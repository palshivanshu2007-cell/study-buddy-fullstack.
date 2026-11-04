
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://palshivanshu2007-cell.github.io"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "Public")));

const client = new MongoClient(process.env.MONGODB_URI);

let tasksCollection;

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find({}).toArray();

    res.json({
      tasks: tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        subject: task.subject,
        done: task.done
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load tasks." });
  }
});

// Add a task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Please enter a task name."
      });
    }

    const task = {
      title: title.trim(),
      subject: subject || "General",
      done: false
    };

    const result = await tasksCollection.insertOne(task);

    res.status(201).json({
      task: {
        id: result.insertedId.toString(),
        ...task
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add task." });
  }
});

// Update task completion
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    if (typeof req.body.done !== "boolean") {
      return res.status(400).json({ message: "Invalid task status." });
    }

    const objectId = new ObjectId(id);

    const result = await tasksCollection.updateOne(
      { _id: objectId },
      { $set: { done: req.body.done } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    const task = await tasksCollection.findOne({ _id: objectId });

    res.json({
      task: {
        id: task._id.toString(),
        title: task.title,
        subject: task.subject,
        done: task.done
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update task." });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete task." });
  }
});

// Serve the website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing.");
    }

    await client.connect();

    const database = client.db("studybuddy");
    tasksCollection = database.collection("tasks");

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Study Buddy running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
