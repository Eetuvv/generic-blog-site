import { Request, Response } from "express"
import { MongoClient, Db, Collection } from "mongodb"
import { config as dotenvConfig } from "dotenv"
import { ReturnDocument } from "mongodb"

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

dotenvConfig()

const client = new MongoClient(process.env.MONGODB_URI as string)

let db: Db
let postsCollection: Collection
let countersCollection: Collection

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server")
    db = client.db("blog")
    postsCollection = db.collection("posts")
    countersCollection = db.collection("counters")
  })
  .catch((err: any) => {
    console.error(err)
  })

async function getNextSequenceValue(name: string): Promise<number> {
  const sequenceDocument = await countersCollection.findOneAndUpdate(
    { _id: name as any },
    { $inc: { seq: 1 } },
    { returnDocument: ReturnDocument.AFTER } // Updated option here
  )
  return sequenceDocument.value.seq
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

interface IPost {
  id: number
  title: string
  content: string
  imgURL?: string
}

app.get("/api/posts/:postId?", async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId

    let posts

    if (postId) {
      const post = await postsCollection.findOne({ id: Number(postId) })
      posts = post ? [post] : []
    } else {
      posts = await postsCollection.find({}).toArray()
    }

    res.send(posts)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Internal server error" })
  }
})

app.post("/api/posts", async (req: Request, res: Response) => {
  try {
    const id = await getNextSequenceValue("postId")
    const newPost: IPost = {
      id,
      title: req.body.title,
      content: req.body.content,
      imgURL: req.body.imgURL,
    }

    await postsCollection.insertOne(newPost)
    res.send(newPost)
  } catch (err) {
    res.status(500).send(err)
  }
})

// const PORT = process.env.PORT || 5001
const PORT = 5001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
