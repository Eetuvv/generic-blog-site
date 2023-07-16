import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { IPost } from "../postSlice"
import { formatDate } from "../dateutils"

interface PostContainerProps {
  posts: IPost[]
}

const MAX_TEXT_LENGTH = 200

// Cut string at the last full word within the limit and add "..."
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

const PostPreview: React.FC<PostContainerProps> = ({ posts }) => {
  const storedPosts = useSelector((state: RootState) => state.post.posts)

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  return (
    <div className="container mx-auto px-1 py-8">
      <div className="max-w-3xl mx-auto">
        {posts.map((post, index) => {
          const storedPost = storedPosts.find((p) => p?._id === post?._id)
          if (!storedPost) return null
          return (
            <Link
              to={`/posts/${storedPost._id}`}
              key={index}
              className="hover:bg-gray-800 transition-colors p-4 rounded-md flex mb-3"
            >
              <div className="flex-1">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">
                    {storedPost.title}
                  </h2>
                  <div className="text-sm text-gray-400 flex items-center my-2">
                    <span>{storedPost.author}</span>
                    <span className="mx-2">|</span>
                    <span>
                      {formatDate(
                        storedPost.timestamp
                          ? new Date(storedPost.timestamp)
                          : new Date()
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-300 leading-snug mr-2">
                  {getPreviewText(storedPost.content, MAX_TEXT_LENGTH)}
                </p>
              </div>
              {storedPost.titleImageURL && (
                <div
                  className="ml-4 md:ml-0 mt-2"
                  style={{ width: "150px", height: "125px" }}
                >
                  <img
                    src={storedPost.titleImageURL}
                    alt={storedPost.title}
                    className="w-full h-full rounded-md object-cover"
                    onError={handleImageError}
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default PostPreview
