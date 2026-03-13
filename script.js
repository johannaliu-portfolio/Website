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
