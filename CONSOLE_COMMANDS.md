# 🖥️ Console Commands Reference

## Copy & Paste Commands

### 1️⃣ Health Check
```javascript
testAPI.health()
```
Expected: `✅ Health check passed: { status: 'ok' }`

---

### 2️⃣ Test Registration (Patient)
```javascript
testAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123",
  role: "patient"
})
```
Expected: `✅ Registration successful`

---

### 3️⃣ Test Registration (Doctor)
```javascript
testAPI.register({
  name: "Dr. Jane Smith",
  email: "jane@example.com",
  password: "DocPass123",
  role: "doctor"
})
```
Expected: `✅ Registration successful`

---

### 4️⃣ Test Login
```javascript
testAPI.login({
  email: "john@example.com",
  password: "SecurePass123"
})
```
Expected: `✅ Login successful` + `💾 Token saved to localStorage`

---

### 5️⃣ Full Flow Test (Register + Login)
```javascript
testAPI.fullFlow({
  name: "Test User",
  email: "test" + Date.now() + "@example.com",
  password: "TestPass123",
  role: "patient"
})
```
Expected: 
- Step 1: ✅ Health check
- Step 2: ✅ Registration  
- Step 3: ✅ Login

---

### 6️⃣ Full Flow with Unique Email
```javascript
testAPI.fullFlow({
  name: "New User " + Date.now(),
  email: "user-" + Date.now() + "@test.com",
  password: "NewPass123",
  role: "patient"
})
```
Useful for testing with guaranteed unique email

---

## Quick Diagnostic Commands

### Check Available Test Functions
```javascript
testAPI
```
Should show 4 functions: health, register, login, fullFlow

---

### Check Token Saved
```javascript
localStorage.getItem('token')
```
Should return JWT token string or null

---

### Clear Token
```javascript
localStorage.removeItem('token')
```
Useful for re-testing login

---

### Check API URL
```javascript
import.meta.env.VITE_API_URL
```
Should show: `http://localhost:5000/api`

---

## Batch Test (Copy All at Once)

```javascript
// 1. Health check
await testAPI.health();

// 2. Register patient
await testAPI.register({
  name: "Patient One",
  email: "patient1@test.com",
  password: "PatPass123",
  role: "patient"
});

// 3. Register doctor
await testAPI.register({
  name: "Doctor One",
  email: "doctor1@test.com",
  password: "DocPass123",
  role: "doctor"
});

// 4. Login as patient
await testAPI.login({
  email: "patient1@test.com",
  password: "PatPass123"
});

// 5. Login as doctor
await testAPI.login({
  email: "doctor1@test.com",
  password: "DocPass123"
});

console.log('✅ All tests completed!');
```

---

## Error Testing

### Test with Missing Field
```javascript
testAPI.register({
  name: "John Doe",
  // email missing!
  password: "SecurePass123",
  role: "patient"
})
```
Expected Error: Validation error

---

### Test with Wrong Password
```javascript
testAPI.login({
  email: "john@example.com",
  password: "WrongPassword"
})
```
Expected Error: `Invalid credentials`

---

### Test with Non-Existent User
```javascript
testAPI.login({
  email: "nonexistent@example.com",
  password: "SomePassword"
})
```
Expected Error: `Invalid credentials`

---

### Test with Duplicate Email
```javascript
testAPI.register({
  name: "Another Name",
  email: "john@example.com",  // Already registered
  password: "SecurePass123",
  role: "patient"
})
```
Expected Error: `User already exists`

---

## Backend Console Checks

### In Backend Console, You Should See

After registration:
```
🏠 REGISTER CONTROLLER: Received request body: {...}
🔵 REGISTER SERVICE: Starting registration {name, email, role}
🔵 REGISTER SERVICE: Checking if user exists...
🔵 REGISTER SERVICE: Hashing password...
🔵 REGISTER SERVICE: Creating user in database...
✅ REGISTER SERVICE: User created successfully {id: '...', email: '...'}
🏠 REGISTER CONTROLLER: Registration successful
```

After login:
```
🏠 LOGIN CONTROLLER: Processing login request
🔵 LOGIN SERVICE: Starting login attempt for [email]
✅ LOGIN SERVICE: Login successful for [email]
🏠 LOGIN CONTROLLER: Login successful
```

---

## Frontend Console Checks

### After Health Check
```
🏥 HEALTH CHECK: Testing backend connectivity...
✅ HEALTH CHECK: Backend is online
```

### After Registration
```
📤 API REQUEST: POST http://localhost:5000/api/auth/register
   body: {name, email, password, role}
   hasAuth: false

📥 API RESPONSE: 201
   endpoint: /auth/register
   data: {message: '...', data: {...}}
```

### After Login
```
📤 API REQUEST: POST http://localhost:5000/api/auth/login
   body: {email, password: '***'}
   hasAuth: false

📥 API RESPONSE: 200
   endpoint: /auth/login
   data: {message: '...', token: '...', user: {...}}
```

---

## Useful Debugging Commands

### Show All Console Logs from This Session
```javascript
// Reload page to get clean logs
location.reload()
```

### Test with Logging Enabled
```javascript
// Paste this before running test
window.DEBUG = true;
testAPI.fullFlow({name: "Test", email: "test@test.com", password: "Pass123", role: "patient"})
```

### Get User Data from Token
```javascript
// If you have a token stored
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);
```

---

## Production Testing Sequence

1. **Health Check**
```javascript
testAPI.health()
```

2. **Register User**
```javascript
testAPI.register({
  name: "Production Test User",
  email: "prod-" + Date.now() + "@example.com",
  password: "ProdPass123",
  role: "patient"
})
```

3. **Verify in MongoDB**
- Open MongoDB Compass or shell
- Query: `db.users.findOne({email: "prod-...@example.com"})`
- Check: `_id` is ObjectId (not UUID string)

4. **Test Login**
```javascript
testAPI.login({
  email: "prod-" + Date.now() + "@example.com",
  password: "ProdPass123"
})
```

5. **Verify Token**
```javascript
localStorage.getItem('token')
```

---

## Clearing Data for Fresh Testing

### Remove Token from localStorage
```javascript
localStorage.clear()
```

### Delete User from MongoDB (via Compass or Shell)
```javascript
db.users.deleteOne({email: "test@example.com"})
```

---

## Expected Console Colors

- 🏥 Blue circle = Health check
- 📤 Up arrow = Request going out
- 📥 Down arrow = Response coming in
- 🏠 House = Controller message
- 🔵 Blue dot = Service message
- ✅ Green checkmark = Success
- ❌ Red X = Error
- ⚠️ Warning = Caution message
- 💾 Floppy disk = Saving data

---

## Copy-Ready One-Liners

```javascript
// Quick health check
testAPI.health()

// Quick register
testAPI.register({name:"Test",email:"t@t.com",password:"Pass123",role:"patient"})

// Quick login
testAPI.login({email:"t@t.com",password:"Pass123"})

// Full test
testAPI.fullFlow({name:"User",email:"u"+Date.now()+"@t.com",password:"Pass123",role:"patient"})

// Check token
localStorage.getItem('token')?'✅ Token exists':'❌ No token'

// View all tests available
Object.keys(testAPI).forEach(fn => console.log(`${fn}()`))
```

---

**Copy & paste these directly into browser console!**
