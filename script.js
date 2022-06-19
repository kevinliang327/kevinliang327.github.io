/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const coffeeCounter = document.getElementById("coffee_counter");

  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  return producers.map((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter((producer) => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  // your code here
  return id
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;

  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <div class="buy">
      <button type="button" id="buy_${producer.id}">Buy</button>
      <span class="price"> ${producer.price} coffee </span>
    </div>
    <div class="sell">
      <button type="button" id="sell_${producer.id}">Sell </button>
      <span class="price"> ${Math.ceil(
        updateSellPrice(producer.price) / 4
      )} coffee </span>
    </div>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById("producer_container");

  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  getUnlockedProducers(data).map((unlockedProducer) => {
    producerContainer.appendChild(makeProducerDiv(unlockedProducer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  return data.producers.filter((producer) => producer.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
  // your code here
  if (data.coffee >= getProducerById(data, producerId).price) {
    return true;
  }

  return false;
}

function canSellProducer(data, producerId) {
  // your code here
  if (getProducerById(data, producerId).qty > 0) {
    return true;
  }

  return false;
}

function updateCPSView(cps) {
  // your code here
  const cpsIndicator = document.getElementById("cps");

  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function updateSellPrice(oldPrice) {
  // try to revert price back to old price before buying
  return Math.ceil(oldPrice / 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let wantedProducer = getProducerById(data, producerId);

  if (canAffordProducer(data, producerId)) {
    wantedProducer.qty += 1;
    data.coffee -= wantedProducer.price;
    wantedProducer.price = updatePrice(wantedProducer.price);
    data.totalCPS += wantedProducer.cps;

    return true;
  }

  return false;
}

function attemptToSellProducer(data, producerId) {
  let unwantedProducer = getProducerById(data, producerId);

  if (canSellProducer(data, producerId)) {
    unwantedProducer.qty -= 1;
    // want to sell for 1/4 of the PREVIOUS price
    data.coffee += Math.ceil(updateSellPrice(unwantedProducer.price) / 4);
    unwantedProducer.price = updateSellPrice(unwantedProducer.price);
    data.totalCPS -= unwantedProducer.cps;

    return true;
  }

  return false;
}

function buyButtonClick(event, data) {
  // your code here
  if (
    event.target.tagName === "BUTTON" &&
    event.target.id.slice(0, 3) === "buy"
  ) {
    let wantedProducerId = getProducerById(data, event.target.id.slice(4)).id;

    if (canAffordProducer(data, wantedProducerId)) {
      attemptToBuyProducer(data, wantedProducerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    } else {
      window.alert("Not enough coffee!");
    }
  }
}

function sellButtonClick(event, data) {
  // your code here
  if (
    event.target.tagName === "BUTTON" &&
    event.target.id.slice(0, 4) === "sell"
  ) {
    let unwantedProducerId = getProducerById(data, event.target.id.slice(5)).id;

    if (canSellProducer(data, unwantedProducerId)) {
      attemptToSellProducer(data, unwantedProducerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    } else {
      window.alert(
        `You have no ${makeDisplayNameFromId(unwantedProducerId)} to sell!`
      );
    }
  }
}

function save(data) {
  window.localStorage.setItem("saveData", JSON.stringify(data));
}

// user can save game manually, though the game state is automattically saved every second
function saveGameButtonClick(event, data) {
  if (event.target.tagName === "BUTTON" && event.target.id === "save_game") {
    save(data);
    event.target.innerText = "Saved!";
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  // useful when loading from local save data
  updateCPSView(data.totalCPS);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  if (Object.hasOwn(window.localStorage, "saveData")) {
    const saveData = window.localStorage.getItem("saveData");
    data = JSON.parse(saveData);
  } else {
    const data = window.data;
  }

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
    sellButtonClick(event, data);
  });

  const newOrSaveGame = document.getElementById("new-or-save-game");
  newOrSaveGame.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && event.target.id === "new_game") {
      if (confirm("Start a new game?\nAll of your progress will be erased!")) {
        data = window.newData;
      }
    }
    saveGameButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  // also saves every second
  setInterval(() => {
    tick(data);
    save(data);
  }, 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
