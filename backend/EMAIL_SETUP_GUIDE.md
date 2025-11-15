# Email Service Setup Guide - Azure Logic Apps with Outlook

This guide will walk you through setting up automated email notifications for the Obayi platform using Azure Logic Apps and Outlook.

## Overview

The system sends emails for:
1. **Welcome emails** when donors/students register
2. **Assignment notifications** when admin assigns a donor to a student

## Prerequisites

- Azure account with active subscription
- Outlook/Microsoft 365 account for sending emails
- Backend deployed to Azure App Service

---

## Part 1: Create Azure Logic App

### Step 1: Create Logic App Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Logic App"** and select it
4. Click **"Create"**

### Step 2: Configure Logic App Settings

Fill in the following details:

- **Subscription**: Select your subscription
- **Resource Group**: Choose existing or create new (e.g., `obayi-resources`)
- **Logic App Name**: `obayi-email-service`
- **Region**: Choose same region as your backend (e.g., `West Europe`)
- **Plan Type**: **Consumption** (pay-per-use, most cost-effective)
- **Zone Redundancy**: Disabled (to save costs)

Click **"Review + Create"** then **"Create"**

Wait 1-2 minutes for deployment to complete, then click **"Go to resource"**

---

## Part 2: Design the Logic App Workflow

### Step 3: Create the Trigger

1. In your Logic App, click **"Logic app designer"** in the left menu
2. You'll see various templates - click **"Blank Logic App"** at the top
3. Search for **"When a HTTP request is received"**
4. Click on **"When a HTTP request is received"** trigger

### Step 4: Configure HTTP Trigger

1. In the HTTP trigger, you'll see **"Request Body JSON Schema"**
2. Click **"Use sample payload to generate schema"**
3. Paste this sample JSON:

```json
{
  "emailType": "donor_welcome",
  "recipientEmail": "donor@example.com",
  "recipientName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "subject": "Welcome to Obayi",
  "templateData": {
    "greeting": "Dear John",
    "bodyContent": "<p>Welcome email content here</p>"
  },
  "studentId": "STU123456789"
}
```

4. Click **"Done"** - the schema will be auto-generated

### Step 5: Add Outlook Send Email Action

1. Click **"+ New step"** button
2. Search for **"Office 365 Outlook"**
3. Select **"Send an email (V2)"** action
4. You'll be prompted to **Sign in** - use your Outlook/Microsoft 365 account credentials
5. Click **"Accept"** to grant permissions

### Step 6: Configure Email Template

In the **Send an email (V2)** action, configure:

**To:** Click in the field, then select **"recipientEmail"** from Dynamic content

**Subject:** Click in the field, then select **"subject"** from Dynamic content

**Body:** Click in the field, switch to **HTML view** (click the `</>` icon), then paste:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #0891b2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            font-size: 12px;
            color: #666;
        }
        h3 {
            color: #0891b2;
        }
        ul {
            padding-left: 20px;
        }
        a {
            color: #0891b2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Obayi</h1>
        </div>
        <div class="content">
            @{triggerBody()?['templateData']?['greeting']}

            @{triggerBody()?['templateData']?['bodyContent']}
        </div>
        <div class="footer">
            <p>&copy; 2025 Obayi. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
```

**Important:** After pasting, you need to add dynamic content:
- Place your cursor where you see `@{triggerBody()?['templateData']?['greeting']}`
- This is the correct expression - keep it as is

### Step 7: Save and Get Webhook URL

1. Click **"Save"** at the top of the designer
2. Go back to the **"When a HTTP request is received"** trigger (click on it)
3. You'll now see **"HTTP POST URL"** - this is your webhook URL
4. Click the **copy icon** to copy the full URL
5. **IMPORTANT:** Save this URL - you'll need it for the backend configuration

The URL will look like:
```
https://prod-XX.westeurope.logic.azure.com:443/workflows/xxxxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxxxx
```

---

## Part 3: Configure Backend to Use Logic App

### Step 8: Add Logic App URL to Azure App Service

1. Go to your **Azure App Service** (obayibackend-b2e8bjfkd8gpbeg6)
2. Click **"Configuration"** in the left menu under Settings
3. Click **"+ New application setting"**
4. Add the following:
   - **Name:** `LOGIC_APP_WEBHOOK_URL`
   - **Value:** Paste the HTTP POST URL you copied from Step 7
5. Click **"OK"**
6. Click **"Save"** at the top
7. Click **"Continue"** when prompted (this will restart your app)

---

## Part 4: Deploy Updated Backend Code

### Step 9: Deploy Backend Changes

The code changes have already been made. You need to deploy the backend:

**Option 1: Deploy via VS Code (Recommended)**

1. Open VS Code
2. Open the Azure extension
3. Right-click on your App Service `obayibackend-b2e8bjfkd8gpbeg6`
4. Select **"Deploy to Web App"**
5. Select the `backend` folder
6. Confirm deployment

**Option 2: Deploy via GitHub Actions**

If you have GitHub Actions set up, simply push the changes:
```bash
git push origin master
```

---

## Part 5: Test the Email System

### Step 10: Test Welcome Emails

1. Go to your registration page: https://ambitious-mushroom-03632ab03.6.azurestaticapps.net/register
2. Register a new test donor or student account
3. Check the email inbox for the welcome email
4. Check Azure Logic App run history:
   - Go to Logic App → Overview → Runs history
   - You should see a "Succeeded" run

### Step 11: Test Assignment Emails

1. Login as admin: admin@obayi.co / admin123
2. Go to admin dashboard
3. Match a donor to a student
4. Both donor and student should receive assignment notification emails

---

## Troubleshooting

### Email Not Received

1. **Check Logic App Run History:**
   - Azure Portal → Your Logic App → Overview → Runs history
   - Click on the failed run to see error details

2. **Check Backend Logs:**
   - Azure Portal → App Service → Log stream
   - Look for "Email service error" messages

3. **Verify Environment Variable:**
   - App Service → Configuration → Application settings
   - Ensure `LOGIC_APP_WEBHOOK_URL` is set correctly

4. **Check Outlook Connection:**
   - Logic App → Logic app designer
   - Click on "Send an email" action
   - If you see ⚠️ warning, click "Change connection" and re-authenticate

### Common Issues

**Issue: "Email service error" in backend logs**
- **Solution:** Check that LOGIC_APP_WEBHOOK_URL environment variable is set

**Issue: Logic App shows "Unauthorized" error**
- **Solution:** Re-authenticate Outlook connection in Logic App designer

**Issue: Emails go to Spam folder**
- **Solution:** This is normal for automated emails. Ask recipients to mark as "Not Spam"

**Issue: HTML not rendering properly**
- **Solution:** Make sure you selected "HTML view" in the email body (click `</>` icon)

---

## Email Templates

The system sends 4 types of emails:

1. **Donor Welcome Email** - Sent when donor registers
2. **Student Welcome Email** - Sent when student registers
3. **Donor Assignment Email** - Sent when student is assigned to donor
4. **Student Assignment Email** - Sent when donor is assigned to student

All templates are defined in `backend/utils/emailService.js`

---

## Cost Estimation

**Azure Logic App (Consumption Plan):**
- First 4,000 actions/month: FREE
- Additional actions: $0.000025 per action

**Example:**
- 100 registrations/month = 100 emails
- 50 assignments/month = 100 emails (donor + student)
- Total: 200 emails = 200 actions
- **Cost: FREE** (under 4,000 actions)

---

## Security Best Practices

1. **Keep webhook URL secure** - Don't commit to Git
2. **Use environment variables** - Store in Azure App Service config
3. **Monitor usage** - Check Logic App metrics regularly
4. **Set up alerts** - Get notified of failures

---

## Need Help?

- [Azure Logic Apps Documentation](https://docs.microsoft.com/en-us/azure/logic-apps/)
- [Office 365 Outlook Connector](https://docs.microsoft.com/en-us/connectors/office365/)
- Check backend logs in Azure App Service Log Stream

---

## Summary Checklist

- [ ] Created Azure Logic App resource
- [ ] Configured HTTP trigger with JSON schema
- [ ] Added Office 365 Outlook "Send email" action
- [ ] Authenticated Outlook account
- [ ] Configured HTML email template
- [ ] Copied HTTP POST webhook URL
- [ ] Added LOGIC_APP_WEBHOOK_URL to App Service configuration
- [ ] Deployed updated backend code
- [ ] Tested welcome email (register new user)
- [ ] Tested assignment emails (match donor to student)
- [ ] Verified emails in inbox
- [ ] Checked Logic App run history

Once all items are checked, your email system is fully operational! ✅
