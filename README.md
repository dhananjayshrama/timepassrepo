# AI Interview Coach

An AI-powered mock interview app. Pick a role (for example MERN Developer), and the AI asks interview questions one by one, scores each answer, and tells you how to improve.

## Features

- Choose role, experience level, and interview type (technical, HR, mixed)
- AI asks one question at a time
- Each answer gets a score out of 10, strengths, missing points, and a sample answer
- Final report with overall score, weak topics, and a study plan
- Saved interview history (planned)
- Adaptive difficulty based on your answers (planned)

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- AI: LangChain + Google Gemini
- Database: MongoDB (Mongoose)
- API testing: Postman

## Project Status

- [x] Express server setup
- [x] Gemini API connected
- [ ] Move AI calls to LangChain
- [ ] Interview start and answer endpoints
- [ ] Scoring with structured output
- [ ] Chat memory
- [ ] React frontend
- [ ] MongoDB and login
- [ ] Final report and history
- [ ] Deployment

## How It Works

1. User selects role, level, and interview type.
2. Backend creates a session and the AI generates the first question.
3. User submits an answer.
4. AI scores it using a rubric (correctness 40%, depth 30%, clarity 30%).
5. Feedback is shown and the next question is generated.
6. After the last question, a final report is generated.

## Flow Chart

        +-----------------------+
        |   User opens the app  |
        +-----------+-----------+
                    |
                    v
        +-----------------------+
        |  Select role, level,  |
        |  type, no. of         |
        |  questions            |
        +-----------+-----------+
                    |
                    v
        +-----------------------+
        | POST /interview/start |
        | Create session        |
        +-----------+-----------+
                    |
                    v
        +-----------------------+
        |  AI generates first   |
        |  question (LangChain  |
        |  prompt template)     |
        +-----------+-----------+
                    |
                    v
        +-----------------------+
        |  User types answer    |<-----------------+
        +-----------+-----------+                  |
                    |                              |
                    v                              |
        +-----------------------+                  |
        | POST /interview/answer|                  |
        +-----------+-----------+                  |
                    |                              |
                    v                              |
        +-----------------------+                  |
        |  AI scores answer     |                  |
        |  (JSON: score,        |                  |
        |  feedback, sample)    |                  |
        +-----------+-----------+                  |
                    |                              |
                    v                              |
        +-----------------------+                  |
        |  Save to MongoDB      |                  |
        +-----------+-----------+                  |
                    |                              |
                    v                              |
              +-----------+   Yes                  |
              | More      |------------------------+
              | questions?|   (AI generates next
              +-----+-----+    question using memory)
                    | No
                    v
        +-----------------------+
        | GET /interview/report |
        | Overall score,        |
        | weak topics, study    |
        | plan                  |
        +-----------------------+

## API Endpoints

| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| POST   | /interview/start         | Start session, get first question    |
| POST   | /interview/answer        | Submit answer, get score + next question |
| GET    | /interview/report/:id    | Get final report                     |
| GET    | /interview/history       | List past interviews                 |
| POST   | /auth/register           | Create account                       |
| POST   | /auth/login              | Log in                               |

## Database Design

- Users: name, email, hashed password
- Sessions: user, role, level, type, status, overall score
- Messages: session, question, answer, score, feedback, timestamp

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file:
   GEMINI_API_KEY=your_key_here
   MONGO_URI=your_mongodb_url
4. Run `npm run dev`
5. Server runs on http://localhost:5001

## Future Ideas

- Resume-based questions (upload a PDF)
- Voice answers using speech recognition
- Timer for each question
- Hindi and Marathi mode
- Shareable score card

## Author

Dhananjay Sharma 