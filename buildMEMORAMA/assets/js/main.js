import { alertBasic } from "./alerts.js";
import { getCharacterApi } from "./fetch.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("estoy listo...");
});

//  ---------------------------- MENU RESPONSIVE
document.querySelector("#menuResponsive").addEventListener("click", () => {
  document.querySelector('#nav').classList.toggle('show-menu')
});

// ----------------------------------- MEMORAMA
const cardsContainer = document.querySelector("#cardsContainer");
const success = document.querySelector("#success span");
const attempts = document.querySelector("#attempts span");
const errors = document.querySelector("#errors span");

let counter = { success: 0, errors: 0, attempts: 0 };
let cardsSelected = [];
let counterPars = 0;

const checkClick = (e) => {
  const imgPosition = e.target.dataset.img || undefined;
  if (!imgPosition) return;
  // select nodes
  const element = e.target;

  if (imgPosition === "back") {
    showCard(element); //show image -> remove portal image
    saveSelected({
      dataSet: element.dataset.id,
      id: element.id,
      currentElement: element, //back img (img portal)
      previousElement: element.previousElementSibling, //img (img characters)
    });
  }
};
cardsContainer.addEventListener("click", checkClick, true);

const showCard = (imgBack) => {
  imgBack.classList.add("hide-card-back");
  imgBack.classList.remove("show-card-back");
};

const hideCard = (current) => {
  current.classList.add("show-card-back");
  current.classList.remove("hide-card-back");
};

const saveSelected = (newCard) => {
  cardsSelected = [...cardsSelected, newCard];
  if (cardsSelected.length < 2) return;

  cardsContainer.removeEventListener("click", checkClick, true); //user can't select more
  const areEquals = cardsSelected[0].dataSet === cardsSelected[1].dataSet;
  updateValues(areEquals);
};

const updateValues = (areEquals) => {
  if (areEquals) {
    success.textContent = counter.success += 1;
    counterPars -= 2;
    cardsSelected.forEach((e) =>
      setTimeout(() => {
        e.previousElement.classList.add("hide-card-selected");
      }, 500)
    );
  } else {
    errors.textContent = counter.errors += 1;
    cardsSelected.forEach((e) =>
      setTimeout(() => {
        hideCard(e.currentElement);
      }, 500)
    );
  }
  attempts.textContent = counter.attempts += 1;
  //reset array
  cardsSelected = [];
  //assign event again
  cardsContainer.addEventListener("click", checkClick, true);

  counterPars < 1 && endGame();
};

const endGame = () => {
  const data = `Aciertos: ${counter.success}\n Errores: ${counter.errors}\n Intentos: ${counter.attempts}`;
  alertBasic(data);

  const playAgain = document.querySelector('#replay');
  playAgain.classList.remove('none');
  playAgain.addEventListener('click', reloadPage);
  
};

const reloadPage = () => location.reload();

//-------------------------------------- FORM SELECT LEVEL
const form = document.querySelector("#formLevel");
const loading = document.querySelector("#loading");
const body = document.querySelector("body");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const level = document.querySelector("#level").value;
  if (!level)
    return alertBasic("Burp", "Debes *burp seleccionar un nivel", "info");

  // currently rick and morty API has 826 character...
  // easy => 12 cards = 6 characters
  // medium => 20 cards = 10 character
  // hard => 26 cards = 13 character

  const qty =
    level === "easy"
      ? 6
      : level === "medium"
      ? 10
      : level === "hard"
      ? 13
      : undefined;

  if (!qty)
    return alertBasic(
      "Burp",
      "Algo falló al seleccionar... intenta otra vez",
      "info"
    );

    counterPars = qty * 2;
  const listIds = randomNumbers(qty);
  loading.classList.remove("none");
  form.classList.add("none");
  const listImages = await getCharacterApi(listIds);
  if (listImages.length < 1)
    return alertBasic("Uppss", "Ha ocurrido un error", "error");
  createCards(listImages);
});

const randomNumbers = (qty) => {
  let numbers = [];
  const min = 1;
  const max = 826;
  for (let i = 0; i < qty; i++) {
    const number = Math.floor(Math.random() * (max - min) + min);
    numbers = [...numbers, number];
  }
  return numbers;
};

const createCards = (images) => {
  let imagesTotal = [...images, ...images];
  imagesTotal.sort(() => Math.random() - 0.5);

  imagesTotal.forEach((url, i) => {
    const card = document.createElement("div");
    const img = document.createElement("img");
    const back = document.createElement("div");

    card.classList.add("card");
    img.classList.add("card-img");
    img.dataset.id = url;
    img.src = url;
    img.id = Date.now();

    back.classList.add("card-img-back");
    back.dataset.id = url;
    back.id = Date.now();
    back.dataset.img = "back";

    card.appendChild(img);
    card.appendChild(back);

    document.querySelector("#cardsContainer").appendChild(card);
  });

  body.classList.remove("block-body");
  document.querySelector("#formContainer").classList.add("none");
};

