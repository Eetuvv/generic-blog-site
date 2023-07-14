import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store"
import { addPost, setPosts, IPost } from "../postSlice"
import { nanoid } from "nanoid"

import AddPostButton from "./AddPostButton"
import PostModal from "./PostModal"
import PreviewPost from "./PreviewPost"

const BlogFeed = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: RootState) => state.post.posts)

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [content, setContent] = useState("")

  const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    setTitle("")
    setImageUrl("")
    setContent("")
  }

  const handleAddPost = () => {
    const newPost = { _id: nanoid(), title, imageUrl, content }
    dispatch(addPost(newPost)).then((action) => {
      const insertedPost = action.payload as IPost
      // Update the posts array with the inserted post
      dispatch(setPosts([...posts, insertedPost]))
    })
    handleCloseModal()
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((response) => response.json())
      .then((data) => {
        // Dispatch setPosts with the data
        dispatch(setPosts(data))
      })
  }, [dispatch])

  return (
    <div className="bg-black text-white">
      <AddPostButton handleOpenModal={handleOpenModal} />

      <PostModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        handleAddPost={handleAddPost}
      />

      <PreviewPost posts={posts} />
    </div>
  )
}

export default BlogFeed
