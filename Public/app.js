// This file runs in the browser. It talks to our Express server through /api/tasks.
const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const subjectInput = document.querySelector("#task-subject");
const taskList = document.querySelector("#task-list");
const formMessage = document.querySelector("#form-message");
const listMessage = document.querySelector("#list-message");
const refreshButton = document.querySelector("#refresh-button");

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function updateStats(tasks) {
  const completed = tasks.filter((task) => task.done).length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#done-count").textContent = completed;
  document.querySelector("#progress-percent").textContent = `${percent}%`;
}

function renderTasks(tasks) {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No tasks yet. Add your first study task above!";
    taskList.append(empty);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("article");
    row.className = `task-item${task.done ? " is-done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.title} complete`);
    checkbox.addEventListener("change", () => changeTaskStatus(task.id, checkbox.checked));

    const copy = document.createElement("div");
    copy.className = "task-copy";
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;
    const subject = document.createElement("span");
    subject.className = "task-subject";
    subject.textContent = task.subject;
    copy.append(title, subject);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    row.append(checkbox, copy, deleteButton);
    taskList.append(row);
  });
}

async function loadTasks() {
  showMessage(listMessage, "");
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) throw new Error("The server could not load tasks.");
    const data = await response.json();
    renderTasks(data.tasks);
    updateStats(data.tasks);
  } catch (error) {
    showMessage(listMessage, "Could not connect to the API. Check that the server is running, then refresh.", true);
    taskList.replaceChildren();
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop the browser from reloading the page.
  showMessage(formMessage, "");

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value, subject: subjectInput.value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not add this task.");

    titleInput.value = "";
    showMessage(formMessage, "Task added. Nice work!");
    await loadTasks();
    titleInput.focus();
  } catch (error) {
    showMessage(formMessage, error.message, true);
  }
});

async function changeTaskStatus(id, done) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done })
    });
    if (!response.ok) throw new Error("Could not update task.");
    await loadTasks();
  } catch (error) {
    showMessage(listMessage, error.message, true);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Could not delete task.");
    showMessage(listMessage, "Task deleted.");
    await loadTasks();
  } catch (error) {
    showMessage(listMessage, error.message, true);
  }
}

refreshButton.addEventListener("click", loadTasks);
loadTasks(); // Fetch the starter tasks as soon as the page opens.
                
