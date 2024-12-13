document.addEventListener('DOMContentLoaded', function() {
    // Display username in sidebar
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('username-display').textContent = currentUser.username;
    }

document.addEventListener('DOMContentLoaded', function () {
                const toggle = document.querySelector(`.preference-item:contains('${key}') input`);
                if (toggle) toggle.checked = value;
            });
        },

        updateProfileUI: function (data) {
            document.querySelector('.profile-details h1').textContent = data.fullName;
            document.querySelectorAll('.info-item').forEach(item => {
                const label = item.querySelector('label').textContent.toLowerCase();
                const value = data[label.replace(' ', '')];
                if (value) item.querySelector('p').textContent = value;
            });
        },

        loadActivityFeed: function () {
            // Sample activity data (in real app, this would come from an API)
            const activities = [
                {
                    type: 'task',
                    action: 'completed',
                    title: 'Website Redesign',
                    timestamp: '2 hours ago'
                },
                {
                    type: 'achievement',
                    action: 'earned',
                    title: 'Task Master Badge',
                    timestamp: '1 day ago'
                },
                {
                    type: 'streak',
                    action: 'reached',
                    title: '7-day streak',
                    timestamp: '2 days ago'
                }
            ];

            this.renderActivities(activities);
        },

        renderActivities: function (activities) {
            this.activityFeed.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p><strong>${activity.title}</strong> ${activity.action}</p>
                        <span class="activity-time">${activity.timestamp}</span>
                    </div>
                </div>
            `).join('');
        },

        getActivityIcon: function (type) {
            const icons = {
                task: 'fa-check-circle',
                achievement: 'fa-trophy',
                streak: 'fa-fire'
            };
            return icons[type] || 'fa-circle';
        },

        showNotification: function (message) {
            // Simple notification (can be replaced with a more sophisticated solution)
            alert(message);
        },

        handleLogout: function () {
            // Show confirmation dialog
            const confirmLogout = confirm('Are you sure you want to logout?');

            if (confirmLogout) {
                // Clear all relevant data from localStoragelocalStorage.removeItem('currentUser');
                localStorage.removeItem("currentUser")
                localStorage.removeItem('userData');
                localStorage.removeItem('userToken');
                localStorage.removeItem('profileData');
                localStorage.removeItem('preferences');
                localStorage.removeItem('journalEntries');
                localStorage.removeItem('profileImage');
                // Add any other data that needs to be cleared

                // Redirect to login page
                window.location.href = '/pages/LoginOrSignup.html';
            }
        }
    };

    Profile.init();

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const editBtn = document.querySelector('.edit-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.btn-cancel');
    const profileForm = document.getElementById('profile-form');
    
    // Get current user data and display it
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Display current user info in the profile section
        document.getElementById('display-name').textContent = currentUser.username || '';
        document.getElementById('display-email').textContent = currentUser.email || '';
        document.getElementById('display-phone').textContent = currentUser.phone || '';
        document.getElementById('display-location').textContent = currentUser.location || '';
        
        // Display username in the header
        document.getElementById('username-display').textContent = currentUser.username || '';
    }

    // Open modal when edit button is clicked
    editBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        
        // Pre-fill form with current user data
        if (currentUser) {
            document.querySelector('input[name="fullName"]').value = currentUser.username || '';
            document.querySelector('input[name="email"]').value = currentUser.email || '';
            document.querySelector('input[name="phone"]').value = currentUser.phone || '';
            document.querySelector('input[name="location"]').value = currentUser.location || '';
        }
    });

    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
    }

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', closeModal);

    // Close modal when Cancel button is clicked
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = {
            username: document.querySelector('input[name="fullName"]').value,
            email: document.querySelector('input[name="email"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            location: document.querySelector('input[name="location"]').value
        };

        // Update localStorage
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update display in profile section
        document.getElementById('display-name').textContent = formData.username;
        document.getElementById('display-email').textContent = formData.email;
        document.getElementById('display-phone').textContent = formData.phone;
        document.getElementById('display-location').textContent = formData.location;

        // Update username display in header
        document.getElementById('username-display').textContent = formData.username;

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Profile updated successfully!';
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Close modal
        closeModal();
    });
});



function handleLogout() {
    // Show confirmation dialog
    const confirmLogout = confirm('Are you sure you want to log out?');
    
    if (confirmLogout) {
        try {
            // Clear all user data from localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('calendarEvents');
            localStorage.removeItem('journalEntries');
            localStorage.removeItem('userData');
            localStorage.removeItem('userToken');
            localStorage.removeItem('profileData');
            localStorage.removeItem('preferences');
            localStorage.removeItem('profileImage');
            
            // Show success message
            showLogoutMessage();
            
            // Redirect to login page after a brief delay
            setTimeout(() => {
                window.location.href = 'LoginOrSignup.html';
            }, 1500);
            
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout. Please try again.');
        }
    }
}
const logoutBtn = document.getElementById('logoutBtn');
console.log(logoutBtn);
logoutBtn.addEventListener('click', handleLogout);

function showLogoutMessage() {
    // Create and show a success message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'logout-message';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Logging out successfully...</span>
    `;
    document.body.appendChild(messageDiv);
}
