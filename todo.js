const form = document.querySelector('#todo-form');
const todosList = document.querySelector('.todos-list');
const clearAll = document.querySelector('.clear');
const todoInput = document.querySelector('#todo');
const cardTodo = document.querySelector('.todos');
let remaining = document.querySelector('.remaining');
let total = document.querySelector('.total');

loadAllEventListeners();

function loadAllEventListeners() {
  document.addEventListener('DOMContentLoaded', verify);
  form.addEventListener('submit', addTodo);
  todosList.addEventListener('click', removeTodo);
  clearAll.addEventListener('click', removeAll);
  cardTodo.addEventListener('click', toggleBox);
}

function verify() {
  if (localStorage.getItem('todos')) {
    total.textContent = JSON.parse(localStorage.getItem('todos')).length;
    remaining.textContent = JSON.parse(localStorage.getItem('remaining')).length;
    getTodos();
  } else {
    remaining.textContent = 0;
    total.textContent = 0;
  }
  if (!parseInt((total.textContent))) todosList.style.display = 'none';
}

function getTodos() {
  let todos = JSON.parse(localStorage.getItem('todos'));
  let remaining = JSON.parse(localStorage.getItem('remaining'));

  todos.forEach(todo => {
    if (remaining.includes(todo)) {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.innerHTML = `
        <label>
          <input type="checkbox" />
          <span id="check">${todo}</span>
        </label>
        <a class="secondary-content">
          <i class="fas fa-trash-alt"></i>
        </a>
      `;
      todosList.insertBefore(li, document.querySelector('.clearall'));
    } else {
      const li = document.createElement('li'); 
      li.className = 'collection-item';
      const label = document.createElement('label'); //materialize is trash
      const input = document.createElement('input');
      input.type = "checkbox";
      input.checked = true;
      label.appendChild(input);
      const span = document.createElement('span');
      span.id = "check";
      span.className = 'complete';
      span.textContent = todo;
      label.appendChild(span);
      const a = document.createElement('a');
      a.className = "secondary-content";
      const i = document.createElement('i');
      i.className = "fas fa-trash-alt";
      a.appendChild(i);
      li.appendChild(label);
      li.appendChild(a);
      todosList.insertBefore(li, document.querySelector('.clearall'));
    }
  })
}

function addTodo(e) {
  if (todoInput.value.length) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.innerHTML = `
    <label>
      <input type="checkbox" />
      <span id="check">${todoInput.value}</span>
    </label>
    <a class="secondary-content">
      <i class="fas fa-trash-alt"></i>
    </a>
    `;
    todosList.insertBefore(li, document.querySelector('.clearall'));
    if (todosList.style.display === 'none') todosList.style.display = 'block';
    remaining.textContent = parseInt(remaining.textContent) + 1;
    total.textContent = parseInt(total.textContent) + 1;
    addToLocalStorage('todos', todoInput.value);
    addToLocalStorage('remaining', todoInput.value);
  }
  todoInput.value = '';
  e.preventDefault();
}

function removeTodo(e) {
  if (e.target.className === 'fas fa-trash-alt') {
    const span = e.target.parentElement.previousElementSibling.lastElementChild;
    removeFromLocalStorage('todos', span.textContent);
    removeFromLocalStorage('remaining', span.textContent);
    remaining.textContent = JSON.parse(localStorage.getItem('remaining')).length;
    total.textContent = JSON.parse(localStorage.getItem('todos')).length;
    e.target.parentElement.parentElement.remove();
    if (parseInt(total.textContent) === 0) {
      remaining.textContent = '0';
      todosList.style.display = 'none';
    }
  }
}

function removeAll() {
  if (todosList.firstElementChild.className.includes('clearall')) {
    todosList.style.display = 'none';
    remaining.textContent = 0;
    total.textContent = 0;
    localStorage.clear();
    return;
  }
  else {
    todosList.firstElementChild.remove();
    removeAll();
  }
}

function toggleBox(e) {
  if (e.target.id === 'check') {
    const span = e.target;
    if (span.previousElementSibling.checked) {
      span.className = '';
      addToLocalStorage('remaining', span.textContent);
      remaining.textContent = JSON.parse(localStorage.getItem('remaining')).length;
    } else {
      span.className = 'complete';
      removeFromLocalStorage('remaining', span.textContent);
      if (!localStorage.getItem('remaining')) {
        remaining.textContent = "0";
      } else {
        remaining.textContent = JSON.parse(localStorage.getItem('remaining')).length;
      }
    }
  }
}

function addToLocalStorage(type, todo) {
  let todos = [];
  if (localStorage.getItem(type)) todos = JSON.parse(localStorage.getItem(type));
  todos.push(todo);
  localStorage.setItem(type, JSON.stringify(todos));
}

function removeFromLocalStorage(type, todo) {
  let todos = JSON.parse(localStorage.getItem(type));
  for (let i = 0; i < todos.length; i++) {
    if (todos[i] === todo) {
      todos.splice(i, 1);
      break;
    }
  }
  localStorage.setItem(type, JSON.stringify(todos));
}