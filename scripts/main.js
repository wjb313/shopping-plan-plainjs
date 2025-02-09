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
      this.initializeModalSystem();
      this.setupModalEvents();
    }
  
    initializeModalSystem() {
      this.modalTemplate = document.getElementById('modalTemplate');
      this.modalTypes = {
        confirmation: document.getElementById('confirmationModalContent'),
        dayPicker: document.getElementById('dayPickerModalContent'),
        menuItem: document.getElementById('menuItemModalContent'),
        addItem: document.getElementById('addItemModalContent')
      };
      
      // Create modal container
      let modalContainer = document.getElementById('modalContainer');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modalContainer';
        document.body.appendChild(modalContainer);
      }
      this.modalContainer = modalContainer;
    }
  
    setupModalEvents() {
      // Button triggers
      const addItemBtn = document.querySelector('[data-js-btn-add-item]');
      const clearBtn = document.querySelector('[data-js-btn-clear]');
      const reorderBtn = document.querySelector('[data-js-btn-reorder]');
      const clearCompletedBtn = document.querySelector('[data-js-btn-clear-completed]');
      const clearAllItemsBtn = document.querySelector('[data-js-btn-clear-all]');
      const editButtons = document.querySelectorAll('[data-js-edit-menu]');
      const notesButtons = document.querySelectorAll('[data-js-edit-notes]');
      
      // Setup event handlers
      addItemBtn?.addEventListener('click', () => {
        this.openModal('addItem', {
          title: 'New Item',
          onSubmit: (formData) => this.handleAddItemSubmit(formData)
        });
      });
  
      clearBtn?.addEventListener('click', () => {
        this.openModal('confirmation', {
          title: 'Clear Menu',
          message: 'Are you sure you want to clear all menu items?',
          onConfirm: () => this.handleClearAll()
        });
      });
  
      reorderBtn?.addEventListener('click', () => {
        this.openModal('dayPicker', {
          title: 'Choose Start Day',
          onDaySelect: (day) => this.handleDayReorder(day)
        });
      });
  
      clearCompletedBtn?.addEventListener('click', () => {
        this.openModal('confirmation', {
          title: 'Clear Completed Items',
          message: 'Are you sure you want to clear completed items?',
          onConfirm: () => this.handleClearCompleted()
        });
      });
  
      clearAllItemsBtn?.addEventListener('click', () => {
        this.openModal('confirmation', {
          title: 'Clear All Items',
          message: 'Are you sure you want to clear all shopping list items?',
          onConfirm: () => this.handleClearAllItems()
        });
      });
  
      editButtons.forEach(button => {
        button.addEventListener('click', e => {
          const dayId = e.target.dataset.jsEditMenu;
          this.openModal('menuItem', {
            title: `${this.state.days[parseInt(dayId.slice(-1)) - 1]} Menu Items`,
            dayId,
            onSubmit: (formData) => this.handleMenuEdit(dayId, formData)
          });
        });
      });
  
      notesButtons.forEach(button => {
        button.addEventListener('click', e => {
          const dayId = e.target.dataset.jsEditNotes;
          this.openModal('menuItem', {
            title: `${this.state.days[parseInt(dayId.slice(-1)) - 1]} Notes`,
            dayId,
            mode: 'notes',
            onSubmit: (notes) => this.handleNotesEdit(dayId, notes)
          });
        });
      });
    }
  
    createModal(type, options = {}) {
      const modalClone = this.modalTemplate.content.cloneNode(true);
      const modal = modalClone.querySelector('.modal');
      const modalId = `modal-${Date.now()}`;
      modal.id = modalId;
      
      // Set title
      if (options.title) {
        modalClone.querySelector('[data-js-modal-title]').textContent = options.title;
      }
      
      // Clone and insert content
      const contentTemplate = this.modalTypes[type];
      if (contentTemplate) {
        const contentClone = contentTemplate.content.cloneNode(true);
        
        // Set up form handlers if needed
        if (options.onSubmit) {
          const form = contentClone.querySelector('form');
          if (form) {
            form.addEventListener('submit', e => {
              e.preventDefault();
              const formData = new FormData(form);
              options.onSubmit(Object.fromEntries(formData));
              this.closeModal(modalId);
            });
          }
        }
        
        // Set up confirmation handlers
        if (options.onConfirm) {
          const confirmBtn = contentClone.querySelector('[data-js-confirm-yes]');
          confirmBtn?.addEventListener('click', () => {
            options.onConfirm();
            this.closeModal(modalId);
          });
        }
        
        // Set up day selection handlers
        if (options.onDaySelect) {
          const dayOptions = contentClone.querySelectorAll('.clickableDays');
          dayOptions.forEach(option => {
            option.addEventListener('click', () => {
              options.onDaySelect(option.textContent);
              this.closeModal(modalId);
            });
          });
        }
        
        modalClone.querySelector('[data-js-modal-body]').appendChild(contentClone);
      }
      
      // Set up close handlers
      const closeButtons = modalClone.querySelectorAll('[data-js-modal-close]');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => this.closeModal(modalId));
      });
      
      this.modalContainer.appendChild(modalClone);
      return modalId;
    }
  
    openModal(type, options = {}) {
      const modalId = this.createModal(type, options);
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
      
      // Focus first input if it exists
      const firstInput = modal.querySelector('input, select, textarea');
      firstInput?.focus();
      
      return modalId;
    }
  
    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        modal.remove();
      }
    }
  
    // Handler Methods
    handleClearAll() {
      Object.keys(this.state.dinnerMenu).forEach(day => {
        this.state.dinnerMenu[day] = {
          main: '', side1: '', side2: '', other: '', notes: ''
        };
      });
      localStorage.setItem(STORAGE_KEYS.DINNER_MENU, JSON.stringify(this.state.dinnerMenu));
      document.dispatchEvent(new CustomEvent('menuUpdated'));
    }
  
    handleClearCompleted() {
      this.state.shoppingList = this.state.shoppingList.filter(item => !item.complete);
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
      document.dispatchEvent(new CustomEvent('listUpdated'));
    }
  
    handleClearAllItems() {
      this.state.shoppingList = [];
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
      document.dispatchEvent(new CustomEvent('listUpdated'));
    }
  
    handleMenuEdit(dayId, formData) {
      this.state.dinnerMenu[dayId] = {
        main: formData.main || '',
        side1: formData.side1 || '',
        side2: formData.side2 || '',
        other: formData.other || '',
        notes: formData.notes || ''
      };
      localStorage.setItem(STORAGE_KEYS.DINNER_MENU, JSON.stringify(this.state.dinnerMenu));
      document.dispatchEvent(new CustomEvent('menuUpdated'));
    }
  
    handleNotesEdit(dayId, notes) {
      this.state.dinnerMenu[dayId].notes = notes;
      localStorage.setItem(STORAGE_KEYS.DINNER_MENU, JSON.stringify(this.state.dinnerMenu));
      document.dispatchEvent(new CustomEvent('menuUpdated'));
    }
  
    handleDayReorder(selectedDay) {
      const currentIndex = this.state.days.indexOf(selectedDay);
      this.state.days = [
        ...this.state.days.slice(currentIndex),
        ...this.state.days.slice(0, currentIndex)
      ];
      localStorage.setItem(STORAGE_KEYS.CURRENT_DOTW, JSON.stringify(this.state.days));
      document.dispatchEvent(new CustomEvent('daysUpdated'));
    }
  
    handleAddItemSubmit(formData) {
      const newItem = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        quantity: parseInt(formData.quantity) || 1,
        units: formData.units,
        complete: false
      };
      
      this.state.shoppingList.push(newItem);
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(this.state.shoppingList));
      document.dispatchEvent(new CustomEvent('listUpdated'));
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