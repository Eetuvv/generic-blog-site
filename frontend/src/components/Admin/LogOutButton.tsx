import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../Authentication/AuthContext"

const LogOutButton = () => {
  const { setAuthentication } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      localStorage.removeItem("token")
      setAuthentication(false)
      navigate("/")
      console.log("Logged out successfully")
    } catch (err) {
      console.error("An error occurred while logging out:", err)
    }
  }

  return (
    <button
      className="bg-white text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200"
      onClick={handleLogout}
    >
      Log out
    </button>
  )
}

export default LogOutButton
