// 在首帧前标记脚本可用，CSS 会据此渐进增强入场动画。
document.documentElement.classList.add("js");

const currentYear = document.querySelector("#year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const revealTargets = document.querySelectorAll(".reveal");

// 不支持观察器时直接展示全部内容，确保旧浏览器仍可正常阅读。
if (!("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealTargets.forEach((target) => observer.observe(target));
}
