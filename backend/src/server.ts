import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes"
import postRoutes from "./routes/postRoutes"
import { initializeDatabase } from "./database/db"

dotenv.config()

const app = express()

const setupServer = async () => {
  try {
    await initializeDatabase()

    const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000"
    app.use(
      cors({
        origin: corsOrigin,
      })
    )
    app.use(bodyParser.json())

    app.use(authRoutes)
    app.use(postRoutes)

    app.get("/", (req, res) => {
      res.send("API is running 🥳")
    })

    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  } catch (err) {
    console.error("Failed to start the server:", err)
  }
}

setupServer().catch((err) => console.error(err))

export default app
