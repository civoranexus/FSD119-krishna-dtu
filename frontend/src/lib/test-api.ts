/**
 * API Testing Utility
 * 
 * Use these functions in the browser console to test API endpoints
 * Examples:
 * 
 * // Test health check
 * testHealth()
 * 
 * // Test registration
 * testRegister({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "SecurePass123",
 *   role: "patient"
 * })
 * 
 * // Test login
 * testLogin({
 *   email: "john@example.com",
 *   password: "SecurePass123"
 * })
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function testHealth() {
  console.log('🏥 Testing backend health...');
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }
}

export async function testRegister(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  console.log('🔐 Testing registration with payload:', payload);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Registration failed:', data);
      return data;
    }
    
    console.log('✅ Registration successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Registration error:', error);
  }
}

export async function testLogin(payload: { email: string; password: string }) {
  console.log('🔑 Testing login with payload:', { email: payload.email, password: '***' });
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Login failed:', data);
      return data;
    }
    
    console.log('✅ Login successful:', data);
    
    // Save token for future requests
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('💾 Token saved to localStorage');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
  }
}

export async function testFullFlow(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  console.log('🚀 Starting full registration + login flow...');
  
  try {
    // 1. Health check
    console.log('\n1️⃣ Step 1: Health check');
    await testHealth();
    
    // 2. Register
    console.log('\n2️⃣ Step 2: Register');
    const registerResult = await testRegister(userData);
    
    if (!registerResult || registerResult.error) {
      console.error('❌ Registration failed, stopping flow');
      return;
    }
    
    // 3. Login
    console.log('\n3️⃣ Step 3: Login');
    await testLogin({
      email: userData.email,
      password: userData.password,
    });
    
    console.log('\n✅ Full flow completed successfully!');
  } catch (error) {
    console.error('❌ Flow test failed:', error);
  }
}

// Expose test functions to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).testAPI = {
    health: testHealth,
    register: testRegister,
    login: testLogin,
    fullFlow: testFullFlow,
  };
  
  console.log('🧪 Test API functions available in console:');
  console.log('  testAPI.health()');
  console.log('  testAPI.register({name, email, password, role})');
  console.log('  testAPI.login({email, password})');
  console.log('  testAPI.fullFlow({name, email, password, role})');
}

export default {
  testHealth,
  testRegister,
  testLogin,
  testFullFlow,
};
