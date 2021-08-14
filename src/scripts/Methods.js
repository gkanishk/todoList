const AppFunctions = (function () {
  // Imports
  const { rootContainer, getHeader, getCard, getModal } = Components;

  // Function declaration
  function renderHeader() {
    rootContainer.innerHTML += getHeader();
  }

  function renderList(todoList = []) {
    const listContainer = document.createElement("div");
    listContainer.id = "container";
    if (todoList.length === 0) {
      listContainer.style.flexDirection = "column";
      listContainer.style.justifyContent = "center";
      listContainer.innerHTML = `<h1 id="no-item-container">No list available</h1>`;
    } else {
      const listItems = `${todoList
        .map(({ id, title, cards }, index) => {
          return `<div class="list-container">
                  <div class="list-header">
                    <span class="list-title">${title}</span>
                    <button class="delete-list-button" listId='${id}' listIndex='${index}'>Delete List</button>
                  </div>
                  <div class="list-body" listId='${id}'>
                    ${cards.map((card) => getCard(card)).join("")}
                  </div>
                  <div class="list-footer">
                    <button class="add-card-button" listid='${id}' >Add Card</button>
                  </div>
                </div>`;
        })
        .join("")}`;
      listContainer.innerHTML = listItems;
    }
    return rootContainer.appendChild(listContainer);
  }

  function renderModal(type = "List", listId = "") {
    rootContainer.innerHTML += getModal(type, listId);
  }

  function getListContainer(element) {
    do {
      if (element.nodeType == 1 && element.className === "list-body") {
        return element;
      }
    } while ((element = element.parentNode));

    return null;
  }

  function getCardFromLists(listItems = [], cardId) {
    for (let list of listItems) {
      for (let card of list.cards) {
        if (card.id === cardId) return card;
      }
    }
  }

  function isCardInList(listItems = [], listId, cardId) {
    const getList = listItems.find((list) => list.id === listId);
    const card = getList.cards.find((card) => card.id === cardId);
    if (card) {
      return true;
    }
    return false;
  }

  function getUpdatedList(listItems = [], params = {}) {
    switch (params?.type) {
      case "AddCard":
        const getCard = getCardFromLists(listItems, params?.cardId);
        // Check whether card exists in list or not.
        if (
          !isCardInList(listItems, params?.listId, params?.cardId) &&
          getCard
        ) {
          // Remove card from old list
          listItems.forEach((list) => {
            list.cards = list.cards.filter((card) => card.id !== params.cardId);
          });
          // Add card to new list.
          listItems.forEach((list) => {
            if (list.id === params?.listId) list.cards.push(getCard);
          });
        }
        return listItems;
        break;
      default:
        break;
    }
  }

  function addListCard(buttonEvent) {
    console.log(buttonEvent, buttonEvent.attributes.listId.value);
  }

  function cancelModal() {
    const modal = document.getElementsByClassName("modal");
    rootContainer.removeChild(modal[0]);
  }

  function getItemFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function saveItemToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function clearLocalStorage() {
    localStorage.clear();
  }

  return {
    renderHeader,
    renderList,
    getItemFromLocalStorage,
    saveItemToLocalStorage,
    clearLocalStorage,
    renderModal,
    getListContainer,
    getUpdatedList,
    cancelModal,
    addListCard,
  };
})();
