# 📚 BookNook Backend

Welcome to the backend server of **BookNook**! This is a robust and secure RESTful API built to handle all the server-side logic, database operations, and inventory management for the BookNook library platform.

---

## 🚀 About The Project

BookNook is designed to be a complete community library system where users can explore books, add new titles, manage their personal collections, and borrow or return books seamlessly. 

This backend securely connects with MongoDB Atlas to handle real-time inventory adjustments, user-specific queries, and fast data retrieval.

---

## 🛠️ Built With

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using the official MongoDB Native Driver)
- **Middleware & Security:** CORS, dotenv, and custom DNS resolution for smooth database connection stability.

---

## 📡 API Endpoints Overview

Here is a quick look at the available routes in this backend:

### **Books Management**
- `GET /books` - Fetch all books from the inventory
- `GET /LatestBooks` - Get the 10 most recently added books
- `GET /Books/:id` - Fetch details for a specific book
- `POST /NewBook` - Add a new book to the database
- `PATCH /UpdateBook/:id` - Update existing book information
- `DELETE /DeleteBook/:id` - Remove a book from the collection
- `GET /MyBooks/:email` - Get all books published by a specific user

### **Inventory & Borrowing System**
- `POST /BookCopesReduce/:id` - Decrease available book quantity when borrowed
- `POST /BookCopesIncrease/:id` - Increase book quantity when returned
- `GET /BorrowedBooks/:email` - Retrieve all books borrowed by a specific user
- `POST /BorrowedBooks` - Record a new book borrow action
- `DELETE /BorrowedBooks/:id` - Remove a borrow record (Return book)

---

## ⚙️ How to Run Locally

If you want to run or test this project on your local machine, follow these simple steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/Forhad-Shorif/Book-Nook-Backend.git](https://github.com/Forhad-Shorif/Book-Nook-Backend.git)
cd Book-Nook-Backend