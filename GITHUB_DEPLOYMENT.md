# GitHub Deployment to Fly.io

This guide will help you deploy your SoundGrab application to Fly.io using GitHub Actions.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
3. **Fly.io API Token**: Generate an API token for GitHub Actions

## Step-by-Step Setup

### 1. Create Fly.io Account and App

1. Go to [fly.io](https://fly.io) and sign up
2. Install Fly CLI locally (already done):
   ```bash
   brew install flyctl
   ```
3. Login to Fly.io:
   ```bash
   flyctl auth login
   ```
4. Create your app:
   ```bash
   flyctl apps create soundgrab-mvp
   ```

### 2. Generate API Token

1. Generate a Fly.io API token:
   ```bash
   flyctl auth token
   ```
2. Copy the token that's displayed

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add a secret named `FLY_API_TOKEN` with the token you copied

### 4. Push to GitHub

1. Commit all your changes:
   ```bash
   git add .
   git commit -m "Setup Fly.io deployment"
   git push origin main
   ```

2. The GitHub Action will automatically trigger and deploy your app

### 5. Monitor Deployment

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Watch the deployment progress
4. Once complete, your app will be available at: `https://soundgrab-mvp.fly.dev`

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. Authenticate with Fly.io:
   ```bash
   flyctl auth login
   ```

2. Deploy:
   ```bash
   flyctl deploy
   ```

## Configuration Files

The following files are configured for Fly.io deployment:

- **[`fly.toml`](fly.toml)**: Fly.io app configuration
- **[`Dockerfile`](Dockerfile)**: Container build instructions
- **[`.dockerignore`](.dockerignore)**: Files to exclude from build
- **[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)**: GitHub Actions workflow

## Environment Variables

To add environment variables:

1. **Via CLI**:
   ```bash
   flyctl secrets set VARIABLE_NAME=value
   ```

2. **Via Dashboard**:
   - Go to [fly.io/dashboard](https://fly.io/dashboard)
   - Select your app
   - Go to Secrets section

## Monitoring

- **View logs**: `flyctl logs`
- **Check status**: `flyctl status`
- **Open app**: `flyctl open`

## Troubleshooting

### Common Issues

1. **Build failures**: Check the GitHub Actions logs
2. **Authentication errors**: Verify your `FLY_API_TOKEN` secret
3. **App name conflicts**: Use a unique app name in `fly.toml`

### Getting Help

- **Fly.io Docs**: [fly.io/docs](https://fly.io/docs)
- **GitHub Actions Logs**: Check the Actions tab in your repository
- **Fly.io Community**: [community.fly.io](https://community.fly.io)

## Cost Optimization

- Apps automatically scale to zero when not in use
- You only pay for actual usage
- Monitor usage in the Fly.io dashboard

## Next Steps

1. Set up your Fly.io account
2. Add the API token to GitHub secrets
3. Push your code to trigger deployment
4. Monitor the deployment in GitHub Actions
5. Access your live app at `https://soundgrab-mvp.fly.dev`

Your app will automatically redeploy whenever you push changes to the main branch!