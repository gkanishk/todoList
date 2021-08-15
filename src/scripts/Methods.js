const AppMethods = (function () {
  // Imports
  const { rootContainer, getHeader, getCard, getModal } = Components;
  const { generateId } = utils;

  // Function declaration
  function renderHeader() {
    rootContainer.innerHTML += getHeader();
  }

  function renderList(todoList = []) {
    const listContainer = document.createElement("div");
    const previousContainer = document.getElementById("container");
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
                    ${
                      cards.length > 0
                        ? cards.map((card) => getCard(card, id)).join("")
                        : `<span class="empty-list">No Cards</span>`
                    }
                  </div>
                  <div class="list-footer">
                    <button class="add-card-button" listid='${id}' >Add Card</button>
                  </div>
                </div>`;
        })
        .join("")}`;
      listContainer.innerHTML = listItems;
    }
    if (previousContainer) {
      return rootContainer.replaceChild(listContainer, previousContainer);
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
    const list = listItems.find((list) => list.id === params?.listId);
    switch (params?.type) {
      case "MoveCard":
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
          // Sort cards using createdAt
          listItems.forEach((list) => {
            list.cards = list.cards.sort(
              (cardOne, cardTwo) =>
                new Date(cardOne.createdAt) - new Date(cardTwo.createdAt)
            );
          });
        }
        return listItems;
      case "AddCard":
        const createCard = {
          id: generateId(),
          title: params?.title,
          description: params?.description,
          isFavoriate: false,
          createdAt: new Date(),
        };
        list.cards.push(createCard);
        return listItems;
      case "RemoveCard":
        list.cards = list.cards.filter((card) => card.id !== params?.cardId);
        return listItems;
      case "MarkCardAsFavourite":
        const card = list.cards.find((card) => card.id === params?.cardId);
        card.isFavoriate = !card.isFavoriate;
        return listItems;
      default:
        break;
    }
  }

  function getListAttributes(listItems, title) {
    const checkList = listItems.find(
      (list) => list.title.toLowerCase() === title.toLowerCase()
    );
    if (checkList) {
      return null;
    }
    const list = {
      id: generateId(),
      title: title,
      createdAt: new Date(),
      cards: [],
    };
    return list;
  }

  function getSearchResult(listItems = [], searchValue = "") {
    let items = JSON.parse(JSON.stringify(listItems));
    if (searchValue.length > 0) {
      items.forEach((list) => {
        list.cards = list.cards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchValue) ||
            card.description.toLowerCase().includes(searchValue)
        );
      });
      items = items.filter((list) => list.cards.length > 0);
    }
    return items;
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
    getListAttributes,
    getSearchResult,
  };
})();
