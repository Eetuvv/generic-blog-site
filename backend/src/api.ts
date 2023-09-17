import { Request, Response } from "express"
import { MongoClient, Db, Collection, ObjectId } from "mongodb"
import { config as dotenvConfig } from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

dotenvConfig()

const client = new MongoClient(process.env.MONGODB_URI as string)

let db: Db
let postsCollection: Collection<IPost>
let usersCollection: Collection<IUser>

interface IPost {
  _id?: ObjectId
  title: string
  content: string
  titleImageURL?: string
  author: string
  timestamp: Date
}

interface IUser {
  _id?: ObjectId
  username: string
  password: string
}

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server")
    db = client.db("blog")
    postsCollection = db.collection("posts")
    usersCollection = db.collection("users")
  })
  .catch((err: any) => {
    console.error(err)
  })

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000"
const app = express()
app.use(
  cors({
    origin: corsOrigin,
  })
)
app.use(bodyParser.json())

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    return res.status(401).send("Missing authentication token")
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

app.get("/", (req, res) => {
  res.send("API is running 🥳")
})

app.post(
  "/api/posts",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const newPost: IPost = {
        title: req.body.title,
        content: req.body.content,
        titleImageURL: req.body.titleImageURL,
        author: req.body.author,
        timestamp: new Date(),
      }

      const result = await postsCollection.insertOne(newPost)
      res.send({ ...newPost, _id: result.insertedId })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: "Internal server error" })
    }
  }
)

app.get("/api/posts/:postId?", async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId
    let posts
    if (postId) {
      const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
      posts = post ? [post] : []
    } else {
      posts = await postsCollection.find({}).sort({ timestamp: -1 }).toArray()
    }

    res.send(posts)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Internal server error" })
  }
})

app.put(
  "/api/posts/:postId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postId = req.params.postId
      const updatedPost: Partial<IPost> = {
        title: req.body.title,
        content: req.body.content,
        titleImageURL: req.body.titleImageURL,
        author: req.body.author,
      }

      const result = await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: updatedPost }
      )

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .send({ message: "Post not found or not authorized" })
      }

      res.send({ ...updatedPost, _id: postId })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: "Internal server error" })
    }
  }
)

app.delete(
  "/api/posts/:postId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postId = req.params.postId
      const result = await postsCollection.deleteOne({
        _id: new ObjectId(postId),
      })

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .send({ message: "Post not found or not authorized" })
      }

      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: "Internal server error" })
    }
  }
)

app.get(
  "/api/check-auth",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).send({ authenticated: true })
  }
)

app.post("/api/login", async (req: Request, res: Response) => {
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

interface AuthenticatedRequest extends Request {
  user?: any
}

module.exports = app
