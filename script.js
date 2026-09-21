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




/* =========================================================
   08. FACT OF THE DAY
========================================================= */

const factTitle =
    document.querySelector("#factTitle");

const factText =
    document.querySelector("#factText");

const newFactButton =
    document.querySelector("#newFactButton");

const factContent =
    document.querySelector(".fact-content");


const historyFacts = [

    {
        title:
            "Vikinger brugte ikke horn på deres hjelme",

        text:
            "Der findes ingen arkæologiske beviser for, at vikinger gik i kamp med horn på hjelmene. Forestillingen blev især populær gennem kunst og kostumer i 1800-tallet."
    },

    {
        title:
            "Cleopatra levede tættere på månelandingen end pyramidernes opførelse",

        text:
            "Den store pyramide i Giza blev bygget omkring 2500 f.Kr., mens Cleopatra levede omkring 30 f.Kr. Det betyder, at hendes levetid faktisk ligger tættere på Apollo 11 i 1969."
    },

    {
        title:
            "Verdens ældste kendte fredsaftale er over 3.000 år gammel",

        text:
            "Egypten og hittitterriget indgik en fredsaftale efter slaget ved Kadesh. Kopier af aftalen findes både i egyptiske og hittittiske kilder."
    },

    {
        title:
            "Oxford University er ældre end Aztekerriget",

        text:
            "Undervisning fandt sted i Oxford allerede omkring år 1096, mens Aztekerriget først blev grundlagt flere hundrede år senere i 1400-tallet."
    },

    {
        title:
            "Mammutter levede stadig, da pyramiderne blev bygget",

        text:
            "En mindre bestand af uldhårede mammutter overlevede på Wrangel Island tusindvis af år efter, at de fleste mammutter var uddøde."
    },

    {
        title:
            "Napoleon var ikke usædvanligt lav",

        text:
            "Napoleon Bonaparte var omtrent gennemsnitlig højde for en fransk mand på hans tid. Myten om hans lave højde skyldes blandt andet forskelle mellem franske og britiske måleenheder."
    },

    {
        title:
            "Romerriget brugte beton, som stadig eksisterer i dag",

        text:
            "Romerne fremstillede en særlig betonblanding, blandt andet med vulkansk aske. Mange romerske bygninger og havnekonstruktioner har derfor overlevet i næsten 2.000 år."
    },

    {
        title:
            "Den korteste krig varede mindre end en time",

        text:
            "Den anglo-zanzibarske krig i 1896 varede omkring 40 minutter og regnes ofte for den korteste registrerede krig i historien."
    },
   
    {
        title:
            "I 1851 blev de første offentlige toiletter med skyl vist frem",

        text:
            "Ved verdensudstillingen i London i 1851 blev de første offentlige toiletter med skyl vist frem og kunne benyttes af de besøgende mod betaling. For en pris på 1 penny."
    },

    {
        title:
            "Pavelig modstand mod jernbaner",

        text:
            "Da jernbaneskinnerne, og de damplokomotiver, skinnerne betjente, begyndte at brede sig fra England, var alle ikke lige begejstrede. Blandt de mere kritiske stemmer fandt man pave Gregor 16., der erklærede jernbanen vejen til helvede og kvitterede med et forbud mod at etablere jernbaner i hele det område, der udgjorde Pavestaten."
    },

    {
        title:
            "At forsøge at smugle en morgenstjerne med ind i fængslet",

        text:
            "I 1993 forsøgte en nyankommen fange at smugle en morgenstjerne ind i Horsens Statsfængsel. Det lykkedes dog for betjentene at opdage det vilde våben ved indsættelsesproceduren. Hvad morgenstjernen skulle bruges til, eller hvor fangen havde forsøgt at gemme den, ved vi desværre ikke."
    },

    {
        title:
            "Under forbudstiden i 1920érnes USA forgiftede den amerikanske regering bogstaveligt talt alkohol.",

        text:
            "Da folk fortsatte med at indtage alkohol på trods af forbudet, blev nogle embedsmænd frustrerede og besluttede at prøve en anden form for afskrækkelse – død. De beordrede forgiftning af industrielle alkoholer fremstillet i USA, som var produkter, der regelmæssigt blev stjålet af spritsmuglere."
    },

    {
        title:
            "Paven der blev smidt ud af et vindue",

        text:
            "Det i dag en berømt fortælling om en pave der, den 14. maj 964, blev grebet i sengen med en gift kvinde. Den rasende ægtemand greb paven og kastede ham ud af vinduet (en såkaldt defenestrering), hvilket paven døde af."
    }


];


/* Select random fact */

function showRandomFact() {

    if (
        !factTitle ||
        !factText
    ) {
        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            historyFacts.length
        );


    const fact =
        historyFacts[randomIndex];


    /* Restart animation */

    factContent?.classList.remove(
        "fact-changing"
    );


    void factContent?.offsetWidth;


    factContent?.classList.add(
        "fact-changing"
    );


    /* Insert content */

    factTitle.textContent =
        fact.title;

    factText.textContent =
        fact.text;
}


/* Button */

newFactButton?.addEventListener(
    "click",
    showRandomFact
);


/* Show random fact when page loads */

if (
    factTitle &&
    factText
) {

    showRandomFact();

}
