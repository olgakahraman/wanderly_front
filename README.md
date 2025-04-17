# Wanderly Frontend — Travel Social Network

🌍 A beautiful social platform for travelers to share their journeys and experiences.

🔗 **Live App**: [https://wanderly-front.onrender.com](https://wanderly-front.onrender.com)

---

## 📌 Project Ownership

This frontend was designed and developed entirely by **OLGA DIETIUK KAHRAMAN** as part of a personal portfolio project. All components, architecture, and styling are original unless otherwise noted.

---

## 🌟 Features

- 🔐 User authentication (Login / Register / Forgot Password)
- 📝 Post creation with text and location tagging
- 🗺️ Interactive travel feed and maps (coming soon)
- 👤 User profile with travel stats
- 📱 Responsive and mobile-first UI

---

## 🛠️ Tech Stack

- **React.js**
- **React Router DOM** for routing
- **Bootstrap** for styling
- **Framer Motion** for animations
- **Yup** and **React Hook Form** for form validation
- **Custom AuthContext** for authentication flow
- **Fetch API** for connecting to the backend
- **CSS Modules** for scoped styles

---

## 📦 Used Libraries and Imports

```js
import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


##🚀 How to Run Locally

git clone "https://github.com/olgakahraman/wanderly_front"
cd client
npm install
VITE_API_URL="https://wanderly-back.onrender.com"
npm run dev





© 2025 Wanderly — all rights reserved. 
Developed by OLGA DIETIUK KAHRAMAN.
