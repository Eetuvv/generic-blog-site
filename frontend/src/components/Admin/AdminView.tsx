import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState, AppDispatch } from "../../store"
import { addPost, setPosts, IPost } from "../../postSlice"
import AddPostButton from "./AddPostButton"
import PostModal from "./PostModal"
import LoadingSpinner from "../LoadingSpinner"
import { useAuth } from "../Authentication/useAuth"
import Modal from "react-modal"

Modal.setAppElement("#root")

const AdminView = () => {
  const { authenticated, token } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.post.status)

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [titleImageURL, settitleImageURL] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")

  const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    setTitle("")
    settitleImageURL("")
    setContent("")
    setAuthor("")
  }

  const handleAddPost = () => {
    const newPost = {
      title,
      titleImageURL,
      content,
      author,
    }
    if (token) {
      dispatch(addPost({ newPost, token }))
        .then((action) => {
          const insertedPost = action.payload as IPost
          dispatch(setPosts([insertedPost]))
        })
        .catch((error) => {
          console.log(error)
        })
    }
    handleCloseModal()
  }

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
        titleImageURL={titleImageURL}
        settitleImageURL={settitleImageURL}
        author={author}
        setAuthor={setAuthor}
        handleAddPost={handleAddPost}
      />
    </div>
  )
}

export default AdminView
