# Hotel Management System - Frontend

This is the frontend application for the Hotel Management System, built using React, Vite, and Material-UI. It provides a user interface for managing hotel bookings, guest information, and reports, with a responsive design and dark/light mode support.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- **Node.js**: Version 14.x or higher (recommended: LTS version).
- **npm**: Comes with Node.js, or install separately if needed.
- **Git**: For version control and cloning the repository.
- **Vercel CLI** (optional): For deployment (install via `npm install -g vercel`).

## Installation
1. **Clone the Repository**:
   - Open a terminal and run:
     ```
     git clone https://github.com/PossibleIlesanmi/Hotel-Management-Frontend.git
     cd Hotel-Management-Frontend
     ```
   - Note: If you’re working directly in an existing folder (e.g., `client`), ensure it’s initialized as a Git repository (`git init`) and linked to the remote (`git remote add origin https://github.com/PossibleIlesanmi/Hotel-Management-Frontend.git`).

2. **Install Dependencies**:
   - Run the following command to install the required packages:
     ```
     npm install
     ```
   - Ensure the following dependencies are included in `package.json`:
     - `react`
     - `react-dom`
     - `react-router-dom`
     - `@mui/material`
     - `@emotion/react`
     - `@emotion/styled`
     - `vite` (for development server)

3. **Configure Git Identity** (if not already set):
   - Set your Git username and email (replace with your details):
     ```
     git config --global user.name "Ilesanmi Gbenga"
     git config --global user.email "your-github-email@example.com"
     ```
   - Verify with:
     ```
     git config --global --list
     ```

## Running the Project Locally
1. **Start the Development Server**:
   - Run the following command to start the app:
     ```
     npm run dev
     ```
   - This will launch the development server, typically at `http://localhost:5173`. Open this URL in your browser.

2. **Explore the App**:
   - Navigate through the sidebar to pages like Dashboard, Bookings, Guest Management, Reports, and Settings.
   - Toggle dark mode via the Settings page to test the theme.

## Deployment
To deploy the project on Vercel:

1. **Install Vercel CLI**:
   - Install globally if not already installed:
     ```
     npm install -g vercel
     ```

2. **Log In to Vercel**:
   - Authenticate with your Vercel account:
     ```
     vercel login
     ```
   - Follow the prompts to log in via browser or token.

3. **Deploy the Project**:
   - From the project root directory, run:
     ```
     vercel
     ```
   - Configure the deployment:
     - **Project Name**: e.g., `hotel-management-frontend`.
     - **Framework Preset**: Select "Vite" (or "Create React App" if Vite isn’t listed).
     - **Build Command**: `npm run build` (ensure this script exists in `package.json`).
     - **Output Directory**: `dist` (default for Vite).
     - **Install Dependencies**: Choose "Yes".
   - Confirm with `y` and note the deployed URL (e.g., `https://hotel-management-frontend.vercel.app`).

4. **Automate with GitHub (Optional)**:
   - Connect the repository to Vercel via [vercel.com](https://vercel.com):
     - Import `https://github.com/PossibleIlesanmi/Hotel-Management-Frontend.git`.
     - Configure settings and deploy.
   - Future pushes to `master` will trigger automatic redeploys.

## Deployment
- **Frontend**: Deployed on Vercel (https://hotel-management-frontend-nu.vercel.app).
  - Set `VITE_API_URL=https://hotel-management-backend-ic5v.onrender.com` in Vercel Environment Variables.
  - Add `vercel.json` with rewrites to handle SPA routing.
- **Backend**: Deployed on Render (https://hotel-management-backend-ic5v.onrender.com).
  - Set environment variables:
    - `MONGO_URI=your_mongodb_connection_string`
    - `ADMIN_CODE=1234`
    - `JWT_SECRET=your_jwt_secret_key`
    - `FRONTEND_URL=https://hotel-management-frontend-nu.vercel.app`

## Troubleshooting
- **404 on /access**: Ensure `vercel.json` is configured and routes are defined in `App.jsx`.
- **CORS Error**: Verify `FRONTEND_URL` matches the Vercel URL.
- **MongoDB Connection**: Check `MONGO_URI` is a valid string.

Testing:Continue testing with multiple users or edge cases (e.g., invalid codes, network interruptions) to ensure robustness.


