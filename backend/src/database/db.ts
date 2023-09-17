import { MongoClient, Db, Collection, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI as string)

export interface IPost {
  _id?: ObjectId
  title: string
  content: string
  titleImageURL?: string
  author: string
  timestamp: Date
}

export interface IUser {
  _id?: ObjectId
  username: string
  password: string
}

let db: Db
export let postsCollection: Collection<IPost>
export let usersCollection: Collection<IUser>

export const initializeDatabase = async () => {
  try {
    await client.connect()
    console.log("Connected successfully to server")
    db = client.db("blog")
    postsCollection = db.collection("posts")
    usersCollection = db.collection("users")
  } catch (err) {
    console.error(err)
  }
}
