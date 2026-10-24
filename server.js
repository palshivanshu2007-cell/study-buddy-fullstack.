// Study Buddy: a small Express API + static frontend.
// Start it with: npm install && npm start

require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Lets the server read JSON request bodies.
app.use(express.static(path.join(__dirname, "public"))); // Serves the website.

// In-memory starter data. It resets when the server restarts.
// A database can be added later as a next step.
let nextId = 4;
let tasks = [
  { id: 1, title: "Revise C programming basics", subject: "Programming", done: false },
  { id: 2, title: "Practise binary conversion", subject: "Digital Electronics", done: true },
  { id: 3, title: "Read one UPSC topic", subject: "General Studies", done: false }
];

// GET: return all tasks.
app.get("/api/tasks", (req, res) => {
  res.json({ success: true, tasks });
});

// POST: create a task after validating the input.
app.post("/api/tasks", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";

  if (!title) {
    return res.status(400).json({ success: false, message: "Please enter a task title." });
  }

  const task = {
    id: nextId++,
    title: title.slice(0, 120),
    subject: (subject || "General").slice(0, 50),
    done: false
  };

  tasks.unshift(task);
  res.status(201).json({ success: true, task });
});

// PATCH: toggle a task's completed status.
app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  task.done = Boolean(req.body.done);
  res.json({ success: true, task });
});

// DELETE: remove a task.
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = tasks.length;
  tasks = tasks.filter((item) => item.id !== id);

  if (tasks.length === oldLength) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  res.json({ success: true, message: "Task deleted." });
});

// Friendly fallback for API routes that do not exist.
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

app.listen(PORT, () => {
  console.log(`Study Buddy is running at http://localhost:${PORT}`);
});
