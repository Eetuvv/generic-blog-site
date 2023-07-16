import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState, AppDispatch } from "../../store"
import { addPost, setPosts, IPost, fetchPosts } from "../../postSlice"
import AddPostButton from "./AddPostButton"
import PostModal from "./PostModal"
import LoadingSpinner from "../LoadingSpinner"
import { useAuth } from "../Authentication/useAuth"

const AdminView = () => {
  const { authenticated } = useAuth() // get authentication state
  const navigate = useNavigate() // get navigate function for redirection
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.post.status)

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")

  const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    setTitle("")
    setImageUrl("")
    setContent("")
    setAuthor("")
  }

  const handleAddPost = () => {
    const newPost = {
      title,
      imageUrl,
      content,
      author,
    }
    dispatch(addPost(newPost)).then((action) => {
      const insertedPost = action.payload as IPost
      dispatch(setPosts([insertedPost]))
    })
    handleCloseModal()
  }

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!authenticated) {
      navigate("/login")
    }
  }, [authenticated, navigate])

  if (status === "loading") {
    return <LoadingSpinner />
  }

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
        author={author}
        setAuthor={setAuthor}
        handleAddPost={handleAddPost}
      />
    </div>
  )
}

export default AdminView
