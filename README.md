# 🖼️ AI Image Generation Platform

A full-stack image generation web application using:

- **Supabase** (Authentication, Database, and Storage)
- **Fal Flux Schnell API** (AI Image Generation)
- **Vercel** (Frontend Hosting & Deployment)

👉 **Live Deployment:**  
[https://image-gen-project-red.vercel.app/](https://image-gen-project-red.vercel.app/)

---

## 🚀 Project Overview

This platform allows users to:

- ✅ Sign up and log in securely using **Supabase Auth**
- ✅ Generate AI-powered images using **Fal.ai's Flux Schnell API**
- ✅ Automatically store generated images inside **Supabase Storage**
- ✅ Maintain user profiles with credit-based image generation limits
- ✅ Store metadata: `user_id`, `prompt`, `generated_image_url`, and storage path in Supabase DB

> **Note:**  
The **Profile module** is currently under development.  
Other core functionalities are fully operational.

---

## 🏗️ Tech Stack

| Layer       | Technology Used               |
|-------------|---------------------------------|
| **Frontend**  | Next.js / React / Tailwind (hosted on Vercel) |
| **Backend**   | Edge Functions on Deno (Supabase Functions)   |
| **Auth**       | Supabase Auth (JWT-based)     |
| **Database**   | Supabase Postgres (Table-based credit system) |
| **Storage**    | Supabase Storage (Image hosting) |
| **AI Model**   | Fal.ai Flux Schnell API        |
| **Deployment** | Vercel (CI/CD & hosting)      |

---

## 🔐 Authentication & Credit System

- Each user is assigned a limited number of **credits** upon sign-up.
- Credits are deducted for every successful image generation.
- The user profile table stores:
  - `id` (UUID)
  - `email`
  - `credits`
- If credits run out, the generation is blocked until refilled.

---

## 📸 Image Generation Flow

1. User submits a **prompt**.
2. Request is sent to **Fal.ai Flux Schnell API** with proper parameters.
3. Once generated:
   - The image URL is fetched.
   - Image is uploaded into **Supabase Storage**.
   - Metadata (prompt, image URL, storage path, user ID) is inserted into `generated_images` table.
   - Credit is deducted automatically.

---

## 🌐 Deployment & Hosting

- The frontend is deployed on **Vercel**:  
  👉 [https://image-gen-project-red.vercel.app/](https://image-gen-project-red.vercel.app/)

- Backend functions run on **Supabase Edge Functions** using **Deno runtime**.

---

## 🔧 Environment Variables Required

You must configure the following environment variables in both Supabase and Vercel:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `FAL_KEY` | Your Fal.ai API key |

---

## 🗄️ Database Schema (Supabase)

### `profiles` table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID (Primary Key) | Supabase user ID |
| email | Text | User email |
| credits | Integer | Remaining credits |

### `generated_images` table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID (Primary Key) | Auto-generated |
| user_id | UUID | Linked user ID |
| prompt | Text | User's input prompt |
| image_url | Text | Public URL of stored image |
| storage_path | Text | Internal Supabase Storage path |
| created_at | Timestamp | Generated time |

---

## 📝 Roadmap (Next Phase)

- ✅ Credit deduction system (Done)
- 🚧 Admin Dashboard (In Progress)
- 🚧 Credit refill / purchase flow
- 🚧 User gallery UI
- 🚧 Delete old images
- 🚧 Analytics

---

## 🤝 Contributions

- Pull requests are welcome.
- For major changes, please open an issue first to discuss proposed updates.

---

## 📄 License

This project is licensed under MIT License.

---

## 🙏 Special Thanks

- [Supabase](https://supabase.com/)
- [Fal.ai](https://fal.ai/)
- [Vercel](https://vercel.com/)
