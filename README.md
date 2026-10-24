# Study Buddy — Beginner Full-Stack Project

Study Buddy is a small study-task tracker made with **HTML, CSS, JavaScript, Node.js, and Express**. It is intentionally simple enough to explain in a hackathon review.

## Features

- View study tasks from your own API
- Add a task and choose its subject
- Mark tasks complete or incomplete
- Delete tasks
- See total, completed, and percentage-progress statistics
- Responsive layout for phone and desktop
- Input validation and clear error messages

## Tech stack

- **Frontend:** HTML + CSS + browser JavaScript (no frontend framework required)
- **Backend:** Node.js + Express
- **API:** JSON endpoints under `/api/tasks`
- **Configuration:** `.env` using `dotenv`

## Requirements

Install Node.js 18 or newer. Check installation in a terminal:

```bash
node --version
npm --version
```

## Run locally

1. Download or clone this repository.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` (optional; defaults to port 3000).
5. Start the server:

   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in your browser.

Keep the terminal open while using the website. Stop the server with `Ctrl+C`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/tasks` | Return all tasks |
| POST | `/api/tasks` | Add a task |
| PATCH | `/api/tasks/:id` | Change completed status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: add a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Practise C loops","subject":"Programming"}'
```

## How it works

1. The browser loads `public/index.html`, `public/style.css`, and `public/app.js`.
2. `app.js` uses `fetch()` to send HTTP requests to `/api/tasks`.
3. Express receives those requests in `server.js`.
4. The server reads or updates the `tasks` array and responds with JSON.
5. The browser renders the JSON data into the page and updates progress statistics.

**Important:** this starter version stores tasks in server memory. Tasks reset when the server restarts. That is intentional for a first project; a database can be added later.

## Environment setup

- `.env.example` documents the optional `PORT` variable.
- Copy it to `.env` if you want to configure the port.
- `.env` and `node_modules/` are ignored by Git.

## GitHub submission checklist

- [ ] Run the app locally and test add, complete, and delete.
- [ ] Add this project to **your own** GitHub account.
- [ ] Keep `README.md`, `package.json`, `server.js`, and `public/` in the repository.
- [ ] Make sure the repository is public if the skill platform requires a public repo.
- [ ] Paste the repository URL into the Full-Stack skill verification step.
- [ ] Be ready to explain which parts you built and how the API works.

## Suggested 30-second explanation

“Study Buddy is a beginner-friendly full-stack study-task tracker. The frontend is built with HTML, CSS, and JavaScript. It sends GET, POST, PATCH, and DELETE requests to an Express backend. The backend validates inputs and returns JSON, while the frontend updates the checklist and progress counters. This starter version uses in-memory data, so a database would be a logical next improvement.”
