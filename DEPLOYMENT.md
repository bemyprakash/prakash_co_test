# Deploying A. Prakash & Co. on Hostinger Business

This guide covers the exact steps to deploy the Next.js app using Hostinger's
**hPanel Node.js Web App** feature — no SSH, no manual PM2.

---

## Prerequisites

Before deploying:

1. ✅ Push your code to a **GitHub repository** (public or private)
2. ✅ Sign up and add your API keys to the `.env` variables below
3. ✅ Set up your Hostinger MySQL database (hPanel → Databases → MySQL)

---

## Step 1 — Set Up Your Hostinger MySQL Database

1. Log into **hPanel** → **Databases** → **MySQL Databases**
2. Create a new database (e.g., `u123456789_prakashco`)
3. Create a database user with a strong password
4. Assign the user to the database with **All Privileges**
5. Note: `host`, `database`, `username`, `password`

Your `DATABASE_URL` will be:
```
mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME
```
> On Hostinger shared/business hosting, MySQL host is `localhost` (not an external IP).

---

## Step 2 — Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial production build"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/prakash-co.git
git push -u origin main
```

---

## Step 3 — Create a Node.js Web App in hPanel

1. Log into **hPanel** → **Websites** → **Add Website**
2. Select **Node.js Web App**
3. Choose **Import Git Repository**
4. Authorize GitHub and select your `prakash-co` repository
5. Branch: `main`

**Build Settings (auto-detected for Next.js, verify these):**
```
Build command:  npm run build
Start command:  npm start
Node version:   18 or 20 (select latest available)
```

---

## Step 4 — Set Environment Variables

In hPanel → your Node.js app → **Environment Variables**, add:

```env
DATABASE_URL=mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.com

RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX

RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=orders@your-domain.com
RESEND_REPLY_TO=contact@your-domain.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=000000000000000
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=<strong-password>

NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+91XXXXXXXXXX
NEXT_PUBLIC_STORE_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_STORE_EMAIL=contact@your-domain.com
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

> ⚠️ **Switch Razorpay from test keys to live keys** before going live!

---

## Step 5 — Run Database Migrations on Hostinger

Hostinger's hPanel has a terminal / **SSH terminal** option.
Access it via hPanel → Advanced → SSH Access (enable it).

Then run:
```bash
cd ~/public_html/YOUR_APP_DIR
npx prisma migrate deploy
```

> `migrate deploy` applies migrations without interactive prompts — safe for production.

Alternatively, run migrations locally against the production database (add prod DATABASE_URL to `.env.local` temporarily):
```bash
npx prisma migrate deploy
```

---

## Step 6 — Deploy

Click **Deploy** in hPanel.

Hostinger will:
1. Pull the latest code from GitHub
2. Run `npm install`
3. Run `npm run build`
4. Start the app with `npm start`

✅ Auto-redeploy is enabled — every `git push` to `main` triggers a new build.

---

## Step 7 — Connect Your Domain

1. hPanel → Domains → point your domain to the Node.js app
2. Enable **Free SSL** (Let's Encrypt) in hPanel → SSL
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your domain URL

---

## Step 8 — Verify Production Checklist

- [ ] Homepage loads at `https://your-domain.com`
- [ ] `/shop` page shows products
- [ ] `/admin` dashboard accessible
- [ ] Test order with Razorpay test keys → switch to live
- [ ] Order confirmation email received via Resend
- [ ] `npx prisma studio` (local) shows all tables populated
- [ ] Cloudinary images loading
- [ ] Mobile responsive ✓

---

## Switching from Test to Production (Razorpay)

1. Dashboard: [dashboard.razorpay.com](https://dashboard.razorpay.com) → Live Keys
2. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `rzp_live_...` keys
3. Update `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your live public key
4. Redeploy

---

## Useful Commands

```bash
# Local development
npm run dev

# Check database
npx prisma studio

# Apply new migrations (production)
npx prisma migrate deploy

# Generate Prisma client after schema changes
npx prisma generate

# Check build locally before pushing
npm run build
npm start
```

---

## Support

- Hostinger Node.js docs: https://support.hostinger.com/en/articles/nodejs
- Prisma MySQL docs: https://pris.ly/d/mysql-connection-string
- Razorpay docs: https://razorpay.com/docs/
- Resend docs: https://resend.com/docs
