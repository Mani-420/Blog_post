# Frontend Architecture - Blog Sharing Platform

## Overview
This is a **React + Vite** frontend application for the blog sharing platform. It provides a modern, responsive user interface with state management using **Redux Toolkit**, routing with **React Router**, and rich text editing capabilities.

## Project Structure

```
frontend/
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
├── src/
│   ├── main.jsx          # React app entry point
│   ├── App.jsx           # Root component with routing
│   ├── index.css         # Global styles (Tailwind CSS)
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── redux/            # State management
│   ├── services/         # API service layer
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Rich Text Editor**: TinyMCE
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Development**: Hot Module Replacement (HMR)

## Components Architecture

### Common Components (`components/common/`)

#### Header.jsx
```javascript
// Main site header with navigation
Features:
- Site branding and logo
- Navigation menu
- User authentication status
- Responsive design
```

#### Navbar.jsx
```javascript
// Navigation component
Features:
- Dynamic navigation based on auth status
- Active route highlighting
- Mobile-responsive hamburger menu
- User profile dropdown
```

#### Footer.jsx
```javascript
// Site footer
Features:
- Quick links (Home, Create Blog, Dashboard)
- Account links (Login, Register)
- Brand information
- Copyright notice
```

#### Loader.jsx & Spinner.jsx
```javascript
// Loading states
Features:
- Animated loading indicators
- Customizable size and text
- Used across different components
```

#### ErrorMessage.jsx
```javascript
// Error display component
Features:
- Standardized error presentation
- Retry functionality
- User-friendly error messages
```

#### ProtectedRoute.jsx
```javascript
// Route protection wrapper
Features:
- Authentication requirement enforcement
- Automatic redirect to login
- Preserves intended destination
```

### Blog Components (`components/blog/`)

#### BlogCard.jsx
```javascript
// Individual blog preview card
Features:
- Blog image display
- Title and content preview
- Author information
- Category and tags
- View count and date
- Responsive card layout
```

#### BlogList.jsx
```javascript
// Grid of blog cards
Features:
- Responsive grid layout
- Empty state handling
- Maps through blog array
- Consistent spacing
```

### Review Components (`components/Reviews/`)

#### Review.jsx
```javascript
// Blog review system
Features:
- Review display and creation
- Rating system (1-5 stars)
- Comment functionality
- User authentication integration
```

## Pages Architecture

### Authentication Pages

#### Login.jsx
```javascript
// User login page
Features:
- Email/username and password fields
- Form validation
- Remember me functionality
- Redirect after successful login
- Link to registration page
```

#### Register.jsx
```javascript
// User registration page
Features:
- User details form
- Password confirmation
- Email validation
- Terms acceptance
- Redirect to dashboard after signup
```

### Blog Management Pages

#### Home.jsx
```javascript
// Landing page and blog discovery
Features:
- Hero section with call-to-action
- Search functionality
- Featured blogs display
- Responsive blog grid
- Features section
```

#### CreateBlog.jsx
```javascript
// Blog creation interface
Features:
- Rich text editor (TinyMCE)
- Image upload with preview
- Category and tags input
- Form validation
- Auto-save functionality
- Publication options
```

#### EditBlog.jsx
```javascript
// Blog editing interface
Features:
- Pre-populated form with existing data
- Same rich text editor as create
- Image replacement capability
- Ownership validation
- Update confirmation
```

#### ViewBlog.jsx
```javascript
// Blog reading interface
Features:
- Full blog content display
- Author information
- View count tracking
- Category and tags display
- Review system integration
- Social sharing options
- Navigation aids
```

#### BlogDetail.jsx
```javascript
// Alternative blog view
Features:
- Focused reading experience
- Comment system
- Related posts
- Author profile link
```

### User Interface Pages

#### Dashboard.jsx
```javascript
// User control panel
Features:
- User statistics (blogs, views, reviews)
- User's blog list with management
- Quick actions (create, edit, delete)
- Performance metrics
- Recent activity
```

#### DonatePage.jsx
```javascript
// Author support page
Features:
- Donation amount selection
- Payment integration (Stripe)
- Author appreciation system
- Secure payment processing
```

### Utility Pages

#### NotFound.jsx
```javascript
// 404 error page
Features:
- User-friendly error message
- Navigation back to home
- Search suggestions
- Contact information
```

## State Management (Redux)

### Store Configuration (`redux/store.js`)
```javascript
// Redux store setup
Features:
- RTK configuration
- Middleware setup
- DevTools integration
- Persistence configuration
```

### Auth Slice (`redux/authSlice.js`)
```javascript
// Authentication state management
State:
- user: Current user data
- isAuthenticated: Login status
- isLoading: Loading states
- error: Error messages

Actions:
- setUser: Set current user
- clearUser: Logout user
- setAuthLoading: Loading states
- setAuthError: Error handling
```

### Blog Slice (`redux/blogSlice.js`)
```javascript
// Blog state management
State:
- blogs: All blogs array
- currentBlog: Currently viewed blog
- userBlogs: Current user's blogs
- isLoading: Loading states
- isCreating: Blog creation state
- isUpdating: Blog update state
- error: Error messages
- searchQuery: Current search term
- pagination: Pagination data

Actions:
- setBlogsSuccess: Set blogs list
- setCurrentBlog: Set current blog
- setUserBlogs: Set user's blogs
- createBlogSuccess: Add new blog
- updateBlogSuccess: Update existing blog
- deleteBlogSuccess: Remove blog
- setBlogsLoading: Loading states
- setBlogError: Error handling
- setSearchQuery: Search functionality
```

## Services Layer (API Integration)

### API Configuration (`services/api.js`)
```javascript
// Axios instance configuration
Features:
- Base URL configuration
- Request/response interceptors
- Authentication token handling
- Error response processing
- Request timeout configuration
```

### Authentication Service (`services/authService.js`)
```javascript
// Authentication API calls
Functions:
- register(userData): User registration
- login(credentials): User login
- logout(): User logout
- refreshToken(): Token refresh
- getCurrentUser(): Get user profile
- isLoggedIn(): Check auth status
```

### Blog Service (`services/blogService.js`)
```javascript
// Blog-related API calls
Functions:
- getAllBlogs(params): Fetch all blogs
- getBlogById(id): Get single blog
- createBlog(formData): Create new blog
- updateBlog(id, formData): Update blog
- deleteBlog(id): Delete blog
- getUserBlogs(): Get user's blogs
- getBlogsByAuthor(authorId): Get author's blogs
```

### Comment Service (`services/commentService.js`)
```javascript
// Comment system API calls
Functions:
- getComments(blogId): Fetch blog comments
- createComment(blogId, data): Add comment
- updateComment(id, data): Update comment
- deleteComment(id): Delete comment
```

### Review Service (`services/reviewService.js`)
```javascript
// Review system API calls
Functions:
- getReviews(blogId): Fetch blog reviews
- createReview(blogId, data): Add review
- updateReview(id, data): Update review
- deleteReview(id): Delete review
```

## Routing Structure

### App.jsx - Route Configuration
```javascript
// Main routing setup
Routes:
- / : Home page (public)
- /login : Login page (guest only)
- /register : Register page (guest only)
- /blogs/:id : View blog (public)
- /view-blog/:id : Alternative blog view (public)
- /blogs/create-blog : Create blog (protected)
- /blogs/edit-blog/:id : Edit blog (protected)
- /dashboard : User dashboard (protected)
- /donate/:blogId : Donation page (public)
- * : 404 Not Found
```

### Route Protection
```javascript
// Protected route implementation
- ProtectedRoute wrapper component
- Automatic redirect to login
- Preserve intended destination
- Auth state checking
```

## Styling System

### Tailwind CSS Integration
```javascript
// Utility-first CSS framework
Features:
- Responsive design utilities
- Component-based styling
- Custom color palette
- Spacing and typography scales
- Hover and focus states
```

### Responsive Design
```javascript
// Mobile-first approach
Breakpoints:
- sm: 640px and up
- md: 768px and up  
- lg: 1024px and up
- xl: 1280px and up
- 2xl: 1536px and up
```

## Key Features Implementation

### Rich Text Editing
```javascript
// TinyMCE integration
Features:
- WYSIWYG editor
- Toolbar customization
- Content validation
- Auto-save functionality
- Image insertion
- Link management
```

### Image Upload System
```javascript
// File upload handling
Features:
- Drag and drop interface
- Image preview
- File type validation
- Size limit enforcement
- Progress indicators
- Error handling
```

### Search Functionality
```javascript
// Blog search implementation
Features:
- Real-time search
- Multi-field search (title, content, author)
- Search result highlighting
- No results handling
- Search history
```

### Authentication Flow
```javascript
// User authentication system
Features:
- JWT token management
- Automatic token refresh
- Session persistence
- Logout handling
- Route protection
```

### Pagination System
```javascript
// Data pagination
Features:
- Page-based navigation
- Configurable page sizes
- Total count display
- Navigation controls
- Loading states
```

## Error Handling

### Global Error Boundary
```javascript
// Application error catching
Features:
- Unhandled error catching
- User-friendly error display
- Error reporting
- Recovery suggestions
```

### API Error Handling
```javascript
// Network error management
Features:
- HTTP status code handling
- Network failure detection
- Retry mechanisms
- User notifications
- Fallback content
```

## Performance Optimizations

### Code Splitting
```javascript
// Bundle optimization
Features:
- Route-based splitting
- Dynamic imports
- Lazy loading
- Bundle analysis
```

### State Management Optimization
```javascript
// Redux performance
Features:
- Selective subscriptions
- Memoized selectors
- Normalized state
- Efficient updates
```

### Image Optimization
```javascript
// Media handling
Features:
- Lazy loading
- Responsive images
- Format optimization
- Placeholder images
```

## User Experience Features

### Loading States
```javascript
// UX improvements
Features:
- Skeleton screens
- Progress indicators
- Smooth transitions
- Optimistic updates
```

### Notifications
```javascript
// User feedback system
Features:
- Success messages
- Error notifications
- Action confirmations
- Auto-dismiss timers
```

### Form Validation
```javascript
// Input validation
Features:
- Real-time validation
- Error message display
- Field highlighting
- Submission prevention
```

## Build and Development

### Vite Configuration
```javascript
// Development and build setup
Features:
- Hot Module Replacement
- Fast refresh
- Environment variables
- Build optimization
- Development server
```

### Environment Management
```javascript
// Configuration management
Variables:
- VITE_API_BASE_URL: Backend API URL
- VITE_TINYMCE_API_KEY: TinyMCE API key
- VITE_STRIPE_PUBLIC_KEY: Stripe public key
```

## Security Considerations

### Input Sanitization
```javascript
// XSS prevention
Features:
- HTML sanitization
- Input validation
- Output encoding
- Content Security Policy
```

### Authentication Security
```javascript
// Auth security measures
Features:
- Secure token storage
- Automatic logout
- Session timeout
- CSRF protection
```

### API Security
```javascript
// Network security
Features:
- HTTPS enforcement
- CORS configuration
- Request validation
- Rate limiting awareness
```

## Deployment Considerations

### Build Optimization
```javascript
// Production build
Features:
- Code minification
- Tree shaking
- Asset optimization
- Bundle splitting
```

### Static Asset Handling
```javascript
// Asset management
Features:
- CDN readiness
- Cache headers
- Compression support
- Fallback handling
```

This frontend architecture provides a modern, scalable, and maintainable foundation for the blog sharing platform with excellent user experience, performance, and security features.
