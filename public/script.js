document.addEventListener("DOMContentLoaded", () => {
  class Card {
    constructor(data, cardCollection) {
      this.data = data;
      this.cardCollection = cardCollection;
      this.element = this.createElement();
    }

    createElement() {
      const card = document.createElement("div");
      card.classList.add("card");

      const cityNameElement = document.createElement("h2");
      cityNameElement.textContent = this.data.city;

      const iconElement = document.createElement("img");
      iconElement.src =
        "http://openweathermap.org/img/w/" + this.data.icon + ".png";
      iconElement.alt = "Weather Icon";

      const temperatureElement = document.createElement("p");
      temperatureElement.textContent = `${this.data.temp}°C`;
      temperatureElement.classList.add("temperature");

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = `Description: ${this.data.description}`;

      card.appendChild(cityNameElement);
      card.appendChild(temperatureElement);
      card.appendChild(iconElement);
      card.appendChild(descriptionElement);
      

      const addToCollectionButton = document.createElement("button");
      addToCollectionButton.textContent = "+";
      addToCollectionButton.classList.add("add-to-collection-button");
      addToCollectionButton.addEventListener("click", () => {
        this.onAddToCollection(addToCollectionButton);
       
      });


      card.appendChild(addToCollectionButton);

      if (this.cardCollection.cards.length > 0) {
        addToCollectionButton.style.display = "none";
      }

      return card;
    }

    onAddToCollection(addButton) {
      addButton.style.display = "none";
      this.cardCollection.addCardToCollection(this);
    
      // Enable navigation buttons if cards are in the collection
      if (this.cardCollection.cards.length > 1) {
        this.cardCollection.enableNavigationButtons();
      }
    }
    
  }

  class CardCollection {
    constructor() {
      this.cards = [];
      this.cardContainer = document.querySelector("#card-content");
      this.navigationContainer = document.querySelector("#card-navigation");
    }

    async generateNewCard(cityName) {
      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cityName }),
        });

        if (!response.ok) {
          throw new Error("Error fetching weather data");
        }

        const data = await response.json();
        const newCard = new Card(data, this);

        this.addCard(newCard);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
    enableNavigationButtons() {
      const prevButton = document.querySelector("#prevButton");
      const nextButton = document.querySelector("#nextButton");
      prevButton.style.display = "block";
      nextButton.style.display = "block";
    }
    
    addCard(card) {
      this.cards.unshift(card);
      this.renderCards();
    }

    addCardToCollection(card) {
      this.cards.unshift(card);
      this.renderCards();
    }

    renderCards() {
      this.cardContainer.innerHTML = "";
      this.navigationContainer.innerHTML = "";

      if (this.cards.length > 0) {
        const currentCard = this.cards[0];
        this.cardContainer.appendChild(currentCard.element);

        if (this.cards.length > 1) {
          const nextButton = document.createElement("button");
          nextButton.textContent = ">";
          nextButton.classList.add("nav-button");
          nextButton.addEventListener("click", () => {
            this.nextCard();
          });

          const prevButton = document.createElement("button");
          prevButton.textContent = "<";
          prevButton.classList.add("nav-button");
          prevButton.addEventListener("click", () => {
            this.prevCard();
          });

          this.navigationContainer.appendChild(prevButton);
          this.navigationContainer.appendChild(nextButton);
        } else {
          // Hide navigation buttons if there is only one card
          const prevButton = document.querySelector("#prevButton");
          const nextButton = document.querySelector("#nextButton");
          prevButton.style.display = "none";
          nextButton.style.display = "none";
        }
      }
    }

    nextCard() {
      this.cards.push(this.cards.shift());
      this.renderCards();
    }

    prevCard() {
      this.cards.unshift(this.cards.pop());
      this.renderCards();
    }
  }

  const cardCollection = new CardCollection();

  const form= document.querySelector("#weatherForm");

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
  
