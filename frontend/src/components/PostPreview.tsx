import React from "react"
import { Link } from "react-router-dom"
import parse from "html-react-parser"
import { PostContainerProps } from "../types/post"
import { formatDate } from "../utils/dateutils"

const MAX_TEXT_LENGTH = 200

// Cut string at the last full word within the limit and add "..."
const getPreviewText = (text: string | undefined, maxLength: number) => {
  // don't render tweets or images in preview
  let strippedText = text?.replace(/{tweet:[\d]+}|<img[^}]+>/g, "") ?? ""
  if (strippedText.length <= maxLength) return strippedText
  let trimmedText = strippedText.slice(0, maxLength)
  trimmedText = trimmedText.substring(
    0,
    Math.min(trimmedText.length, trimmedText.lastIndexOf(" "))
  )
  return `${trimmedText}...`
}

const PostPreview: React.FC<PostContainerProps> = ({ posts }) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  return (
    <div className="container mx-auto p-r-1 py-8">
      <div className="max-w-3xl mx-auto">
        {posts?.map((post, index) => {
          const key = `${post._id} + ${index}`
          return (
            <Link
              to={`/posts/${post._id}`}
              key={key}
              className="hover:bg-gray-800 transition-colors p-3 rounded-md flex mb-3"
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
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default PostPreview
