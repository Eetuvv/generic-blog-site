import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../Authentication/AuthContext"
import axios from "axios"

const LogOutButton = () => {
  const { setAuthentication } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setAuthentication(false)
        localStorage.removeItem("authenticated")
        navigate("/")
        console.log("Logged out successfully")
      } else {
        console.error("Error logging out")
      }
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
