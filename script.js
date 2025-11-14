alert('WE ARE BEYOND IMAGINATION.')

// Order Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        // Form validation patterns
        const validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
            fullName: /^[a-zA-Z\s]{2,}$/
        };

        // Real-time validation functions
        function validateField(field, pattern, errorMessage) {
            const value = field.value.trim();
            const isValid = pattern ? pattern.test(value) : value.length > 0;
            
            // Remove existing error styling
            field.classList.remove('error', 'success');
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            if (value && !isValid) {
                field.classList.add('error');
                showFieldError(field, errorMessage);
                return false;
            } else if (value && isValid) {
                field.classList.add('success');
                return true;
            }
            return true;
        }

        function showFieldError(field, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        // Add validation event listeners
        const fullNameField = document.getElementById('fullName');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');

        if (fullNameField) {
            fullNameField.addEventListener('blur', function() {
                validateField(this, validationRules.fullName, 'Please enter a valid full name (at least 2 characters, letters only)');
            });
        }

        if (emailField) {
            emailField.addEventListener('blur', function() {
                validateField(this, validationRules.email, 'Please enter a valid email address');
            });
        }

        if (phoneField) {
            phoneField.addEventListener('blur', function() {
                validateField(this, validationRules.phone, 'Please enter a valid phone number');
            });
        }

        // Form submission handler
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any existing messages
            clearMessages();
            
            // Validate all required fields
            const formData = new FormData(this);
            const errors = [];
            
            // Required field validation
            const requiredFields = [
                { field: 'fullName', name: 'Your Name' },
                { field: 'phone', name: 'Phone Number' },
                { field: 'productType', name: 'Product Type' },
                { field: 'quantity', name: 'Quantity' },
                { field: 'description', name: 'Description' }
            ];

            requiredFields.forEach(({ field, name }) => {
                const value = formData.get(field);
                if (!value) {
                    errors.push(`${name} is required`);
                    const fieldElement = document.getElementById(field);
                    if (fieldElement) {
                        fieldElement.classList.add('error');
                    }
                }
            });

            // Specific validations
            const phone = formData.get('phone');
            if (phone && !validationRules.phone.test(phone)) {
                errors.push('Please enter a valid phone number');
            }

            const email = formData.get('email');
            if (email && !validationRules.email.test(email)) {
                errors.push('Please enter a valid email address');
            }

            const quantity = formData.get('quantity');
            if (quantity && (parseInt(quantity) < 1 || parseInt(quantity) > 10000)) {
                errors.push('Quantity must be between 1 and 10,000');
            }

            if (errors.length > 0) {
                showErrorMessage('Please correct the following errors:\n• ' + errors.join('\n• '));
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Prepare order data for email
            const orderData = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email') || 'Not provided',
                productType: formData.get('productType'),
                quantity: formData.get('quantity'),
                description: formData.get('description'),
                timestamp: new Date().toLocaleString()
            };

            // Create email content
            const emailSubject = `New Printing Quote Request - ${orderData.fullName}`;
            const emailBody = `
QUOTE REQUEST DETAILS:

Customer Name: ${orderData.fullName}
Phone: ${orderData.phone}
Email: ${orderData.email}

PRINTING ORDER:
Item: ${orderData.productType}
Quantity: ${orderData.quantity}

DESCRIPTION:
${orderData.description}

Submitted: ${orderData.timestamp}

Please contact this customer within 24 hours with a quote.
            `.trim();

            // Create mailto link
            const mailtoLink = `mailto:motloungnthabiseng421@gmail.com.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Show success message
                showSuccessMessage('Your email client should open with the quote request. If it doesn\'t open, please call or WhatsApp us at +27 72 656 5457.');
                
                // Create a formatted summary for the user
                createOrderSummary(orderData);
                
                // Reset form
                this.reset();
                clearFieldStyles();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll to success message
                setTimeout(() => {
                    const successMsg = document.querySelector('.success-message');
                    if (successMsg) {
                        successMsg.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                
            }, 1000);
        });

        function clearMessages() {
            const existingMessages = document.querySelectorAll('.success-message, .error-message, .order-summary');
            existingMessages.forEach(msg => msg.remove());
        }

        function clearFieldStyles() {
            const fields = document.querySelectorAll('.order-form input, .order-form select, .order-form textarea');
            fields.forEach(field => {
                field.classList.remove('error', 'success');
            });
        }

        function showErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <strong style="color: #c62828;">⚠️ Error:</strong>
                    <pre style="margin: 0.5rem 0 0 0; color: #d32f2f; white-space: pre-line; font-family: inherit;">${message}</pre>
                </div>
            `;
            orderForm.insertBefore(errorDiv, orderForm.firstChild);
            errorDiv.scrollIntoView({ behavior: 'smooth' });
        }

        function showSuccessMessage(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <strong style="color: #2e7d32;">✅ Success:</strong>
                    <p style="margin: 0.5rem 0 0 0; color: #388e3c;">${message}</p>
                </div>
            `;
            orderForm.insertBefore(successDiv, orderForm.firstChild);
        }

        function createOrderSummary(orderData) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'order-summary';
            summaryDiv.innerHTML = `
                <div style="background: #f3e5f5; border: 2px solid #ff69b4; padding: 1.5rem; margin: 1rem 0; border-radius: 15px;">
                    <h4 style="color: #333; margin-bottom: 1rem;">📋 Your Order Request</h4>
                    <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;">
                        <p><strong>Customer:</strong> ${orderData.fullName}</p>
                        <p><strong>Phone:</strong> ${orderData.phone}</p>
                        <p><strong>Item:</strong> ${orderData.productType}</p>
                        <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                        <p><strong>Details:</strong> ${orderData.description}</p>
                    </div>
                    <p style="font-size: 0.85rem; color: #666; text-align: center;">We'll contact you within 24 hours with a quote!</p>
                </div>
            `;
            
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.appendChild(summaryDiv);
            }
        }

        // Global function to copy order summary
        window.copyOrderSummary = function() {
            const summaryText = document.querySelector('.order-summary').textContent;
            navigator.clipboard.writeText(summaryText).then(() => {
                alert('Order details copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = summaryText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Order details copied to clipboard!');
            });
        };
    }
});
