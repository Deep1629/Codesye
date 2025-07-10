# 🚀 Deployment Guide: Vercel + Render

This guide will help you deploy your StudentCode app to production using Vercel for the frontend and Render for the backend.

## 📋 Prerequisites

- GitHub repository (already done ✅)
- Vercel account (free)
- Render account (free)
- OpenAI API key

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

### 1.2 Deploy Backend Service
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**: `Deep1629/Codesye`
3. **Configure the service:**
   - **Name**: `codesye-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

### 1.3 Set Environment Variables
In Render dashboard, go to your service → **Environment** tab:

```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Copy the URL: `https://your-service-name.onrender.com`

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.2 Deploy Frontend
1. **Click "New Project"**
2. **Import your repository**: `Deep1629/Codesye`
3. **Configure the project:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3 Set Environment Variables
In Vercel dashboard, go to your project → **Settings** → **Environment Variables**:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

### 2.4 Deploy
- Click **"Deploy"**
- Wait for deployment (1-2 minutes)
- Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 Step 3: Update Configuration

### 3.1 Update Frontend API URL
After getting your Render backend URL, update the frontend configuration:

1. Go to Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with your actual Render backend URL
3. Redeploy the project

### 3.2 Update Backend CORS
Update the CORS configuration in `server.js` with your actual Vercel frontend URL:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-actual-vercel-url.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Try the demo login
3. Test code analysis functionality

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that your Vercel URL is in the backend CORS configuration
   - Ensure environment variables are set correctly

2. **API Connection Issues**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Check that your Render backend is running

3. **Environment Variables**
   - Make sure `OPENAI_API_KEY` is set in Render
   - Verify `JWT_SECRET` is set in Render

### Debug Commands:
```bash
# Check backend logs
# Go to Render dashboard → your service → Logs

# Check frontend build
# Go to Vercel dashboard → your project → Deployments → View Function Logs
```

## 📊 Monitoring

### Render Backend:
- **Logs**: Available in Render dashboard
- **Health Check**: `/api/health` endpoint
- **Uptime**: Free tier has some limitations

### Vercel Frontend:
- **Analytics**: Available in Vercel dashboard
- **Performance**: Built-in monitoring
- **Deployments**: Automatic on git push

## 🔄 Continuous Deployment

Both services will automatically redeploy when you push to your GitHub repository:

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Vercel** will automatically redeploy the frontend
4. **Render** will automatically redeploy the backend

## 💰 Cost

- **Vercel**: Free tier includes unlimited deployments
- **Render**: Free tier includes 750 hours/month
- **Total**: $0/month for this setup

## 🎉 Success!

Your StudentCode app is now live and accessible to anyone on the internet!

**Frontend**: `https://your-project.vercel.app`
**Backend**: `https://your-service.onrender.com`

---

## 📝 Notes

- The free tier of Render may have cold starts (first request takes longer)
- Consider upgrading to paid plans for production use
- Monitor your OpenAI API usage to control costs
- Set up proper error monitoring for production use 