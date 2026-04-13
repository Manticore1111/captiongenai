/**
 * Test Authentication Routes
 * Run with: node test-auth.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test credentials
const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'TestPassword123!',
    phone: '+31612345678',
    type: 'register'
  },
  {
    email: 'john@example.com',
    password: 'TestPassword123!',
    type: 'login'
  },
  {
    email: 'john@example.com',
    password: 'WrongPassword123!',
    type: 'login-fail'
  },
  {
    email: 'nonexistent@example.com',
    password: 'SomePassword123!',
    type: 'login-fail'
  }
];

// Helper function to make HTTP requests
function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Starting Authentication Tests...\n');
  console.log('Make sure the server is running on port 5000!\n');

  for (const test of testUsers) {
    const isRegister = test.type === 'register';
    const path = isRegister ? '/register' : '/login';
    const shouldFail = test.type.includes('fail');

    console.log(`\n📝 Test: ${test.type.toUpperCase()}`);
    console.log(`   Email: ${test.email}`);
    console.log(`   Password: ${test.password}`);

    try {
      const result = await makeRequest('POST', path, test);

      console.log(`   Status: ${result.status}`);

      if (shouldFail) {
        if (result.status >= 400) {
          console.log(`   ✅ PASS - Correctly rejected invalid credentials`);
          console.log(`   Error: ${result.data.error}`);
        } else {
          console.log(`   ❌ FAIL - Should have rejected these credentials!`);
        }
      } else {
        if (result.status === 201 || result.status === 200) {
          console.log(`   ✅ PASS - Authentication successful`);
          console.log(`   User: ${result.data.user.name} (${result.data.user.email})`);
          console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
          if (result.data.user) {
            console.log(`   Plan: ${result.data.user.plan}`);
          }
        } else {
          console.log(`   ❌ FAIL - Unexpected response`);
          console.log(`   Response: ${JSON.stringify(result.data)}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      console.log(`   Make sure the server is running: npm start`);
    }

    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);
