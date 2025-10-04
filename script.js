// DOM Elements - Check if elements exist before using them
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const galleryItems = document.querySelectorAll('.gallery-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const closeLightbox = document.querySelector('.close-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');

// Contact Form
const contactForm = document.getElementById('contactForm');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Mobile Navigation Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Multi-page navigation - no need for section switching

// Auth Tab Switching
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            const targetForm = document.getElementById(`${targetTab}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });
}

// Gallery Filtering
if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update visible items for lightbox
            updateVisibleGalleryItems();
        });
    });
}

// Gallery Lightbox with Enhanced Functionality
let currentImageIndex = 0;
let visibleGalleryItems = [];

// Update visible gallery items when filtering
function updateVisibleGalleryItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none'
    );
}

// Handle expand button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('expand-btn') || e.target.closest('.expand-btn')) {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            galleryItem.click(); // Trigger the gallery item click
        }
    }
});

// Gallery Lightbox
if (galleryItems.length > 0 && lightbox) {
    // Initialize visible items
    updateVisibleGalleryItems();
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('.gallery-img');
            const titleElement = item.querySelector('.gallery-overlay h4');
            const descriptionElement = item.querySelector('.gallery-overlay p');
            const categoryElement = item.getAttribute('data-category');
            
            if (imgElement && titleElement && descriptionElement && lightboxImage && lightboxTitle && lightboxDescription) {
                const imageSrc = imgElement.src;
                const title = titleElement.textContent;
                const description = descriptionElement.textContent;
                
                // Update visible items and find current index
                updateVisibleGalleryItems();
                currentImageIndex = visibleGalleryItems.indexOf(item);
                
                // Show loading state
                lightbox.classList.add('loading');
                
                // Reset image opacity for animation
                lightboxImage.style.opacity = '0';
                
                // Set lightbox content
                lightboxImage.src = imageSrc;
                lightboxImage.alt = title;
                lightboxTitle.textContent = title;
                lightboxDescription.textContent = description;
                
                // Update category if element exists
                const lightboxCategory = document.getElementById('lightbox-category');
                if (lightboxCategory) {
                    lightboxCategory.textContent = categoryElement;
                }
                
                // Update counter
                updateLightboxCounter();
                
                // Show lightbox with animation
                lightbox.classList.add('show');
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Hide loading when image loads and animate in
                lightboxImage.onload = () => {
                    lightbox.classList.remove('loading');
                    lightboxImage.style.opacity = '1';
                };
            }
        });
    });
}

// Update lightbox counter
function updateLightboxCounter() {
    const currentElement = document.getElementById('lightbox-current');
    const totalElement = document.getElementById('lightbox-total');
    
    if (currentElement && totalElement) {
        currentElement.textContent = currentImageIndex + 1;
        totalElement.textContent = visibleGalleryItems.length;
    }
}

// Navigation functions
function showNextImage() {
    if (visibleGalleryItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
    showImageAtIndex(currentImageIndex);
}

function showPreviousImage() {
    if (visibleGalleryItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    showImageAtIndex(currentImageIndex);
}

function showImageAtIndex(index) {
    const item = visibleGalleryItems[index];
    if (!item) return;
    
    const imgElement = item.querySelector('.gallery-img');
    const titleElement = item.querySelector('.gallery-overlay h4');
    const descriptionElement = item.querySelector('.gallery-overlay p');
    const categoryElement = item.getAttribute('data-category');
    
    if (imgElement && titleElement && descriptionElement) {
        // Show loading state
        lightbox.classList.add('loading');
        
        // Reset image opacity for animation
        lightboxImage.style.opacity = '0';
        
        // Update content
        lightboxImage.src = imgElement.src;
        lightboxImage.alt = titleElement.textContent;
        lightboxTitle.textContent = titleElement.textContent;
        lightboxDescription.textContent = descriptionElement.textContent;
        
        // Update category
        const lightboxCategory = document.getElementById('lightbox-category');
        if (lightboxCategory) {
            lightboxCategory.textContent = categoryElement;
        }
        
        // Update counter
        updateLightboxCounter();
        
        // Hide loading when image loads and animate in
        lightboxImage.onload = () => {
            lightbox.classList.remove('loading');
            lightboxImage.style.opacity = '1';
        };
    }
}

// Close lightbox
if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', () => {
        closeLightboxModal();
    });

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });
}

// Close lightbox function
function closeLightboxModal() {
    lightbox.classList.remove('show');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Navigation event listeners
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

// Contact Form Handling
if (contactForm) {
    console.log('Contact form found, adding event listener');
    
    contactForm.addEventListener('submit', (e) => {
        console.log('Form submit event triggered');
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        console.log('Form data:', { name, email, subject, message });
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            console.log('Validation failed: missing fields');
            showCustomAlert('Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Validation failed: invalid email');
            showCustomAlert('Please enter a valid email address.', 'error');
            return;
        }
        
        console.log('Validation passed, showing loading state');
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        btnIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>';
        
        // Simulate form submission with delay
        setTimeout(() => {
            console.log('Form submission completed, showing success alert');
            // Reset button
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
            btnIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9 22,2"></polygon></svg>';
            
            // Show success alert
            showCustomAlert('Thank you for your message! We will get back to you soon.', 'success');
            // Fallback to browser alert
            setTimeout(() => {
                if (!document.getElementById('customAlert').classList.contains('show')) {
                    alert('Message successfully sent! Thank you for your message!');
                }
            }, 100);
            contactForm.reset();
        }, 2000);
    });
} else {
    console.log('Contact form not found!');
}

// Backup: Direct button click handler for contact form
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        console.log('Submit button found, adding direct click handler');
        submitBtn.addEventListener('click', (e) => {
            console.log('Submit button clicked directly');
            e.preventDefault();
            
            // Get the form
            const form = submitBtn.closest('form');
            if (!form) {
                console.log('No form found for button');
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            console.log('Form data from direct click:', { name, email, subject, message });
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                console.log('Validation failed: missing fields');
                showCustomAlert('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log('Validation failed: invalid email');
                showCustomAlert('Please enter a valid email address.', 'error');
                return;
            }
            
            console.log('Validation passed, showing loading state');
            
            // Show loading state
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            const btnIcon = submitBtn.querySelector('.btn-icon');
            
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            btnIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>';
            
            // Simulate form submission with delay
            setTimeout(() => {
                console.log('Form submission completed, showing success alert');
                // Reset button
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalText;
                btnIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9 22,2"></polygon></svg>';
                
                // Show success alert
                showCustomAlert('Thank you for your message! We will get back to you soon.', 'success');
                // Fallback to browser alert
                setTimeout(() => {
                    if (!document.getElementById('customAlert').classList.contains('show')) {
                        alert('Message successfully sent! Thank you for your message!');
                    }
                }, 100);
                form.reset();
            }, 2000);
        });
    } else {
        console.log('Submit button not found!');
    }
});

// Custom Alert Functions
function showCustomAlert(message, type = 'success') {
    console.log('showCustomAlert called with:', message, type);
    const alert = document.getElementById('customAlert');
    
    if (!alert) {
        console.error('Custom alert element not found!');
        // Fallback to browser alert
        alert(message);
        return;
    }
    
    console.log('Custom alert element found');
    const alertTitle = alert.querySelector('.alert-title');
    const alertMessage = alert.querySelector('.alert-message');
    const alertIcon = alert.querySelector('.alert-icon');
    const alertBtn = alert.querySelector('.alert-btn');
    
    if (!alertTitle || !alertMessage || !alertIcon || !alertBtn) {
        console.error('Alert elements not found!');
        // Fallback to browser alert
        alert(message);
        return;
    }
    
    // Update content
    alertMessage.textContent = message;
    
    if (type === 'success') {
        alertTitle.textContent = 'Message Sent Successfully!';
        alertIcon.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
        alertIcon.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        alertBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        alert.querySelector('.alert-content').style.borderTop = '4px solid #4CAF50';
    } else if (type === 'error') {
        alertTitle.textContent = 'Please Check Your Input';
        alertIcon.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        alertIcon.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        alertBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        alert.querySelector('.alert-content').style.borderTop = '4px solid #f44336';
    }
    
    // Show alert
    console.log('Showing custom alert');
    alert.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCustomAlert() {
    const alert = document.getElementById('customAlert');
    alert.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Login Form Handling
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate login
        alert('Login successful! Welcome back.');
        loginForm.reset();
    });
}

// Signup Form Handling
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(signupForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        // Confirm password validation
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        // Simulate signup
        alert('Account created successfully! Welcome to our portfolio.');
        signupForm.reset();
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(247, 245, 251, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#FFFFFF';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-item, .gallery-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form input animations
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add loading states to buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Processing...';
        this.disabled = true;
        
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 2000);
    });
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        switch(e.key) {
            case 'Escape':
                closeLightboxModal();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('active');
    }
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize form validation
    initializeFormValidation();
});

// Form validation helper
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'password' && value && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorDiv);
}

function clearErrors(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
    }
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(77, 189, 233, 0.2);
    }
`;
document.head.appendChild(style);
