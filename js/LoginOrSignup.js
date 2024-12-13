// Initialize users array in localStorage if it doesn't exist
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Get DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupContainer = document.getElementById('signupContainer');                                
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');           

// Toggle between login and signup forms
showSignupLink.addEventListener('click', (e) => {                              
    e.preventDefault();
    loginForm.parentElement.style.display = 'none';
    signupContainer.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.parentElement.style.display = 'block';
    signupContainer.style.display = 'none';
});

// Handle signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        alert('User with this email already exists!');
        return;
    }
    
    // Add new user
    users.push({
        username,
        email,
        password // In a real application, you should hash the password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully! Please log in.');
    
    // Reset form and show login
    signupForm.reset();
    loginForm.parentElement.style.display = 'block';
    signupContainer.style.display = 'none';
});

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store logged in user
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = '/pages/dashboard.html'; // Redirect to home page
    } else {
        alert('Invalid email or password!');
    }
});

// Check if user is already logged in
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    window.location.href = '/pages/dashboard.html'; // Redirect to home page if already logged in
}