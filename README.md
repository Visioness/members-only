# Members Only

A private message board application where anyone can view messages, but only members can see who wrote them. Built with Node.js, Express, and PostgreSQL. This project is part of The Odin Project curriculum.

## Features

- **User Authentication**: Secure sign-up and log-in functionality using Passport.js.
- **Membership System**:
  - Users start as "Outsiders".
  - Users can upgrade to "Member" status by entering a secret passcode.
  - **Members Only**: Only members can see the author and timestamp of messages.
- **Admin Privileges**: Admins (verified via a special code) have the ability to delete messages.
- **Message Board**:
  - Create new messages (Authenticated users).
  - View all messages (Public).
- **Security**:
  - Passwords are hashed using `bcryptjs`.
  - Sessions are stored securely in PostgreSQL using `connect-pg-simple`.
  - Input validation and sanitization with `express-validator`.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Templating**: EJS
- **Authentication**: Passport.js (Local Strategy)
- **Styling**: Custom CSS
- **Tools**: `dotenv` for environment variables, `pg` for database connection.

## Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd members-only
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up the database**

    - Make sure you have PostgreSQL installed and running.
    - Create a database for the project.
    - Run the SQL setup script (usually provided in `db/` or constructed from models).

4.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=3000
    HOST=localhost
    USER=your_db_username
    PASSWORD=your_db_password
    DB=your_database_name
    DB_PORT=5432
    SECRET_CODE=your_secret_membership_code
    ADMIN_CODE=your_secret_admin_code
    ```

5.  **Run the application**

    ```bash
    node app.js
    ```

    or if you have `nodemon` installed:

    ```bash
    nodemon app.js
    ```

6.  **Visit the app**
    Open your browser and go to `http://localhost:3000`.

## Usage

- **Sign Up**: Create a new account.
- **Join the Club**: Click "Unhide The Secret" and enter the `SECRET_CODE` you defined in your `.env` file to become a member.
- **Post Messages**: Share your thoughts on the board.
- **Delete Messages**: If you signed up with the `ADMIN_CODE`, you can delete messages.

## Project Structure

```
members-only/
├── controllers/   # Route Controllers
├── db/            # Database connection and queries
├── routes/        # Express routes
├── views/         # EJS templates
├── app.js         # Entry point
└── package.json   # Dependencies
```
