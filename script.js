// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Photo carousel with auto-play
const carouselTrack = document.getElementById('carouselTrack');
if (carouselTrack) {
  const slides = carouselTrack.querySelectorAll('.photo-carousel__slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  let currentIndex = 0;
  let autoPlayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'photo-carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Bild ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    carouselTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dotsContainer.querySelectorAll('.photo-carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goTo(currentIndex + 1), 3500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoPlay(); });

  startAutoPlay();
}

// Counter animation for stats — triggers when stats enter the viewport
function animateCounter(el, target, suffix, duration) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.stat__number');
if (statEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const suffix = raw.includes('+') ? '+' : '';
        const target = parseInt(raw.replace('+', ''), 10);
        animateCounter(el, target, suffix, 1600);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  statEls.forEach(el => observer.observe(el));
}
