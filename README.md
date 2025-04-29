# 🌍 Globetrotter – Backend

This is the **backend server** for **Globetrotter**, a full-stack travel trivia game where users guess destinations from cryptic clues and track their scores.

---

## 🔧 Tech Stack

- **Node.js** + **Express** – API server
- **MongoDB** + **Mongoose** – Database and ODM
- **UUID** – Unique user and city IDs
- **JWT** – Authentication token generation
- **Bcrypt** – Secure password hashing
- **CORS** – Enable frontend-backend communication

---

## 📂 Folder Structure

```bash
server/
├── controllers/
│   ├── auth.js          # Login, Register
│   ├── cities.js        # City-related logic
│   └── user.js          # User profile management
├── models/
│   ├── User.js
│   └── City.js
├── routes/
│   ├── auth.js
│   ├── cities.js
│   └── user.js
├── middleware/
│   └── auth.js          # JWT verification
├── utils/
│   └── randomUserId.js  # Generate random user IDs
├── .env
├── server.js
└── package.json
```

---

## 📢 API Endpoints

### 🔐 Authentication Routes

| Method | Route           | Description                  |
|:------:|:----------------|:------------------------------|
| POST   | `/auth/register` | Register a new user          |
| POST   | `/auth/login`    | Login with email and password |


### 🌟 City Gameplay Routes

| Method | Route                      | Description                                      |
|:------:|:----------------------------|:-------------------------------------------------|
| GET    | `/city/random`              | Fetch a random city the user hasn't visited yet |
| GET    | `/city/:cityId`             | Fetch details of a specific city by ID          |
| GET    | `/answer/:cityId`           | Check if the user's answer is correct           |


### 👥 User Profile Routes

| Method | Route                        | Description                       |
|:------:|:------------------------------|:----------------------------------|
| GET    | `/users/:userId`              | Get user profile                  |
| PATCH  | `/users/update/:userId`       | Update user profile and scores    |
| PATCH  | `/users/reset/:userId`        | Reset user's game progress        |


---

## 🛠️ Setup Instructions

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔐 Environment Variables (.env)

```env
MONGO_URI=mongodb+srv://<your-cluster-url>
JWT_SECRET=your-secret-key
PORT=5000
```

---

## 📌 Notes

- **Cities are randomly selected** excluding cities already visited by the user (MongoDB query based).
- **City dataset includes**:
  - 2 cryptic clues per city
  - 2–3 fun facts
  - Bonus trivia facts (optional)
- **Dataset seeding**: Cities are pre-populated manually or via scripts into MongoDB.

---

## 📈 Future Improvements

- Add refresh tokens for more secure authentication.
- Admin dashboard for adding new cities.
- Real-time leaderboards.

---

Made with ❤️ for travelers and trivia lovers.