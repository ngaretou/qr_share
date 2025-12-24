// No need to edit this file
let currentIndex = 0;
let startX = 0;
let endX = 0;
let isLink = false;

function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-cards img");
  if (index >= slides.length) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slides.length - 1;
  } else {
    currentIndex = index;
  }
  const offset = -currentIndex * 320; // 300 is the width of each image + 20 padding
  document.querySelector(".carousel-cards").style.transform =
    `translateX(${offset}px)`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
  // console.log("sliding");
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  isLink = event.target.tagName.toLowerCase() === "a";
}

function handleTouchMove(event) {
  endX = event.touches[0].clientX;
}

function handleTouchEnd() {
  if (!isLink) {
    if (startX - endX > 50) {
      nextSlide();
    } else if (endX - startX > 50) {
      prevSlide();
    }
  }
}

function handleMouseDown(event) {
  startX = event.clientX;
  isLink = event.target.tagName.toLowerCase() === "a";
}

function handleMouseMove(event) {
  endX = event.clientX;
}

function handleMouseUp() {
  if (!isLink) {
    if (startX - endX > 50) {
      nextSlide();
    } else if (endX - startX > 50) {
      prevSlide();
    }
  }
}

function preventImageDrag(event) {
  event.preventDefault();
}

let isDark = false;
let initialized = false;

// Initialize theme
const storedTheme = window.localStorage.getItem("active-theme");
if (storedTheme != null) {
  isDark = storedTheme === "theme-dark";
} else {
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
}
initialized = true;

// Apply initial state
const themeIcon = document.getElementById("theme-icon");
// Wait for DOM to be ready if script is loaded in head, but here it is at end of body so element should exist.
// However, standard practice is safe. script.js is at end of body in index.html.
if (themeIcon) {
  if (isDark) {
    document.documentElement.className = "theme-dark";
    themeIcon.innerText = "mode_night";
    themeIcon.classList.remove("light-icon");
    themeIcon.classList.add("dark-icon");
  } else {
    document.documentElement.className = "theme-light";
    themeIcon.innerText = "light_mode";
    themeIcon.classList.remove("dark-icon");
    themeIcon.classList.add("light-icon");
  }
}

function switchTheme() {
  // console.log("switching theme");
  isDark = !isDark;
  const themeClass = isDark ? "theme-dark" : "theme-light";
  document.documentElement.className = themeClass;
  window.localStorage.setItem("active-theme", themeClass);

  const icon = document.getElementById("theme-icon");
  if (icon) {
    if (isDark) {
      icon.innerText = "mode_night";
      icon.classList.remove("light-icon");
      icon.classList.add("dark-icon");
    } else {
      icon.innerText = "light_mode";
      icon.classList.remove("dark-icon");
      icon.classList.add("light-icon");
    }
  }
}

function renderCards() {
  const container = document.querySelector(".carousel-cards");
  container.innerHTML = cards
    .map(
      (card) => `
    <div class="card card-spacing">
      <div class="card-image">
        <figure class="image is-square qr-code">
          <img alt="${card.title}" src="${card.image}" />
        </figure>
      </div>
      <div class="card-content">
        <p><a href="${card.link}">${card.title}</a></p>
      </div>
      <footer class="card-footer">
        <button class="card-footer-item navbutton prev" onClick="prevSlide()">
          <span class="material-icons">navigate_before</span>
        </button>
        <a class="card-footer-item" href="${card.link}">
          <span class="material-icons">touch_app</span>
        </a>
        <button class="card-footer-item navbutton next" onClick="nextSlide()">
          <span class="material-icons">navigate_next</span>
        </button>
      </footer>
    </div>
  `
    )
    .join("");
}

// Initialize the carousel
if (typeof pageTitle !== "undefined") {
  document.title = pageTitle;
}
renderCards();
showSlide(currentIndex);

// Add touch event listeners
const carousel = document.querySelector(".carousel-cards");
carousel.addEventListener("touchstart", handleTouchStart);
carousel.addEventListener("touchmove", handleTouchMove);
carousel.addEventListener("touchend", handleTouchEnd);

// Add mouse event listeners
carousel.addEventListener("mousedown", handleMouseDown);
carousel.addEventListener("mousemove", handleMouseMove);
carousel.addEventListener("mouseup", handleMouseUp);

// Prevent image drag
const images = document.querySelectorAll(".carousel-cards img");
images.forEach((img) => img.addEventListener("dragstart", preventImageDrag));
