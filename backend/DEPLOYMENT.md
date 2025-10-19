# Backend Deployment Guide

This guide explains how to deploy the Obayi backend to Azure App Service.

## Prerequisites

1. An Azure account (create one at [azure.microsoft.com](https://azure.microsoft.com))
2. Azure CLI installed ([installation guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
3. Git installed and configured

## Option 1: Deploy via Azure Portal (Easiest)

### Step 1: Create an Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `obayibackend` (this will be `obayibackend.azurewebsites.net`)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS or Node 20 LTS
   - **Operating System**: Linux (recommended) or Windows
   - **Region**: Choose closest to your users
   - **Pricing plan**: Free F1 or Basic B1 (recommended for production)
4. Click "Review + Create" → "Create"

### Step 2: Configure Environment Variables

1. Go to your App Service in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add the following environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-a-strong-random-string>
   FRONTEND_URL=https://obayi.co
   PORT=8080
   ```
4. Click "Save"

### Step 3: Enable CORS (Optional - already configured in code)

1. Navigate to **CORS** in your App Service
2. Add allowed origins: `https://obayi.co`
3. Click "Save"

### Step 4: Deploy from GitHub

1. In your App Service, go to **Deployment Center**
2. Select **Source**: GitHub
3. Authorize Azure to access your GitHub account
4. Select:
   - **Organization**: Your GitHub username
   - **Repository**: obayi
   - **Branch**: master or main
5. Configure build:
   - **Build provider**: App Service Build Service
   - **Runtime stack**: Node
   - **Version**: 18 LTS or 20 LTS
   - **Build command**: `cd backend && npm install`
   - **Startup command**: `cd backend && node server.js`
6. Click "Save"

Azure will now automatically deploy your backend whenever you push to the selected branch!

### Step 5: Verify Deployment

1. Wait for deployment to complete (check **Deployment Center** → **Logs**)
2. Visit: `https://obayibackend.azurewebsites.net/api/health`
3. You should see: `{"status":"OK","message":"Obayi Backend API is running"}`

## Option 2: Deploy via Azure CLI

### Step 1: Login to Azure

```bash
az login
```

### Step 2: Create Resource Group

```bash
az group create --name obayi-rg --location eastus
```

### Step 3: Create App Service Plan

```bash
# For Free tier
az appservice plan create --name obayi-plan --resource-group obayi-rg --sku F1 --is-linux

# For Basic tier (recommended for production)
az appservice plan create --name obayi-plan --resource-group obayi-rg --sku B1 --is-linux
```

### Step 4: Create Web App

```bash
az webapp create --resource-group obayi-rg --plan obayi-plan --name obayibackend --runtime "NODE:18-lts"
```

### Step 5: Configure App Settings

```bash
az webapp config appsettings set --resource-group obayi-rg --name obayibackend --settings \
  NODE_ENV=production \
  JWT_SECRET=your_super_secret_key_here \
  FRONTEND_URL=https://obayi.co \
  PORT=8080
```

### Step 6: Configure Deployment from GitHub

```bash
# First, get your GitHub Personal Access Token from https://github.com/settings/tokens

az webapp deployment source config --resource-group obayi-rg --name obayibackend \
  --repo-url https://github.com/YOUR_USERNAME/obayi \
  --branch master \
  --git-token YOUR_GITHUB_TOKEN
```

### Step 7: Set Startup Command

```bash
az webapp config set --resource-group obayi-rg --name obayibackend \
  --startup-file "cd backend && npm install && node server.js"
```

## Option 3: Deploy via VS Code (Quickest for testing)

1. Install the [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code
2. Open VS Code in the project root
3. Click the Azure icon in the sidebar
4. Sign in to Azure
5. Right-click on your subscription → "Create New Web App"
6. Follow the prompts:
   - Name: `obayibackend`
   - Runtime: Node 18 LTS
   - Create new resource group
7. Once created, right-click the web app → "Deploy to Web App"
8. Select the `backend` folder when prompted
9. Configure environment variables in the Azure Portal (see Step 2 of Option 1)

## Post-Deployment Tasks

### 1. Update Frontend Configuration

Update `.env.production` in your frontend:

```env
VITE_AUTH_MODE=api
VITE_API_URL=https://obayibackend.azurewebsites.net/api
VITE_DEBUG=false
```

### 2. Rebuild and Deploy Frontend

```bash
npm run build
# Then push to GitHub - Azure Static Web Apps will auto-deploy
```

### 3. Test the Full Stack

1. Visit https://obayi.co
2. Try registering a new user
3. Check that data persists across different browsers/devices

## Monitoring and Troubleshooting

### View Logs

**Azure Portal:**
1. Go to your App Service
2. Navigate to **Monitoring** → **Log stream**

**Azure CLI:**
```bash
az webapp log tail --resource-group obayi-rg --name obayibackend
```

### Common Issues

**Issue: "Could not resolve host"**
- Solution: Make sure the App Service name matches the URL in frontend config

**Issue: CORS errors**
- Solution: Check that `FRONTEND_URL` environment variable is set correctly

**Issue: 500 errors**
- Solution: Check logs for detailed error messages
- Ensure all environment variables are set
- Verify Node.js version matches

**Issue: Database resets on restart**
- Solution: Azure App Service has ephemeral file systems. Consider:
  - Using Azure SQL Database instead of SQLite
  - Or mounting persistent storage (Azure Files)

## Database Persistence (Important!)

**Note:** SQLite files on Azure App Service are **ephemeral** and will be lost on:
- App restart
- Scaling operations
- Redeployments

### Solutions for Production:

1. **Azure SQL Database** (Recommended for production)
2. **PostgreSQL on Azure**
3. **Azure Files mounted storage** (for SQLite persistence)

For now, the SQLite file will work but expect data loss on restarts. Contact me if you need help migrating to a persistent database solution.

## Updating the Backend

Just push changes to your GitHub repository - Azure will automatically redeploy!

```bash
git add .
git commit -m "Update backend"
git push
```

## Cost Considerations

- **Free Tier (F1)**: Free, but limited (60 CPU minutes/day, 1GB RAM)
- **Basic Tier (B1)**: ~$13/month, suitable for production
- **Standard Tier (S1)**: ~$70/month, for high traffic

## Need Help?

- Azure App Service Docs: https://docs.microsoft.com/en-us/azure/app-service/
- Node.js on Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs
