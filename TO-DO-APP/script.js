let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Elements
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterTasks = document.getElementById("filterTasks");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const todayTasks = document.getElementById("todayTasks");
const progressBar = document.getElementById("progressBar");

// Add Task
addTaskBtn.onclick = () => {
  if (taskInput.value.trim() === "") return alert("Please enter a task");

  let today = new Date().toISOString().split("T")[0];

  tasks.push({
    text: taskInput.value,
    date: taskDate.value ? taskDate.value : today, // default today
    priority: taskPriority.value,
    completed: false
  });

  taskInput.value = "";
  taskDate.value = "";
  taskPriority.value = "Medium";

  saveTasks();
  renderTasks();
};

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  let search = searchTask.value.toLowerCase();
  let filter = filterTasks.value;

  let filtered = tasks.filter(task => {
    let match = task.text.toLowerCase().includes(search);

    if (filter === "completed" && !task.completed) return false;
    if (filter === "pending" && task.completed) return false;
    if (filter === "today") {
      let today = new Date().toISOString().split("T")[0];
      if (task.date !== today) return false;
    }
    return match;
  });

  filtered.forEach((task, index) => {
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
        <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
        <span class="badge bg-secondary ms-2">${formatDate(task.date)}</span>
        <span class="badge bg-info text-dark ms-2">${task.priority}</span>
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-1" onclick="editTask(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateDashboard();
}

// Format Date
function formatDate(dateStr) {
  if (!dateStr) return "No Date";
  let d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

// Toggle Complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(index) {
  let newText = prompt("Edit Task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Update Dashboard
function updateDashboard() {
  totalTasks.innerText = tasks.length;
  completedTasks.innerText = tasks.filter(t => t.completed).length;
  pendingTasks.innerText = tasks.filter(t => !t.completed).length;

  let today = new Date().toISOString().split("T")[0];
  todayTasks.innerText = tasks.filter(t => t.date === today).length;

  let progress = tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
  progressBar.style.width = progress.toFixed(0) + "%";
  progressBar.innerText = progress.toFixed(0) + "%";
}

// Dark/Light Mode
document.getElementById("toggleDarkMode").onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
};

// Search & Filter Events
searchTask.addEventListener("input", renderTasks);
filterTasks.addEventListener("change", renderTasks);

// Initial Load
renderTasks();
