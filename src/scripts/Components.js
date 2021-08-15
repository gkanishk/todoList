const Components = (function () {
  const rootContainer = document.querySelector("#root");
  const { getTimeAgo } = utils;

  const getHeader = () => {
    return `<nav id="navbar">
                <h1 id="page-title" draggable="true">Todo List</h1>
                <input id="search-box" type="text" placeholder="Search Card"/>
                <button class="add-list-button">+ Add List</button>
            </nav>`;
  };

  const getCard = (
    { id, title, description, isFavoriate, createdAt },
    listId
  ) => {
    return `<div class="card-container" cardId=${id} draggable="true" >
                <div class="card-header">
                    <span class="card-title">
                        ${title}
                    </span>
                    <div class="card-button-container">
                    <button class="favourite-button" cardid='${id}' listId='${listId}' title='Favourite'><i class='${
      isFavoriate ? "fas fa-star" : "far fa-star"
    }'></i></button>
                    <button class="delete-card-button"  cardid='${id}' listId='${listId}' title='Delete Cart'><i class="far fa-trash-alt"></i></button>
                    </div>
                </div>
                <p class="card-description">
                    ${description}
                </p>
                <span class="created-ago">Created ${getTimeAgo(
                  new Date(createdAt)
                )} ago</span>
            </div>`;
  };

  const getModal = (type = "List", listId = "") => {
    return `<div id='${type}-modal-container' class='modal'>
                <div class="modal-title">
                    Add ${type}
                </div>
                <div class="modal-body">
                    <label>
                        Title
                    </label>
                    <input type="text" id="title-input" placeholder="Enter Title" />
                    ${
                      type === "Card"
                        ? `<label>
                            Description
                        </label>
                        <textarea type="text" id="description-input" rows="6" placeholder="Enter description"></textarea>`
                        : ``
                    }
                </div>
                <div class="modal-footer">
                    <button class="cancel-modal-button" listid='${listId}'>Cancel</button>
                    <button class="add-modal-button" listid='${listId}'>Add</button>
                </div>
            </div>`;
  };

  return {
    getHeader,
    rootContainer,
    getCard,
    getModal,
  };
})();
