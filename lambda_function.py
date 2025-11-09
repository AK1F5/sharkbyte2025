import json
import boto3
import os
from datetime import datetime
import urllib.request
import urllib.error

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
ssm = boto3.client('ssm')
table = dynamodb.Table('CareerPathways')
mdc_programs_table = dynamodb.Table('MDCPrograms')

def get_gemini_api_key():
    """Retrieve Gemini API key from Secrets Manager or Parameter Store"""
    try:
        # Try Parameter Store first (cheaper) - using 'geminikey' parameter name
        response = ssm.get_parameter(
            Name='geminikey',
            WithDecryption=True
        )
        return response['Parameter']['Value']
    except ssm.exceptions.ParameterNotFound:
        # Fallback to alternative parameter name
        try:
            response = ssm.get_parameter(
                Name='/nextwave/gemini-api-key',
                WithDecryption=True
            )
            return response['Parameter']['Value']
        except ssm.exceptions.ParameterNotFound:
            # Fallback to Secrets Manager
            secrets_client = boto3.client('secretsmanager')
            response = secrets_client.get_secret_value(
                SecretId='MDCPartners'
            )
            secret = json.loads(response['SecretString'])
            return secret.get('GEMINI_API_KEY') or secret.get('api_key') or list(secret.values())[0]

def get_college_scorecard_api_key():
    """Retrieve College Scorecard API key from Parameter Store"""
    try:
        response = ssm.get_parameter(
            Name='collegescorecard-key',
            WithDecryption=True
        )
        return response['Parameter']['Value']
    except ssm.exceptions.ParameterNotFound:
        try:
            response = ssm.get_parameter(
                Name='/nextwave/college-scorecard-api-key',
                WithDecryption=True
            )
            return response['Parameter']['Value']
        except ssm.exceptions.ParameterNotFound:
            # Default to the provided key
            return 'ntgRFLSNKv02PCmynsut41GqawOSxHdDb44baMuZ'

def get_mdc_financial_data(api_key):
    """Fetch MDC financial data from College Scorecard API"""
    try:
        # MDC's IPEDS ID (you may need to verify this)
        # Miami Dade College - multiple campuses, using main campus
        # Common IPEDS IDs for MDC: 135717 (Kendall), 135726 (North), etc.
        # We'll search for Miami Dade College
        url = f"https://api.data.gov/ed/collegescorecard/v1/schools?api_key={api_key}&school.name=Miami%20Dade%20College&fields=id,school.name,cost.tuition.in_state,cost.tuition.out_of_state,cost.avg_net_price.overall,cost.avg_net_price.private,cost.roomboard.oncampus,cost.booksupply,latest.earnings.10_yrs_after_entry.median"
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if 'results' in data and len(data['results']) > 0:
                # Get the first result (main campus)
                school = data['results'][0]
                return {
                    'tuition_in_state': school.get('cost.tuition.in_state'),
                    'tuition_out_of_state': school.get('cost.tuition.out_of_state'),
                    'avg_net_price': school.get('cost.avg_net_price.overall'),
                    'roomboard': school.get('cost.roomboard.oncampus'),
                    'booksupply': school.get('cost.booksupply'),
                    'median_earnings_10yr': school.get('latest.earnings.10_yrs_after_entry.median')
                }
        return None
    except Exception as e:
        print(f"Error fetching College Scorecard data: {str(e)}")
        return None

def get_mdc_program_data(program_name):
    """Query DynamoDB for actual MDC program data"""
    try:
        program_id = program_name.lower().replace(' ', '-').replace(',', '')
        response = mdc_programs_table.get_item(
            Key={'programId': program_id}
        )
        
        if 'Item' in response:
            return response['Item']
        
        # Try scan for partial match
        scan_response = mdc_programs_table.scan(
            FilterExpression='contains(programName, :name)',
            ExpressionAttributeValues={':name': program_name}
        )
        
        if scan_response.get('Items'):
            return scan_response['Items'][0]
        
        return None
    except Exception as e:
        print(f"Error querying MDC programs: {str(e)}")
        return None

def validate_courses_against_mdc(courses, mdc_data):
    """Validate that recommended courses actually exist in MDC data"""
    if not mdc_data or 'courses' not in mdc_data or not mdc_data['courses']:
        return courses  # Can't validate, return as-is
    
    valid_courses = []
    mdc_course_codes = {course.get('code', '').upper() for course in mdc_data['courses'] if course.get('code')}
    
    for course in courses:
        if isinstance(course, str):
            # Extract course code if format is "ENC 1101 - Course Name"
            course_code = course.split(' - ')[0].strip().upper()
            if course_code in mdc_course_codes:
                valid_courses.append(course)
            else:
                print(f"Warning: Course '{course}' not found in MDC data")
        elif isinstance(course, dict):
            course_code = course.get('code', '').upper()
            if course_code in mdc_course_codes:
                valid_courses.append(course)
    
    return valid_courses if valid_courses else courses  # Return validated or original

def generate_pathway_with_gemini(career, degree_level):
    """Call Gemini API to generate career pathway using REST API with MDC data validation"""
    try:
        api_key = get_gemini_api_key()
        
        # Try to get MDC program data for the career
        mdc_data = None
        related_program = None
        
        # Career to program mappings
        career_mappings = {
            'doctor': 'biology', 'physician': 'biology', 'medical': 'biology',
            'lawyer': 'criminal-justice', 'attorney': 'criminal-justice', 'law': 'criminal-justice',
            'engineer': 'engineering', 'engineering': 'engineering',
            'architect': 'architecture', 'architecture': 'architecture',
            'nurse': 'nursing', 'nursing': 'nursing',
            'business': 'business-administration', 'accountant': 'accounting',
            'teacher': 'education', 'education': 'education',
            'computer': 'computer-science', 'programmer': 'computer-science', 'developer': 'computer-science'
        }
        
        for key, program in career_mappings.items():
            if key in career.lower():
                mdc_data = get_mdc_program_data(program)
                if mdc_data:
                    related_program = mdc_data['programName']
                    break
        
        # Build MDC context for prompt
        mdc_context = ""
        if mdc_data and 'courses' in mdc_data and mdc_data['courses']:
            sample_courses = mdc_data['courses'][:15]  # First 15 courses
            course_examples = "\n".join([f"- {c.get('code', '')} - {c.get('name', '')}" for c in sample_courses if c.get('code')])
            mdc_context = f"""

IMPORTANT - Use ONLY actual MDC courses when recommending courses. Here are real courses from the {related_program} program:
{course_examples}

When listing courses, use the exact format: "CODE XXXX - Course Name" (e.g., "ENC 1101 - English Composition I")."""
        
        prompt = f"""You are an experienced academic advisor at Miami Dade College (MDC) helping a student plan their educational pathway to become a {career}. Provide guidance in a supportive, encouraging, and professional advisor tone. Be warm, clear, and helpful.

IMPORTANT: If "{career}" is not a specific career that MDC offers direct programs for (like "Doctor" or "Physician"), suggest the closest related MDC program that leads to that career. For example:
- "Doctor" → Suggest "Biology" or "Pre-Med" pathway that leads to medical school
- "Lawyer" → Suggest "Pre-Law" or "Criminal Justice" pathway
- "Engineer" → Suggest specific engineering pathway (Mechanical, Civil, etc.)

{mdc_context}

CRITICAL: When listing courses in the "keyCourses" field, use ONLY actual MDC course codes and names. Course codes follow the format: "XXX XXXX" (e.g., "ENC 1101", "MAC 2311", "BSC 2010"). Do not make up course codes or names. Use the exact course codes and names provided above if available.

As an advisor, provide a comprehensive educational pathway that includes:
1. Associate's degree (A.A./A.S.) - specific MDC programs if applicable. If the exact career isn't available at MDC, suggest the closest related program (e.g., Biology for Doctor, Pre-Engineering for Engineer)
2. Bachelor's degree (B.S.) - transfer plan and target universities
3. Master's degree (M.S.) - if relevant
4. Ph.D. or Professional degree (M.D., J.D., etc.) - if relevant
5. Required certifications and exams (e.g., FE, PE for engineering, MCAT for medical school)
6. Internships or practical experience opportunities
7. Articulation agreements from MDC to other institutions

Format the response as JSON with this structure:
{{
  "career": "{career}",
  "relatedMDCProgram": "The actual MDC program name that relates to this career (e.g., 'Biology' for Doctor, 'Pre-Engineering' for Engineer)",
  "degreeLevel": "{degree_level}",
  "associates": {{
    "programs": ["Specific MDC Program Name"],
    "duration": "2 years",
    "keyCourses": ["Course 1", "Course 2"],
    "financial": {{
      "tuitionPerYear": "4000-6000",
      "housingPerMonth": "800-1200",
      "booksPerYear": "1200",
      "totalCost": "12000-18000"
    }},
    "careerOutcomes": {{
      "entryLevel": [
        {{"title": "Job Title 1", "salary": "35000-45000"}},
        {{"title": "Job Title 2", "salary": "30000-40000"}}
      ],
      "midCareer": [
        {{"title": "Job Title 3", "salary": "50000-70000"}}
      ]
    }},
    "roi": {{
      "investment": "15000",
      "tenYearEarnings": "400000-500000",
      "roiPercentage": "2567",
      "breakEvenMonths": "6-8"
    }}
  }},
  "bachelors": {{
    "universities": ["University 1", "University 2"],
    "articulationAgreements": ["Agreement details"],
    "duration": "2 years (after AA)",
    "keyCourses": ["Course 1", "Course 2"],
    "financial": {{
      "tuitionPerYear": "8000-25000",
      "housingPerMonth": "1000-1500",
      "booksPerYear": "1500",
      "totalCost": "21000-35000"
    }},
    "careerOutcomes": {{
      "entryLevel": [
        {{"title": "Job Title 1", "salary": "55000-70000"}},
        {{"title": "Job Title 2", "salary": "50000-65000"}}
      ],
      "midCareer": [
        {{"title": "Job Title 3", "salary": "75000-110000"}}
      ]
    }},
    "roi": {{
      "investment": "28000",
      "tenYearEarnings": "600000-800000",
      "roiPercentage": "2143",
      "breakEvenMonths": "5-7"
    }}
  }},
  "masters": {{
    "universities": ["University 1"],
    "duration": "2 years",
    "required": true/false
  }},
  "professionalDegree": {{
    "type": "M.D./J.D./Ph.D. etc.",
    "universities": ["University 1"],
    "duration": "4 years",
    "required": true/false,
    "description": "Details about the professional degree needed"
  }},
  "certifications": [
    {{"name": "Cert Name", "required": true, "timing": "After BS"}}
  ],
  "exams": [
    {{"name": "Exam Name", "required": true, "timing": "After BS"}}
  ],
  "internships": ["Internship opportunity 1", "Internship opportunity 2"],
  "alternativePathways": ["Alternative path 1", "Alternative path 2"],
  "note": "If the career requires a professional degree (like Doctor, Lawyer), explain the pathway clearly: Associate → Bachelor → Professional Degree"
}}

IMPORTANT: For financial, careerOutcomes, and roi fields, provide realistic, data-driven numbers based on actual market data. Keep descriptions concise - focus on numbers and facts, not lengthy explanations. Use actual salary ranges and cost data when possible.

Tone: Write as a supportive academic advisor would speak to a student - encouraging, clear, and helpful. Use advisor language like "I recommend", "You'll want to", "This pathway will help you", etc. Be specific and realistic. Focus on MDC (Miami Dade College) programs when applicable. If the exact career isn't available at MDC, suggest the closest related program that leads to that career.

Remember: You're acting as a caring academic advisor helping a student achieve their career goals. Be encouraging and supportive throughout."""
        
        # Use Gemini REST API - v1beta endpoint with gemini-2.5-flash (available model)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                
                # Check for errors in response
                if 'error' in result:
                    error_detail = result['error']
                    raise Exception(f"Gemini API error: {error_detail.get('message', str(error_detail))}")
                
                # Extract text from response
                if 'candidates' not in result or len(result['candidates']) == 0:
                    raise Exception(f"No candidates in Gemini response. Full response: {json.dumps(result)}")
                
                if 'content' not in result['candidates'][0] or 'parts' not in result['candidates'][0]['content']:
                    raise Exception(f"Invalid response structure. Full response: {json.dumps(result)}")
                    
                response_text = result['candidates'][0]['content']['parts'][0]['text']
                raw_response = json.dumps(result, indent=2)  # Keep full response for debugging
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
            print(f"HTTP Error {e.code}: {error_body}")
            try:
                error_json = json.loads(error_body)
                error_msg = error_json.get('error', {}).get('message', error_body)
            except:
                error_msg = error_body
            raise Exception(f"Gemini API HTTP {e.code}: {error_msg}")
        
        # Try to extract JSON if wrapped in markdown
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0]
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0]
        
        pathway_data = json.loads(response_text.strip())
        
        # Validate courses against MDC data
        if mdc_data and 'associates' in pathway_data and 'keyCourses' in pathway_data['associates']:
            pathway_data['associates']['keyCourses'] = validate_courses_against_mdc(
                pathway_data['associates']['keyCourses'],
                mdc_data
            )
        
        # Update relatedMDCProgram if we found actual data
        if related_program:
            pathway_data['relatedMDCProgram'] = related_program
        
        # Fetch real financial data from College Scorecard API
        try:
            scorecard_key = get_college_scorecard_api_key()
            financial_data = get_mdc_financial_data(scorecard_key)
            
            if financial_data:
                # Enhance associates financial data with real MDC data
                if 'associates' in pathway_data and not pathway_data['associates'].get('financial'):
                    pathway_data['associates']['financial'] = {}
                
                if financial_data.get('tuition_in_state'):
                    pathway_data['associates']['financial'] = {
                        'tuitionPerYear': f"{financial_data['tuition_in_state']}",
                        'housingPerMonth': f"{int(financial_data.get('roomboard', 0) / 12) if financial_data.get('roomboard') else '800-1200'}",
                        'booksPerYear': f"{financial_data.get('booksupply', 1200)}",
                        'totalCost': f"{int(financial_data['tuition_in_state']) * 2 + (financial_data.get('booksupply', 1200) * 2)}"
                    }
                
                # Calculate ROI if we have earnings data
                if financial_data.get('median_earnings_10yr') and 'associates' in pathway_data:
                    total_cost = int(financial_data['tuition_in_state']) * 2 + (financial_data.get('booksupply', 1200) * 2)
                    ten_year_earnings = financial_data['median_earnings_10yr'] * 10
                    roi = ((ten_year_earnings - total_cost) / total_cost * 100) if total_cost > 0 else 0
                    
                    if not pathway_data['associates'].get('roi'):
                        pathway_data['associates']['roi'] = {
                            'investment': str(total_cost),
                            'tenYearEarnings': str(ten_year_earnings),
                            'roiPercentage': str(int(roi)),
                            'breakEvenMonths': str(int((total_cost / (financial_data['median_earnings_10yr'] / 12)) if financial_data['median_earnings_10yr'] > 0 else 8)))
                        }
        except Exception as e:
            print(f"Error enhancing with College Scorecard data: {str(e)}")
        
        # Add raw response for debugging
        pathway_data['rawResponse'] = raw_response
        return pathway_data
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error calling Gemini: {error_msg}")
        # Log full error for debugging
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        # Return a fallback pathway structure with error info
        return {
            "error": error_msg,
            "career": career,
            "degreeLevel": degree_level,
            "associates": {
                "programs": ["MDC Associate Program"],
                "duration": "2 years",
                "keyCourses": ["Core courses"]
            },
            "bachelors": {
                "universities": ["Transfer to 4-year university"],
                "duration": "2 years (after AA)",
                "keyCourses": ["Advanced courses"]
            },
            "certifications": [],
            "exams": [],
            "internships": [],
            "alternativePathways": []
        }

def lambda_handler(event, context):
    """Main Lambda handler"""
    try:
        # Parse request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body') or {}
        
        career = body.get('career', '').strip()
        degree_level = body.get('degreeLevel', 'associate').strip()
        
        if not career:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Career field is required'
                })
            }
        
        # Create career ID (lowercase, replace spaces with hyphens)
        # Combine career and degree level for unique key
        career_id = f"{career.lower().replace(' ', '-').replace(',', '')}-{degree_level}"
        
        # Try to get from DynamoDB first
        try:
            response = table.get_item(
                Key={
                    'careerId': career_id
                }
            )
            
            if 'Item' in response:
                # Return cached pathway
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                    },
                    'body': json.dumps({
                        'pathway': response['Item']['pathway'],
                        'cached': True,
                        'career': career
                    })
                }
        except Exception as e:
            print(f"DynamoDB read error: {str(e)}")
        
        # Not in cache, generate with Gemini
        pathway_data = generate_pathway_with_gemini(career, degree_level)
        
        # Store in DynamoDB
        try:
            table.put_item(
                Item={
                    'careerId': career_id,
                    'career': career,
                    'degreeLevel': degree_level,
                    'pathway': pathway_data,
                    'createdAt': datetime.utcnow().isoformat(),
                    'updatedAt': datetime.utcnow().isoformat()
                }
            )
        except Exception as e:
            print(f"DynamoDB write error: {str(e)}")
        
        # Return pathway
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': json.dumps({
                'pathway': pathway_data,
                'cached': False,
                'career': career
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }

