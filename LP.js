document.addEventListener('DOMContentLoaded', function() {
    const LandingPage = {
        init: function() {
            this.initializeElements();
            this.bindEvents();
            this.checkAuthStatus();
        },

        initializeElements: function() {
            this.getStartedBtn = document.querySelector('.get-started-btn'); // Make sure this class exists in your LP.html
        },

        bindEvents: function() {
            if (this.getStartedBtn) {
                this.getStartedBtn.addEventListener('click', () => this.handleGetStarted());
            }
        },

        checkAuthStatus: function() {
            // Check if user is logged in by looking for auth token or user data
            const userToken = localStorage.getItem('userToken');
            const userData = localStorage.getItem('userData');
            
            return !!(userToken && userData); // Returns true if both exist
        },

        handleGetStarted: function() {
            if (this.checkAuthStatus()) {
                // User is logged in, redirect to home page
                window.location.href = '/pages/home.html';
            } else {
                // User is not logged in, redirect to login/signup page
                window.location.href = '/pages/LoginOrSignup.html';
            }
        }
    };

    LandingPage.init();
});

        init: function() {
            this.initializeElements();
            this.bindEvents();
            this.checkAuthStatus();
        },

        initializeElements: function() {
            this.getStartedBtn = document.querySelector('.get-started-btn'); // Make sure this class exists in your LP.html
        },

        bindEvents: function() {
            if (this.getStartedBtn) {
                this.getStartedBtn.addEventListener('click', () => this.handleGetStarted());
            }
        },

        checkAuthStatus: function() {
            // Check if user is logged in by looking for auth token or user data
            const userToken = localStorage.getItem('userToken');
            const userData = localStorage.getItem('userData');
            
            return !!(userToken && userData); // Returns true if both exist
        },

        handleGetStarted: function() {
            if (this.checkAuthStatus()) {
                // User is logged in, redirect to home page
                window.location.href = '/pages/home.html';
            } else {
                // User is not logged in, redirect to login/signup page
                window.location.href = '/pages/LoginOrSignup.html';
            }
        }
    };

    LandingPage.init();
});
