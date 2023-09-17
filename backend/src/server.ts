import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes"
import postRoutes from "./routes/postRoutes"

dotenv.config()

const app = express()
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

export default app
