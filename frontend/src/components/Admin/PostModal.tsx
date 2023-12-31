import React from "react"
import Modal from "react-modal"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface PostModalProps {
  isOpen: boolean
  handleCloseModal: () => void
  title: string
  setTitle: (value: string) => void
  content: string
  setContent: (value: string) => void
  titleImageURL: string
  settitleImageURL: (value: string) => void
  handleAddPost: () => void
  handleEditPost?: (postId: string) => void
  editingPostId?: string
  isEditing?: boolean
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
  titleImageURL,
  settitleImageURL,
  handleAddPost,
  handleEditPost,
  editingPostId,
  isEditing,
  author,
  setAuthor,
}) => {
  const quillRef = React.useRef<ReactQuill | null>(null)
  const insertImage = () => {
    const url = prompt("Enter the image URL:")
    if (url) {
      if (quillRef && quillRef.current) {
        const editor = quillRef.current.getEditor()
        const range = editor.getSelection()
        if (range) {
          editor.insertEmbed(range.index, "image", url)
        }
      }
    }
  }
  const insertTweet = () => {
    const tweetId = prompt("Enter the tweet ID:")
    if (tweetId) {
      const tweet = `{tweet:${tweetId}}`
      if (quillRef && quillRef.current) {
        const editor = quillRef.current.getEditor()
        const range = editor.getSelection()
        if (range) {
          editor.insertEmbed(range.index, "text", tweet)
        }
      }
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
        <div className="flex justify-end">
          <button
            className="font-bold hover:bg-gray-500"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Post" : "Add Post"}
        </h2>
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
          className="h-96"
          ref={quillRef} // attach the ref to ReactQuill component
        />

        <input
          value={titleImageURL}
          onChange={(e) => settitleImageURL(e.target.value)}
          placeholder="Title Image URL"
          className="bg-black text-white mt-14 border-2 p-2 rounded w-full"
        />

        <button
          onClick={() => {
            if (isEditing && editingPostId) {
              if (handleEditPost) {
                handleEditPost(editingPostId)
              }
            } else {
              handleAddPost()
            }
          }}
          className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded mt-4"
        >
          {isEditing ? "Update Post" : "Add Post"}
        </button>
      </div>
    </Modal>
  )
}

export default PostModal
