# MDC Data Integration - Summary

## What I've Done

✅ **Pulled DataCollection from upstream/main** - All MDC PDFs are now in `DataCollection/downloaded_pdfs/`

✅ **Updated Lambda Function** - Now includes:
- Functions to query `MDCPrograms` DynamoDB table
- Course validation against real MDC data
- Enhanced Gemini prompt with actual MDC courses
- Automatic filtering of invalid courses

✅ **Created Setup Scripts**:
- `setup_mdc_dynamodb.py` - Creates DynamoDB table and loads program names
- `parse_mdc_data.py` - (Optional) Parses PDFs to extract courses

## What You Need to Do

### Step 1: Create DynamoDB Table

```bash
# Install boto3 if needed
pip3 install boto3

# Run setup script
python3 setup_mdc_dynamodb.py
```

This creates the `MDCPrograms` table and loads program names from CSV.

### Step 2: Add Course Data to DynamoDB

You have two options:

**Option A: Manual Entry (Most Accurate)**
1. Open AWS Console → DynamoDB → `MDCPrograms` table
2. For each program, add a `courses` array with actual MDC courses:
   ```json
   {
     "programId": "architecture-aa",
     "programName": "Architecture",
     "degreeType": "AA",
     "courses": [
       {"code": "ENC 1101", "name": "English Composition I"},
       {"code": "MAC 2311", "name": "Calculus I"},
       {"code": "ARC 1301", "name": "Architectural Design I"}
     ]
   }
   ```

**Option B: Use PDF Parser (Requires PyPDF2)**
```bash
pip3 install PyPDF2
python3 parse_mdc_data.py
```
⚠️ PDF parsing may need manual verification.

### Step 3: Deploy Updated Lambda

```bash
./deploy-lambda.sh
```

## How It Works

1. **User searches for a career** (e.g., "Architect")
2. **Lambda queries DynamoDB** for related MDC program (e.g., "Architecture")
3. **Lambda gets actual MDC courses** from DynamoDB
4. **Lambda includes real courses in Gemini prompt** - This ensures Gemini uses actual MDC courses
5. **Lambda validates Gemini's response** - Filters out any courses that don't exist in MDC data
6. **Returns validated pathway** with only real MDC courses

## Current Status

- ✅ Lambda function updated with MDC integration
- ✅ DynamoDB table structure defined
- ⏳ Need to create DynamoDB table (run `setup_mdc_dynamodb.py`)
- ⏳ Need to populate course data (manual or automated)
- ⏳ Need to deploy updated Lambda

## Testing

After setup, test with:
```bash
curl -X POST https://btoccmzs5b.execute-api.us-east-1.amazonaws.com/prod/pathway \
  -H "Content-Type: application/json" \
  -d '{"career":"Architect","degreeLevel":"associate"}'
```

The response should now include only actual MDC courses!

