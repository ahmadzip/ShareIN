# SHARAEIN - File Sharing Application

Aplikasi web full-stack untuk berbagi file secara real-time dalam room privat yang dilindungi kata sandi.

## 🚀 Fitur Utama

1. **Manajemen Room**
   - Buat room baru dengan nama dan kata sandi
   - ID room unik 6 digit alfanumerik
   - Join room dengan ID dan kata sandi

2. **Berbagi File Real-time**
   - Upload file dalam room
   - Download file dari room
   - Delete file dengan sinkronisasi real-time
   - Update otomatis tanpa refresh halaman

3. **Keamanan**
   - Password hashing dengan bcrypt
   - JWT authentication
   - File storage di server lokal

## 🛠️ Tech Stack

### Backend
- **Framework:** Express.js + TypeScript
- **Real-time:** Socket.IO
- **Database:** SQLite
- **ORM:** Prisma
- **Validasi:** Zod
- **Keamanan:** bcrypt, JWT

### Frontend
- **Library:** React.js + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Socket Client:** Socket.IO Client

## 📁 Struktur Proyek

```
sharaein/
├── server/                 # Backend Express.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── uploads/           # File storage
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── client/                # Frontend React.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🏗️ Arsitektur

### Database Schema
- **Room:** id, name, password (hashed), createdAt
- **File:** id, filename, path, mimetype, size, roomId, createdAt

### API Endpoints
- `POST /api/rooms` - Buat room baru
- `POST /api/rooms/join` - Join room dengan ID dan password
- `GET /api/rooms/:roomId/files` - Ambil daftar file dalam room
- `POST /api/rooms/:roomId/upload` - Upload file ke room
- `DELETE /api/files/:fileId` - Hapus file dari room
- `GET /uploads/:filename` - Download file

### Socket.IO Events
- `join_room` - Join ke room tertentu
- `new_file` - Broadcast file baru ke semua anggota room
- `file_deleted` - Broadcast penghapusan file ke semua anggota room

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd sharaein
```

2. Setup Backend
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

4. Akses aplikasi di `http://localhost:5173`

## 🔧 Development Guide

Lihat file dokumentasi individual di setiap folder untuk panduan pengembangan lebih detail.

## 📝 License

MIT License