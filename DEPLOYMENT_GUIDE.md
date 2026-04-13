# Deployment Guide - Vercel

## Stappen om op Vercel te deployen:

### 1. Zet de configuratie files op GitHub
```bash
git add vercel.json .vercelignore .env.example package.json
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Ga naar Vercel.com
- Log in met je GitHub account
- Klik op "New Project"
- Selecteer je repository: `viralcaption-app`
- Vercel zal automatisch de instellingen detecteren

### 3. Stel Environment Variables in (BELANGRIJK!)
In het Vercel dashboard, ga naar "Settings" → "Environment Variables" en voeg toe:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=jouw_geheime_sleutel
STRIPE_SECRET_KEY=jouw_stripe_sleutel
STRIPE_PUBLIC_KEY=jouw_stripe_public_sleutel
STRIPE_WEBHOOK_SECRET=jouw_webhook_sleutel
```

### 4. Deploy
Klik op "Deploy" - Vercel zal:
- De client React app builden
- De server Node.js dependencies installeren
- Alles online zetten

### 5. Test
Je app zal beschikbaar zijn op: `https://your-project.vercel.app`

## Als het niet werkt:
1. Controleer de build logs in Vercel dashboard
2. Zorg dat alle environment variables zijn ingesteld
3. Controleer dat `npm install` beide `client/` en `server/` directories kunnen bereiken

## Lokaal testen:
```bash
npm install
npm run dev
```
