# Cora React Dashboard

A modern, scalable, and strictly-typed React admin dashboard built with Vite, TypeScript, and Tailwind CSS. This project demonstrates enterprise-grade architecture, including role-based access control (RBAC), advanced TypeScript mechanics, and comprehensive testing.

## 🚀 Key Features

- **Strict TypeScript Integration:** Zero usage of `any`. Features advanced mechanics including Generics (reusable UI components like `<DataTable />`), Discriminated Unions (complex form states), and Utility Types.
- **Role-Based Access Control (RBAC):** Secure routing and dynamic UI rendering based on user roles (`admin`, `manager`, `user`).
- **Advanced Form Handling:** Schema-based validation using **Zod** and **React Hook Form** for robust, accessible, and type-safe forms.
- **Component-Driven Development:** UI components are developed, documented, and visually tested in isolation using **Storybook**.
- **Rock-Solid Testing:** Component, unit, and smoke testing powered by **Jest** and **React Testing Library**.

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Routing:** React Router v6
- **State Management:** Zustand (Client State), React Query (Server/Async State)
- **Styling:** Tailwind CSS
- **Forms & Validation:** React Hook Form, Zod
- **Testing:** Jest, React Testing Library
- **UI Documentation:** Storybook

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
