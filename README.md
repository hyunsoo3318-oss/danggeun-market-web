# Secondhand Market — Web Client

> _A second-hand marketplace with live auctions, in-app messaging, and a virtual wallet — the React web client for Waffle Studio 23.5 Team 9._

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## Overview

Single-page web client for a peer-to-peer second-hand marketplace. It pairs product listings with **live auctions**, **direct chat between buyers and sellers**, and a **virtual-currency wallet** for deposits, withdrawals, and transfers, all served from a FastAPI backend. The app is built with React 19 and TypeScript on Vite, organized as a **feature-sliced architecture** where each domain (auth, product, chat, pay, user, location, image) owns its own API layer, hooks, components, and pages. Server state is managed end-to-end with TanStack Query, while lightweight client/UI state lives in Zustand stores, and all backend communication flows through a single axios instance with automatic JWT refresh.

## Technical Highlights

- **Feature-sliced structure.** Code is split by domain under `src/features/*`, each with its own `api/`, `hooks/`, `components/`, and `pages/`, on top of a shared layer (`src/shared/*`) providing the axios client, design-system UI primitives, layouts, i18n, and global stores. A `@/` path alias maps to `src/`.
- **Centralized API client with token rotation.** A single axios instance injects the `Bearer` access token via a request interceptor (skippable per-request with a `skipAuth` flag for public endpoints like product listing). A response interceptor catches `401`s, transparently calls `/api/auth/tokens/refresh` with the refresh token, retries the original request, and **queues concurrent failed requests** behind a single in-flight refresh to avoid a refresh stampede. On refresh failure it logs the user out.
- **JWT auth + Google OAuth.** Access and refresh tokens are persisted in `localStorage` and mirrored into a Zustand `useAuthStore` as the single source of truth. Email/password login hits `/api/auth/tokens`; Google login redirects to the backend OAuth endpoint, which returns `access_token`/`refresh_token` as URL query params that the client captures, stores, and clears from the address bar. New social/email users without a nickname or region are routed into an onboarding flow before reaching the app.
- **Live auctions.** Products can be listed as auctions with an `end_at` deadline. The detail page runs a `setInterval` countdown that re-renders the remaining time every second, validates bids client-side (must exceed the current price), and posts to `/api/auction/{id}/bids`, then refetches to reflect the new high bid. Auction vs. regular listings are filtered throughout via an `auction` query flag.
- **Real-time-style chat via polling.** Chat is HTTP-based: rooms and messages are fetched through TanStack Query with tunable `refetchInterval` polling (intervals centralized in `shared/config/polling.ts`), giving near-live updates without a WebSocket connection. Sent messages are written directly into the query cache for instant feedback, unread counts are aggregated across rooms, and a read-receipt endpoint clears unread state.
- **Virtual wallet & payments.** A pay feature wraps deposit, withdraw, and transfer endpoints (`/api/pay/*`), with balance checks before withdrawal, idempotency via a `request_key`, and a paginated transaction history. Mutations invalidate the user balance and transaction queries to keep the wallet in sync.
- **Image uploads with reordering.** Listing creation supports multi-file upload via drag-and-drop or file picker, with per-file progress tracking, object-URL previews, server-side persistence returning image IDs, and **SortableJS drag-to-reorder** to choose the cover image.
- **Region-scoped browsing.** A cascading 시/도 → 시/군/구 → 동 (province → district → neighborhood) region selector backs location-based filtering, with a "find my location" option using the browser Geolocation API and an IP-based geolocation fallback when GPS is denied or unavailable.
- **Bilingual UI + on-demand content translation.** A typed i18n layer ships full Korean and English string tables selected via a Zustand language store. Beyond static UI strings, listing titles/descriptions can be translated on demand through the Google Translate endpoint, with automatic source-language detection.
- **Design system & theming.** UI is built from reusable primitives (Button, Input, Modal, Card, Badge, Avatar, NavBar, etc.) styled with Tailwind CSS 4, `class-variance-authority` for variant management, and a `cn()` helper (`clsx` + `tailwind-merge`). A Zustand theme store toggles light/dark mode by applying a `dark` class on the document root and persisting the choice.
- **Form handling.** Forms use React Hook Form with Zod schemas via `@hookform/resolvers` for validation (e.g. requiring an end time when a listing is marked as an auction).

## Architecture

The client is a Vite-built React SPA that renders into a single `MainLayout` shell, with all routes declared in `App.tsx` using React Router v7. Routing covers the marketplace (`/products`, `/products/:id`), seller profiles (`/user/:userId`), chat (`/chat`, `/chat/:chatId`), and a tabbed "My Market" account area (`/my/*` for products, profile, wallet/coin, transactions, and password), plus auth pages (`/auth/login`, `/auth/signup`, `/auth/onboarding`).

State is cleanly split: **TanStack Query** owns all server state (products, chat, wallet, user) — including caching, background refetch/polling, and cache invalidation on mutation — while **Zustand** holds session/UI state (auth tokens, theme, language, region, product filters), several stores hydrating from and persisting to `localStorage`. An `useAuthQuerySync` effect bridges the two, refetching the current user on login and clearing the query cache on logout.

All backend calls target the FastAPI server through the shared axios client. In development, Vite proxies `/api` to the dev server (`changeOrigin`), so the client uses a relative base URL and avoids CORS; in production the API base URL points directly at the deployed backend. Authentication, auctions, chat, pay, products, images, users, and regions are all consumed as REST endpoints under `/api/*`.

The app is deployed via a GitHub Actions workflow that builds with `npm run build` and publishes the static bundle to **GitHub Pages** and to **AWS S3 + CloudFront** (with cache invalidation) on every push to `main`. A `vercel.json` is also included with an `/api` rewrite to the backend and an SPA catch-all rewrite for Vercel-style hosting.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.9
- **Build tool:** Vite 7 (`@vitejs/plugin-react`)
- **Routing:** React Router DOM 7
- **Server state / data fetching:** TanStack Query 5 (+ Query Devtools)
- **Client state:** Zustand 5
- **HTTP:** Axios 1.x (single instance with auth + refresh interceptors)
- **Forms & validation:** React Hook Form 7 + Zod 4 (`@hookform/resolvers`)
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/postcss`), `class-variance-authority`, `clsx`, `tailwind-merge`
- **Drag & drop reorder:** SortableJS
- **Tooling:** ESLint 9, TypeScript, `gh-pages`
- **Deployment:** GitHub Actions → GitHub Pages + AWS S3/CloudFront (Vercel config included)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

This starts Vite on the default port. The dev server proxies `/api/*` to the backend (`https://dev.server.team9-toy-project.p-e.kr`), so no extra configuration is needed to talk to the API while developing.

### Other scripts

```bash
npm run build     # production build (also emits a 404.html SPA fallback)
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm run deploy    # build and publish to GitHub Pages via gh-pages
```

### Configuration

The backend base URL is resolved in `src/shared/api/config.ts`: in development it is empty (so requests go through the Vite `/api` proxy), and in production it points at the deployed backend. There are **no `.env` files required** to run locally — the dev proxy target and backend/OAuth URLs are configured in code (`vite.config.js`, `src/shared/api/config.ts`, and `src/features/auth/api/config.ts`). Google OAuth is initiated by redirecting to the backend's `/api/auth/oauth2/login/google` endpoint, which returns tokens back to the client; the OAuth client configuration itself lives on the backend.
