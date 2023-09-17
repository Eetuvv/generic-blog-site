import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { usersCollection } from "../database/db"
import { AuthenticatedRequest } from "../authentication/authentication"

const router = express.Router()

router.post("/api/login", async (req: AuthenticatedRequest, res) => {
  try {
    const { username, password } = req.body
    const user = await usersCollection.findOne({ username })
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    )

    res.status(200).send({ token })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Internal server error" })
  }
})

export default router
