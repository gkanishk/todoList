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
      const listItems = `${todoList.map(({ id, title, cards }, index) => {
        return `<div class="list-container">
                  <div class="list-header">
                    <span class="list-title">${title}</span>
                    <button class="delete-list-button" listId='${id}' listIndex='${index}'>Delete List</button>
                  </div>
                  <div class="list-body" listId='${id}'>
                    ${cards.map((card) => getCard(card)).join("")}
                  </div>
                  <div class="list-footer">
                    <button class="add-card-button">Add Card</button>
                  </div>
                </div>`;
      })}`;
      listContainer.innerHTML = listItems;
    }
    return rootContainer.appendChild(listContainer);
  }

  function renderModal() {
    // rootContainer.innerHTML += getModal("Card");
  }

  function getListContainer(element) {
    do {
      if (element.nodeType == 1 && element.className === "list-body") {
        return element;
      }
    } while ((element = element.parentNode));

    return null;
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
  };
})();
