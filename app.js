document.addEventListener('DOMContentLoaded', () => {
  // --- Slides Navigation State & Elements ---
  const slides = Array.from(document.querySelectorAll('.slide'));
  const navItems = Array.from(document.querySelectorAll('.sidebar-nav .nav-item'));
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const slideCounter = document.getElementById('slide-counter');
  const slideTitleDisplay = document.getElementById('slide-title-display');
  const progressBar = document.getElementById('progress-bar');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const themeToggle = document.getElementById('theme-toggle');

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Set initial progress bar width
  updateProgressBar();

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    // Remove active class from current slide and nav
    slides[currentSlide].classList.remove('active');
    navItems[currentSlide].classList.remove('active');

    // Update index
    currentSlide = index;

    // Add active class to new slide and nav
    slides[currentSlide].classList.add('active');
    navItems[currentSlide].classList.add('active');

    // Scroll active sidebar navigation item into view
    navItems[currentSlide].scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // Update control states
    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1;
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    // Update Slide Title text in top nav bar
    const activeNavText = navItems[currentSlide].textContent.replace(/^\d+\s+/, '').trim();
    slideTitleDisplay.textContent = activeNavText;

    updateProgressBar();
  }

  function updateProgressBar() {
    const percentage = (currentSlide / (totalSlides - 1)) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  // Prev / Next button click listeners
  btnPrev.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });

  btnNext.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });

  // Sidebar item click navigation
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      // Prevent spacebar from scrolling page
      if (e.key === ' ') e.preventDefault();
      
      if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    }
  });

  // Mobile Swipe Gesture support
  let touchStartX = 0;
  let touchEndX = 0;
  const slidesContainer = document.getElementById('slides-container');

  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50; // swipe threshold in pixels
    if (touchEndX < touchStartX - threshold) {
      // Swipe left -> Next slide
      if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
    } else if (touchEndX > touchStartX + threshold) {
      // Swipe right -> Prev slide
      if (currentSlide > 0) showSlide(currentSlide - 1);
    }
  }

  // Sidebar Toggle
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Theme Toggle (Dark / Light)
  const savedTheme = localStorage.getItem('melore-theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('melore-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      // Show sun icon outline for switching back to light mode
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      // Show moon icon for dark mode
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  // --- Slide 3 Tab Control ---
  window.switchTab = function(event, tabId) {
    // Hide all contents under this context
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active state from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected content and set button as active
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
  };

  // --- Slide 4 Copy Color Hex Code to Clipboard ---
  window.copyHex = function(hex, cardElement) {
    navigator.clipboard.writeText(hex).then(() => {
      const originalText = cardElement.querySelector('.swatch-hex').textContent;
      const hexSpan = cardElement.querySelector('.swatch-hex');
      
      // Visual Feedback
      hexSpan.textContent = 'COPIED!';
      hexSpan.style.color = 'var(--brand-gold)';
      hexSpan.style.fontWeight = 'bold';
      
      setTimeout(() => {
        hexSpan.textContent = originalText;
        hexSpan.style.color = '';
        hexSpan.style.fontWeight = '';
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // --- Slide 10 Product Filter Timeline ---
  window.filterProducts = function(phase) {
    const p1Items = document.querySelectorAll('.p1-prod');
    const p2Items = document.querySelectorAll('.p2-prod');
    const p3Items = document.querySelectorAll('.p3-prod');

    // Hide all first
    p1Items.forEach(item => item.style.display = 'none');
    p2Items.forEach(item => item.style.display = 'none');
    p3Items.forEach(item => item.style.display = 'none');

    // Show correct phase
    if (phase === 'p1') {
      p1Items.forEach(item => item.style.display = 'flex');
    } else if (phase === 'p2') {
      p2Items.forEach(item => item.style.display = 'flex');
    } else if (phase === 'p3') {
      p3Items.forEach(item => item.style.display = 'flex');
    }

    // Toggle button style
    const filterButtons = event.currentTarget.parentElement.querySelectorAll('button');
    filterButtons.forEach(btn => btn.classList.remove('btn-primary'));
    event.currentTarget.classList.add('btn-primary');
  };

  // --- Slide 16 GTM Checklist Management ---
  window.toggleChecklistItem = function(element) {
    element.classList.toggle('checked');
    updateChecklistProgress();
  };

  function updateChecklistProgress() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    const checkedItems = document.querySelectorAll('.checklist-item.checked');
    const totalCount = checklistItems.length;
    const checkedCount = checkedItems.length;

    const percentage = Math.round((checkedCount / totalCount) * 100);
    document.getElementById('checklist-pct').textContent = `${percentage}%`;
    document.getElementById('checklist-progress-bar-fill').style.width = `${percentage}%`;
  }

  // Run checklist sync once on load
  updateChecklistProgress();

  // --- Slide 17 Interactive Budget Calculator ---
  const slideQty = document.getElementById('slide-qty');
  const slidePrice = document.getElementById('slide-price');
  const slideMarketing = document.getElementById('slide-marketing');
  const slideOverhead = document.getElementById('slide-overhead');

  const valQty = document.getElementById('val-qty');
  const valPrice = document.getElementById('val-price');
  const valMarketing = document.getElementById('val-marketing');
  const valOverhead = document.getElementById('val-overhead');

  const outInvestment = document.getElementById('out-investment');
  const outRevenue = document.getElementById('out-revenue');
  const outBreakeven = document.getElementById('out-breakeven');

  function calculateFinance() {
    const qty = parseInt(slideQty.value);
    const price = parseInt(slidePrice.value);
    const marketing = parseInt(slideMarketing.value);
    const overhead = parseInt(slideOverhead.value);

    // Update Slider text labels
    valQty.textContent = `${qty} units`;
    valPrice.textContent = `$${price}.00`;
    valMarketing.textContent = `$${marketing}`;
    valOverhead.textContent = `$${overhead}`;

    // Financial formulas
    // Let's assume manufacturing & raw material packaging cost is $4.00 per unit (typical skin formulation base)
    const unitCost = 4.00; 
    const productionCost = qty * unitCost;
    
    const totalInvestment = productionCost + marketing + overhead;
    const projectedRevenue = qty * price;
    
    // Break-even formula: Total Investment / Retail Unit Price
    const breakevenUnits = Math.ceil(totalInvestment / price);

    // Update values in HTML with commas
    outInvestment.textContent = `$${totalInvestment.toLocaleString()}`;
    outRevenue.textContent = `$${projectedRevenue.toLocaleString()}`;
    
    if (breakevenUnits > qty) {
      outBreakeven.textContent = `Break-even Point: ${breakevenUnits} units sold (exceeds current production)`;
      outBreakeven.style.color = 'var(--brand-dusty-rose)';
    } else {
      outBreakeven.textContent = `Break-even Point: ${breakevenUnits} units sold (starts making profit)`;
      outBreakeven.style.color = '';
    }
  }

  // Add listeners to sliders
  [slideQty, slidePrice, slideMarketing, slideOverhead].forEach(slider => {
    slider.addEventListener('input', calculateFinance);
  });

  // Run calculation once on load
  calculateFinance();
});
