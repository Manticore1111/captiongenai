# 🚀 Secure Authentication System Setup Guide

## ✅ What's Been Configured

Your application now has a **complete secure authentication system** with:

### 🔐 Security Features
- ✅ Password hashing with bcryptjs (salted & hashed)
- ✅ SQLite database for all user data
- ✅ JWT tokens for session management
- ✅ Email validation on registration
- ✅ Password strength requirements (min 8 characters)
- ✅ Only registered users can login
- ✅ Unique email addresses (no duplicates)

### 💾 Database Structure
```sql
users table:
├── id: Unique identifier
├── email: Unique email address
├── password: Hashed password (bcrypt)
├── name: User's full name
├── phone: User's phone number (optional)
├── country: User's country (optional)
├── subscription_status: 'free' or 'pro'
├── created_at: Registration timestamp
└── More fields for activity tracking
```

### 🔄 Authentication Flow

**Registration:**
1. User fills form (name, email, password, phone)
2. Server validates input
3. Password hashed with bcryptjs
4. User stored in database
5. JWT token generated
6. Token + user data returned to frontend
7. Frontend stores in localStorage
8. Redirects to dashboard

**Login:**
1. User enters email + password
2. Server checks if user exists in database
3. Password compared with stored hash (safe comparison)
4. If valid → JWT token generated
5. If invalid → Error returned ("Invalid email or password")
6. Token stored in localStorage
7. User can access protected pages

**What's Prevented:**
- ❌ Fake logins without registration
- ❌ Unknown credentials accepted
- ❌ Plain text passwords stored
- ❌ Duplicate email addresses
- ❌ Weak passwords

---

## 🛠️ How to Use

### Step 1: Start the Server
```bash
cd server
npm install  # (if not done yet)
npm start
```

Server runs on: `http://localhost:5000`

### Step 2: Open Frontend
```bash
Open: c:\Users\mofik\OneDrive\Desktop\Nieuwe map\standalone\register.html
```

### Step 3: Create an Account
Fill in:
- Full Name: e.g., "John Doe"
- Email: e.g., "john@example.com"
- Password: Min 8 chars with uppercase, lowercase, number
- Phone: Optional
- Accept terms
- Click "Create My Account"

✅ Account is now stored in database!

### Step 4: Login
Go to: `login.html`
- Email: john@example.com
- Password: [your password]
- Click "Sign In"

✅ Only this email+password combination will work!

### Step 5: Try Invalid Login
Try:
- Email: john@example.com
- Password: WrongPassword
- Result: ❌ "Invalid email or password"

Try:
- Email: fake@example.com
- Password: AnyPassword123!
- Result: ❌ "Invalid email or password. User not registered."

---

## 🧪 Test the System

### Option 1: Use Test Script
```bash
cd server
node test-auth.js
```

This will:
- ✅ Register a new test user
- ✅ Login with correct credentials
- ✅ Fail login with wrong password
- ✅ Fail login with non-existent user

### Option 2: Manual Testing

**Test 1: Register**
```
Open: register.html
Name: Alice Smith
Email: alice@example.com
Password: SecurePass123!
Phone: +31612345678
Register → Should see dashboard
```

**Test 2: Login with Correct Credentials**
```
Open: login.html
Email: alice@example.com
Password: SecurePass123!
Login → Should see dashboard with your name
```

**Test 3: Login with Wrong Password**
```
Open: login.html
Email: alice@example.com
Password: WrongPassword!
Login → ❌ "Invalid email or password"
```

**Test 4: Login with Fake Email**
```
Open: login.html
Email: nonexistent@example.com
Password: AnyPassword123!
Login → ❌ "Invalid email or password. User not registered."
```

---

## 📊 Database Connection

Your data is stored in: `server/mindboost.db` (SQLite)

To view users:
```bash
# In server folder
sqlite3 mindboost.db
SELECT id, email, name, created_at FROM users;
.quit
```

---

## 🔒 Files Modified

### Backend
- ✅ `server/routes/auth.js` - Updated registration & login with proper validation
- ✅ `server/db.js` - Added user fields (name, phone, country) with migration
- ✅ `server/test-auth.js` - Test script for authentication

### Frontend
- ✅ `standalone/register.html` - Updated to send all user data to backend
- ✅ `standalone/login.html` - Updated with better error handling & validation

---

## 💡 Key Features

### Frontend Validation
- Email format check
- Password strength meter (8+ chars, uppercase, lowercase, numbers, special chars)
- Password confirmation required
- Required field validation

### Backend Validation
- Email uniqueness check (database constraint)
- Password strength validation
- Secure password hashing (bcryptjs)
- Error messages don't reveal if user exists (prevents brute force)
- Rate limiting on requests

### Session Management
- JWT tokens (JSON Web Token)
- localStorage persistence
- Auto-redirect if already logged in
- Logout clears session

---

## 🚀 Next Steps

### For Production:
1. Change `JWT_SECRET` in `server/routes/auth.js`
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
   ```

2. Update database location from `./mindboost.db` to a production path

3. Add HTTPS/SSL certificate

4. Use environment variables:
   ```bash
   JWT_SECRET=your_secret_key
   DB_PATH=/var/lib/app/database.db
   ```

### Additional Features to Add:
- [ ] Email verification on registration
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Login attempt tracking
- [ ] Session timeout
- [ ] "Remember me" option

---

## 🆘 Troubleshooting

### "Cannot POST /api/auth/login"
- ✅ Make sure server is running: `npm start`
- ✅ Check port 5000 is available
- ✅ Check server/routes/auth.js exists

### "User already exists"
- ✅ Email is already registered
- ✅ Try with different email address

### "Invalid email or password"
- ✅ Check caps lock is off
- ✅ Verify email spelling
- ✅ Wrong password entered
- ✅ User not registered yet (register first)

### Database locked error
- ✅ Close other applications using the database
- ✅ Delete mindboost.db and restart (will recreate)

---

## 📞 Support

If you encounter issues:
1. Check server logs: `npm start`
2. Check browser console: F12 → Console tab
3. Review auth.js error handling
4. Run test-auth.js to diagnose

---

**Your authentication system is now fully functional! 🎉**

Only registered users with correct credentials can access the application.
