/**
 * SANJALU // EDITORIAL RETROSPECTIVE (BOOK PAGE-FLIP ENGINE)
 * Interactive 3D Page Turn, Swipe Gesture Detection & Audio System
 */

document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.book-page');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageCounter = document.getElementById('pageCounter');
  const hbdCurtain = document.getElementById('hbdCurtain');
  const enterBtn = document.getElementById('enterBtn');
  const loaderBar = document.getElementById('loaderBar');
  const bgAudio = document.getElementById('bgAudio');
  const audioToggle = document.getElementById('audioToggle');
  const audioLabel = document.getElementById('audioLabel');
  const bookStage = document.getElementById('bookStage');

  let currentPage = 0;
  const totalPages = pages.length;
  let isAudioPlaying = false;

  // 1. Loader Animation
  if (loaderBar) {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 25) + 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
      }
      loaderBar.style.width = `${p}%`;
    }, 120);
  }

  // 2. Audio Control
  function startAudio() {
    if (bgAudio) {
      bgAudio.volume = 0.45;
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        if (audioLabel) audioLabel.textContent = "Music: On";
      }).catch(err => {
        console.log("Audio autoplay prevented:", err);
      });
    }
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isAudioPlaying) {
      bgAudio.pause();
      isAudioPlaying = false;
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

  // 3. Page Flip System
  function updatePages() {
    pages.forEach((page, index) => {
      page.classList.remove('active', 'flipped');
      if (index === currentPage) {
        page.classList.add('active');
      } else if (index < currentPage) {
        page.classList.add('flipped');
      }
    });

    if (prevBtn) prevBtn.style.visibility = currentPage === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = currentPage === totalPages - 1 ? 'hidden' : 'visible';
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updatePages();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updatePages();
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  if (prevBtn) prevBtn.addEventListener('click', prevPage);

  // Keyboard navigation (Left / Right Arrow)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextPage();
    } else if (e.key === 'ArrowLeft') {
      prevPage();
    }
  });

  // Touch Swipe Gesture for Mobile Page Turning
  let touchStartX = 0;
  let touchEndX = 0;

  if (bookStage) {
    bookStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookStage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 45;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe Left -> Next Page
      nextPage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe Right -> Prev Page
      prevPage();
    }
  }

  updatePages();

  // 4. Modal Lightbox
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 5. Photo Assignment Engine
  window.photoManifest = {
    'cover-hero': 'assets/images/cover-hero.jpg',
    'eyes-childhood': 'assets/images/eyes-childhood.jpg',
    'eyes-recent': 'assets/images/eyes-recent.jpg',
    'leap-hero': 'assets/images/leap-hero.jpg',
    'leap-helmet': 'assets/images/leap-helmet.jpg',
    'leap-bike': 'assets/images/leap-bike.jpg',
    'leap-car': 'assets/images/leap-car.jpg'
  };

  window.assignPhoto = function(slotId, imageSrc, captionText = '') {
    const slot = document.querySelector(`[data-slot-id="${slotId}"]`);
    if (!slot) return;

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

  // Populate photos from manifest on load
  if (window.photoManifest) {
    Object.keys(window.photoManifest).forEach(slotId => {
      window.assignPhoto(slotId, window.photoManifest[slotId]);
    });
  }
});
