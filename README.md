# UCab - MERN Stack Cab Booking Application

UCab is a full-featured MERN stack (MongoDB, Express.js, React.js, Node.js) cab booking application that enables passengers to select vehicles and schedule trips, driver tracking via real-time WebSocket communication, and administrators to oversee overall metrics and fleet updates.

---

## Technology Stack

- **Frontend:** React (Vite-powered SPA), Tailwind CSS v3, React Context API, Lucide React (icons), Axios (API client with interceptors), React Hot Toast (UI alerts).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM), JWT Authentication, BcryptJS password hashing, Multer file upload handlers, Socket.io (WebSocket connections).
- **Simulations:** Sandbox Stripe payment callback handlers, deterministic distance metrics, and real-time SVG cab movement.

---

## Features

1. **Role-Based Authentication:** Unified forms handling Passenger accounts, Driver profiles, and Admin dashboard authorizations.
2. **Dynamic Cab Fleet Directory:** Instant searches and sorting based on category (Hatchback, Sedan, SUV, Mini, Bike), price per kilometer, and active seat capacities.
3. **Trip Calculation Wizard:** Deterministic route calculations matching pick-up and drop cities, estimating travel distances, and listing total fees.
4. **Stripe Simulator Checkout:** Integrates checkout session creation and verify status verification webhooks.
5. **Real-time Ride Tracking:** Emits locations via Socket.io channels, displaying moving cab vectors along path tracks.
6. **Admin Dashboard Stats:** Analytics displaying user count, overall bookings, available cabs, total revenues, and monthly earnings charts.
7. **Profile Settings:** Customize user credentials, telephone strings, and upload avatars.

---

## Directory Structure

```
ucab-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # API call integrations
│   │   ├── components/     # Navbar & Protected route wrappers
│   │   ├── context/        # Auth & Booking contexts
│   │   ├── pages/          # Home, Login, Register, Dashboards, Cabs, MyBookings
│   │   ├── App.jsx         # App router
│   │   └── index.css       # Tailwind entry point
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                 # Node/Express backend
│   ├── db/                 # Mongoose configurations
│   ├── models/             # Database schemas (User, Car, Booking, Admin)
│   ├── controllers/        # Business logic controllers
│   ├── routes/             # REST route mappings
│   ├── middlewares/        # Auth, Multer, Error handlers
│   ├── socket.js           # WebSockets logic
│   └── server.js           # Server entry point
│
├── Procfile                # Hosting configuration
└── package.json            # Root command organizer
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js installed (v16+)
- MongoDB running locally on `mongodb://localhost:27017`

### Step 1: Install Dependencies
Run the install command inside the root folder:
```bash
npm run install-all
```

### Step 2: Configure Environment Variables

#### Backend Configuration (`server/.env`)
Create a `.env` inside `server/` folder:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/ucab_db
JWT_SECRET=your_secret_key_here
```

#### Frontend Configuration (`client/.env`)
Create a `.env` inside `client/` folder:
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 3: Run the Application

#### Start in Development mode:
Run inside client:
```bash
npm run dev
```
Run inside server:
```bash
npm run dev
```

#### Start in Production mode:
Build frontend dist assets and launch node:
```bash
npm run build
npm start
```
The server will boot on port `8000` and host the React compilation statically.

---

## Testing & Verifications
Run the backend tests:
```bash
npm test
```
The tests check the environment loader, cryptographic password hashes, and JWT signature validation.
