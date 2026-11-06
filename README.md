<div align="center">

# ⚙️ BookNook — Enterprise Backend Server

**A robust, high-performance, and secure RESTful API engineered to power the BookNook digital library ecosystem.**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

[🌐 **Explore Live API**](https://book-nook-backend-forhad.vercel.app/) • [💻 **Frontend Repository**](https://github.com/Forhad-Shorif/Book-Nook)

</div>

---

## 🌟 About The Backend

The **BookNook Backend** serves as the powerhouse of the entire platform. Built with asynchronous Node.js and Express.js architecture, it safely handles secure user authentication, real-time inventory adjustments, borrowing history tracking, and high-speed MongoDB Atlas database operations. 

---

## 🛠️ Built With & Core Technologies

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express.js](https://expressjs.com/) for clean middleware routing and endpoint handling.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) utilizing optimized database queries and connection pooling.
- **Security & Middleware:** CORS configuration, environment variable management via `dotenv`, and custom Google DNS resolution (`8.8.8.8` / `1.1.1.1`) to ensure zero-downtime database connectivity.

---

## 📡 API Endpoints Architecture

Here is the complete overview of the RESTful endpoints available in this server:

### **📚 Books Portfolio Management**
- `GET /books` — Retrieve the comprehensive library book inventory.
- `GET /LatestBooks` — Fetch the 10 most recently published books for the home feed.
- `GET /Books/:id` — Get detailed metadata for a specific book.
- `POST /NewBook` — Securely add a new book to the database.
- `PATCH /UpdateBook/:id` — Update existing book information (CRUD).
- `DELETE /DeleteBook/:id` — Remove a specific book from the platform.
- `GET /MyBooks/:email` — Fetch all books uploaded/published by a specific user.

### **🔄 Inventory & Borrowing System**
- `POST /BookCopesReduce/:id` — Atomically decrease available book stock upon borrowing.
- `POST /BookCopesIncrease/:id` — Increment book stock when a user returns a title.
- `GET /BorrowedBooks/:email` — Retrieve active borrowing history for a user.
- `POST /BorrowedBooks` — Register a new book borrowing transaction.
- `DELETE /BorrowedBooks/:id` — Conclude a borrow record upon book return.

### **✍️ Community Reviews System**
- `GET /GetReview` — Fetch all public community reviews with optimized revalidation.
- `POST /AddReview` — Post a verified review for a read book.
- `DELETE /DeleteReview/:id` — Author-protected review deletion endpoint.

---

## ⚙️ Getting Started Locally

Follow these steps to run the backend server locally on your development machine:

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- Git

### 1. Clone the Repository
```bash
git clone [https://github.com/Forhad-Shorif/Book-Nook-Backend.git](https://github.com/Forhad-Shorif/Book-Nook-Backend.git)
cd Book-Nook-Backend