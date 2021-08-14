(() => {
  // ****Imports****
  const {
    getItemFromLocalStorage,
    renderHeader,
    renderList,
    saveItemToLocalStorage,
    renderModal,
    getListContainer,
  } = AppFunctions;

  const { rootContainer, getModal } = Components;

  // ****State****
  let todoList = getItemFromLocalStorage("todoList") ?? [];
  todoList = [
    {
      id: "!234",
      title: "Todo",
      cards: [
        {
          id: "112233",
          title: "Complete todo app",
          description: "Complete using vanilla js",
        },
        {
          id: "112235",
          title: "Complete on finish app",
          description: "Complete using vanilla js",
        },
      ],
    },
    {
      id: "!233",
      title: "In Progress",
      cards: [
        {
          id: "112237",
          title: "Complete on progress app",
          description: "Complete using vanilla js",
        },
      ],
    },
  ];

  updateList(todoList);

  function updateList(list) {
    todoList = list;
    saveItemToLocalStorage("todoList", todoList);
  }

  // ****Event Listeners****

  // Event for global Search
  rootContainer.addEventListener("input", (event) => {
    if (event.target.id === "search-box") console.log(event.target.value);
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
    if (event.target.nodeName === "BUTTON") {
      switch (event.target.className) {
        case "add-list-button":
          console.log("add list clicked");
          break;
        case "add-card-button":
          console.log("add card clicked");
          break;
        case "delete-list-button":
          console.log("delete list btn");
          break;
        case "delete-card-button":
          console.log("delete card clicked");
          break;
        case "favourite-button":
          console.log("Add to fav card");
          break;
        default:
          break;
      }
    }
  });
  /**
   * Drag and drop events for dragging card from one list
   * to another list.
   */
  rootContainer.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData(
      "text/plain",
      event.target.attributes.cardid.value
    );
  });

  rootContainer.addEventListener("dragover", function (event) {
    // prevent default to allow drop
    event.preventDefault();
  });

  rootContainer.addEventListener("dragenter", (event) => {
    if (event.target.className === "list-container") {
      event.target.style.background = "pink";
    }
  });

  rootContainer.addEventListener("dragleave", (event) => {
    if (event.target.className === "list-container") {
      event.target.style.background = "";
    }
  });

  rootContainer.addEventListener("drop", function (event) {
    // event.preventDefault();
    const cardId = event.dataTransfer.getData("text");
    const draggedCard = document.querySelector(`[cardid= '${cardId}']`);
    const listBodyElement = getListContainer(event.target);
    if (listBodyElement.className === "list-body") {
      const listId = listBodyElement.attributes.listId.value;
      console.log("cardId", cardId, "listId", listId);
      event.target.style.background = "";
      draggedCard.parentNode.removeChild(draggedCard);
      listBodyElement.appendChild(draggedCard);
    }
  });

  // ****Mounting****
  renderHeader();
  renderList(todoList);
  renderModal();
  console.log(todoList);
  console.log(utils.generateId());
})();
