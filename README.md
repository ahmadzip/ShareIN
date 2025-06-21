# SHARAEIN - Real-time File Sharing Application

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Backend-Express.js-green?style=for-the-badge&logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react" alt="React.js">
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Real--time-Socket.IO-010101?style=for-the-badge&logo=socket.io" alt="Socket.IO">
</div>

## 📖 Description

SHARAEIN is a modern, real-time file sharing application that allows users to create password-protected rooms and share files instantly with other users. Originally created for a backend development assignment, this project was built with genuine passion and addresses a real-world problem.

### 💡 The Problem It Solves

In our daily lives, people often resort to logging into WhatsApp or Telegram on public computers just to transfer files from their phones to computers. This creates a significant security risk as users frequently forget to log out of their personal accounts on public machines, potentially exposing their private conversations and data.

SHARAEIN eliminates this outdated and risky practice by providing a secure, temporary, and password-protected environment for file sharing without requiring any personal account login. Simply create a room, share the ID and password, transfer your files, and close the session - no personal data left behind.

## 👥 Team Members

This project was developed by:

- **5220411082** - Restu Sofyan Ma'arif
- **5220411358** - Musyafa Ali
- **5220411084** - Ahmad Sulaeman

---

### 🚀 Key Features

- **Create Private Rooms**: Generate unique 6-character room IDs
- **Password Protection**: Secure rooms with custom passwords
- **Easy Access**: Simple room joining with ID and password
- **Real-time Updates**: Instant notifications when users join/leave
- **Universal File Support**: Upload ANY file type without restrictions
- **Large File Support**: Up to 500MB file size limit
- **Drag & Drop**: Modern file upload interface
- **Real-time Sync**: Files appear instantly for all room members
- **Smart Icons**: Automatic file type detection with appropriate icons
- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: bcrypt encryption for room passwords
- **Route Protection**: Prevent unauthorized room access
- **Token Validation**: Secure file download with token verification
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Live connection status indicators
- **Toast Notifications**: User-friendly feedback messages
- **Tailwind CSS**: Beautiful and consistent styling

## 🛠️ Tech Stack

### Backend

- **Framework:** Express.js with TypeScript
- **Database:** SQLite with Prisma ORM
- **Real-time:** Socket.IO for live updates
- **Authentication:** JWT + bcrypt
- **Validation:** Zod schemas
- **File Upload:** Multer middleware

### Frontend

- **Library:** React.js with TypeScript
- **Build Tool:** Vite for fast development
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git (optional)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd sharaein
```

2. **Setup Backend**

```bash
cd server
npm install
cp .env.example .env
# Edit .env file with your configuration
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

3. **Setup Frontend** (in new terminal)

```bash
cd client
npm install
cp .env.example .env
# Edit .env file with your backend URLs
npm run dev
```

4. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## ⚙️ Configuration

### Backend Environment Variables (.env)

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

### Frontend Environment Variables (.env)

```bash
VITE_API_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3000"
```

## 🌐 Dev Tunnels Support

For accessing from external devices or sharing with others:

1. **Create dev tunnels**

```bash
# Backend tunnel
devtunnel host -p 3000 --allow-anonymous

# Frontend tunnel
devtunnel host -p 5173 --allow-anonymous
```

2. **Update environment variables** with tunnel URLs

The application includes auto-detection for dev tunnel environments!

## 📁 Project Structure

```
sharaein/
├── server/                 # Backend Express.js
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── src/
│   │   ├── controllers/   # API logic
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Socket.IO handlers
│   │   ├── utils/         # Utilities & middleware
│   │   └── index.ts       # Server entry point
│   ├── uploads/           # File storage
│   └── .env.example       # Environment template
├── client/                # Frontend React.js
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API & Socket clients
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript definitions
│   └── .env.example       # Environment template
└── README.md
```

## 🔌 API Endpoints

### Room Management

- `POST /api/rooms` - Create new room
- `POST /api/rooms/join` - Join existing room
- `GET /api/rooms/:roomId/files` - Get room files

### File Operations

- `POST /api/files/rooms/:roomId/upload` - Upload file
- `DELETE /api/files/:fileId` - Delete file
- `GET /api/files/:fileId/download` - Download file

### Health Check

- `GET /api/health` - Server health status

## 🎯 Socket.IO Events

### Client → Server

- `join_room` - Join specific room
- `leave_room` - Leave room

### Server → Client

- `new_file` - New file uploaded
- `file_deleted` - File deleted
- `user_joined` - User joined room
- `user_left` - User left room

## 🔒 Security Features

- **Password Protection** - All rooms secured with hashed passwords
- **JWT Authentication** - Secure session management
- **Route Guards** - Protected routes prevent unauthorized access
- **Input Validation** - Server-side validation with Zod
- **CORS Protection** - Configured for secure cross-origin requests
- **File Size Limits** - 500MB maximum file size

## 📱 Supported File Types

SHARAEIN supports **ALL file types** including:

- 📄 **Documents** - PDF, Word, Excel, PowerPoint
- 🖼️ **Images** - JPEG, PNG, GIF, SVG, WebP
- 🎵 **Audio** - MP3, WAV, FLAC, OGG
- 🎬 **Video** - MP4, AVI, MOV, MKV
- 📦 **Archives** - ZIP, RAR, 7Z, TAR, ISO
- 💻 **Code** - JS, TS, Python, Java, C++
- 🔧 **Executables** - EXE, MSI, APP, DEB
- **And ANY other file format!**

## 🎥 Demo Video

![Demo](https://github.com/ahmadzip/ShareIN/blob/main/demo.gif)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Future Roadmap & TODO

### 📋 Planned Features

- [ ] **File Preview** - View images, PDFs, videos directly in browser
- [ ] **Room Member List** - Show who's currently in the room
- [ ] **User Management** - Kick users from room (room creator only)
- [ ] **Room Settings** - Edit room name and change password
- [ ] **Dark Mode** - Toggle between light and dark themes
- [ ] **File Search** - Search and filter files by name/type
- [ ] **Mobile PWA** - Progressive Web App for better mobile experience

### 🎯 Contributing

Want to help implement these features? Feel free to:

1. Pick an item from the TODO list
2. Create an issue to discuss implementation
3. Submit a pull request

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for simple, secure file sharing
- Thanks to the open-source community

<div align="center">
  <p>Made with ❤️ for seamless file sharing</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
