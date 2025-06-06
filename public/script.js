document.addEventListener("DOMContentLoaded", () => {
  class Card {
    constructor(data, cardCollection) {
      this.data = data;
      this.cardCollection = cardCollection;
      this.element = this.createElement();
      this.inStack = false; // tracks whether it's in the stack
    }

    createElement() {
      const card = document.createElement("div");
      card.classList.add("card");

      const cityNameElement = document.createElement("h2");
      cityNameElement.textContent = this.data.city;

      const iconElement = document.createElement("img");
      iconElement.src = `http://openweathermap.org/img/w/${this.data.icon}.png`;
      iconElement.alt = "Weather Icon";

      const temperatureElement = document.createElement("p");
      temperatureElement.textContent = `${this.data.temp}°C`;
      temperatureElement.classList.add("temperature");

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = `Description: ${this.data.description}`;

      // Toggle button ( + or - )
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "+";
      toggleButton.classList.add("add-to-collection-button");

      toggleButton.addEventListener("click", () => {
        this.inStack = !this.inStack;
        if (this.inStack) {
          this.cardCollection.addCardToStack(this);
          toggleButton.textContent = "-";
        } else {
          this.cardCollection.removeCardFromStack(this);
          toggleButton.textContent = "+";
        }
      });

      card.appendChild(cityNameElement);
      card.appendChild(temperatureElement);
      card.appendChild(iconElement);
      card.appendChild(descriptionElement);
      card.appendChild(toggleButton);

      this.toggleButton = toggleButton; // So we can update it from outside

      return card;
    }

    updateButton() {
      this.toggleButton.textContent = this.inStack ? "-" : "+";
    }
  }

  class CardCollection {
    constructor() {
      this.allCards = []; // All cards ever created
      this.stack = []; // Cards in the stack
      this.currentIndex = 0;

      this.cardContainer = document.querySelector("#card-content");
      this.navigationContainer = document.querySelector("#card-navigation");
    }

    async generateNewCard(cityName) {
      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityName }),
        });

        if (!response.ok) throw new Error("Error fetching weather data");

        const data = await response.json();
        const newCard = new Card(data, this);
        this.allCards.push(newCard);
        this.renderCard(newCard); // Show the new card even if it's not in the stack

      } catch (error) {
        console.error("Error:", error);
      }
    }

    addCardToStack(card) {
      if (!this.stack.includes(card)) {
        this.stack.unshift(card);
        this.currentIndex = 0;
        this.renderStack();
      }
    }

    removeCardFromStack(card) {
  const index = this.stack.indexOf(card);
  if (index !== -1) {
    this.stack.splice(index, 1);

    if (this.stack.length === 0) {
      this.cardContainer.innerHTML = "";
      this.navigationContainer.innerHTML = "";
      return;
    }

    if (this.currentIndex >= this.stack.length) {
      this.currentIndex = Math.max(0, this.stack.length - 1);
    }

    this.renderStack();
  }
}


    renderCard(card) {
      this.cardContainer.innerHTML = "";
      this.navigationContainer.innerHTML = "";
      this.cardContainer.appendChild(card.element);
    }

    renderStack() {
  this.cardContainer.innerHTML = "";
  this.navigationContainer.innerHTML = "";

  if (this.stack.length === 0) return;

  const currentCard = this.stack[this.currentIndex];
  this.cardContainer.appendChild(currentCard.element);
  currentCard.updateButton();

  // Only show nav buttons if there are more than 1 card
  if (this.stack.length > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.classList.add("nav-button");
    prevButton.addEventListener("click", () => this.prevCard());

    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.classList.add("nav-button");
    nextButton.addEventListener("click", () => this.nextCard());

    this.navigationContainer.appendChild(prevButton);
    this.navigationContainer.appendChild(nextButton);
  }
}


    nextCard() {
      this.currentIndex = (this.currentIndex + 1) % this.stack.length;
      this.renderStack();
    }

    prevCard() {
      this.currentIndex =
        (this.currentIndex - 1 + this.stack.length) % this.stack.length;
      this.renderStack();
    }
  }

  const cardCollection = new CardCollection();

  const form = document.querySelector("#weatherForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityNameInput = document.querySelector("#cityNameInput");
    const cityName = cityNameInput.value.trim();
    if (cityName) {
      cardCollection.generateNewCard(cityName);
      cityNameInput.value = "";
    }
  });
});
