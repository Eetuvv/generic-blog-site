import { useDispatch as useReduxDispatch } from "react-redux"
import { AppDispatch } from "../../store"

import {
  IPost,
  addPost,
  fetchPosts,
  setPosts,
  editPost,
  deletePost,
} from "../../postSlice"

export const useAdminUtils = () => {
  const useDispatch = () => useReduxDispatch<AppDispatch>()
  const dispatch = useDispatch()

  const handleAddPost = (newPost: IPost, afterAdd: () => void) => {
    dispatch(addPost({ newPost }))
      .unwrap()
      .then((insertedPost) => {
        dispatch(setPosts([insertedPost]))
        dispatch(fetchPosts())
      })
      .catch((error) => {
        console.log(error)
      })
    afterAdd()
  }

  const handleEditPost = (
    postId: string,
    updatedPost: IPost,
    afterEdit: () => void
  ) => {
    dispatch(editPost({ postId, updatedPost }))
      .unwrap()
      .then((responsePost) => {
        console.log("Post edited successfully", responsePost)
        dispatch(fetchPosts())
        afterEdit()
      })
      .catch((error) => {
        console.error("Failed to edit post", error)
      })
  }

  const handleDeletePost = (postId: string) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this post?"
    )
    if (!confirmDeletion) return

    dispatch(deletePost(postId))
      .unwrap()
      .then(() => {
        console.log("Post deleted successfully")
        dispatch(fetchPosts())
      })
      .catch((error) => {
        console.error("Failed to delete post", error)
      })
  }

  return {
    handleAddPost,
    handleEditPost,
    handleDeletePost,
  }
}
