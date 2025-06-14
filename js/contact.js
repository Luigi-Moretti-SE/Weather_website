// Contact Form JavaScript - Client-Side Solution
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successAlert = document.getElementById('formSuccess');
        this.errorAlert = document.getElementById('formError');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.addFormEnhancements();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }    async handleSubmit() {
        // Hide previous alerts
        this.hideAlerts();

        console.log('Form submission started...');

        // Validate form
        if (!this.validateForm()) {
            console.log('Form validation failed');
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        console.log('Form data collected:', data);

        try {
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Save submission locally
            console.log('Saving submission...');
            this.saveSubmission(data);            // Send email (via mailto)
            console.log('Opening email client...');
            this.sendEmail(data);

            // Show success message
            this.showSuccess('Thank you for your message! Your submission has been saved and your email client will open with a pre-filled message to send.');
            this.form.reset();

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Sorry, there was an error processing your message. Please try again.');
            
            // Reset button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
            submitBtn.disabled = false;
        }
    }saveSubmission(data) {
        // Create submission object
        const submission = {
            id: Date.now(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            subject: data.subject,
            message: data.message,
            newsletter: data.newsletter === 'on' || false,
            timestamp: new Date().toISOString()
        };

        // Get existing submissions
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        
        // Add new submission
        submissions.push(submission);
        
        // Save back to localStorage
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        console.log('Submission saved locally:', submission);
        console.log('Total submissions now:', submissions.length);
        console.log('All submissions:', submissions);
    }    sendEmail(data) {
        console.log('Sending email via mailto...');
        this.openMailClient(data);
    }openMailClient(data) {
        // Build mailto parameters
        const params = new URLSearchParams();
        
        // Set recipient
        const recipient = 'luigi.moretti@ue-germany.de';
        
        // Set subject
        params.set('subject', `WeatherCast Contact: ${data.subject}`);
        
        // Create email body with all form data
        const emailBody = `
Dear Luigi,

You have received a new message through the WeatherCast website contact form.

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject}

MESSAGE:
━━━━━━━━━━━━━━━━━━━━
${data.message}

ADDITIONAL INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━
Newsletter Subscription: ${data.newsletter === 'on' ? 'Yes' : 'No'}
Submitted on: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This email was generated from the WeatherCast website contact form.
Please reply directly to ${data.email} to respond to the sender.

Best regards,
WeatherCast Contact Form System
        `;
        
        params.set('body', emailBody.trim());
        
        // Optional: Add CC or BCC if needed
        // params.set('cc', 'additional@email.com');
        
        // Create mailto URL
        const mailtoUrl = `mailto:${recipient}?${params.toString()}`;
        
        // Log for debugging
        console.log('Opening mail client with URL:', mailtoUrl);
        
        // Open the mail client
        window.open(mailtoUrl, '_self');
    }

    validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific validations
        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        // Message length validation
        if (field.id === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Simple phone validation (adjust based on your requirements)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return cleanPhone.length >= 7 && phoneRegex.test(cleanPhone);
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showSuccess(message = 'Thank you for your message! We will get back to you soon.') {
        // Update the success message text
        const messageElement = this.successAlert.querySelector('i').nextSibling;
        if (messageElement) {
            messageElement.textContent = ' ' + message;
        }
        
        this.successAlert.style.display = 'block';
        this.successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 15 seconds (longer for this detailed message)
        setTimeout(() => {
            this.successAlert.style.display = 'none';
        }, 15000);
    }

    showError(message) {
        const messageElement = this.errorAlert.querySelector('i').nextSibling;
        if (messageElement) {
            messageElement.textContent = ' ' + message;
        }
        this.errorAlert.style.display = 'block';
        this.errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 8 seconds
        setTimeout(() => {
            this.errorAlert.style.display = 'none';
        }, 8000);
    }

    hideAlerts() {
        this.successAlert.style.display = 'none';
        this.errorAlert.style.display = 'none';
    }

    addFormEnhancements() {
        this.addCharacterCounter();
        this.addFormAnimations();
    }

    addCharacterCounter() {
        const messageField = document.getElementById('message');
        if (messageField) {
            const counter = document.createElement('small');
            counter.className = 'text-muted character-counter mt-1';
            counter.textContent = '0 characters';
            messageField.parentNode.appendChild(counter);

            messageField.addEventListener('input', () => {
                const length = messageField.value.length;
                counter.textContent = `${length} characters`;
                
                if (length < 10) {
                    counter.className = 'text-danger character-counter mt-1';
                    counter.textContent = `${length} characters (minimum 10 required)`;
                } else if (length > 500) {
                    counter.className = 'text-warning character-counter mt-1';
                    counter.textContent = `${length} characters (getting quite long!)`;
                } else {
                    counter.className = 'text-success character-counter mt-1';
                    counter.textContent = `${length} characters`;
                }
            });
        }
    }

    addFormAnimations() {
        // Add focus animations to form fields
        const formFields = this.form.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentNode.classList.add('field-focused');
            });

            field.addEventListener('blur', () => {
                field.parentNode.classList.remove('field-focused');
            });
        });
    }
}

// Utility functions for admin access
window.ContactFormUtils = {
    getSubmissions: () => {
        return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    },
    
    clearSubmissions: () => {
        localStorage.removeItem('contactSubmissions');
        console.log('All submissions cleared');
    },
    
    exportSubmissions: () => {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        console.log('All submissions:', submissions);
        return submissions;
    }
};

// Initialize the contact form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    
    // Add admin access info to console
    console.log('Contact Form loaded successfully!');
    console.log('Admin functions available: ContactFormUtils.getSubmissions(), ContactFormUtils.clearSubmissions(), ContactFormUtils.exportSubmissions()');
    console.log('View admin panel at: admin.html');
});
