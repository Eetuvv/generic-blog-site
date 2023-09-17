import express, { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { postsCollection, IPost } from "../database/db"
import {
  AuthenticatedRequest,
  authenticateToken,
} from "../authentication/authentication"

const router = express.Router()
router.post(
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
      res.status(201).send({ ...newPost, _id: result.insertedId })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: "Internal server error" })
    }
  }
)

router.get(
  "/api/posts/:postId?",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postId = req.params.postId
      if (postId) {
        const post = await postsCollection.findOne({
          _id: new ObjectId(postId),
        })
        return res.send(post || {})
      }
      const posts = await postsCollection
        .find({})
        .sort({ timestamp: -1 })
        .toArray()
      res.send(posts)
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: "Internal server error" })
    }
  }
)

router.put(
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

router.delete(
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

export default router
