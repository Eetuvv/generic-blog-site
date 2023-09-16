import { useState, useEffect } from "react"
import axios from "axios"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../Authentication/AuthContext"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const { setAuthentication } = useContext(AuthContext)

  const navigate = useNavigate()

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        })

        if (response.status === 200 && response.data.authenticated) {
          setAuthentication(true)
          navigate("/admin")
        }
      } catch (error) {
        console.log(error)
      }
    }
    checkAuthentication()
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setSuccessMsg("Login successful!")
        setErrorMsg("")
        setAuthentication(true)
        navigate("/admin")
      } else {
        setErrorMsg("Failed to login.")
      }
    } catch (err: any) {
      setErrorMsg(
        err.response ? err.response.data.message : "An error occurred"
      )
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-64 p-6 bg-black text-white rounded-md"
      >
        <label className="block mb-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block mb-2">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </label>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Log In
        </button>
      </form>
    </div>
  )
}

export default LoginForm
