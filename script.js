// ===== DOM ELEMENTS =====
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
const contactForm = document.getElementById('contactForm');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// ===== MOBILE NAV =====
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  navLinks.forEach(link =>
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    })
  );
}

// ===== AUTH TABS =====
if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const targetForm = document.getElementById(`${targetTab}-form`);
      if (targetForm) targetForm.classList.add('active');
    });
  });
}

// ===== GALLERY FILTER =====
let visibleGalleryItems = [];
function updateVisibleGalleryItems() {
  visibleGalleryItems = [...galleryItems].filter(i => i.style.display !== 'none');
}
if (filterBtns.length && galleryItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        item.style.display = filter === 'all' || category === filter ? 'block' : 'none';
      });
      updateVisibleGalleryItems();
    });
  });
}

// ===== LIGHTBOX =====
let currentImageIndex = 0;
function updateLightboxCounter() {
  const c = document.getElementById('lightbox-current');
  const t = document.getElementById('lightbox-total');
  if (c && t) {
    c.textContent = currentImageIndex + 1;
    t.textContent = visibleGalleryItems.length;
  }
}

function showImageAtIndex(index) {
  const item = visibleGalleryItems[index];
  if (!item) return;
  const img = item.querySelector('.gallery-img');
  const title = item.querySelector('.gallery-overlay h4');
  const desc = item.querySelector('.gallery-overlay p');
  if (!(img && title && desc)) return;

  lightbox.classList.add('loading');
  lightboxImage.style.opacity = '0';
  lightboxImage.src = img.src;
  lightboxTitle.textContent = title.textContent;
  lightboxDescription.textContent = desc.textContent;
  updateLightboxCounter();

  lightboxImage.onload = () => {
    lightbox.classList.remove('loading');
    lightboxImage.style.opacity = '1';
  };
}

function showNextImage() {
  if (!visibleGalleryItems.length) return;
  currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
  showImageAtIndex(currentImageIndex);
}
function showPreviousImage() {
  if (!visibleGalleryItems.length) return;
  currentImageIndex =
    (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
  showImageAtIndex(currentImageIndex);
}
function closeLightboxModal() {
  lightbox.classList.remove('show');
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ===== GALLERY CLICK =====
if (galleryItems.length && lightbox) {
  updateVisibleGalleryItems();
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-overlay h4');
      const desc = item.querySelector('.gallery-overlay p');
      if (!(img && title && desc)) return;

      currentImageIndex = visibleGalleryItems.indexOf(item);
      showImageAtIndex(currentImageIndex);

      lightbox.classList.add('show');
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
}

if (closeLightbox && lightbox) {
  closeLightbox.addEventListener('click', closeLightboxModal);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightboxModal();
  });
}

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
if (prevBtn) prevBtn.addEventListener('click', e => (e.stopPropagation(), showPreviousImage()));
if (nextBtn) nextBtn.addEventListener('click', e => (e.stopPropagation(), showNextImage()));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightboxModal();
  if (e.key === 'ArrowLeft') showPreviousImage();
  if (e.key === 'ArrowRight') showNextImage();
});

// ===== CONTACT FORM =====
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = fd.get('name');
    const email = fd.get('email');
    const subject = fd.get('subject');
    const message = fd.get('message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !subject || !message)
      return showCustomAlert('Please fill in all fields.', 'error');
    if (!emailRegex.test(email))
      return showCustomAlert('Please enter a valid email address.', 'error');

    const btn = contactForm.querySelector('.submit-btn');
    const text = btn.querySelector('.btn-text');
    const icon = btn.querySelector('.btn-icon');
    const original = text.textContent;
    btn.disabled = true;
    text.textContent = 'Sending...';
    icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';

    setTimeout(() => {
      btn.disabled = false;
      text.textContent = original;
      showCustomAlert('Thank you for your message! We will get back to you soon.', 'success');
      contactForm.reset();
    }, 2000);
  });
}

// ===== ALERT =====
function showCustomAlert(message, type = 'success') {
  const el = document.getElementById('customAlert');
  if (!el) return window.alert(message);
  const title = el.querySelector('.alert-title');
  const msg = el.querySelector('.alert-message');
  const icon = el.querySelector('.alert-icon');
  const btn = el.querySelector('.alert-btn');

  msg.textContent = message;
  if (type === 'success') {
    title.textContent = 'Message Sent Successfully!';
    icon.innerHTML = '✔️';
    btn.style.background = '#4CAF50';
  } else {
    title.textContent = 'Please Check Your Input';
    icon.innerHTML = '❌';
    btn.style.background = '#f44336';
  }
  el.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCustomAlert() {
  const el = document.getElementById('customAlert');
  if (!el) return;
  el.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// ===== LOGIN / SIGNUP =====
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(loginForm);
    const email = f.get('email');
    const pass = f.get('password');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !pass) return alert('Please fill in all fields.');
    if (!emailRegex.test(email)) return alert('Invalid email.');
    alert('Login successful!');
    loginForm.reset();
  });

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(signupForm);
    const name = f.get('name');
    const email = f.get('email');
    const pass = f.get('password');
    const cpass = f.get('confirmPassword');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !pass || !cpass) return alert('Please fill in all fields.');
    if (!emailRegex.test(email)) return alert('Invalid email.');
    if (pass.length < 6) return alert('Password too short.');
    if (pass !== cpass) return alert('Passwords do not match.');
    alert('Account created successfully!');
    signupForm.reset();
  });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  })
);

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const n = document.querySelector('.navbar');
  if (!n) return;
  if (window.scrollY > 100) {
    n.style.background = 'rgba(247,245,251,0.95)';
    n.style.backdropFilter = 'blur(10px)';
  } else {
    n.style.background = '#fff';
    n.style.backdropFilter = 'none';
  }
});

// ===== ANIMATIONS =====
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.project-item, .gallery-item, .skill-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  obs.observe(el);
});

// ===== FORM VALIDATION =====
function showFieldError(field, message) {
  field.classList.add('error');
  const ex = field.parentElement.querySelector('.error-message');
  if (ex) ex.remove();
  const e = document.createElement('div');
  e.className = 'error-message';
  e.textContent = message;
  e.style.color = '#e74c3c';
  e.style.fontSize = '12px';
  e.style.marginTop = '5px';
  field.parentElement.appendChild(e);
}
function clearErrors(e) {
  const f = e.target;
  f.classList.remove('error');
  const m = f.parentElement.querySelector('.error-message');
  if (m) m.remove();
}
function validateField(e) {
  const f = e.target;
  const v = f.value.trim();
  f.classList.remove('error');
  if (f.hasAttribute('required') && !v) return showFieldError(f, 'Required field');
  if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return showFieldError(f, 'Invalid email');
  if (f.type === 'password' && v && v.length < 6)
    return showFieldError(f, 'Min 6 chars');
}
document.querySelectorAll('input, textarea').forEach(i => {
  i.addEventListener('blur', validateField);
  i.addEventListener('input', clearErrors);
});

// ===== INITIALIZE PAGE =====
document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('home');
  if (home) home.classList.add('active');
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});
