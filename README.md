# 📝 Blog Sharing Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) blog sharing platform where users can create, read, update, and delete blog posts with authentication, rich text editing, and review system.

## 🌟 Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication with refresh tokens
- Protected routes and middleware
- User profile management
- Secure password hashing with bcrypt

### 📚 Blog Management
- Create blogs with rich text editor (TinyMCE)
- Edit and delete own blogs
- Image upload for blog covers
- Categories and tags system
- View tracking and analytics
- Search functionality across title, content, and author

### 💬 Review & Engagement System
- Review and rating system (1-5 stars)
- Comment on blogs
- Average rating calculation
- Review management (edit/delete own reviews)

### 📊 User Dashboard
- Personal blog statistics
- Total views and engagement metrics
- Recent blog activity
- Blog management interface

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Loading states and error handling
- Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **TinyMCE** - Rich text editor
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mani-420/Blog_post.git
   cd Blog_post
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/blogdb
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_TINYMCE_API_KEY=your_tinymce_api_key_here
   ```

5. **Start the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

## 📁 Project Structure

```
Blog_post/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # State management
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend
│   ├── controllers/         # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── utils/              # Utility functions
│   ├── public/uploads/     # Uploaded files
│   └── package.json
└── README.md
```

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home-page.png)

### Blog Creation
![Create Blog](./screenshots/create-blog.png)

### Blog Detail View
![Blog Detail](./screenshots/blog-detail.png)

### User Dashboard
![Dashboard](./screenshots/dashboard.png)

### Login Page
![Login](./screenshots/login.png)

### Registration Page
![Register](./screenshots/register.png)

## 🎥 Demo Video

[Watch the demo video](./demo/blog-platform-demo.mp4)

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/profile` - Get current user profile

### Blogs
- `GET /api/v1/blogs` - Get all blogs (with search and pagination)
- `GET /api/v1/blogs/:id` - Get single blog
- `POST /api/v1/blogs/create-blog` - Create new blog
- `PUT /api/v1/blogs/edit-blog/:id` - Update blog
- `DELETE /api/v1/blogs/:id` - Delete blog
- `GET /api/v1/blogs/user` - Get user's blogs
- `GET /api/v1/blogs/author/:authorId` - Get blogs by author

### Reviews
- `GET /api/v1/blogs/:blogId/reviews` - Get blog reviews
- `POST /api/v1/blogs/:blogId/reviews` - Create/update review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

## 💡 Key Features Explained

### Authentication System
- JWT tokens with access/refresh token rotation
- HTTP-only cookies for security
- Protected routes with middleware
- Password hashing with bcrypt

### Rich Text Editor
- TinyMCE integration for blog content
- WYSIWYG editing experience
- HTML content storage and rendering
- Image insertion capabilities

### File Upload
- Multer middleware for image handling
- Local file storage in `public/uploads/`
- Unique filename generation
- Image preview in forms

### Search & Pagination
- Multi-field search (title, content, author)
- Efficient pagination with skip/limit
- Search highlighting and filtering
- Responsive design for all screen sizes

### Review System
- 1-5 star rating system
- One review per user per blog
- Average rating calculation
- CRUD operations for reviews

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **CORS Configuration**: Proper origin handling
- **Route Protection**: Middleware-based protection
- **Error Handling**: Consistent error responses

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Future Enhancements

- [ ] Email notifications for new blogs
- [ ] Social media integration
- [ ] Advanced search filters
- [ ] Blog categories management
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Blog analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mani-420**
- GitHub: [@Mani-420](https://github.com/Mani-420)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [TinyMCE](https://www.tiny.cloud/) for the rich text editor
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [MongoDB](https://www.mongodb.com/) for the database
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework

## 📊 Project Statistics

- **Total Lines of Code**: ~10,000+
- **Components**: 25+
- **API Endpoints**: 15+
- **Database Models**: 4
- **Features**: 20+

---

⭐ If you found this project helpful, please give it a star on GitHub!

🐛 Found a bug? Please open an issue.

💡 Have a suggestion? Feel free to create a feature request.

---

*Built with ❤️ using the MERN stack*
