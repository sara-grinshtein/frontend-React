# 🎨 ProjectYedidim – Client (React)

Frontend client built with **React (CRA)** for interacting with the volunteer assistance backend.

---

## 📑 Table of Contents
- ⚡ [Installation & Run](#installation-run)
- 🛠 [Available Scripts](#available-scripts)
- 🔌 [API Configuration](#api-configuration)
- 📦 [Main Dependencies](#main-dependencies)
- 🧪 [Testing](#testing)
- 🚀 [Build & Deployment](#build-deployment)

---

<a id="installation-run"></a>
## ⚡ Installation & Run

Clone the repository and install dependencies:

    git clone https://github.com/sara-grinshtein/frontend-React.git
    cd frontend-React
    npm install
    npm start

- Runs the app in development mode  
- Open **http://localhost:3000** in your browser  
- The page reloads when you make changes  

---

<a id="available-scripts"></a>
## 🛠 Available Scripts

Inside the project directory you can run:

- `npm start` → Runs the app in development mode  
- `npm test` → Launches the test runner (watch mode)  
- `npm run build` → Builds the app for production (output in `build/`)  
- `npm run eject` → Exposes CRA config files (⚠️ irreversible)  

---

<a id="api-configuration"></a>
## 🔌 API Configuration

The frontend communicates with the backend (ASP.NET Core API).  
Update your API base URL inside your axios configuration or environment file:

    REACT_APP_API_URL=http://localhost:5171/api

For production, configure accordingly.  
👉 Backend repository: https://github.com/sara-grinshtein/backend-ASP.NET-Core

---

<a id="main-dependencies"></a>
## 📦 Main Dependencies

- ⚛️ **React 18** – UI framework  
- 🔄 **Redux Toolkit** – state management  
- 🌐 **axios** – HTTP requests  
- 🗺 **react-router-dom v7** – routing  
- 🎨 **styled-components** – styling  
- ✅ **react-hook-form** – form management  
- 🔑 **jwt-decode** – JWT token handling  

---

<a id="testing"></a>
## 🧪 Testing

Uses **Jest** and **React Testing Library**:  

    npm test

Tests run in watch mode by default.  

---

<a id="build-deployment"></a>
## 🚀 Build & Deployment

Build for production:

    npm run build

This creates a `build/` directory with optimized static files.  
You can deploy the build to **Netlify**, **Vercel**, or any static hosting provider.  

---

## 📜 License

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

