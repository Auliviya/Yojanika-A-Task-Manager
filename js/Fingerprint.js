class FingerprintAuth {
    constructor() {
        this.scanner = document.getElementById('scanner');
        this.statusMessage = document.getElementById('status-message');
        this.progressBar = document.querySelector('.progress');
        this.retryBtn = document.getElementById('retry-btn');
        this.altAuthBtn = document.getElementById('alt-auth-btn');
        this.passwordForm = document.getElementById('password-form');
        this.backToFpBtn = document.getElementById('back-to-fp');
        
        this.isScanning = false;
        this.progress = 0;
        this.mockFingerprints = this.generateMockFingerprints();
        
        this.initializeEventListeners();
    }

    generateMockFingerprints() {
        // Simulate stored fingerprints
        return [
            'fp_123456789',
            'fp_987654321'
        ];
    }

    initializeEventListeners() {
        this.scanner.addEventListener('click', () => this.startScanning());
        this.retryBtn.addEventListener('click', () => this.resetScanner());
        this.altAuthBtn.addEventListener('click', () => this.showPasswordForm());
        this.backToFpBtn.addEventListener('click', () => this.showFingerprintScanner());
        this.passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
    }

    startScanning() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.scanner.classList.add('scanning');
        this.updateStatus('Scanning fingerprint...', 'scanning');
        this.progress = 0;
        this.progressBar.style.width = '0%';

        // Simulate scanning progress
        this.scanningInterval = setInterval(() => {
            this.progress += 2;
            this.progressBar.style.width = `${this.progress}%`;

            if (this.progress >= 100) {
                clearInterval(this.scanningInterval);
                this.validateFingerprint();
            }
        }, 50);
    }

    validateFingerprint() {
        // Simulate fingerprint validation
        setTimeout(() => {
            // Random success/failure for demonstration
            const isValid = Math.random() > 0.3;
            
            if (isValid) {
                this.authenticationSuccess();
            } else {
                this.authenticationFailed();
            }
        }, 500);
    }

    authenticationSuccess() {
        this.scanner.classList.remove('scanning');
        this.scanner.classList.add('success');
        this.updateStatus('Authentication successful!', 'success');
        this.retryBtn.classList.add('hidden');
        
        // Redirect to dashboard after successful authentication
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    }

    authenticationFailed() {
        this.scanner.classList.remove('scanning');
        this.scanner.classList.add('error');
        this.updateStatus('Authentication failed. Please try again.', 'error');
        this.retryBtn.classList.remove('hidden');
        this.isScanning = false;
    }

    resetScanner() {
        this.scanner.classList.remove('scanning', 'success', 'error');
        this.updateStatus('Awaiting fingerprint...', 'waiting');
        this.progress = 0;
        this.progressBar.style.width = '0%';
        this.retryBtn.classList.add('hidden');
    }

    updateStatus(message, state) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-${state}`;
    }

    showPasswordForm() {
        this.scanner.parentElement.classList.add('hidden');
        this.passwordForm.classList.remove('hidden');
        this.altAuthBtn.classList.add('hidden');
    }

    showFingerprintScanner() {
        this.scanner.parentElement.classList.remove('hidden');
        this.passwordForm.classList.add('hidden');
        this.altAuthBtn.classList.remove('hidden');
        this.resetScanner();
    }

    handlePasswordSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulate password validation
        if (username === 'admin' && password === 'password') {
            this.updateStatus('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } else {
            this.updateStatus('Invalid credentials', 'error');
        }
    }
}

// Initialize the fingerprint authentication
document.addEventListener('DOMContentLoaded', () => {
    const fingerprintAuth = new FingerprintAuth();
});








