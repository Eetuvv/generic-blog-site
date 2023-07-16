import { Route, Routes } from "react-router-dom"
import { AuthProvider } from "./components/Authentication/AuthContext"
import Navbar from "./components/Navbar"
import BlogFeed from "./components/BlogFeed"
import About from "./components/About"
import Footer from "./components/Footer"
import BlogPost from "./components/BlogPost"
import AdminView from "./components/Admin/AdminView"
import LoginForm from "./components/Authentication/LoginForm"

function App() {
  return (
    <AuthProvider>
      <div className="bg-black flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<BlogFeed />} />
            <Route path="/posts/:postId" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
