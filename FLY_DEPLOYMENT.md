# Fly.io Deployment Guide

This guide will help you deploy the SoundGrab application to Fly.io.

## Prerequisites

1. Install the Fly CLI:
   ```bash
   # macOS
   brew install flyctl
   
   # Or download from https://fly.io/docs/getting-started/installing-flyctl/
   ```

2. Sign up and authenticate:
   ```bash
   fly auth signup
   # or if you already have an account
   fly auth login
   ```

## Deployment Steps

1. **Initialize the Fly app** (if not already done):
   ```bash
   fly apps create soundgrab
   ```

2. **Set environment variables** (if needed):
   ```bash
   fly secrets set NODE_ENV=production
   # Add any other environment variables your app needs
   ```

3. **Deploy the application**:
   ```bash
   fly deploy
   ```

4. **Open your deployed app**:
   ```bash
   fly open
   ```

## Configuration Details

- **App Name**: soundgrab
- **Region**: iad (US East)
- **Port**: 5000 (internal)
- **Memory**: 1GB
- **CPU**: 1 shared CPU
- **Auto-scaling**: Enabled (0 minimum machines)

## Monitoring and Management

- **View logs**: `fly logs`
- **Check status**: `fly status`
- **Scale app**: `fly scale count 2` (to run 2 instances)
- **SSH into machine**: `fly ssh console`

## Environment Variables

The application uses the following environment variables:
- `NODE_ENV=production`
- `PORT=5000`

Add additional environment variables using:
```bash
fly secrets set VARIABLE_NAME=value
```

## Troubleshooting

1. **Build failures**: Check the Dockerfile and ensure all dependencies are properly installed
2. **Runtime errors**: Use `fly logs` to check application logs
3. **Connection issues**: Verify the port configuration in fly.toml matches your application

## Cost Optimization

- The app is configured with auto-stop/auto-start to minimize costs
- Minimum machines running is set to 0
- Uses shared CPU for cost efficiency

## Updates

To deploy updates:
```bash
fly deploy
```

The deployment will automatically build and deploy the latest version of your application.