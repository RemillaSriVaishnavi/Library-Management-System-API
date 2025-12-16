# 📚 Library Management API

A backend REST API for managing book borrowing and returning in a library system.  
This project demonstrates **database design**, **business rule enforcement**, **state management**, and **API testing** using **Node.js, Express, and MySQL**.

---

## 🚀 Features

- Borrow and return books
- Enforce business rules (availability, eligibility, fines)
- Maintain book state and transaction history
- RESTful API design
- MySQL relational schema with constraints
- API testing using `.http` file (VS Code REST Client)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL
- **Driver:** mysql2
- **API Testing:** VS Code REST Client (`.http` file)
- **Language:** JavaScript

---

## 📦 Project Structure

Library-API-Mandatory-Task-4/
│
├── src/
│   ├── controllers/
|   |   └── bookController.js
|   |   └── fineController.js
|   |   └── memberController.js
│   │   └── transactionController.js
│   ├── models/
│   │   └── db.js
│   ├── routes/
|   |   └── books.js
|   |   └── fines.js
|   |   └── members.js
│   │   └── transactions.js
│   ├── services/              # Optional helper logic
│   │   ├── bookStateService.js
│   │   └── businessRulesService.js
│   ├── utils/
│   │   └── dateUtils.js
│   └── app.js
│
├── requests.http              # API testing file
├── package.json
└── README.md



---

## 🧑‍💻 How to Run the Project

### 1️⃣ Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- MySQL Server
- MySQL Workbench
- VS Code (for `.http` testing)

---

### 2️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd Library-API-Mandatory-Task-4

```
### 3️⃣ Install Dependencies
npm install

### 4️⃣ MySQL Setup
Create Database
CREATE DATABASE library_management;
USE library_management;

Create Tables

Books Table

CREATE TABLE books (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(255),
  year_published INT,
  available_copies INT NOT NULL
);


Members Table

CREATE TABLE members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  join_date DATE
);


Transactions Table

CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT,
  book_id INT,
  borrow_date DATE,
  return_date DATE,
  status VARCHAR(20),
  fine INT DEFAULT 0,
  FOREIGN KEY (member_id) REFERENCES members(member_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);

5️⃣ Configure Database Connection

Edit:

src/models/db.js

const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'library_management'
});

module.exports = db;

6️⃣ Start the Server
npm start


Expected output:

Server running on port 3000


🔄 State Machine (Book Status Logic)

Books do not have a separate status column.
Instead, state is derived from available_copies and transactions.

Book States
State	Condition
AVAILABLE	available_copies > 0
BORROWED	available_copies = 0
RETURNED	available_copies increased
Transaction States
Status	Meaning
BORROWED	Book currently issued
RETURNED	Book returned
📏 Business Rules Enforced

A member must exist to borrow a book

A book must exist and have available copies

Available copies decrease on borrow

Available copies increase on return

Borrow duration limit: 7 days

Fine: ₹10 per extra day

A transaction must be in BORROWED state to be returned

🔌 API Documentation
1️⃣ Borrow Book

Endpoint

POST /transactions/borrow


Request Body

{
  "book_id": 1,
  "member_id": 1
}


Success Response

{
  "message": "Book borrowed successfully"
}

2️⃣ Return Book

Endpoint

POST /transactions/return


Request Body

{
  "transaction_id": 1
}


Success Response

{
  "message": "Book returned successfully",
  "fine": 0
}

🧪 API Testing (PHASE 9)
Using .http File (Recommended)

File: requests.http

### Borrow a book
POST http://localhost:3000/transactions/borrow
Content-Type: application/json

{
  "book_id": 1,
  "member_id": 1
}

### Return a book
POST http://localhost:3000/transactions/return
Content-Type: application/json

{
  "transaction_id": 1
}

Tool Required

VS Code Extension: REST Client (by Huachao Mao)

📄 Controller Logic Summary

The core logic is implemented in:

src/controllers/transactionController.js


It handles:

Member validation

Book availability checks

Transaction creation

State updates

Fine calculation

Database consistency