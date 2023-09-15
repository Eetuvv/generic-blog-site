import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Modal from "react-modal"
import parse from "html-react-parser"
import axios from "axios"

import { IPost } from "../../types/post"
import { useAdminUtils } from "./adminUtils"

import AddPostButton from "./AddPostButton"
import PostModal from "./PostModal"
import { useAuth } from "../Authentication/useAuth"
import { formatDate } from "../../utils/dateutils"
import LoadingSpinner from "../LoadingSpinner"

Modal.setAppElement("#root")

const AdminView = () => {
  const { authenticated } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authenticated) {
      navigate("/login")
    }
  }, [authenticated, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/api/posts`)
        setPosts(response.data)
      } catch (error: any) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [titleImageURL, settitleImageURL] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [editingPost, setEditingPost] = useState<IPost | null>(null)
  const { handleAddPost, handleEditPost, handleDeletePost } = useAdminUtils(
    posts,
    setPosts
  )

  const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    setTitle("")
    settitleImageURL("")
    setContent("")
    setAuthor("")
    setEditingPost(null)
  }

  const handleEditModal = (post: IPost) => {
    setTitle(post.title)
    settitleImageURL(post.titleImageURL || "")
    setContent(post.content)
    setAuthor(post.author)
    setEditingPost(post)
    setIsOpen(true)
  }

  const MAX_TEXT_LENGTH = 200

  const getPreviewText = (text: string | undefined, maxLength: number) => {
    let strippedText =
      text?.replace(/<p>|<\/p>|{tweet:[\d]+}|{image:[^}]+}/g, "") ?? ""
    if (strippedText.length <= maxLength) return strippedText
    let trimmedText = strippedText.slice(0, maxLength)
    trimmedText = trimmedText.substr(
      0,
      Math.min(trimmedText.length, trimmedText.lastIndexOf(" "))
    )
    return `${trimmedText}...`
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!posts) {
    return null
  }

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  return (
    <div>
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
          handleAddPost={() =>
            handleAddPost(
              {
                title,
                titleImageURL,
                content,
                author,
              },
              handleCloseModal
            )
          }
          handleEditPost={(postId: string) =>
            handleEditPost(
              postId,
              {
                title,
                titleImageURL,
                content,
                author,
              },
              handleCloseModal
            )
          }
          editingPostId={editingPost?._id}
          isEditing={!!editingPost}
        />
      </div>
      <div className="container mx-auto p-r-1 py-8">
        <div className="max-w-3xl mx-auto">
          {posts.map((post, index) => {
            const key = `${post._id} + ${index}`
            return (
              <div
                key={key}
                className="transition-colors p-3 rounded-md flex mb-3"
              >
                <div className="flex-1">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
                    <div className="text-sm text-gray-400 flex items-center my-2">
                      <span>{post.author}</span>
                      <span className="mx-2">|</span>
                      <span>
                        {formatDate(
                          post.timestamp ? new Date(post.timestamp) : new Date()
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 leading-snug mr-3">
                    {parse(getPreviewText(post.content, MAX_TEXT_LENGTH))}
                  </p>
                </div>
                {post.titleImageURL && (
                  <div
                    className="ml-4 md:ml-0 mt-2"
                    style={{ width: "150px", height: "125px" }}
                  >
                    <img
                      src={post.titleImageURL}
                      alt={post.title}
                      className="w-full h-full rounded-md object-cover"
                      onError={handleImageError}
                    />
                  </div>
                )}
                <div className="flex">
                  <button
                    className="hover:bg-gray-600 w-14 h-12 mx-4 py-2 text-bold text-lg text-red-300"
                    onClick={() => handleEditModal(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="hover:bg-gray-600 w-14 h-12 mx-4 text-bold text-lg text-red-300"
                    onClick={() => post._id && handleDeletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminView
