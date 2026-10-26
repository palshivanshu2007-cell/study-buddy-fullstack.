
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "Public")));

let tasks = [];
let nextId = 1;

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json({ tasks });
});

// Add a task
app.post("/api/tasks", (req, res) => {
  const { title, subject } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Please enter a task name."
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    subject: subject || "General",
    done: false
  };

  tasks.push(task);
  res.status(201).json({ task });
});

// Update task completion
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  if (typeof req.body.done === "boolean") {
    task.done = req.body.done;
  }

  res.json({ task });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found."
    });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted." });
});

// Serve the website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Study Buddy running on port ${PORT}`);
});
