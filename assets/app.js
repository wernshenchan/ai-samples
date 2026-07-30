document.addEventListener("DOMContentLoaded", () => {
  const progress = document.querySelector("#reading-progress");
  const chapters = [...document.querySelectorAll(".chapter[id]")];
  const links = [...document.querySelectorAll(".chapter-nav a[href^='#chapter-']")];
  const mobileChapter = document.querySelector("#mobile-chapter");

  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  const activateChapter = (chapter) => {
    const target = `#${chapter.id}`;
    links.forEach((link) => {
      if (link.getAttribute("href") === target) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (mobileChapter) {
      const number = chapter.id.replace("chapter-", "");
      mobileChapter.textContent = `${number} · ${chapter.dataset.shortTitle || "Proposal"}`;
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) activateChapter(visible[0].target);
    }, { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.15, 0.35] });
    chapters.forEach((chapter) => observer.observe(chapter));
  } else if (chapters[0]) {
    activateChapter(chapters[0]);
  }

  document.querySelectorAll("#print-proposal, [data-print-control]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
});
