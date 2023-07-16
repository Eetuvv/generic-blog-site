import React, { useState, useCallback } from "react"
import Modal from "react-modal"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useDropzone } from "react-dropzone"

interface PostModalProps {
  isOpen: boolean
  handleCloseModal: () => void
  title: string
  setTitle: (value: string) => void
  content: string
  setContent: (value: string) => void
  imageUrl: string
  setImageUrl: (value: string) => void
  handleAddPost: () => void
  author: string
  setAuthor: (value: string) => void
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  handleCloseModal,
  title,
  setTitle,
  content,
  setContent,
  imageUrl,
  setImageUrl,
  handleAddPost,
  author,
  setAuthor,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    console.log(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const insertImage = () => {
    const url = prompt("Enter the image URL:")
    if (url) {
      const alt = prompt("Enter the alt text:")
      setContent(content + `{image:${url}|${alt}}`)
    }
  }

  const insertTweet = () => {
    const tweetId = prompt("Enter the tweet ID:")
    if (tweetId) {
      setContent(content + `{tweet:${tweetId}}`)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Add Post Modal"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="bg-black text-white p-8 rounded-lg border-white border-2 w-8/12">
        <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="bg-black text-white border-2 p-2 rounded mb-4 w-full"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="bg-black text-white border-2 p-2 rounded mb-4 w-full"
        />
        <button
          onClick={insertImage}
          className="bg-white text-black hover:bg-gray-200 font-semibold py-1 px-2 rounded mr-2 mb-3 mt-4"
        >
          Insert Image
        </button>

        <button
          onClick={insertTweet}
          className="bg-white text-black hover:bg-gray-200 font-semibold py-1 px-2 rounded mr-2 my-2 mt-4"
        >
          Insert Tweet
        </button>
        <ReactQuill
          value={content}
          onChange={setContent}
          className="h-96 mb-4"
        />

        <div {...getRootProps()} className="mt-4">
          <input {...getInputProps()} />
          <p className="text-gray-300">
            {isDragActive
              ? "Drop the files here ..."
              : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>

        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="bg-black text-white border-2 p-2 rounded mb-4 w-full"
        />

        <button
          onClick={handleAddPost}
          className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded mt-4"
        >
          Add Post
        </button>
      </div>
    </Modal>
  )
}

export default PostModal
