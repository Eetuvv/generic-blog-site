import React from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import BlogFeed from "./components/BlogFeed"
import About from "./components/About"
import Footer from "./components/Footer"
import BlogPost from "./components/BlogPost"

function App() {
  return (
    <div className="bg-black flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<BlogFeed />} />
          <Route path="/posts/:postId" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
