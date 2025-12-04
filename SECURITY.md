# 🔒 Security Documentation

## Overview
This document outlines the security measures implemented in the NMBS Gamification Platform and provides guidance for maintaining a secure application.

## ✅ Implemented Security Features

### 1. Authentication & Authorization
- **JWT Tokens**: 7-day expiration with secret key rotation support
- **Password Hashing**: bcrypt with 10 salt rounds
- **Password Policies**: Minimum 6 characters (consider increasing to 8+)
- **Token Storage**: Bearer tokens in Authorization headers
- **Session Management**: Stateless JWT-based authentication

### 2. Input Validation
- **express-validator**: Validates all auth endpoints
- **Mongoose Schemas**: Database-level validation
- **Input Sanitization**: Profile fields limited to safe lengths
- **Email Normalization**: Consistent email formatting

### 3. Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Auth Endpoints**: 5 attempts per 15 minutes per IP
- **Admin Actions**: 10 requests per hour per IP

### 4. HTTP Security
- **Helmet.js**: Sets secure HTTP headers
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security (in production)
- **CORS**: Configured to only allow trusted origins
- **Body Parsing**: JSON size limits enforced

### 5. Data Protection
- **Password Exclusion**: Never returned in API responses
- **Sensitive Data**: Excluded from logs and error messages
- **Environment Variables**: Secrets stored in .env files

### 6. Pagination & Query Limits
- **Activities**: Max 100 per page
- **Leaderboard**: Max 100 users per request
- **Points**: Max 10,000 points per single transaction

## ⚠️ Remaining Security Gaps

### Critical Priority

1. **Admin Role System** (Not Implemented)
   - **Risk**: Any authenticated user can create achievements, badges, challenges
   - **Fix**: Add `isAdmin: Boolean` field to User model
   - **Implementation**: Use `adminAuth` middleware (already created in `middleware/adminAuth.js`)
   
   ```javascript
   // In User.js schema
   isAdmin: {
     type: Boolean,
     default: false
   }
   
   // In routes that need admin protection
   const adminAuth = require('../middleware/adminAuth');
   router.post('/achievements', authMiddleware, adminAuth, async (req, res) => {
     // Only admins can reach here
   });
   ```

2. **Production Environment Validation**
   - **Risk**: Server starts without critical environment variables
   - **Fix**: Already implemented - server validates JWT_SECRET and MONGODB_URI on startup

### High Priority

3. **Token Storage Vulnerability**
   - **Risk**: localStorage vulnerable to XSS attacks
   - **Fix**: Consider httpOnly cookies instead
   
   ```javascript
   // Set token in httpOnly cookie (backend)
   res.cookie('token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'strict',
     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   });
   ```

4. **HTTPS Enforcement**
   - **Risk**: Tokens sent over unencrypted HTTP in development
   - **Fix**: Add HTTPS redirect middleware for production
   
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

### Medium Priority

5. **User Enumeration**
   - **Risk**: Registration reveals if email/username exists
   - **Fix**: Use generic error messages
   
   ```javascript
   // Instead of "User already exists"
   return res.status(400).json({ 
     message: 'Registration failed. Please check your information.' 
   });
   ```

6. **No Failed Login Tracking**
   - **Risk**: Can't detect brute force attempts
   - **Fix**: Implement account lockout after failed attempts
   
   ```javascript
   // Add to User schema
   failedLoginAttempts: { type: Number, default: 0 },
   lockUntil: { type: Date }
   ```

7. **Missing Audit Logging**
   - **Risk**: No record of security-sensitive actions
   - **Fix**: Log all authentication events with IP addresses
   
   ```javascript
   const logAuthEvent = (userId, event, ip, success) => {
     // Log to database or external service
   };
   ```

## 🛡️ Security Best Practices

### For Developers

1. **Never Commit Secrets**
   - Use `.env` files for all sensitive data
   - Never hardcode API keys, passwords, or tokens
   - Use `.gitignore` to exclude `.env` files

2. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   npm outdated
   ```

3. **Validate All Inputs**
   - Never trust user input
   - Use express-validator for all endpoints
   - Sanitize data before database operations

4. **Use Parameterized Queries**
   - Mongoose models prevent SQL injection
   - Never concatenate user input into queries

5. **Error Handling**
   - Don't expose stack traces in production
   - Log errors server-side only
   - Return generic error messages to clients

### For Administrators

1. **Environment Variables**
   ```bash
   # Strong JWT secret (at least 32 characters)
   JWT_SECRET=your-super-secret-key-change-this-in-production
   
   # MongoDB connection with authentication
   MONGODB_URI=mongodb://username:password@host:port/database
   
   # Set NODE_ENV in production
   NODE_ENV=production
   ```

2. **Database Security**
   - Enable MongoDB authentication
   - Use strong passwords
   - Limit network access with firewall rules
   - Enable MongoDB audit logging

3. **Server Hardening**
   - Keep OS and packages updated
   - Disable unnecessary services
   - Use firewall to restrict ports
   - Enable fail2ban for SSH protection

4. **Monitoring**
   - Set up log aggregation (ELK stack, Splunk)
   - Monitor for suspicious patterns
   - Set up alerts for security events
   - Regular security audits

## 🔍 Security Testing

### Manual Testing Checklist

- [ ] Test authentication with invalid credentials
- [ ] Verify rate limiting kicks in after exceeded attempts
- [ ] Try accessing protected routes without token
- [ ] Test XSS in profile bio/displayName fields
- [ ] Verify password is never returned in responses
- [ ] Test CORS with unauthorized origins
- [ ] Verify admin-only routes reject non-admin users

### Automated Testing

```bash
# Install security testing tools
npm install --save-dev jest supertest

# Run security audit
npm audit

# Check for known vulnerabilities
npx snyk test
```

## 📝 Security Incident Response

### If You Discover a Vulnerability

1. **Do Not** disclose publicly
2. Document the vulnerability
3. Assess the impact
4. Develop a fix
5. Test the fix thoroughly
6. Deploy to production
7. Monitor for exploitation

### If You Suspect a Breach

1. **Immediately** rotate all secrets (JWT_SECRET, database passwords)
2. Invalidate all active sessions (force re-login)
3. Review audit logs for suspicious activity
4. Notify affected users if data was compromised
5. Document the incident
6. Implement additional safeguards

## 🔄 Security Update Schedule

- **Daily**: Monitor security advisories
- **Weekly**: Review npm audit results
- **Monthly**: Update dependencies
- **Quarterly**: Full security audit
- **Annually**: Penetration testing

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## 🆘 Contact

For security concerns, contact: [your-security-email@example.com]

---

**Last Updated**: 2024
**Reviewed By**: Security Team
**Next Review**: Q2 2024
