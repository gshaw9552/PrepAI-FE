# PrepAI Frontend

PrepAI is an AI-powered interview platform that helps users prepare for job interviews with dynamic question generation, real-time feedback, and progress tracking. This repository contains the frontend code built with React, TypeScript, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)

## Overview

PrepAI provides a seamless interview preparation experience, allowing candidates to receive dynamic interview questions, view detailed feedback, and track their progress over time. The frontend is responsible for user interactions and communication with the backend APIs.

## Tech Stack

- **React**: Component-based UI development.
- **TypeScript**: Provides type safety and improved developer experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Axios**: For making API requests to the backend.

## Features

- User authentication (login & registration)
- Dynamic interview question generation
- Real-time AI evaluation and feedback on answers
- Interview session tracking and analytics
- Option to save questions for later review

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/PrepAI.git
   cd PrepAI/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Development

To run the frontend in development mode:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

## Build

To create a production build:

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the `frontend` folder with the following values:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Deployment

You can deploy the frontend on platforms like Vercel, Netlify, or GitHub Pages.

Make sure to set the `VITE_BACKEND_URL` environment variable appropriately on the deployment platform.
