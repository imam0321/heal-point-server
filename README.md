# Heal Point Server

**Heal Point Server** is a secure and feature-rich backend for a healthcare management system that connects patients with doctors. It enables patients to browse and book appointments with doctors, give reviews after consultations, and make payments for services. Doctors can manage appointments, provide prescriptions, and update patients' health records. The system also includes AI-powered doctor suggestions based on patient symptoms using OpenRouter, and supports video consultations between doctors and patients.

Built with **Node.js**, **Express**, and **TypeScript**, it leverages **Prisma** with **PostgreSQL** for database management, **JWT** for secure authentication, and integrates **Multer** and **Cloudinary** for file uploads. Additional tools like **Stripe**, **Nodemailer**, **Zod**, and essential utilities ensure a modern, reliable, and maintainable backend architecture.

---

## 🔍 Features

- User authentication & authorization (patients, doctors, admins)
- Patients can browse doctors and book appointments
- Patients can give reviews for doctors after an appointment
- Doctors can view and manage their appointments
- Doctors can provide prescriptions to patients
- Doctors can update patients' health records
- Admins can manage users, doctors, appointments, and system settings
- AI-powered doctor suggestion: based on symptoms or condition, the system suggests the most suitable doctors using OpenRouter
- Secure JWT authentication
- File/image uploads
- Payment integration: patients can pay for appointments
- Video call functionality: doctors and patients can have online consultations
- …and more!

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Language**: TypeScript
- **ORM / Database**: Prisma + PostgreSQL
- **Authentication**: JWT (Access & Refresh Tokens)
- **AI Suggestion API**: OpenRouter
- **Validation**: Zod
- **File Uploads**: Multer + cloudinary
- **Payment Integration**: Stripe
- **Email Service**: Nodemailer
- **Tools & Utilities**:
  - dotenv
  - eslint
  - bcryptjs
  - cookie-parser
  - cors
  - express-session
