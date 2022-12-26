"use strict";

import { formatArray, getSumCards } from "./utilities.js";

const startBet = 100;

class Game {
  constructor(dealerName, userName) {
    this.dealer = new Player(dealerName);
    this.user = new Player(userName);

    this.userIsStand = false;

    this.bet = startBet;

    this.ui = new GameUI(this);
  }

  start() {
    this.setStartingCards(this.user);
    this.setStartingCards(this.dealer);

    this.updateUI();
  }
  updateUI() {
    this.dealer.ui.updatePlayerUI(this.dealer, this.userIsStand);
    this.user.ui.updatePlayerUI(this.user);

    this.ui.updateGameUI();
  }
  userStand() {
    this.userIsStand = true;
    this.user.stand = true;
    this.updateUI();
  }
  setDoubleBet() {
    this.bet = this.bet * 2;
  }
  setStartBet() {
    this.bet = startBet;
  }
  setFirstCard(playerObj) {
    playerObj.cards.push(Math.trunc(Math.random() * 11 + 1));
    playerObj.score = getSumCards(playerObj.cards);
  }
  setAnotherCard(playerObj) {
    playerObj.cards.push(Math.trunc(Math.random() * 9 + 1));
    playerObj.score = getSumCards(playerObj.cards);
  }
  setStartingCards(playerObj) {
    this.setFirstCard(playerObj);
    this.setAnotherCard(playerObj);
  }
}

class Player {
  constructor(playerName) {
    this.name = playerName;
    this.score = 0;
    this.stand = false;
    this.cards = [];
    this.win = false;
    this.ui = new PlayerUI(this.name);
  }
  setWinner() {
    this.win = true;
    this.ui.$status.innerText = "WIN";
  }
}

class PlayerUI {
  constructor(name) {
    this.$score = document.getElementById("score" + name);
    this.$status = document.getElementById("status" + name);
    this.$cards = document.getElementById("cards" + name);
  }
  updatePlayerUI(player, userIsStand = false) {
    let scoreText;

    if (player.name == "User" || userIsStand) {
      console.log("карты открыты!");

      scoreText = player.score;

      for (let i = 0; i < player.cards.length; i++) {
        if (!this.$cards.children[i]) {
          let newCard = document.createElement("div");
          newCard.innerText = player.cards[i];
          newCard.className = "elementCard";
          this.$cards.appendChild(newCard);

          setTimeout(() => newCard.classList.add("animate"), 80);
        } else if (i == 0 && player.name == "Dealer") {
          this.$cards.children[i].innerHTML = player.cards[i];
          this.$cards.children[i].classList.remove("hide");
          setTimeout(() => this.$cards.children[i].classList.add("flip"), 80);
        }
      }
    } else {
      console.log("карты скрыты!");

      scoreText = "?";

      for (let i = 0; i < player.cards.length; i++) {
        if (!this.$cards.children[i]) {
          let newCard = document.createElement("div");

          newCard.className = i == 0 ? "elementCard hide" : "elementCard";
          newCard.innerText = i == 0 ? "" : player.cards[i];

          this.$cards.appendChild(newCard);

          setTimeout(() => newCard.classList.add("animate"), 150);
        }
      }
    }

    this.$score.innerText = scoreText;
  }
  reset() {
    this.$status.innerText = "";

    while (this.$cards.firstChild) {
      this.$cards.removeChild(this.$cards.firstChild);
    }
  }
}

class Button {
  constructor(name, func) {
    this.name = name;
    this.disabled = false;

    this.$element = document.getElementById(name);
    this.$element.addEventListener("click", func);
  }
  enable() {
    this.$element.disabled = false;
  }
  disable() {
    this.$element.disabled = true;
  }
}

class GameUI {
  constructor(gameObject) {
    this.reference = gameObject;

    this.btnHit = new Button("btnHit", () => this.hit(this.reference.user));
    this.btnStand = new Button("btnStand", () => this.stand(this.reference));
    this.btnRestart = new Button("btnRestart", () => this.restart());

    this.betElement = document.getElementById("bet");
  }
  updateGameUI() {
    this.betElement.innerText = `$ ${this.reference.bet}`;
  }
  hit(player) {
    if (player.name == "Dealer") {
      if (player.win == false) {
        let interval = setInterval(() => {
          this.reference.setAnotherCard(player);
          this.reference.updateUI();

          if (player.score > this.reference.user.score) {
            clearInterval(interval);
          }
          checkTurn(this.reference);
        }, 1000);
      }
    } else if (player.name == "User") {
      this.reference.setAnotherCard(player);
      this.reference.updateUI();

      checkTurn(this.reference);
    }
  }

  stand(ref) {
    ref.userStand();
    ref.updateUI();

    checkTurn(ref);
    this.hit(ref.dealer);
  }
  restart() {
    this.reference.userIsStand = false;

    this.reference.user.win = false;
    this.reference.dealer.win = false;

    this.reference.user.score = 0;
    this.reference.dealer.score = 0;

    this.reference.user.stand = false;
    this.reference.dealer.stand = false;

    this.reference.user.cards = [];
    this.reference.dealer.cards = [];

    this.reference.user.ui.reset();
    this.reference.dealer.ui.reset();

    this.reference.setStartingCards(this.reference.user);
    this.reference.setStartingCards(this.reference.dealer);

    this.btnHit.enable();
    this.btnStand.enable();

    this.reference.updateUI();
  }
}

let game = new Game("Dealer", "User");
game.start();

function checkTurn(gameObject) {
  if (
    gameObject.user.score >= 21 ||
    gameObject.dealer.score >= 21 ||
    gameObject.user.stand
  ) {
    gameObject.ui.btnHit.disable();
    gameObject.ui.btnStand.disable();

    if (gameObject.user.score == 21 || gameObject.dealer.score > 21) {
      gameObject.user.setWinner();
      gameObject.setDoubleBet();
    } else if (
      gameObject.dealer.score == 21 ||
      gameObject.user.score > 21 ||
      (gameObject.user.score < gameObject.dealer.score && gameObject.user.stand)
    ) {
      gameObject.dealer.setWinner();
      gameObject.bet = startBet;
    }
    gameObject.ui.updateGameUI();
  }
}
