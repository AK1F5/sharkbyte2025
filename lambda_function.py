import json
import boto3
import os
from datetime import datetime
import google.generativeai as genai

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
ssm = boto3.client('ssm')
table = dynamodb.Table('CareerPathways')

def get_gemini_api_key():
    """Retrieve Gemini API key from Secrets Manager or Parameter Store"""
    try:
        # Try Parameter Store first (cheaper)
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

def generate_pathway_with_gemini(career, degree_level):
    """Call Gemini API to generate career pathway"""
    try:
        api_key = get_gemini_api_key()
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Generate a comprehensive educational pathway for becoming a {career} starting with a {degree_level} degree.

The pathway should include:
1. Associate's degree (A.A./A.S.) - specific MDC programs if applicable
2. Bachelor's degree (B.S.) - transfer plan and target universities
3. Master's degree (M.S.) - if relevant
4. Ph.D. - if relevant
5. Required certifications and exams (e.g., FE, PE for engineering)
6. Internships or practical experience opportunities
7. Articulation agreements from MDC to other institutions

Format the response as JSON with this structure:
{{
  "career": "{career}",
  "degreeLevel": "{degree_level}",
  "associates": {{
    "programs": ["Program 1", "Program 2"],
    "duration": "2 years",
    "keyCourses": ["Course 1", "Course 2"]
  }},
  "bachelors": {{
    "universities": ["University 1", "University 2"],
    "articulationAgreements": ["Agreement details"],
    "duration": "2 years (after AA)",
    "keyCourses": ["Course 1", "Course 2"]
  }},
  "masters": {{
    "universities": ["University 1"],
    "duration": "2 years",
    "required": true/false
  }},
  "certifications": [
    {{"name": "Cert Name", "required": true, "timing": "After BS"}}
  ],
  "exams": [
    {{"name": "Exam Name", "required": true, "timing": "After BS"}}
  ],
  "internships": ["Internship opportunity 1", "Internship opportunity 2"],
  "alternativePathways": ["Alternative path 1", "Alternative path 2"]
}}

Be specific and realistic. Focus on MDC (Miami Dade College) programs when applicable."""
        
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text
        
        # Try to extract JSON if wrapped in markdown
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0]
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0]
        
        pathway_data = json.loads(response_text.strip())
        return pathway_data
        
    except Exception as e:
        print(f"Error calling Gemini: {str(e)}")
        # Return a fallback pathway structure
        return {
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
        career_id = career.lower().replace(' ', '-').replace(',', '')
        
        # Try to get from DynamoDB first
        try:
            response = table.get_item(
                Key={
                    'careerId': career_id,
                    'degreeLevel': degree_level
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
                    'degreeLevel': degree_level,
                    'career': career,
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

