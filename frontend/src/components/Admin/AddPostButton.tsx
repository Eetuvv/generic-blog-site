import React from "react"

interface AddPostButtonProps {
  handleOpenModal: () => void
}

const AddPostButton: React.FC<AddPostButtonProps> = ({ handleOpenModal }) => (
  <div className="flex justify-center">
    <button
      className="bg-white text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200"
      onClick={handleOpenModal}
    >
      Add Post
    </button>
  </div>
)

export default AddPostButton
