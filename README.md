# ViralCaption AI

A modern web application for generating viral captions using AI.

## Prerequisites

- Node.js (version 14 or higher)

## Features

- Generate 5 viral captions, 10 hashtags, and 1 hook sentence
- Support for TikTok, Instagram, and YouTube platforms
- 1 free generation, then subscription required (€2.99/month)
- User authentication with JWT
- Dark modern UI with smooth animations
- Mobile responsive design
- Stripe payment integration (placeholder)
- Moderator panel for admin
- Privacy policy page

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `server/.env`:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `JWT_SECRET`: A secret key for JWT
4. Run the application:
   ```
   npm run dev
   ```

This will start both the client on port 3000 and the server on port 5000.

## Seed User

A seed user is created: email `test@example.com`, password `password`.

Moderator: username `cerberus1`, password `cerberus123`.

## Technologies

- Frontend: React, React Router, Axios, Framer Motion
- Backend: Node.js, Express, SQLite, JWT, Bcrypt, Stripe
- Database: SQLite

## Deployment on Replit

1. Fork this repo on GitHub
2. Create a new Replit project from the forked repo
3. Run `npm install` in the shell
4. Set environment variables in Replit secrets
5. Run `npm run dev` or use the run button