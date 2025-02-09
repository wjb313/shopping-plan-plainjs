// Storage keys for consistent localStorage access
const STORAGE_KEYS = {
  SHOPPING_LIST: 'shopping.list',
  CURRENT_PAGE: 'current.page',
  CURRENT_DOTW: 'current.dotw',
  DINNER_MENU: 'dinnermenu.plan'
};

class AppState {
  constructor() {
    this.currentEditDay = null;
    this.currentEditDayNumber = null;
    this.currentDayDisplay = null;
    this.editItemId = null;
    this.days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.shoppingList = [];
    this.dinnerMenu = this.createInitialDinnerMenu();
  }

  createInitialDinnerMenu() {
    const menu = {};
    for (let i = 1; i <= 7; i++) {
      menu[`day${i}`] = {
        main: '',
        side1: '',
        side2: '',
        other: '',
        notes: ''
      };
    }
    return menu;
  }

  loadFromStorage() {
    try {
      const storedMenu = localStorage.getItem(STORAGE_KEYS.DINNER_MENU);
      if (storedMenu) {
        this.dinnerMenu = JSON.parse(storedMenu);
      }

      const storedDays = localStorage.getItem(STORAGE_KEYS.CURRENT_DOTW);
      if (storedDays) {
        this.days = JSON.parse(storedDays);
      }

      const storedList = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (storedList) {
        this.shoppingList = JSON.parse(storedList);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }
}

class UIController {
  constructor(state) {
    this.state = state;
    this.initializeTemplates();  // Add this new line
    this.initializeElements();
    this.setupEventListeners();
  }
  
  initializeTemplates() {
    // Insert navigation into both views
    const navTemplate = document.getElementById('navigationTemplate');
    const navContainers = document.querySelectorAll('[data-js-nav-container]');
    navContainers.forEach(container => {
      const navClone = navTemplate.content.cloneNode(true);
      container.appendChild(navClone);
    });
  
    // Generate day containers
    this.generateDayContainers();
  }
  
  generateDayContainers() {
    const daysContainer = document.querySelector('[data-js-days-container]');
    const dayTemplate = document.getElementById('dayTemplate');
    
    for (let i = 1; i <= 7; i++) {
      const dayClone = dayTemplate.content.cloneNode(true);
      
      // Replace all instances of 'dayX' with the actual day number
      dayClone.querySelectorAll('[data-js-dotw="dayX"], [data-js-menu-box-X], [data-js-droppable="dayX"], [data-js-main="dayX"], [data-js-side1="dayX"], [data-js-side2="dayX"], [data-js-other="dayX"], [data-js-edit-notes="dayX"], [data-js-notes-span="dayX"], [data-js-draggable="dayX"], [data-js-edit-menu="dayX"]')
        .forEach(element => {
          const attrs = element.getAttributeNames();
          attrs.forEach(attr => {
            if (element.getAttribute(attr).includes('dayX')) {
              element.setAttribute(attr, element.getAttribute(attr).replace('dayX', `day${i}`));
            }
          });
        });
      
      daysContainer.appendChild(dayClone);
    }
  }

  initializeElements() {
    this.elements = {
      dmpDisplay: document.querySelector('[data-js-dmp-display]'),
      sliDisplay: document.querySelector('[data-js-sli-display]'),
      dmpLinks: document.querySelectorAll('[data-js-nav-to-dinner]'),
      sliLinks: document.querySelectorAll('[data-js-nav-to-shopping-list]'),
      listBody: document.querySelector('[data-js-list-body]'),
      listCount: document.querySelector('[data-js-list-count]')
    };
  }

  setupEventListeners() {
    // Navigation
    this.elements.dmpLinks.forEach(link => 
      link.addEventListener('click', () => this.navigateTo('dmp')));
    this.elements.sliLinks.forEach(link => 
      link.addEventListener('click', () => this.navigateTo('sli')));
    
    // List item events
    this.elements.listBody?.addEventListener('click', e => this.handleListItemClick(e));
  }

  navigateTo(page) {
    if (page === 'dmp') {
      this.elements.dmpDisplay.style.display = 'flex';
      this.elements.sliDisplay.style.display = 'none';
    } else {
      this.elements.dmpDisplay.style.display = 'none';
      this.elements.sliDisplay.style.display = 'flex';
    }
    this.saveCurrentPage();
  }

  saveCurrentPage() {
    const pageState = [
      this.elements.dmpDisplay.style.display,
      this.elements.sliDisplay.style.display
    ];
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, JSON.stringify(pageState));
  }

  handleListItemClick(e) {
    if (e.target.tagName.toLowerCase() === 'input') {
      const selectedItem = this.state.shoppingList.find(item => item.id === e.target.id);
      if (selectedItem) {
        selectedItem.complete = e.target.checked;
        localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
        this.updateListCount();
      }
    }
  }

  renderShoppingList() {
    const { listBody } = this.elements;
    listBody.innerHTML = '';

    this.state.shoppingList.forEach((item, index) => {
      const listItem = this.createListItem(item, index);
      listBody.appendChild(listItem);
    });

    this.updateListCount();
  }

  createListItem(item, index) {
    const template = document.querySelector('#listItemTemplate');
    const listItem = document.importNode(template.content, true);
    
    const checkbox = listItem.querySelector('input');
    const label = listItem.querySelector('label');
    const editButton = listItem.querySelector('.sliEdit');
    
    checkbox.id = item.id;
    checkbox.checked = item.complete;
    label.htmlFor = item.id;
    editButton.dataset.itemId = item.id;
    
    label.appendChild(this.formatListItemText(item));

    if (index % 2 === 0) {
      const container = listItem.querySelector('.listItem');
      container.style.background = '#6b7a66';
      container.style.color = 'white';
      checkbox.className = 'sliCheckboxEven';
    }
    
    return listItem;
  }

  formatListItemText(item) {
    const { name, quantity, units } = item;
    let text = name;
    
    if (quantity > 1) {
      text += `, ${quantity}`;
      if (units) {
        text += ` ${units}${units === 'box' ? 'es' : 's'}`;
      }
    } else if (units) {
      text += `, ${quantity} ${units}`;
    }
    
    return document.createTextNode(text);
  }

  updateListCount() {
    const remaining = this.state.shoppingList.filter(item => !item.complete).length;
    const itemText = remaining === 1 ? 'item' : 'items';
    this.elements.listCount.textContent = `${remaining} ${itemText} remaining`;
  }
}

class MenuManager {
    constructor(state) {
      this.state = state;
      this.initializeMenuElements();
      this.setupDragAndDrop();
    }
  
    initializeMenuElements() {
      this.elements = {
        dayContainers: document.querySelectorAll('[data-js-dotw]'),
        menuItems: document.querySelectorAll('.allMenuItems'),
        mainDishes: document.querySelectorAll('[data-js-main]'),
        sides1: document.querySelectorAll('[data-js-side1]'),
        sides2: document.querySelectorAll('[data-js-side2]'),
        others: document.querySelectorAll('[data-js-other]'),
        notes: document.querySelectorAll('[data-js-notes-span]'),
        editButtons: document.querySelectorAll('[data-js-edit-menu]')
      };
    }
  
    setupDragAndDrop() {
      const draggables = document.querySelectorAll('[data-js-draggable]');
      const dropZones = document.querySelectorAll('[data-js-droppable]');
  
      draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', e.target.dataset.jsDraggable);
        });
      });
  
      dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragover', e => {
          const dataTo = dropZone.dataset.jsDroppable;
          if (e.dataTransfer.getData('text/plain') !== dataTo) {
            e.preventDefault();
          }
        });
  
        dropZone.addEventListener('drop', e => this.handleDrop(e));
      });
    }
  
    handleDrop(e) {
      e.preventDefault();
      const dataFrom = e.dataTransfer.getData('text/plain');
      const dataTo = e.currentTarget.dataset.jsDroppable;
  
      // Swap menu items
      const tempContent = { ...this.state.dinnerMenu[dataFrom] };
      this.state.dinnerMenu[dataFrom] = this.state.dinnerMenu[dataTo];
      this.state.dinnerMenu[dataTo] = tempContent;
  
      this.saveAndRenderMenu();
    }
  
    renderMenu() {
      // Update day labels
      this.elements.dayContainers.forEach((container, index) => {
        const day = this.state.days[index];
        container.textContent = day.charAt(0);
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = day;
        container.appendChild(tooltip);
      });
  
      // Update menu items
      this.elements.menuItems.forEach(item => {
        let dayId;
        let content = '';
  
        if (item.dataset.jsMain) {
          dayId = item.dataset.jsMain;
          content = this.state.dinnerMenu[dayId].main;
        } else if (item.dataset.jsSide1) {
          dayId = item.dataset.jsSide1;
          content = this.state.dinnerMenu[dayId].side1;
        } else if (item.dataset.jsSide2) {
          dayId = item.dataset.jsSide2;
          content = this.state.dinnerMenu[dayId].side2;
        } else if (item.dataset.jsOther) {
          dayId = item.dataset.jsOther;
          content = this.state.dinnerMenu[dayId].other;
        } else if (item.dataset.jsNotesSpan) {
          dayId = item.dataset.jsNotesSpan;
          content = this.state.dinnerMenu[dayId].notes;
        }
  
        item.textContent = content;
      });
  
      this.updateEditButtons();
    }
  
    updateEditButtons() {
      this.elements.editButtons.forEach((button, index) => {
        const dayId = `day${index + 1}`;
        const hasContent = this.state.dinnerMenu[dayId].main !== '';
        button.textContent = hasContent ? 'Edit' : 'Add';
      });
    }
  
    saveAndRenderMenu() {
      localStorage.setItem(STORAGE_KEYS.DINNER_MENU, JSON.stringify(this.state.dinnerMenu));
      this.renderMenu();
    }
  }

class ModalController {
  constructor(state) {
  this.state = state;
  this.initializeModalSystem();  // Add this line
  this.initializeModals();
  this.setupModalEvents();
}

// Add this as a new method in your ModalController class
  initializeModalSystem() {
    this.modalTemplate = document.getElementById('modalTemplate');
    this.modalTypes = {
      confirmation: document.getElementById('confirmationModalContent'),
      dayPicker: document.getElementById('dayPickerModalContent'),
      menuItem: document.getElementById('menuItemModalContent'),
      addItem: document.getElementById('addItemModalContent')
    };
    
    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modalContainer';
      document.body.appendChild(modalContainer);
    }
    this.modalContainer = modalContainer;
  }

  createModal(type, options = {}) {
    console.log('Creating modal of type:', type);
    console.log('Template:', this.modalTemplate);
    console.log('Content template:', this.modalTypes[type]);
    // Clone the base modal template
    const modalClone = this.modalTemplate.content.cloneNode(true);
    const modal = modalClone.querySelector('.modal');
    
    // Set unique ID for the modal
    const modalId = `modal-${Date.now()}`;
    modal.id = modalId;
    
    // Set the title if provided
    if (options.title) {
      modalClone.querySelector('[data-js-modal-title]').textContent = options.title;
    }
    
    // Clone and insert the specific content template
    const contentTemplate = this.modalTypes[type];
    if (contentTemplate) {
      const contentClone = contentTemplate.content.cloneNode(true);
      modalClone.querySelector('[data-js-modal-body]').appendChild(contentClone);
    }
    
    // Add to the DOM
    this.modalContainer.appendChild(modalClone);
    
    return modalId;
  }

  openModal(type, options = {}) {
    console.log('Opening modal with type:', type, 'and options:', options);
    const modalId = this.createModal(type, options);
    console.log('Created modal with ID:', modalId);
    const modal = document.getElementById(modalId);
    console.log('Found modal element:', modal);
    const modalId = this.createModal(type, options);
    const modal = document.getElementById(modalId);
    
    // Set up close handlers
    const closeButtons = modal.querySelectorAll('[data-js-modal-close]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.closeModal(modalId));
    });
    
    // Set up any custom handlers
    if (options.onConfirm) {
      const confirmButton = modal.querySelector('[data-js-confirm-yes]');
      confirmButton?.addEventListener('click', () => {
        options.onConfirm();
        this.closeModal(modalId);
      });
    }
    
    if (options.onCancel) {
      const cancelButton = modal.querySelector('[data-js-confirm-no]');
      cancelButton?.addEventListener('click', () => {
        options.onCancel();
        this.closeModal(modalId);
      });
    }
    
    // Show the modal
    modal.style.display = 'block';
    
    // Focus the first input if it exists
    const firstInput = modal.querySelector('input, select, textarea');
    firstInput?.focus();
    
    return modalId;
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      modal.remove(); // Remove from DOM since we create new ones each time
    }
  }

  initializeModals() {
    this.modals = {
      dinnerMenu: {
        element: document.querySelector('[data-js-dmp-modal]'),
        header: document.querySelector('[data-js-dmp-modal-header]'),
        form: document.querySelector('[data-js-dmp-modal] form'),
        closeBtn: document.querySelector('[data-js-dmp-modal-close]'),
        submitBtn: document.querySelector('[data-js-new-item-submit]'),
        inputs: {
          main: document.querySelector('[data-js-input-one="main"]'),
          side1: document.querySelector('[data-js-input-two="side1"]'),
          side2: document.querySelector('[data-js-input-three="side2"]'),
          other: document.querySelector('[data-js-input-four="other"]'),
          notes: document.querySelector('[data-js-input-five="notes"]')
        }
      },
      notes: {
        element: document.querySelector('[data-js-notes-modal]'),
        header: document.querySelector('[data-js-dmp-notes-modal-header]'),
        input: document.querySelector('[data-js-input-notes]'),
        closeBtn: document.querySelector('[data-js-notes-modal-close]'),
        submitBtn: document.querySelector('[data-js-notes-submit]')
      },
      addItem: {
        element: document.querySelector('[data-js-add-item-modal]'),
        form: document.querySelector('[data-js-add-item-form]'),
        closeBtn: document.querySelector('[data-js-add-item-close]'),
        inputs: {
          name: document.querySelector('[data-js-add-item-name]'),
          type: document.querySelector('[data-js-add-item-type]'),
          quantity: document.querySelector('[data-js-add-item-quantity]'),
          units: document.querySelector('[data-js-add-item-units]')
        }
      },
      clearAll: {
        element: document.querySelector('[data-js-clear-modal]'),
        yesBtn: document.querySelector('[data-js-clear-yes]'),
        noBtn: document.querySelector('[data-js-clear-no]')
      },
      reorder: {
        element: document.querySelector('[data-js-reorder-modal]'),
        closeBtn: document.querySelector('[data-js-reorder-modal-close]'),
        dayOptions: document.querySelectorAll('.clickableDays')
      },
      clearCompleted: {
        element: document.querySelector('[data-js-clear-completed-modal]'),
        yesBtn: document.querySelector('[data-js-clear-completed-yes]'),
        noBtn: document.querySelector('[data-js-clear-completed-no]')
      },
      noItems: {
        element: document.querySelector('[data-js-no-items-modal]'),
        closeBtn: document.querySelector('[data-js-no-items-close]')
      }
    };
  }

  setupModalEvents() {
    // Button triggers
    const addItemBtn = document.querySelector('[data-js-btn-add-item]');
    const clearBtn = document.querySelector('[data-js-btn-clear]');
    const reorderBtn = document.querySelector('[data-js-btn-reorder]');
    const clearCompletedBtn = document.querySelector('[data-js-btn-clear-completed]');
    const clearAllItemsBtn = document.querySelector('[data-js-btn-clear-all]');
    
    // Setup button click handlers
    addItemBtn?.addEventListener('click', () => this.openAddItemModal());
    clearBtn?.addEventListener('click', () => {
      this.openModal('confirmation', {
        title: 'Clear Menu',
        onConfirm: () => this.handleClearAll(),
        onCancel: () => {}
      });
    });
    reorderBtn?.addEventListener('click', () => this.openModal(this.modals.reorder.element));
    clearCompletedBtn?.addEventListener('click', () => this.handleClearCompletedClick());
    clearAllItemsBtn?.addEventListener('click', () => this.handleClearAllClick());
  
    // Comment out the old modal-specific events for now
    // this.setupDinnerMenuModalEvents();
    // this.setupNotesModalEvents();
    // this.setupAddItemModalEvents();
    // this.setupClearModalEvents();
    // this.setupReorderModalEvents();
    // this.setupClearCompletedModalEvents();
    // this.setupNoItemsModalEvents();
  }

    // Setup all modal-specific events
  //   this.setupDinnerMenuModalEvents();
  //   this.setupNotesModalEvents();
  //   this.setupAddItemModalEvents();
  //   this.setupClearModalEvents();
  //   this.setupReorderModalEvents();
  //   this.setupClearCompletedModalEvents();
  //   this.setupNoItemsModalEvents();
  // }

  setupDinnerMenuModalEvents() {
    const { dinnerMenu } = this.modals;
    dinnerMenu.closeBtn.addEventListener('click', e => this.handleModalClose(e, dinnerMenu.element));
    dinnerMenu.submitBtn.addEventListener('click', e => this.handleDinnerMenuSubmit(e));

    // Setup edit menu buttons
    const editButtons = document.querySelectorAll('[data-js-edit-menu]');
    editButtons.forEach(button => {
      button.addEventListener('click', e => this.handleMenuEdit(e));
    });
  }

  setupNotesModalEvents() {
    const { notes } = this.modals;
    notes.closeBtn.addEventListener('click', e => this.handleModalClose(e, notes.element));
    notes.submitBtn.addEventListener('click', e => this.handleNotesSubmit(e));

    // Setup notes buttons
    const notesButtons = document.querySelectorAll('[data-js-edit-notes]');
    notesButtons.forEach(button => {
      button.addEventListener('click', e => this.handleNotesEdit(e));
    });
  }

  setupAddItemModalEvents() {
    const { addItem } = this.modals;
    addItem.closeBtn.addEventListener('click', e => this.handleModalClose(e, addItem.element));
    addItem.form.addEventListener('submit', e => this.handleAddItemSubmit(e));
  }

  setupClearModalEvents() {
    const { clearAll } = this.modals;
    clearAll.yesBtn.addEventListener('click', () => this.handleClearAll());
    clearAll.noBtn.addEventListener('click', () => this.closeModal(clearAll.element));
  }

  setupReorderModalEvents() {
    const { reorder } = this.modals;
    reorder.closeBtn.addEventListener('click', () => this.closeModal(reorder.element));
    reorder.dayOptions.forEach(option => {
      option.addEventListener('click', e => this.handleDayReorder(e));
    });
  }

  setupClearCompletedModalEvents() {
    const { clearCompleted } = this.modals;
    clearCompleted.yesBtn.addEventListener('click', () => this.handleClearCompleted());
    clearCompleted.noBtn.addEventListener('click', () => this.closeModal(clearCompleted.element));
  }

  setupNoItemsModalEvents() {
    const { noItems } = this.modals;
    noItems.closeBtn.addEventListener('click', () => this.closeModal(noItems.element));
  }

  // Modal Operation Handlers
  handleMenuEdit(e) {
    const dayId = e.target.dataset.jsEditMenu;
    const dayNumber = parseInt(dayId.slice(-1));
    const dayName = this.state.days[dayNumber - 1];

    this.state.currentEditDay = dayId;
    this.state.currentEditDayNumber = dayNumber;
    this.state.currentDayDisplay = dayName;

    const { dinnerMenu } = this.modals;
    dinnerMenu.header.textContent = `${dayName} Menu Items`;

    Object.entries(dinnerMenu.inputs).forEach(([key, input]) => {
      input.value = this.state.dinnerMenu[dayId][key] || '';
    });

    this.openModal(dinnerMenu.element);
    dinnerMenu.inputs.main.focus();
  }

  handleNotesEdit(e) {
    const dayId = e.target.dataset.jsEditNotes;
    const dayNumber = parseInt(dayId.slice(-1));
    const dayName = this.state.days[dayNumber - 1];

    this.state.currentEditDay = dayId;
    this.modals.notes.header.textContent = `${dayName} Notes`;
    this.modals.notes.input.value = this.state.dinnerMenu[dayId].notes || '';

    this.openModal(this.modals.notes.element);
  }

  handleDinnerMenuSubmit(e) {
    e.preventDefault();
    
    const { dinnerMenu } = this.modals;
    const updatedContent = {};
    
    Object.entries(dinnerMenu.inputs).forEach(([key, input]) => {
      updatedContent[key] = input.value;
    });

    this.state.dinnerMenu[this.state.currentEditDay] = updatedContent;
    this.saveMenuAndClose(dinnerMenu.element);
  }

  handleNotesSubmit(e) {
    e.preventDefault();
    
    this.state.dinnerMenu[this.state.currentEditDay].notes = this.modals.notes.input.value;
    this.saveMenuAndClose(this.modals.notes.element);
  }

  handleDayReorder(e) {
    const selectedDay = e.target.textContent;
    const currentIndex = this.state.days.indexOf(selectedDay);
    
    const reorderedDays = [
      ...this.state.days.slice(currentIndex),
      ...this.state.days.slice(0, currentIndex)
    ];
    
    this.state.days = reorderedDays;
    localStorage.setItem(STORAGE_KEYS.CURRENT_DOTW, JSON.stringify(this.state.days));
    document.dispatchEvent(new CustomEvent('daysUpdated'));
    
    this.closeModal(this.modals.reorder.element);
  }

  handleClearAll() {
    Object.keys(this.state.dinnerMenu).forEach(day => {
      this.state.dinnerMenu[day] = {
        main: '', side1: '', side2: '', other: '', notes: ''
      };
    });
    
    this.saveMenuAndClose(this.modals.clearAll.element);
  }

  handleClearCompletedClick() {
    const completedItems = this.state.shoppingList.filter(item => item.complete);
    if (completedItems.length > 0) {
      this.openModal(this.modals.clearCompleted.element);
    } else {
      this.openModal(this.modals.noItems.element);
    }
  }

  handleClearAllClick() {
    if (this.state.shoppingList.length > 0) {
      this.openModal(this.modals.clearAll.element);
    } else {
      this.openModal(this.modals.noItems.element);
    }
  }

  handleClearCompleted() {
    this.state.shoppingList = this.state.shoppingList.filter(item => !item.complete);
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
    document.dispatchEvent(new CustomEvent('listUpdated'));
    this.closeModal(this.modals.clearCompleted.element);
  }

  handleAddItemSubmit(e) {
    e.preventDefault();
    
    const { inputs, form } = this.modals.addItem;
    const { name, type, quantity, units } = inputs;
    
    if (!name.value.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: name.value,
      type: type.value,
      quantity: parseInt(quantity.value) || 1,
      units: units.value,
      complete: false
    };

    if (form.dataset.jsAddItemForm === 'edit') {
      const index = this.state.shoppingList.findIndex(item => item.id === this.state.editItemId);
      if (index !== -1) {
        this.state.shoppingList[index] = { ...this.state.shoppingList[index], ...newItem };
      }
    } else {
      this.state.shoppingList.push(newItem);
    }

    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
    document.dispatchEvent(new CustomEvent('listUpdated'));
    
    this.resetAddItemForm();
    this.closeModal(this.modals.addItem.element);
  }

  // Helper Methods
  openModal(modal) {
    modal.style.display = 'block';
  }

  closeModal(modal) {
    modal.style.display = 'none';
  }

  handleModalClose(e, modal) {
    e.preventDefault();
    this.closeModal(modal);
  }

  openAddItemModal() {
    const { addItem } = this.modals;
    addItem.form.dataset.jsAddItemForm = 'new';
    this.openModal(addItem.element);
    addItem.inputs.name.focus();
  }

  resetAddItemForm() {
    const { inputs, form } = this.modals.addItem;
    inputs.name.value = '';
    inputs.type.value = '';
    inputs.quantity.value = '1';
    inputs.units.value = '';
    form.dataset.jsAddItemForm = 'new';
  }

  saveMenuAndClose(modalElement) {
    localStorage.setItem(STORAGE_KEYS.DINNER_MENU, JSON.stringify(this.state.dinnerMenu));
    document.dispatchEvent(new CustomEvent('menuUpdated'));
    this.closeModal(modalElement);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const state = new AppState();
  state.loadFromStorage();
  
  const ui = new UIController(state);
  const modals = new ModalController(state);
  const menuManager = new MenuManager(state);
  
  // Setup event listeners for state changes
  document.addEventListener('menuUpdated', () => menuManager.renderMenu());
  document.addEventListener('listUpdated', () => ui.renderShoppingList());
  document.addEventListener('daysUpdated', () => {
    menuManager.renderMenu();
    menuManager.setupDragAndDrop();
  });

  // Load stored page state
  if (localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE)) {
    const [dmpDisplay, sliDisplay] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE)
    );
    ui.elements.dmpDisplay.style.display = dmpDisplay;
    ui.elements.sliDisplay.style.display = sliDisplay;
  } else {
    ui.elements.dmpDisplay.style.display = 'flex';
    ui.elements.sliDisplay.style.display = 'none';
  }

  // Initial render
  menuManager.renderMenu();
  ui.renderShoppingList();
});