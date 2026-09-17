const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function loopVideoWithPause(videoEl, pauseMs) {
  if (!videoEl) {
    return;
  }

  let restartTimer = null;

  videoEl.addEventListener("ended", () => {
    if (restartTimer) {
      clearTimeout(restartTimer);
    }

    restartTimer = setTimeout(() => {
      if (!videoEl.isConnected) {
        return;
      }

      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Ignore autoplay interruptions so delayed loops never break the page.
        });
      }
    }, pauseMs);
  });
}

const heroAnimation = document.getElementById("hero-animation");
loopVideoWithPause(heroAnimation, 15000);

const detailsTurnaround = document.getElementById("details-turnaround");
loopVideoWithPause(detailsTurnaround, 30000);

document.querySelectorAll("video[data-loop-pause]").forEach((videoEl) => {
  const pauseMs = Number(videoEl.dataset.loopPause || 0);
  if (pauseMs > 0) {
    loopVideoWithPause(videoEl, pauseMs);
  }
});

const homeSlideshow = document.querySelector(".home-slideshow");
if (homeSlideshow) {
  const slides = Array.from(homeSlideshow.querySelectorAll(".home-slide"));
  const previousButton = homeSlideshow.querySelector(".slideshow-arrow-left");
  const nextButton = homeSlideshow.querySelector(".slideshow-arrow-right");
  const statusNumber = homeSlideshow.querySelector(".slideshow-status span");
  let currentSlide = 0;
  let slideshowTimer = null;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    statusNumber.textContent = String(currentSlide + 1);
  }

  function stopSlideshow() {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  function startSlideshow() {
    stopSlideshow();
    slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startSlideshow();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startSlideshow();
  });

  homeSlideshow.addEventListener("mouseenter", stopSlideshow);
  homeSlideshow.addEventListener("mouseleave", startSlideshow);
  homeSlideshow.addEventListener("focusin", stopSlideshow);
  homeSlideshow.addEventListener("focusout", startSlideshow);
  homeSlideshow.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showSlide(currentSlide - 1);
    } else if (event.key === "ArrowRight") {
      showSlide(currentSlide + 1);
    }
  });

  showSlide(0);
  startSlideshow();
}

document.querySelectorAll(".character-mview-box[data-mview]").forEach((viewerContainer) => {
  if (typeof marmoset === "undefined") {
    return;
  }

  const characterViewer = new marmoset.WebViewer(800, 500, viewerContainer.dataset.mview);
  characterViewer.domRoot.style.setProperty("width", "100%", "important");
  characterViewer.domRoot.style.setProperty("height", "100%", "important");
  characterViewer.domRoot.style.setProperty("max-width", "100%", "important");
  characterViewer.domRoot.style.setProperty("position", "relative", "important");
  viewerContainer.replaceChildren(characterViewer.domRoot);
  characterViewer.loadScene();
});
