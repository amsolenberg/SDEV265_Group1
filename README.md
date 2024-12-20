# Online Reservations System

## Overview

The **Online Reservations System** is a web application designed to manage appointments for a salon. Users can browse available services, book appointments, and manage their reservations. Admins have access to administrative tools for managing services and user reservations.

---

## Features

- **User Registration and Login**: Secure authentication for managing reservations.
- **Service Listings**: View detailed descriptions of services offered by the salon.
- **Appointment Booking**: Book and manage reservations directly from the application.
- **Admin Panel**: Access tools to manage services and reservations.
- **Mobile-Friendly**: Responsive design using Bootstrap.
- **Error Handling**: Custom error pages for 404 and other issues.

---

## Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript Templates)
- **Database**: MongoDB
- **Styling**: Bootstrap, CSS
- **Authentication**: Sessions with `express-session` and secure password hashing using `bcryptjs`
- **Containerization**: Docker with `docker-compose`

---

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Docker (optional for containerized deployment)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/amsolenberg/SDEV265_Group1.git
   cd SDEV265_Group1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
    - In the project root directory there is an `.env.example` file. Copy this and rename as `.env`
    - Configure environment variables:
        - DB_USER
        - DB_PASS
        - DB_HOST
        - DB_PORT
        - DB_NAME
        - SESSION_SECRET
        - MONGO_INITDB_ROOT_USERNAME 
        - MONGO_INITDB_ROOT_PASSWORD
    - In the `app.js` file, if you're not running this in Docker, uncomment lines 2 and 13-30
        - This should not be done if running in Docker
    - If running in Docker, if you want to customize the container ports through environment variables, add the following variables to the `.env` file and give them desired values:
        - ONLINE_RESERVATIONS_APP_3000="####"
        - ONLINE_RESERVATIONS_DB_27017="####"
4. Run the application:
    ```bash
    node app.js
    ```
5. Access the application:
    - Open a browser and visit `http://localhost:3000`.

---

## Running with Docker

1. Copy the contents of the `docker-compose.yml` file.
2. Rename `.env.example` to `.env`
3. Adjust the variable values as necessary
4. Start the container:
```bash
docker compose up -d
```
5. Access the application at `http://localhost:3000`.

---

## File Structure

```
.
├── app.js                  # Main application entry point
├── db.js                   # Database connection logic
├── middlewares.js          # Middleware configurations
├── models/                 # Mongoose models for the app
│   ├── reservation.js
│   ├── service.js
│   └── user.js
├── routes/                 # Express route modules
│   ├── login.js
│   ├── logout.js
│   ├── register.js
│   ├── reservation.js
│   ├── service.js
│   └── static.js
├── views/                  # EJS templates
│   ├── partials/           # Reusable EJS components (nav, footer, etc.)
│   ├── register.ejs
│   ├── login.ejs
│   ├── services.ejs
│   ├── my-reservations.ejs
│   └── admin.ejs
├── public/                 # Static assets
│   ├── styles.css
│   └── images/
├── env/                    # Environment variable configuration
│   ├── database.env
│   └── mongo.env
├── docker-compose.yml      # Docker configuration
├── package.json            # Node.js dependencies
└── README.md               # Project documentation
```

---

## Key Endpoints

### User Authentication
- `GET /login`: Login page
- `POST /login`: Authenticate user
- `GET /register`: Registration page
- `POST /register`: Register a new user
- `GET /logout`: Log out the user

### Services and Reservations
- `GET /services`: View all services
- `GET /my-reservations`: View user reservations
- `POST /reservations`: Create a reservation
- `DELETE /reservations/:id`: Cancel a reservation

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

Feel free to form the repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.