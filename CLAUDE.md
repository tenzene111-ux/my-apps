# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyMarket — a full-featured e-commerce marketplace (Amazon/Alibaba-style) with multi-vendor support.

## Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS, in `frontend/`
- **Backend**: Express.js REST API + MongoDB (Mongoose), in `backend/`
- **Real-time**: Socket.IO for buyer-seller messaging
- **State**: Zustand (`frontend/src/lib/store.ts`) — auth, cart state
- **API client**: `frontend/src/lib/api.ts` — token-based fetch wrapper

## Commands

```bash
npm run install:all    # Install all dependencies (root + frontend + backend)
npm run dev            # Start both frontend (port 3000) and backend (port 5000)
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
```

## Backend Structure

- `backend/src/server.js` — Express app entry, Socket.IO setup
- `backend/src/models/` — Mongoose schemas: User, Product, Order, Cart, Review, Message
- `backend/src/routes/` — REST endpoints: auth, products, cart, orders, reviews, messages, admin
- `backend/src/middleware/auth.js` — JWT auth + role-based authorization

### Key patterns

- All routes use `protect` middleware for auth, `authorize('seller', 'admin')` for role checks
- Product images uploaded via multer to `backend/uploads/`
- Orders are created from the user's cart, stock is decremented atomically
- Reviews auto-update product rating via aggregation

## Frontend Structure

- `frontend/src/app/` — Next.js App Router pages
- `frontend/src/components/` — Reusable components organized by feature
- `frontend/src/lib/api.ts` — API client with auto-token injection
- `frontend/src/lib/store.ts` — Global state (Zustand)

### Roles

- **buyer**: Browse, cart, checkout, orders, reviews, messaging
- **seller**: All buyer features + product management, seller dashboard, order fulfillment
- **admin**: Full platform control via `/admin` dashboard

## Environment

Backend requires `.env` — copy from `.env.example`. MongoDB must be running locally.
