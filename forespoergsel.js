
"use strict";

/* =========================================================
   01. INDSTILLINGER OG PRODUKTER
========================================================= */

// Navnet på kurven i browserens localStorage
const INQUIRY_KEY = "heres-history-inquiry-v1";

// Produkterne, der kan tilføjes til kurven
const INQUIRY_PRODUCTS = {

    verdenskort: {
        name: "Verdenskort — 200 mio. år siden",
        price: 299,
        image: "assets/world-map.png"
    },

    dannebrog: {
        name: "Dannebrogs fald — før & nu",
        price: 299,
        image: "assets/dannebrog-now.jpg"
    }

};


/* =========================================================
   02. HENT KURVEN FRA LOCALSTORAGE
========================================================= */

function readInquiry() {

    try {

        const stored = JSON.parse(
            localStorage.getItem(INQUIRY_KEY) || "{}"
        );

        // Kontrollér, at den gemte kurv er gyldig
        if (
            !stored ||
            typeof stored !== "object" ||
            Array.isArray(stored)
        ) {
            return {};
        }

        const clean = {};

        // Gennemgå alle produkter
        for (const id of Object.keys(INQUIRY_PRODUCTS)) {

            const n = stored[id];

            if (Number.isInteger(n) && n > 0) {

                clean[id] = Math.min(99, n);

            }

        }

        return clean;

    } catch {

        return {};

    }

}


/* =========================================================
   03. GEM KURVEN
========================================================= */

function saveInquiry(cart) {

    try {

        localStorage.setItem(
            INQUIRY_KEY,
            JSON.stringify(cart)
        );

    } catch {

        // Browseren kan blokere localStorage

    }

    // Opdater antal produkter i menuen
    updateInquiryCount(cart);

    // Opdater kurvens indhold
    renderInquiry(cart);

}


/* =========================================================
   04. OPDATER KURVENS ANTAL
========================================================= */

function updateInquiryCount(cart = readInquiry()) {

    // Beregn samlet antal produkter
    const count = Object.values(cart).reduce(
        (sum, qty) => sum + qty,
        0
    );

    // Opdater alle kurvetællere på siden
    document.querySelectorAll(".cart-count").forEach(el => {

        el.textContent = String(count);

    });

}


/* =========================================================
   05. TILFØJ ELLER FJERN PRODUKTER
========================================================= */

function changeInquiry(id, delta) {

    // Kontrollér, at produktet findes
    if (!Object.hasOwn(INQUIRY_PRODUCTS, id)) {
        return;
    }

    // Hent kurven
    const cart = readInquiry();

    // Beregn nyt antal (minimum 0, maksimum 99)
    const next = Math.max(
        0,
        Math.min(99, (cart[id] || 0) + delta)
    );

    // Opdater produktet
    if (next) {

        cart[id] = next;

    } else {

        delete cart[id];

    }

    // Gem den nye kurv
    saveInquiry(cart);

}


/* =========================================================
   06. KNAPPER: TILFØJ TIL KURV
========================================================= */

document.querySelectorAll(".add-to-inquiry").forEach(button => {

    button.addEventListener("click", () => {

        // Tilføj ét produkt
        changeInquiry(
            button.dataset.product,
            1
        );

        // Gem knappens oprindelige tekst
        const initial = button.textContent;

        // Vis besked til brugeren
        button.textContent = "✓ Tilføjet til kurven";

        // Skift tilbage efter 1,6 sekunder
        window.setTimeout(() => {

            button.textContent = initial;

        }, 1600);

    });

});


/* =========================================================
   07. VIS KURVENS INDHOLD
========================================================= */

function renderInquiry(cart = readInquiry()) {

    // Find containeren til kurvens produkter
    const container = document.getElementById(
        "inquiry-items"
    );

    // Stop, hvis vi ikke er på kurvesiden
    if (!container) {
        return;
    }

    // Ryd det tidligere indhold
    container.replaceChildren();

    // Hent produkterne fra kurven
    const entries = Object.entries(cart);

    // Find oversigt og send-knap
    const summary = document.getElementById(
        "inquiry-summary"
    );

    const send = document.getElementById(
        "send-inquiry"
    );


    /* -----------------------------------------------------
       TOM KURV
    ----------------------------------------------------- */

    if (!entries.length) {

        const empty = document.createElement("p");

        empty.className = "empty-inquiry";

        empty.textContent =
            "Din kurv er tom. Gå til produkter og tilføj de plakater, du vil spørge om.";

        container.append(empty);

        summary.textContent =
            "Ingen plakater valgt endnu.";

        // Deaktiver send-knappen
        send.disabled = true;

        return;

    }


    // Aktivér send-knappen
    send.disabled = false;

    let count = 0;
    let amount = 0;


    /* -----------------------------------------------------
       OPRET PRODUKTERNE I KURVEN
    ----------------------------------------------------- */

    for (const [id, qty] of entries) {

        const product = INQUIRY_PRODUCTS[id];

        // Beregn samlet antal og pris
        count += qty;
        amount += product.price * qty;


        // Produktets container
        const row = document.createElement("article");

        row.className = "inquiry-item";


        // Produktbillede
        const image = document.createElement("img");

        image.src = product.image;
        image.alt = product.name;


        // Produktinformation
        const content = document.createElement("div");


        // Produktnavn
        const heading = document.createElement("h3");

        heading.textContent = product.name;


        // Pris pr. stk.
        const price = document.createElement("p");

        price.textContent =
            `${product.price} kr. pr. stk.`;



        /* -------------------------------------------------
           ANTALSKNAPPER
        ------------------------------------------------- */

        const controls = document.createElement("div");

        controls.className = "quantity-controls";


        // Minusknap
        const minus = document.createElement("button");

        minus.type = "button";
        minus.textContent = "−";

        minus.setAttribute(
            "aria-label",
            `Fjern én ${product.name}`
        );

        minus.addEventListener("click", () => {

            changeInquiry(id, -1);

        });


        // Vis antal
        const quantity = document.createElement("span");

        quantity.textContent = `${qty} stk.`;


        // Plusknap
        const plus = document.createElement("button");

        plus.type = "button";
        plus.textContent = "+";

        plus.setAttribute(
            "aria-label",
            `Tilføj én ${product.name}`
        );

        plus.disabled = qty >= 99;

        plus.addEventListener("click", () => {

            changeInquiry(id, 1);

        });


        // Fjern produkt helt
        const remove = document.createElement("button");

        remove.type = "button";
        remove.className = "remove-item";
        remove.textContent = "Fjern";

        remove.addEventListener("click", () => {

            changeInquiry(id, -qty);

        });



        /* -------------------------------------------------
           SAML PRODUKTETS HTML
        ------------------------------------------------- */

        controls.append(
            minus,
            quantity,
            plus,
            remove
        );

        content.append(
            heading,
            price,
            controls
        );

        row.append(
            image,
            content
        );

        container.append(row);

    }


    /* -----------------------------------------------------
       OPDATER SAMLET PRIS
    ----------------------------------------------------- */

    summary.textContent =
        `${count} plakat(er) · ` +
        `Vejledende produktsum: ` +
        `${amount.toLocaleString("da-DK")} kr. ` +
        `(ekskl. evt. levering). ` +
        `Ingen betaling eller bindende ordre.`;

}


/* =========================================================
   08. KONTAKTFORMULAR / SEND FORESPØRGSEL
========================================================= */

// Find formularen
const inquiryForm = document.getElementById(
    "inquiry-form"
);


// Når brugeren klikker på Send forespørgsel
inquiryForm?.addEventListener("submit", event => {

    // Undgå almindelig formularindsendelse
    event.preventDefault();


    // Kontrollér formularens felter
    if (!inquiryForm.reportValidity()) {
        return;
    }


    // Hent kurven
    const cart = readInquiry();

    // Stop, hvis kurven er tom
    if (!Object.keys(cart).length) {
        return;
    }


    // Hent oplysninger fra formularen
    const fields = new FormData(inquiryForm);



    /* -----------------------------------------------------
       OPRET PRODUKTLISTE TIL E-MAIL
    ----------------------------------------------------- */

    const lines = Object.entries(cart).map(
        ([id, qty]) => {

            const product = INQUIRY_PRODUCTS[id];

            return (
                `${qty} x ${product.name} ` +
                `(${qty * product.price} kr.)`
            );

        }
    );



    /* -----------------------------------------------------
       BEREGN SAMLET PRIS
    ----------------------------------------------------- */

    const amount = Object.entries(cart).reduce(
        (sum, [id, qty]) => {

            return sum +
                INQUIRY_PRODUCTS[id].price * qty;

        },
        0
    );



    /* -----------------------------------------------------
       OPRET E-MAILENS INDHOLD
    ----------------------------------------------------- */

    const body = [

        "Hej Here's History",

        "",

        "Jeg vil gerne sende en uforpligtende forespørgsel om:",

        ...lines,

        "",

        `Vejledende produktsum: ${amount} kr. ekskl. evt. levering`,

        "",

        `Navn: ${fields.get("name")}`,

        `E-mail: ${fields.get("email")}`,

        `Telefon: ${fields.get("phone") || "Ikke oplyst"}`,

        "",

        "Besked:",

        String(
            fields.get("message") ||
            "Ingen yderligere besked."
        ),

        "",

        "Dette er en forespørgsel, ikke en bindende bestilling."

    ].join("\n");



    /* -----------------------------------------------------
       OPRET MAILTO-LINK
    ----------------------------------------------------- */

    const url =
        `mailto:kontakt@hereshistory.dk` +
        `?subject=${encodeURIComponent("Forespørgsel på historieplakater")}` +
        `&body=${encodeURIComponent(body)}`;



    /* -----------------------------------------------------
       VIS BESKED TIL BRUGEREN
    ----------------------------------------------------- */

    document.getElementById(
        "inquiry-status"
    ).textContent =
        "Dit mailprogram åbnes nu. " +
        "Kontrollér indholdet, og tryk selv Send. " +
        "Hvis intet åbner, skal du have et mailprogram " +
        "knyttet til mailto-links.";



    /* -----------------------------------------------------
       ÅBN BRUGERENS MAILPROGRAM
    ----------------------------------------------------- */

    window.location.href = url;

});


/* =========================================================
   09. INITIALISERING
========================================================= */

// Opdater kurvens tæller, når siden indlæses
updateInquiryCount();

// Vis kurvens indhold, hvis vi er på kurvesiden
renderInquiry();


/* =========================================================
   10. SYNKRONISERING MELLEM FANER
========================================================= */

// Hvis kurven ændres i en anden browserfane,
// opdateres denne side automatisk.

window.addEventListener("storage", () => {

    updateInquiryCount();

    renderInquiry();

});