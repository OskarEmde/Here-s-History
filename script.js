/* =========================================================
   01. MOBILE MENU
========================================================= */

// Find mobile menu button
const menuButton = document.querySelector(".menu-toggle");

// Find navigation
const nav = document.querySelector(".main-nav");


// Open / close mobile menu
menuButton?.addEventListener("click", () => {

  const isOpen =
      nav.classList.toggle("open");

  menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
  );

});



/* =========================================================
   02. CLOSE MOBILE MENU WHEN LINK IS CLICKED
========================================================= */

document
    .querySelectorAll(".main-nav a")
    .forEach((link) => {

      link.addEventListener("click", () => {

        // Close navigation
        nav.classList.remove("open");

        // Update accessibility attribute
        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

      });

    });



/* =========================================================
   03. DANNEBROG PRODUCT INTERACTION
========================================================= */

// Interactive image container
const dannebrogDemo =
    document.querySelector(".dannebrog-demo");


// Open / close button
const foldToggle =
    document.querySelector(".fold-toggle");



/*
  Toggles between:

  closed = current image

  open = historical image
*/

function toggleDannebrog() {

  if (!dannebrogDemo) {
    return;
  }


  // Check current state
  const isOpen =
      dannebrogDemo.dataset.state === "open";


  // Change state
  dannebrogDemo.dataset.state =
      isOpen
          ? "closed"
          : "open";


  // Update accessibility
  foldToggle?.setAttribute(
      "aria-pressed",
      String(!isOpen)
  );

}



/* =========================================================
   04. DANNEBROG BUTTON CLICK
========================================================= */

foldToggle?.addEventListener(
    "click",
    (event) => {

      /*
        Prevents the click from
        triggering the image click too.
      */

      event.stopPropagation();

      toggleDannebrog();

    }
);



/* =========================================================
   05. DANNEBROG IMAGE CLICK
========================================================= */

dannebrogDemo?.addEventListener(
    "click",
    toggleDannebrog
);



/* =========================================================
   06. SCROLL REVEAL ANIMATIONS
========================================================= */

/*
  IntersectionObserver detects when
  elements enter the user's screen.
*/

const observer =
    new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              // Show element
              entry.target.classList.add(
                  "is-visible"
              );


              /*
                Stop observing once
                animation has played.
              */

              observer.unobserve(
                  entry.target
              );

            }

          });

        },

        {
          threshold: 0.12
        }

    );



/*
  Add observer to every element
  with the class "reveal".
*/

document
    .querySelectorAll(".reveal")
    .forEach((element) => {

      observer.observe(element);

    });



/* =========================================================
   07. ACTIVE NAVIGATION WHILE SCROLLING
========================================================= */

// Find all sections that have an ID
const sections = [
  ...document.querySelectorAll(
      "main section[id], #top"
  )
];


// Find all navigation links
const navLinks = [
  ...document.querySelectorAll(
      ".main-nav a"
  )
];



window.addEventListener(
    "scroll",
    () => {


      /*
        Add an offset so the active
        section changes slightly before
        reaching the very top.
      */

      const scrollPosition =
          window.scrollY + 140;


      // Default active section
      let currentSection =
          "#top";



      /*
        Find which section
        the user currently views.
      */

      sections.forEach((section) => {

        if (
            section.offsetTop <=
            scrollPosition
        ) {

          currentSection =
              `#${section.id}`;

        }

      });



      /*
        Add active class to the
        matching navigation link.
      */

      navLinks.forEach((link) => {

        const linkTarget =
            link.getAttribute("href");


        link.classList.toggle(
            "active",
            linkTarget === currentSection
        );

      });

    }
);