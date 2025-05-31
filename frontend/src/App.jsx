import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ViewBlog from './pages/ViewBlog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogs/:id" element={<ViewBlog />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/create-blog"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/edit-blog/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
    </BrowserRouter>
  );
}

export default App;
