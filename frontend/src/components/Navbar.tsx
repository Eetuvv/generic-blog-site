import { Link } from "react-router-dom"
import { FaBlog } from "react-icons/fa"
import { useAuth } from "./Authentication/useAuth"
import LogoutButton from "./Admin/LogOutButton"

const Navbar = () => {
  const { authenticated } = useAuth()
  return (
    <nav className="p-6 bg-black text-white">
      <div className="container mx-auto max-w-screen-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center p-3 hover:bg-gray-800">
              <FaBlog className="w-8 h-8 mr-2" />
              <h1 className="font-bold text-3xl">Blogster</h1>
            </Link>
          </div>
          <ul className="flex items-center">
            <li>
              <Link to="/about" className="p-3 text-2xl hover:bg-gray-800">
                About
              </Link>
            </li>
            {authenticated && <LogoutButton></LogoutButton>}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
