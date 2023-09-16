import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { IPost } from "../../types/post"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const useAdminUtils = (
  posts: IPost[],
  setPosts: Dispatch<SetStateAction<IPost[]>>
) => {
  const handleAddPost = async (newPost: IPost, afterAdd: () => void) => {
    try {
      await axios.post(`${API_BASE_URL}/posts`, newPost, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      const response = await axios.get(`${API_BASE_URL}/posts`)
      const updatedPosts = response.data
      setPosts(updatedPosts)
      afterAdd()
    } catch (error) {
      console.error("Failed to add post", error)
    }
  }

  const handleEditPost = async (
    postId: string,
    updatedPost: IPost,
    afterEdit: () => void
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        updatedPost,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      const updatedPosts = posts.map((post) =>
        post._id === postId ? response.data : post
      )
      if (posts) {
        setPosts(updatedPosts)
      }
      afterEdit()
    } catch (error) {
      console.error("Failed to edit post", error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this post?"
    )
    if (!confirmDeletion) return

    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        withCredentials: true,
      })

      if (posts) {
        const updatedPosts = posts.filter((post) => post._id !== postId)
        setPosts(updatedPosts)
      }
    } catch (error) {
      console.error("Failed to delete post", error)
    }
  }

  return {
    posts,
    handleAddPost,
    handleEditPost,
    handleDeletePost,
  }
}
