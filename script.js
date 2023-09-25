'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContends = document.querySelectorAll('.operations__content');
const dotsContainer = document.querySelector('.dots');
const images = document.querySelectorAll('.features__img');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(i => i.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div'); //Create element with that tag name
message.classList.add('cookie-message'); //Add that class with CSS property to created element
message.innerHTML =
  'We use cookies for improve functionality. <button class="btn btn--close-cookie">OK !</button>'; // --Change the content of the element

header.append(message); //Add or move selected element to bottom of parent element

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());

message.style.backgroundColor = '#37383d'; //------Add CSS style---
message.style.height = '65px'; //----writing style in HTML directly and disapears infront of CSS style//inline styles

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//----------Log in to atm-bank
const logIn = document.createElement('div');
nav.prepend(logIn);
logIn.innerHTML =
  '<a href="ATM-Bank/bankApp.html" style="text-decoration:none ; color:black" ><button class="btn">Log IN</button></a>';

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Activate tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content
  tabContends.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//      Effects on linked menu
const effectMenu = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linked = e.target;
    const siblings = linked.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== linked) el.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', effectMenu.bind(0.5));
nav.addEventListener('mouseout', effectMenu.bind(1));

//  Observing on elements

//   callback
const stickyNav = entres => {
  const entry = entres[0];

  if (!entry.isIntersecting) nav.classList.add('sticky'); //condition
  else nav.classList.remove('sticky');
}; //Observing on navbar
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height + 10}px`,
});
headerObserver.observe(header);
//Observing on sections
const sectionShow = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectOpt = { root: null, threshold: 0.2 };
const sectionsObserver = new IntersectionObserver(sectionShow, sectOpt);
allSections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy image

const lazyImages = function () {
  const imageSh = function (entries, observe) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observe.unobserve(entry.target);
  };
  const imgOpt = {
    root: null,
    threshold: 1,
    // rootMargin: '100px'
  };
  const imageObserver = new IntersectionObserver(imageSh, imgOpt);
  images.forEach(im => imageObserver.observe(im));
};
lazyImages();

//Sliders
const slidersFunction = function () {
  let curSlide = 0;

  const maxSlide = slides.length;
  //function to transform slides
  const slidesTransform = function (slide = 0) {
    slides.forEach((el, i) => {
      el.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const createDots = () => {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activeDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Buttons for slide/functions
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    slidesTransform(curSlide);
    activeDots(curSlide);
  };
  const init = function () {
    slidesTransform();
    createDots();
    activeDots(curSlide);
  };
  init();
  const prevSlide = () => {
    if (curSlide <= 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    slidesTransform(curSlide);
    activeDots(curSlide);
  };
  //Buttons
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide(curSlide);
    if (e.key === 'ArrowLeft') prevSlide(curSlide);
  });

  //Dots

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const dot = e.target.dataset.slide;
      slidesTransform(dot);
      activeDots(dot);
    }
  });
};
slidersFunction();

document.addEventListener('DOMContentLoaded', function (e) {
  console.log(e);
});
//Callback function
// const funObs = function (entry, ovserver) {
//   entry.forEach(e => console.log(e));
// };
// //options
// const obsOpt = {
//   root: null, //null is for intersect with viewport
//   threshold: [0, 0.2], //condition when intersect
// };
// //Method intersectionObserver           callback    options
// const observe = new IntersectionObserver(funObs, obsOpt);
// observe.observe(section1); //Where to observe

// const iniCoord = section1.getBoundingClientRect();
// console.log(iniCoord);

// window.addEventListener('scroll', function () {
//   console.log(iniCoord.top, window.scrollY);
//   if (window.scrollY > iniCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//--------------------------
/////////////////////////////////////////
/////////////////Lectures////////////////
/////////////////////////////////////////

//---------------Selecting---elements--------
/*
console.log(document.documentElement); //Select entire HTML document
console.log(document.body); //Select special element
console.log(document.head); //
console.log(document.querySelector('.btn')); //Return the first element with class name
console.log(document.querySelector('.header'));
console.log(document.querySelectorAll('.section')); //Return the nodelist
console.log(document.getElementsByTagName('button')); //Return the HTML colection
console.log(document.getElementsByClassName('btn')); //Return the HTML colection
*/
// const allButtons = document.getElementsByTagName('button');
// const allSections = document.querySelectorAll('.section');
// const header = document.querySelector('.header');
//---------------------Creating--and--inserting--elements------

// selectedElement.insertAdjacentHTML('afterbegin', html);-
//                                      position     element
/*const message = document.createElement('div'); //Create element with that tag name
message.classList.add('cookie-message'); //Add that class with CSS property to created element
// message.textContent = 'We use cookies for improve functionality.'; //Add or change text content on the element-
message.innerHTML =
  'We use cookies for improve functionality. <button class="btn btn--close-cookie">OK !</button>'; // --Change the content of the element
// header.prepend(message); //Add or move selected element to top of parrent element-
header.append(message); //Add or move selected element to bottom of parent element
// header.append(message.cloneNode(true)); //Add selected element to bottom of parent element/Clone all child element-

// header.before(message); //Add element before parent element-
// header.after(message); //Add element after parent element-

//-------------------------Delete--elments--------
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());

//------------------------Styles-----
message.style.backgroundColor = '#37383d'; //------Add CSS style---
message.style.height = '65px'; //----writing style in HTML directly and disapears infront of CSS style//inline styles
// message.style.width = '110%';
// document.body.style.overflow = 'hidden';
// console.log(getComputedStyle(message).color); //--Get style from CSS file---READ ONLY cannot be changed

// document.documentElement.style.setProperty('--color-primary', 'orangered'); //---Change property from CSS variables
//--------------------Attributes-----------
const logo = document.querySelector('.nav__logo'); //--Selecting element
// console.log(logo);
// console.log(logo.className); //get attribute value class===className----/work ONLY for standart atribute
//for non-standart logo.getAttribute('attribute_name')
// logo.src = 'img/img-1.jpg'; // Setting attribute value --in that case changing image
logo.setAttribute('company', 'Bankist'); //set atribute to element logo ---in that case attribute 'company' with value 'Bankist'

//--------------------------Data--Attributes--------
// console.log(logo.dataset.versionNumber); //getting data attribute from HTML with dataset//data-version-number===dataset.versionNumber//

//-------------------------Classes-----------
// logo.classList.add('clas1', 'class2'); //--------Add class to object
// logo.classList.remove('class1', 'class2'); //------Remove Class from object
// logo.classList.toggle('src'); //----------Add class from function//Remove when is olready there
// logo.classList.contains('class1'); //Return true or faulse

// logo.className = 'something';//Important !!! This rewrite classes with only that one class

//----------------------------------------------------------------------------------------------------------------------------------------//
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1Coord = section1.getBoundingClientRect(); //---get coordinates of section
  // window.scrollTo(s1Coord.left + pageXOffset, s1Coord.top + pageYOffset); //where window to scroll
  /*
  window.scrollTo({
    //----------scroll
    left: s1Coord.left + pageXOffset, //-----------left position
    top: s1Coord.top + pageYOffset, //------------top position
    behavior: 'smooth', //------------behavior
  });*/
// console.log(s1Coord);
// console.log('X/Y', window.pageXOffset, window.pageYOffset);
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// console.log(
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
// );
// const randomColor = () => `rgb(
//   ${randomInt(0, 255)},
//   ${randomInt(0, 255)},
//   ${randomInt(0, 255)}
// )`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log('lmfao');
//   this.style.backgroundColor = randomColor();
//   e.stopPropagation();
// });
// document.querySelector('.nav__item').addEventListener('click', function (e) {
//   // console.log('lmfao1');
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log('lmfao2');
//   this.style.backgroundColor = randomColor();
// });
/*
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstChild);
console.log(h1.firstElementChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'white';
console.log(h1.parentNode);
// console.log((h1.parentElement.style.backgroundColor = 'rgba(100,100,100,0.5'));
// h1.closest('.header').style.background = 'var(--gradient-primary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';
console.log(h1.previousElementSibling);
console.log((h1.nextElementSibling.style.color = 'orangered'));
console.log(h1.parentElement.children);*/
