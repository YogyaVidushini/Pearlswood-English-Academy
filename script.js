document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementsByClassName("toggle-btn")[0];
    const navMenu = document.getElementsByClassName("nav-menu")[0];

    toggleBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents the <a> from jumping to top
        navMenu.classList.toggle("active");
    });
});

//contact form

// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('form-message');
    
    // Check if form was successfully submitted (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
        showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);

    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Create FormData object
        const formData = new FormData(form);
        
        // Submit form using fetch API
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                form.reset();
                clearValidationStyles();
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        showMessage('Please check your form and try again.', 'error');
                    } else {
                        showMessage('There was an error sending your message. Please try again.', 'error');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            form.reset();
            clearValidationStyles();
        })
        .finally(() => {
            setLoadingState(false);
        });
    });
    
    // Form validation function
    function validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Validate name
        if (!name.value.trim()) {
            showFieldError(name, 'Name is required');
            isValid = false;
        } else {
            showFieldSuccess(name);
        }
        
        // Validate email
        if (!email.value.trim()) {
            showFieldError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            showFieldSuccess(email);
        }
        
        // Validate message
        if (!message.value.trim()) {
            showFieldError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFieldError(message, 'Message should be at least 10 characters long');
            isValid = false;
        } else {
            showFieldSuccess(message);
        }
        
        // Show general error message if form is invalid
        if (!isValid) {
            showMessage('Please fill in all required fields correctly.', 'error');
        }
        
        return isValid;
    }
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    // Show field success
    function showFieldSuccess(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }
    
    // Clear validation styles
    function clearValidationStyles() {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
    }
    
    // Set loading state for submit button
    function setLoadingState(loading) {
        const btnText = submitBtn.querySelector('.btn-text');
        
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.textContent = 'Send';
        }
    }
    
    // Show success/error messages
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll to message for better visibility
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
    
    // Hide message
    function hideMessage() {
        messageDiv.style.display = 'none';
    }
    
    // Real-time validation on field blur
    const formFields = form.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling when user starts typing
            this.classList.remove('invalid', 'valid');
        });
    });
    
    // Validate single field
    function validateSingleField(field) {
        const value = field.value.trim();
        
        if (field.id === 'name') {
            if (value) {
                showFieldSuccess(field);
            } else {
                showFieldError(field);
            }
        }
        
        if (field.id === 'email') {
            if (value && isValidEmail(value)) {
                showFieldSuccess(field);
            } else if (value) {
                showFieldError(field);
            }
        }
        
        if (field.id === 'message') {
            if (value && value.length >= 10) {
                showFieldSuccess(field);
            } else if (value) {
                showFieldError(field);
            }
        }
    }
    
    // Prevent form submission on Enter key in input fields (except textarea)
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            
            // Find next field and focus it
            const fields = Array.from(form.querySelectorAll('.form-control'));
            const currentIndex = fields.indexOf(e.target);
            const nextField = fields[currentIndex + 1];
            
            if (nextField) {
                nextField.focus();
            } else {
                // If it's the last field, submit the form
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
});
// Gallery Modal Functions - Add this to your existing script.js file
let currentMediaSrc = '';
let currentMediaType = '';

function openModal(src, type) {
    currentMediaSrc = src;
    currentMediaType = type;
    const modal = document.getElementById('mediaModal');
    const container = document.getElementById('modalMediaContainer');
    
    container.innerHTML = '';
    
    if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '70vh';
        video.style.borderRadius = '8px';
        video.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70vh';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        container.appendChild(img);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('mediaModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function downloadMedia() {
    try {
        // Show loading state
        const downloadBtn = document.querySelector('.modal-btn[onclick="downloadMedia()"]');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;
        
        // Fetch the file as a blob
        const response = await fetch(currentMediaSrc);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Get filename from path and ensure it has the correct extension
        let filename = currentMediaSrc.split('/').pop();
        
        // Handle files without extensions or with incorrect extensions
        if (!filename.includes('.')) {
            const mimeType = blob.type;
            if (mimeType.includes('image')) {
                filename += '.jpg'; // Default image extension
            } else if (mimeType.includes('video')) {
                filename += '.mp4'; // Default video extension
            }
        }
        
        link.download = filename || 'media';
        link.style.display = 'none';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
        
        // Restore button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        // Show success message
        showNotification('Download started successfully!', 'success');
        
    } catch (error) {
        console.error('Download failed:', error);
        
        // Restore button state
        const downloadBtn = document.querySelector('.modal-btn[onclick="downloadMedia()"]');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.disabled = false;
        
        // Fallback: try direct download
        fallbackDownload();
    }
}

function fallbackDownload() {
    try {
        const link = document.createElement('a');
        link.href = currentMediaSrc;
        link.download = currentMediaSrc.split('/').pop() || 'media';
        link.target = '_blank'; // Open in new tab if direct download fails
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('If download didn\'t start, the file will open in a new tab where you can save it manually.', 'info');
    } catch (error) {
        console.error('Fallback download also failed:', error);
        showNotification('Download failed. Please try right-clicking the image/video and selecting "Save as..."', 'error');
    }
}

function shareMedia() {
    if (navigator.share) {
        navigator.share({
            title: 'Pearlswood English Academy Gallery',
            text: 'Check out this photo/video from Pearlswood English Academy',
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Fallback - copy URL to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            // If clipboard fails, show the URL
            prompt('Copy this link:', window.location.href);
        });
    } else {
        // Even older browsers
        prompt('Copy this link:', window.location.href);
    }
}

// Notification function for better user feedback
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.download-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `download-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#3498db';
            break;
    }
    
    // Add CSS for animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('mediaModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Prevent right-click context menu on images (optional - for protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.gallery')) {
        e.preventDefault();
    }
});

// Preload images for better performance (optional)
function preloadImages() {
    const images = document.querySelectorAll('.gallery img');
    images.forEach(img => {
        const imageLoader = new Image();
        imageLoader.src = img.src;
    });
}

// Initialize preloading when page loads
document.addEventListener('DOMContentLoaded', preloadImages);


