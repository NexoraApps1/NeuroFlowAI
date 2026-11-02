// reveal on scroll
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// dashboard tilt
const dashboard = document.querySelector(".dashboard");

if (dashboard) {
  dashboard.addEventListener("mousemove", (e) => {
    const rect = dashboard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 14;
    const rotateX = -(y / rect.height - 0.5) * 14;

    dashboard.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  dashboard.addEventListener("mouseleave", () => {
    dashboard.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
}

/*// dark/light mode
const toggle = document.createElement("button");
toggle.innerText = "🌙";
toggle.className = "theme-toggle";
document.body.appendChild(toggle);
*/

/*toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggle.innerText =
    document.body.classList.contains("light") ? "☀️" : "🌙";
});
*/

