/**
 * SANJALU // EDITORIAL RETROSPECTIVE (V2)
 * Mobile Drawer, Lightbox Modal, Scroll-Triggered Fade-In, and Photo Assignment Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Birthday Opener Curtain & Audio Handling
  const hbdCurtain = document.getElementById('hbdCurtain');
  const enterBtn = document.getElementById('enterBtn');
  const loaderBar = document.getElementById('loaderBar');
  const bgAudio = document.getElementById('bgAudio');
  const audioToggle = document.getElementById('audioToggle');
  const audioLabel = document.getElementById('audioLabel');

  let isPlaying = false;

  // Fake asset preload animation on curtain
  if (loaderBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      loaderBar.style.width = `${progress}%`;
    }, 150);
  }

  function startAudio() {
    if (bgAudio) {
      bgAudio.volume = 0.45;
      bgAudio.play().then(() => {
        isPlaying = true;
        if (audioLabel) audioLabel.textContent = "Music: On";
      }).catch(err => {
        console.log("Audio play blocked by browser policy:", err);
      });
    }
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      if (audioLabel) audioLabel.textContent = "Music: Off";
    } else {
      startAudio();
    }
  }

  if (enterBtn && hbdCurtain) {
    enterBtn.addEventListener('click', () => {
      hbdCurtain.classList.add('hidden');
      startAudio();
    });
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAudio);
  }

  // 1. Navigation Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const drawer = document.getElementById('drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => {
      drawer.classList.add('active');
    });
  }

  if (closeDrawer && drawer) {
    closeDrawer.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) drawer.classList.remove('active');
    });
  });

  // 2. Lightbox Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 3. Progressive Scroll Animation (Fade & Slide in)
  // Injected via JS so layout remains completely visible if JS is disabled
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .act-section, .act-single-hero, .act-grid, .city-card {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .anim-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(animStyle);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.act-section, .act-single-hero, .act-grid, .city-card').forEach(el => {
    observer.observe(el);
  });

  // 4. Photo Assignment Engine
  // Map any slot ID to an image source URL or local path
  window.photoManifest = {
    // Example:
    // 'cover-hero': 'assets/images/cover.jpg',
    // 'eyes-childhood': 'assets/images/childhood.jpg',
  };

  window.assignPhoto = function(slotId, imageSrc, captionText = '') {
    const slot = document.querySelector(`[data-slot-id="${slotId}"]`);
    if (!slot) {
      console.warn(`[PhotoEngine] Slot not found: ${slotId}`);
      return;
    }

    slot.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = captionText || slotId;
    img.loading = 'lazy';

    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = imageSrc;
        if (modalCaption) modalCaption.textContent = captionText || '';
        modal.classList.add('active');
      }
    });

    slot.appendChild(img);
  };

  // Populate any pre-loaded photos in manifest
  if (window.photoManifest && typeof window.photoManifest === 'object') {
    Object.keys(window.photoManifest).forEach(slotId => {
      window.assignPhoto(slotId, window.photoManifest[slotId]);
    });
  }
});
