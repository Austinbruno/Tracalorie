// Storage Controller
const StorageCtrl = (function () {
  // Public Methods
  const ITEM_KEY = "items";
  return {
    storeItem: function (item) {
      let items;
      // check if any item in localstorage
      if (localStorage.getItem(ITEM_KEY) === null) {
        items = [];
        // Push a new item
        items.push(item);
        // set localstorage
        localStorage.setItem(ITEM_KEY, JSON.stringify(items));
      } else {
        // Get what is already in local storage
        items = JSON.parse(localStorage.getItem(ITEM_KEY));

        // Push new Item
        items.push(item);
        // Reset local storage
        localStorage.setItem(ITEM_KEY, JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem(ITEM_KEY) === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem(ITEM_KEY));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem(ITEM_KEY));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem(ITEM_KEY, JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem(ITEM_KEY));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem(ITEM_KEY, JSON.stringify(items));
    },
    clearItemFromStorage: function () {
      localStorage.removeItem(ITEM_KEY);
    },
  };
})();
// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / state
  const data = {
    // items: [
    //   // { id: 0, name: "Rice and Stew", calories: 1200 },
    //   // { id: 1, name: "Beans", calories: 200 },
    //   // { id: 2, name: "Bread", calories: 100 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public method
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // Craete ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through Items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    delteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    clearAllItems: function () {
      data.items = [];
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      // Loop through items and add calories
      data.items.forEach(function (item) {
        total += item.calories;
      });

      // Set data calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list ",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  // Public Return
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
        </li>`;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show The lIst
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li Element
      const li = document.createElement("li");

      // Add class
      li.className = "collection-item";

      // Add ID
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;

      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list to Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (UICtrl, StorageCtrl, ItemCtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // get UISelectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable Submit On Enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update Item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    //Delete Item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back btn event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear Btn Item event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault();
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add Item to List
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total colories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localstorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }
  };

  // Click Edit Item
  const itemEditClick = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      // Get List Item id (id: 0, id:1, id: 2)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get the Actual ID
      const id = parseInt(listIdArr[1]);

      // Get Item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add Item to form
      UICtrl.addItemToForm();
    }
  };

  // Update item Submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    e.preventDefault();
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);
    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total colories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
  };

  // Delete Button event
  const itemDeleteSubmit = function (e) {
    e.preventDefault();

    // Get current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from Data Structure
    ItemCtrl.delteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total colories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    // // Remove from UI
    // UICtrl.removeItems();
  };

  // Clear btn event
  const clearAllItemsClick = function () {
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total colories to UI
    UICtrl.showTotalCalories(totalCalories);

    // // Remove from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemFromStorage();

    // Hide UL
    UICtrl.hideList();
  };

  // Public Methods
  return {
    init: function () {
      // Clear edit state
      UICtrl.clearEditState();
      // Fetch Items from data structure
      // let items = [];
      items = ItemCtrl.getItems() || [];

      // Check if any
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total colories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Load Event Listeners
      loadEventListeners();
    },
  };
})(UICtrl, StorageCtrl, ItemCtrl);

// Initialize App
App.init();
