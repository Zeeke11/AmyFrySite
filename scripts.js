/**
 * Skin Reversal Skincare Clinic - Global JavaScript
 * Controls premium micro-interactions, responsive menus, scroll animations, and carousel components.
 */

/**
 * =========================================================================
 * WEB3FORMS API KEY CONFIGURATION
 * Paste your Web3Forms Access Key below (from https://web3forms.com):
 * =========================================================================
 */
export const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initTestimonialSlider();
  initActiveLinkHighlighting();
  initBookingFormValidation();
});

/**
 * Responsive Mobile Menu Controller
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    
    // Toggle state
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    
    // Toggle SVG icons
    if (menuIconOpen && menuIconClose) {
      menuIconOpen.classList.toggle('hidden');
      menuIconClose.classList.toggle('hidden');
    }
  });

  // Close mobile menu on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      }
    }
  });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px 50px 0px', // trigger smoothly as entering view
      threshold: 0.02 // 2% element visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, we don't need to observe it again
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers: show elements immediately
    revealElements.forEach((element) => {
      element.classList.add('revealed');
    });
  }
}

/**
 * Testimonial Slider / Carousel
 */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Wrap index around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('w-8', 'bg-brand-charcoal');
        dot.classList.remove('w-2.5', 'bg-brand-gold/40');
      } else {
        dot.classList.remove('w-8', 'bg-brand-charcoal');
        dot.classList.add('w-2.5', 'bg-brand-gold/40');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetInterval();
    });
  });

  // Auto rotation every 7 seconds
  function startInterval() {
    slideInterval = setInterval(nextSlide, 7000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Initialize
  showSlide(0);
  startInterval();
}

/**
 * Dynamic Navbar Link Highlighter
 */
function initActiveLinkHighlighting() {
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    
    // Match current page to the navbar link
    if (
      (filename === '' && (linkHref === 'index.html' || linkHref === './')) ||
      filename === linkHref ||
      (filename.includes('index') && linkHref === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Appointment Booking Form Validation & Interactive Feedback
 */
function initBookingFormValidation() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const treatmentSelect = document.getElementById('treatment');
  const durationText = document.getElementById('treatment-duration-tip');

  // Provide interactive treatment advice when selected
  if (treatmentSelect && durationText) {
    treatmentSelect.addEventListener('change', (e) => {
      const value = e.target.value;
      let durationStr = "";
      switch (value) {
        // Consultations
        case "free-consultation":
          durationStr = "✦ Free Skin Diagnostic Consultation (15-30 min): Complimentary skin-barrier assessment and bespoke treatment plan with our licensed estheticians.";
          break;

        // Facials Menu
        case "customized-facial":
          durationStr = "✦ Customized Facial ($80 / 60 min): Tailored specifically to what your skin needs with double-cleansing, extractions, custom masque, and barrier hydration.";
          break;
        case "express-facial":
          durationStr = "✦ Express Facial ($65 / 30 min): Focused radiance refresh delivering intense cleansing, exfoliation, and hydration in 30 minutes.";
          break;
        case "dermaplane":
          durationStr = "✦ Dermaplane ($90 / 50 min): Surgical-grade blade exfoliation eliminating dead cells and vellus hair for glass-like smoothness.";
          break;
        case "dermaplane-express":
          durationStr = "✦ Dermaplane Express ($65 / 30 min): Focused manual blade exfoliation for immediate radiance and silky texture.";
          break;
        case "dermaplane-addon":
          durationStr = "✦ Add-on Dermaplane ($50): Add surgical-grade dermaplaning exfoliation to any facial or clinical service.";
          break;
        case "oxygen-rx":
          durationStr = "✦ Oxygen RX Facial ($125 / 60 min): Controlled pure oxygen generation to calm rosacea, neutralize bacteria, and stimulate circulation.";
          break;
        case "oxygen-acne-detox":
          durationStr = "✦ Oxygen Acne Detox ($110 / 60 min): Antibacterial oxygen treatment combined with clinical extractions for breakout-prone skin.";
          break;
        case "carboxy-mask":
          durationStr = "✦ Carboxy Mask Facial ($155 / 1.5 hrs): Intensive Bohr-effect CO2 microcirculation therapy stimulating deep cellular healing and firming.";
          break;
        case "four-layer-glow":
          durationStr = "✦ 4-Layer Glow Facial ($125 / 60 min): Synergistic layering of glycolic acid, vitamin C, enzymes, and mineral moisture for luminous glow.";
          break;
        case "coco-chocolate":
          durationStr = "✦ COCO - Chocolate Facial ($125 / 60 min): Rich antioxidant cocoa therapy that calms inflammation and deeply replenishes skin lipids.";
          break;
        case "plume-facial":
          durationStr = "✦ Plume Facial ($65 / 45 min): Gentle botanical renewal formulated specifically to soothe delicate, sensitive, and compromised skin barriers.";
          break;
        case "mask-madness":
          durationStr = "✦ Mask Madness Facial ($125 / 60 min): Multi-zone therapeutic masking balancing distinct facial areas simultaneously.";
          break;
        case "princess-facial":
          durationStr = "✦ Princess Facial ($45 / 30 min): Gentle, youthful introductory facial with mild enzymes, soothing masque, and self-care basics.";
          break;

        // Lashes & Brows
        case "lash-lift":
          durationStr = "✦ Lash Lift (45 min): Semi-permanent curl boosting your natural lashes. Lasts up to 6 weeks.";
          break;
        case "lash-tint":
          durationStr = "✦ Lash Tint (20 min): Defines lashes using biocompatible botanical dark tint.";
          break;
        case "brow-shaping":
          durationStr = "✦ Brow Shaping (30 min): Custom mapping and waxing tailored to frame your face structure.";
          break;
        case "brow-lamination":
          durationStr = "✦ Brow Lamination (45 min): Aligning brow hairs for a fuller, fluffy, brushed-up volume.";
          break;
        case "brow-mapping":
          durationStr = "✦ Brow Mapping, Wax & Tint (60 min): Complete mapping, styling, waxing, and custom color tinting.";
          break;
        
        // Body & Detox
        case "back-facial":
          durationStr = "✦ Back Facial ($65 / 60 min): Deep purification, extractions, and calming masque for the back.";
          break;
        case "body-plume":
          durationStr = "✦ Body Treatment (Plume) ($105 / 75 min): Skin-balancing, firming full-body treatment using active botanicals.";
          break;
        case "lymphatic":
          durationStr = "✦ Lymphatic Treatment ($115+ / 60 min+): Soft, manual drainage to decrease puffiness and promote tissue healing.";
          break;
        case "salt-cabin":
          durationStr = "✦ Salt Cabin Session ($30 / 45 min): Relax in aerosolized salt microclimate to cleanse lungs and soothe skin.";
          break;
        case "infrared-sauna":
          durationStr = "✦ Infrared Sauna Session ($30 / 45 min): Deep infrared heat to sweep toxins and soothe muscle tension.";
          break;
        case "ionic-detox":
          durationStr = "✦ Ionic Foot Detox ($35 / 30 min): Energizing foot bath pulling cellular impurities.";
          break;
        
        case "hydro-base":
          durationStr = "✦ Hydrafacial Hydrodermabrasion ($165 / 45 min): Foundational vortex liquid exfoliation, pore clearing, and deep-dermal infusion of biocompatible antioxidants.";
          break;
        case "hydro-signature":
          durationStr = "✦ Signature Hydro Facial ($189 / 60 min): Multi-step vortex deep cleansing, extractions, and intense peptide hydration.";
          break;
        case "hydro-deluxe":
          durationStr = "✦ Deluxe Hydro Facial ($249 / 75 min): Signature logic + targeted medical-grade booster serum + red light LED.";
          break;
        case "hydro-premium":
          durationStr = "✦ Premium Hydro Facial ($299 / 90 min): Premium logic + deluxe boosters + red light LED + face lymphatic drainage.";
          break;
        case "microderm":
          durationStr = "✦ Wet Tip Microdermabrasion ($175 / 60 min): Resurfacing diamond-tipped wand combined with liquid serum infusion.";
          break;
        case "collagen-induction":
          durationStr = "✦ Collagen Induction CIT ($350+ / 75-90 min): Precision micro-channeling activating natural collagen & elastin remodeling to refine lines and tighten skin.";
          break;
        case "keravive":
          durationStr = "✦ Keravive Scalp Treatment ($300+ / 60 min): Cleanses, exfoliates, and nourishes follicles for thicker, healthier hair.";
          break;
        case "peel-pumpkin":
          durationStr = "✦ Pumpkin Peel (Consultation): Enzymatic antioxidant treatment that gently exfoliates, improves cellular turnover, and leaves a warm radiance.";
          break;
        case "peel-berry":
          durationStr = "✦ Berry Peel (Consultation): Powerful fruit-acid peel targeting hyperpigmentation, uneven skin tone, and dullness for luminous clarity.";
          break;
        case "peel-jessner":
          durationStr = "✦ Jessner Peel (Consultation): Multi-acid clinical resurfacing peel addressing acne, congestion, fine lines, and sun damage.";
          break;
        case "peel-skin-reversal":
          durationStr = "✦ Skin Reversal Peel (Consultation): Signature intensive rejuvenating peel formulated to accelerate cellular turnover and restore tissue vitality.";
          break;
        case "peptides-iv-consult":
          durationStr = "✦ Peptides & IV Drips Consultation (15-30 min): Discuss custom peptide therapy and IV drip wellness infusions tailored to your cellular health.";
          break;
        case "peels-consult":
          durationStr = "✦ Clinical Peels Consultation (15-30 min): Thorough skin barrier assessment to determine the ideal peel formulation (Pumpkin, Berry, Jessner, or Skin Reversal).";
          break;
        case "postiche-consult":
          durationStr = "✦ Postiche Beauty Consultation (60 min): Private wig/topper fitting and custom scalp health assessment.";
          break;
        default:
          durationStr = "";
      }
      
      durationText.textContent = durationStr;
      if (durationStr) {
        durationText.classList.remove('hidden');
        durationText.classList.add('animate-pulse');
        setTimeout(() => durationText.classList.remove('animate-pulse'), 1000);
      } else {
        durationText.classList.add('hidden');
      }
    });
  }

  // Client-side validation and Web3Forms AJAX submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('border-red-400');
        
        // Dynamic event to remove red border once user types
        input.addEventListener('input', function handleInput() {
          if (this.value.trim()) {
            this.classList.remove('border-red-400');
            this.removeEventListener('input', handleInput);
          }
        });
      }
    });

    if (!isValid) {
      alert('Please fill out all required fields to request your luxury skincare consultation.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Request Reservation';
    const resultBox = document.getElementById('form-result');

    // Sync access key if configured
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    if (accessKeyInput && (accessKeyInput.value === "YOUR_WEB3FORMS_ACCESS_KEY_HERE" || !accessKeyInput.value) && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
      accessKeyInput.value = WEB3FORMS_ACCESS_KEY;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center justify-center space-x-2">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending Request...</span>
        </span>
      `;
    }

    if (resultBox) {
      resultBox.classList.add('hidden');
      resultBox.innerHTML = '';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (resultBox) {
          resultBox.innerHTML = `
            <div class="bg-brand-sage-light text-brand-charcoal border border-brand-sage/40 p-5 rounded-none space-y-1">
              <p class="font-serif font-medium text-base">✦ Request Sent Successfully</p>
              <p class="text-xs text-brand-slate leading-relaxed">Thank you! Your consultation inquiry has been submitted to Skin Reversal. Our receptionist will contact you shortly to confirm your booking.</p>
            </div>
          `;
          resultBox.classList.remove('hidden');
        } else {
          alert('✦ Request Sent Successfully! Thank you for reaching out to Skin Reversal.');
        }
        form.reset();
        if (durationText) durationText.classList.add('hidden');
      } else {
        if (resultBox) {
          resultBox.innerHTML = `
            <div class="bg-red-50 text-red-800 border border-red-200 p-4 rounded-none">
              <p class="text-xs font-medium">${data.message || 'There was an issue sending your request. Please phone us directly at (217) 994-1048.'}</p>
            </div>
          `;
          resultBox.classList.remove('hidden');
        } else {
          alert(data.message || 'Failed to submit form. Please call (217) 994-1048.');
        }
      }
    } catch (error) {
      if (resultBox) {
        resultBox.innerHTML = `
          <div class="bg-red-50 text-red-800 border border-red-200 p-4 rounded-none">
            <p class="text-xs font-medium">Network error. Please call our receptionist directly at (217) 994-1048.</p>
          </div>
        `;
        resultBox.classList.remove('hidden');
      } else {
        alert('Network error. Please call our receptionist directly at (217) 994-1048.');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}
