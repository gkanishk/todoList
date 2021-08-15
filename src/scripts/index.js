(() => {
  // ****Imports****
  const {
    getItemFromLocalStorage,
    renderHeader,
    renderList,
    saveItemToLocalStorage,
    renderModal,
    getListContainer,
    getUpdatedList,
    cancelModal,
    getListAttributes,
    getSearchResult,
    getSortedValue,
  } = AppMethods;

  const { rootContainer } = Components;

  // ****State****
  let todoList = getItemFromLocalStorage("todoList") ?? [];
  let filters = {
    name: "",
    isName: false,
    date: "past",
    isDate: false,
  };

  // ****Event Listeners****

  // Event for global Search
  rootContainer.addEventListener("input", (event) => {
    if (event.target.id === "search-box") {
      const result = getSearchResult(todoList, event.target.value);
      renderList(result);
    }
  });
  // Click event for buttons
  rootContainer.addEventListener("click", (event) => {
    event.stopPropagation();
    /**
     * This will have five events for:
     * 1. Adding a new list
     * 2. Adding a new card
     * 3. Deleting a List
     * 4. Deleting a card
     * 5. Marking card as favoriate
     */
    const buttonEvent = event.target;
    if (buttonEvent.nodeName === "BUTTON") {
      const cardId = buttonEvent.attributes?.cardid?.value;
      const listId = buttonEvent.attributes?.listid?.value;
      const params = {
        listId,
        cardId,
      };
      switch (buttonEvent.className) {
        case "add-list-button":
          renderModal("List");
          break;
        case "add-card-button":
          renderModal("Card", listId);
          break;
        case "cancel-modal-button":
          cancelModal();
          break;
        case "add-modal-button":
          const title = document.getElementById("title-input");
          const description = document.getElementById("description-input");
          if (title.value.length === 0) return alert("Enter title");
          if (listId === "") {
            const list = getListAttributes(todoList, title.value);
            if (list) {
              todoList.push(list);
              updateList(todoList);
              cancelModal();
            } else {
              alert("Enter another title");
            }
          } else {
            params.title = title.value;
            params.description = description.value;
            params.type = "AddCard";
            todoList = getUpdatedList(todoList, params);
            updateList(todoList);
            cancelModal();
          }
          break;
        case "delete-list-button":
          const deleteList = confirm("Are you sure delete list?");
          if (deleteList) {
            const index = buttonEvent.attributes.listindex.value;
            todoList.splice(index, 1);
            updateList(todoList);
          }
          break;
        case "delete-card-button":
          const deleteCard = confirm("Are you sure delete card?");
          if (deleteCard) {
            params.type = "RemoveCard";
            todoList = getUpdatedList(todoList, params);
            updateList(todoList);
          }
          break;
        case "favourite-button":
          params.type = "MarkCardAsFavourite";
          todoList = getUpdatedList(todoList, params);
          updateList(todoList);
          break;
        default:
          console.log(buttonEvent);
          break;
      }
    }
  });
  /**
   * Drag and drop events for dragging card from one list
   * to another list.
   */
  rootContainer.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData(
      "text/plain",
      event.target.attributes.cardid.value
    );
    event.target.style.opacity = 0.5;
  });

  rootContainer.addEventListener("dragend", function (event) {
    // reset the transparency
    event.target.style.opacity = "";
  });

  rootContainer.addEventListener("dragover", function (event) {
    // prevent default to allow drop
    event.preventDefault();
  });

  rootContainer.addEventListener("dragenter", function (event) {
    if (event.target.className === "list-container") {
      event.target.style.background = "pink";
    }
  });

  rootContainer.addEventListener("dragleave", function (event) {
    if (event.target.className === "list-container") {
      event.target.style.background = "";
    }
  });

  rootContainer.addEventListener("drop", function (event) {
    const cardId = event.dataTransfer.getData("text");
    const draggedCard = document.querySelector(`[cardid= '${cardId}']`);
    const listBodyElement = getListContainer(event.target);
    if (listBodyElement.className === "list-body") {
      const listId = listBodyElement.attributes.listId.value;
      const params = {
        listId,
        cardId,
        type: "MoveCard",
      };
      todoList = getUpdatedList(todoList, params);
      updateList(todoList);
      event.target.style.background = "";
      draggedCard.parentNode.removeChild(draggedCard);
      listBodyElement.appendChild(draggedCard);
    }
  });

  rootContainer.addEventListener("change", (event) => {
    switch (event.target.name) {
      case "date-filter":
        filters.date = event.target.value;
        sortCards();
        break;
      case "name-filter":
        filters.name = event.target.value;
        sortCards();
        break;
      case "sortName":
        filters.isName = !filters.isName;
        sortCards();
        break;
      case "sortDate":
        filters.isDate = !filters.isDate;
        sortCards();
        break;
      default:
        break;
    }
  });

  // ****Methods****

  function updateList(list) {
    todoList = list;
    saveItemToLocalStorage("todoList", todoList);
    sortCards();
  }

  function sortCards() {
    const result = getSortedValue(todoList, filters);
    renderList(result);
  }

  // ****Mounting****
  renderHeader();
  renderList(todoList);
  sortCards();
})();
