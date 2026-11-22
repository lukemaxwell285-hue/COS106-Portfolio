// Academic planner: add, complete and delete tasks.
// Tasks live in an array of objects and are saved to localStorage.
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const dueInput = document.getElementById('task-due');
const errorBox = document.getElementById('task-error');
const list = document.getElementById('task-list');
const countBox = document.getElementById('task-count');
const emptyMsg = document.getElementById('empty-msg');
const clearBtn = document.getElementById('clear-done');

let tasks = loadTasks();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('planner-tasks')) || [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem('planner-tasks', JSON.stringify(tasks));
  } catch (e) { /* storage unavailable: tasks last for this visit only */ }
}

function addTask(text, due) {
  tasks.push({ id: Date.now(), text: text, due: due, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? { id: t.id, text: t.text, due: t.due, done: !t.done } : t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach(function (t) {
    const li = document.createElement('li');
    li.className = 'task' + (t.done ? ' done' : '');
    li.dataset.id = t.id;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = t.done;
    box.setAttribute('aria-label', 'Mark "' + t.text + '" as completed');

    const label = document.createElement('span');
    label.className = 'task-text';
    const strong = document.createElement('strong');
    strong.textContent = t.text;
    label.appendChild(strong);
    if (t.due) {
      const due = document.createElement('span');
      due.className = 'task-due';
      due.textContent = 'Due ' + t.due;
      label.appendChild(due);
    }

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'task-delete';
    del.textContent = 'Delete';

    li.append(box, label, del);
    list.appendChild(li);
  });

  const done = tasks.filter(function (t) { return t.done; }).length;
  countBox.textContent = tasks.length + (tasks.length === 1 ? ' task' : ' tasks') +
    ', ' + done + ' completed';
  emptyMsg.hidden = tasks.length > 0;
  clearBtn.disabled = done === 0;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    errorBox.textContent = 'Enter a task before adding it.';
    input.classList.add('invalid');
    input.focus();
    return;
  }
  errorBox.textContent = '';
  input.classList.remove('invalid');
  addTask(text, dueInput.value);
  form.reset();
  input.focus();
});

// One listener handles every checkbox and delete button in the list
list.addEventListener('click', function (e) {
  const li = e.target.closest('.task');
  if (!li) return;
  const id = Number(li.dataset.id);
  if (e.target.matches('input[type=checkbox]')) toggleTask(id);
  if (e.target.matches('.task-delete')) deleteTask(id);
});

clearBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  renderTasks();
});

renderTasks();
