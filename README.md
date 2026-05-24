# 🍜 Rabix GO

> Restaurant Review & Discovery Platform — ค้นหาร้านอาหาร รีวิว และจัดอันดับร้านค้า

---

## 🛠️ Tech Stack

### Backend
| Package | Version | หน้าที่ |
|---|---|---|
| Express.js | ^5.2.1 | Web framework |
| PostgreSQL (pg) | ^8.20.0 | Database |
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT access + refresh token |
| express-rate-limit | ^8.5.1 | Rate limiting (5 req / 5 min) |
| cors | ^2.8.6 | Cross-origin resource sharing |
| dotenv | ^17.4.2 | Environment variables |
| crypto (built-in) | Node.js built-in | Hash refresh token ด้วย SHA-256 |
| nodemon | ^3.1.14 | Auto-restart on dev |

### Frontend
| Package | Version | หน้าที่ |
|---|---|---|
| React | ^19.2.5 | UI framework |
| React Router DOM | ^7.15.0 | Client-side routing |
| Tailwind CSS | ^4.3.0 | Utility-first styling |
| Vite | ^8.0.10 | Build tool + dev server |
| Lucide React | ^1.14.0 | Icon library |

### Infrastructure
| Tool | Version | หน้าที่ |
|---|---|---|
| Docker Compose | - | Multi-service orchestration |
| PostgreSQL | 16 | Database container |

---

## 🏗️ Project Structure

```
Rabix-Go/
├── backend/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js  # register, login, logout, getUser
│   │   └── restaurantController.js # CRUD restaurants
│   ├── middleware/
│   │   ├── verifyToken.js     # JWT auth middleware
│   │   └── rateLimit.js       # Rate limit สำหรับ auth routes
│   ├── routers/
│   │   ├── authRouter.js
│   │   └── restaurantRouter.js
│   ├── utils/
│   │   ├── jwt.js             # generateAccessToken, generateRefreshToken
│   │   └── hashToken.js       # SHA-256 hash สำหรับ refresh token
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RestaurantCard.jsx
│   │   ├── CreateRestaurantModal.jsx
│   │   └── FormElements.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Restaurants.jsx
│   └── src/
│       ├── App.jsx
│       └── main.jsx
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose

### Run with Docker

```bash
# Clone repo
git clone https://github.com/username/rabix-go.git
cd rabix-go

# สร้าง .env จาก template
cp .env.example .env

# Start ทุก service
docker-compose up -d
```

Services ที่รันขึ้นมา:
- Frontend → http://localhost:5173
- Backend API → http://localhost:3000
- PostgreSQL → localhost:5432

### Run Locally (without Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (terminal ใหม่)
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Auth — `/auth`
```
POST /auth/register       # สมัครสมาชิก
POST /auth/login          # เข้าสู่ระบบ → return accessToken + refreshToken
POST /auth/logout         # ออกจากระบบ (ลบ refresh token จาก DB)
PATCH /auth/rePassword/:id # เปลี่ยนรหัสผ่าน
GET  /auth/getUser        # ดู users ทั้งหมด (admin only)
```

### Restaurants — `/restaurants`
```
GET  /restaurants         # ดูร้านทั้งหมด (pagination)
GET  /restaurants/filter  # filter ตาม address
POST /restaurants/create-Restaurant  # สร้างร้าน (ต้อง login)
```

---

## 🔐 Auth Flow

```
Register → bcrypt hash password → save to DB
Login    → compare password → generate JWT (15m) + Refresh Token (7d)
         → hash refresh token ด้วย SHA-256 → save hash ลง DB
Logout   → hash token → delete จาก DB
```

---

## ⚙️ Environment Variables

```env
# Database
PG_USER=
PG_HOST=db
PG_DB=
PG_PASSWORD=
PG_PORT=5432

# PostgreSQL Docker
POSTGRES_USER=
POSTGRES_DB=
POSTGRES_PASSWORD=

# JWT
ACCESS_JWT_SECRET=
REFRESH_JWT_SECRET=
```
