# Hospital Management System (HMS)

## About the Project

The Hospital Management System is a web-based application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

It is designed to simplify hospital operations by providing a centralized platform for managing hospital information, patients, doctors, and appointments. It aims to reduce paperwork, save time, and improve hospital management efficiency.

## Technologies Used

- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Version Control:** Git and GitHub

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Riyan-Davi/hospital-management-system.git
cd hospital-management-system
```

### 2. Install Backend Dependencies

```bash
cd Server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Start the Backend

```bash
npm run dev
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

### 7. Access the Application

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

**Note:** Keep your `.env` file private. Never upload database credentials to GitHub.
