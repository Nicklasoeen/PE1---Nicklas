const API_URL = 'https://v2.api.noroff.dev';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');
  

  if (!name || !email || !password) {
    showError('All fields are required');
    return;
  }
  
  if (!/^\w+$/.test(name)) {
    showError('Name must contain only letters, numbers, and underscores (no spaces)');
    return;
  }
  
  if (name.length > 20) {
    showError('Name must be 20 characters or less');
    return;
  }
  
  if (password.length < 8) {
    showError('Password must be at least 8 characters long');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('Please enter a valid Noroff email (username@stud.noroff.no or username@noroff.no)');
    return;
  }


  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating account...';
  submitBtn.disabled = true;
  
  const requestData = {
    name,
    email,
    password,
  };
  
  console.log('Sending registration data:', requestData);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    
    console.log('API Response:', { status: response.status, data });
    
    if (response.ok && data.data) {

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('userName', data.data.name);
      

      showError('Account created successfully! Redirecting...', true);
      

      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
    } else {
      let errorMsg = 'Registration failed. Please try again.';
      
      if (data.errors && Array.isArray(data.errors)) {
        errorMsg = data.errors.map(e => e.message || String(e)).join(', ');
      } else if (data.statusMessage) {
        errorMsg = data.statusMessage;
      } else if (data.message) {
        errorMsg = data.message;
      } else if (typeof data === 'string') {
        errorMsg = data;
      }
      
      console.error('Registration error response:', errorMsg);
      showError(errorMsg);
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError('An error occurred. Please try again later.');
  } finally {

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function showError(message, isSuccess = false) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = isSuccess 
      ? 'success-message' 
      : 'error-message';
  }
}

function isValidEmail(email) {
  const noroffEmailRegex = /^[\w\-.]+@(stud\.)?noroff\.no$/;
  return noroffEmailRegex.test(email);
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  

  if (!email || !password) {
    showError('Email and password are required');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('Please enter a valid Noroff email');
    return;
  }
  
  if (password.length < 8) {
    showError('Password must be at least 8 characters long');
    return;
  }
  

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.disabled = true;
  
  const requestData = {
    email,
    password,
  };
  
  console.log('Sending login data:', requestData);
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    
    console.log('Login API Response:', { status: response.status, data });
    
    if (response.ok && data.data) {

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('userName', data.data.name);
      localStorage.setItem('userEmail', data.data.email);
      

      showError('Login successful! Redirecting...', true);
      

      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
    } else {

      let errorMsg = 'Login failed. Please try again.';
      
      if (data.errors && Array.isArray(data.errors)) {
        errorMsg = data.errors.map(e => e.message || String(e)).join(', ');
      } else if (data.statusMessage) {
        errorMsg = data.statusMessage;
      } else if (data.message) {
        errorMsg = data.message;
      }
      
      console.error('Login error response:', errorMsg);
      showError(errorMsg);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred. Please try again later.');
  } finally {

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}
