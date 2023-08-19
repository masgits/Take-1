"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
//Scrolling, when u click 'Learn more'
const btnScroll = document.querySelector(".btn--scroll");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");
//Tabbed component - The 3 foods part
const tabs = document.querySelectorAll(".foods_tab");
const tabsContainer = document.querySelector(".foods_tab-container");
const tabsContent = document.querySelectorAll(".foods_content");

//MODAL WINDOW
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

/*Subscribe*/
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/*Learn More arrow*/
btnScroll.addEventListener("click", function (e) {
  e.preventDefault();

  console.log(`You clicked the ${btnScroll} button.`);
  const sec1 = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: "smooth" });
});

/*PAGE NAVIGATION*/
//Ukiclick the options on top, yakupeleka mahali ziko.
document.querySelector(".nav_links").addEventListener("click", function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains("nav_link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".foods_tab");
  console.log(clicked);

  //Guard Clause
  if (!clicked) return;

  //Removing active classes
  tabs.forEach((t) => t.classList.remove("foods_tab--active"));
  tabsContent.forEach((c) => c.classList.remove("foods_content--active"));

  //Activate tab
  clicked.classList.add("foods_tab--active");

  //Activate the content area
  document
    .querySelector(`.foods_content--${clicked.dataset.tab}`)
    .classList.add("foods_content--active");
});

//FADING OF THE MENU AT THE TOP
const handleHover = function (e) {
  if (e.target.classList.contains("nav_link")) {
    const link = e.target;

    //closest(".nav") means the closest ancestor with the nav class
    const siblings = link.closest(".nav").querySelectorAll(".nav_link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//PASSING ARGS INTO HANDLER
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Lifecycle DOM Events
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM tree built!", e);
});

window.addEventListener("load", function (e) {
  console.log("Page fully loaded", e);
});

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
  console.log("Window unloading...", e);
});

//Bar to be sticky immediately ukifika CULTURES section
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});
headerObserver.observe(header);

//Revealing sections on scroll
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy loading of images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider_btn--left");
  const btnRight = document.querySelector(".slider_btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots_dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots_dot")
      .forEach((dot) => dot.classList.remove("dots_dot--active"));

    document
      .querySelector(`.dots_dot[data-slide="${slide}"]`)
      .classList.add("dots_dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0); //Upon reload, the 1st content on the 1st dot should be displayed
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots_dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

document.getElementById("section--1");
const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));

const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message); //.append moved the element from being the 1st child to being the last.

//Deleting elements such as removing the cookie message when u click 'Got it;
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    //message.parentElement.removeChild(message); //Old way of removing an element
    message.remove(); //New way of removing an element
  });

/*STYLES, ATTRIBUTES and CLASSES*/

//Styles
message.style.backgroundColor = "#ffffff"; //The cookie message
message.style.width = "104%";

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

document.documentElement.style.setProperty("--color-primary", "teal");

// Attributes
const logo = document.querySelector(".nav_logo");

logo.alt = "MAS logo";

// Non-standard
// console.log(logo.designer);
logo.setAttribute("home", "MAS");

const link = document.querySelector(".nav_link--btn");

// Classes
logo.classList.add("c", "j");
logo.classList.remove("c", "j");
logo.classList.toggle("c");
logo.classList.contains("c"); // not includes

//Event propagation: bubbling and capturing
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector(".nav_link").addEventListener("click", function (e) {});

//Note that nav__links is the parent of nav__link
document.querySelector(".nav_links").addEventListener("click", function (e) {});

document.querySelector(".nav").addEventListener("click", function (e) {});

const h1 = document.querySelector("h1");

//Going downwards; children
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children); //Only works for direct children
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "white";

//Going upwards; parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//Going sideways; siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});

//NOTES
//bind creates a bound function that has the same body as the original function
// filter - Returns all elements of an array that meet the condition specified in a callback function.
//find method is used to retrieve one element of an array based on a condition. In case there are many values that satisfy the condition, the 1st value is chosen.
//FILTER retrieves all values while FIND retrieves one value. FILTER also returns the values in form of an array while FIND returns a single value not as an array or anything.
//Sorting sorts strings effectively while numbers, it works in some scenes and doesn't in some
//push adds sth to the end of an array
//unshift adds sth at the beginning of an array
//shift removes the 1st element in an array
//pop removes the last element in "  "
//splice removes elements in "  "
//slice returns a copy of an element in an array
//concat combines 2 or more arrays
// reverse reverses elements in "  "
//map calls a function and returns an array containing the result
//flat combines subarrays into 1 array
//flatMap Calls a defined callback function on each element of an array then flattens the result into a new array
//indexof returns the index of a certain element in an array
//findIndex returns the index "  "  "  " based on a condition
//includes returns boolean on whether an element is in the array or not
//some returns boolean on whether some element satisfy a condition
//every "  "  "  "  all ...
//join combines all elements into a single string
// const mohd = [20, 3, 14];
// console.log(mohd.join('/')); //20/3/14

//reduce returns 1 value (can be any type) in place of all elements in the array. Mainly brings back the total
//forEach loops over the array and doesn't create any new array
