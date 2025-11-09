# MDC Data Integration Setup Guide

This guide will help you integrate real MDC course data to validate Gemini's responses.

## Step 1: Create DynamoDB Table

Run the setup script to create the `MDCPrograms` table:

```bash
python3 setup_mdc_dynamodb.py
```

This will:
- Create the `MDCPrograms` DynamoDB table
- Load program names from CSV logs
- Upload basic program structure to DynamoDB

## Step 2: Add Course Data

You have two options:

### Option A: Manual Entry (Recommended for accuracy)
1. Open each PDF from `DataCollection/downloaded_pdfs/`
2. Extract course codes and names
3. Update DynamoDB items with course data

### Option B: Use PDF Parser (Experimental)
```bash
python3 parse_mdc_data.py
```

**Note:** PDF parsing may not be 100% accurate. Manual verification is recommended.

## Step 3: Update Lambda Function

The Lambda function has been updated to:
- Query `MDCPrograms` table for real program data
- Include actual MDC courses in the Gemini prompt
- Validate Gemini's recommended courses against real MDC data
- Filter out courses that don't exist at MDC

## Step 4: Deploy Updated Lambda

```bash
./deploy-lambda.sh
```

## Step 5: Test

Test with a career that has MDC data:
```bash
curl -X POST https://btoccmzs5b.execute-api.us-east-1.amazonaws.com/prod/pathway \
  -H "Content-Type: application/json" \
  -d '{"career":"Architect","degreeLevel":"associate"}'
```

## DynamoDB Table Structure

**Table Name:** `MDCPrograms`

**Key Schema:**
- `programId` (String, Hash Key) - e.g., "biology-aa"

**Attributes:**
- `programName` (String) - e.g., "Biology"
- `degreeType` (String) - e.g., "AA", "AS", "BAS"
- `courses` (List) - Array of course objects:
  ```json
  [
    {
      "code": "ENC 1101",
      "name": "English Composition I"
    },
    {
      "code": "MAC 2311",
      "name": "Calculus I"
    }
  ]
  ```
- `updatedAt` (String) - ISO timestamp

## Next Steps

1. ✅ Create DynamoDB table
2. ⏳ Populate with course data (manual or automated)
3. ✅ Update Lambda function (already done)
4. ⏳ Deploy Lambda
5. ⏳ Test integration

## Troubleshooting

- **Table not found:** Run `setup_mdc_dynamodb.py` first
- **No courses in response:** Add course data to DynamoDB items
- **Courses still incorrect:** Verify course data in DynamoDB matches actual MDC courses

