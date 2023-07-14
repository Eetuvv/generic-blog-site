import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { IPost } from "../postSlice"

interface PostContainerProps {
  posts: IPost[]
}

const MAX_TEXT_LENGTH = 200

// cut string at the last full word within the limit and add "..."
const getPreviewText = (text: string, maxLength: number) => {
  // quill adds extra <p> tags
  let strippedText = text.replace(/<p>|<\/p>/g, "")
  if (strippedText.length <= maxLength) return strippedText
  let trimmedText = strippedText.slice(0, maxLength)
  trimmedText = trimmedText.substr(
    0,
    Math.min(trimmedText.length, trimmedText.lastIndexOf(" "))
  )
  return `${trimmedText}...`
}

const PreviewPost: React.FC<PostContainerProps> = ({ posts }) => {
  const storedPosts = useSelector((state: RootState) => state.post.posts)

  return (
    <div className="container mx-auto px-1 py-8">
      <div className="max-w-3xl mx-auto">
        {posts.map((post) => {
          const storedPost = storedPosts.find((p) => p._id === post._id)
          if (!storedPost) return null
          return (
            <Link
              to={`/posts/${storedPost._id}`}
              key={storedPost._id.toString()}
              className="block hover:bg-gray-800 transition-colors p-4 rounded-md"
            >
              <div
                className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:mr-6"
                style={{ flexBasis: "60%" }}
              >
                <h2 className="text-3xl font-bold mb-2">{storedPost.title}</h2>
                <p className="text-lg text-gray-300 leading-snug">
                  {getPreviewText(storedPost.content, MAX_TEXT_LENGTH)}
                </p>
              </div>
              {storedPost.imageUrl && (
                <div
                  className="ml-4 md:ml-0 md:mr-4"
                  style={{ width: "150px", height: "125px" }}
                >
                  <img
                    src={storedPost.imageUrl}
                    alt={storedPost.title}
                    className="w-full h-full rounded-md object-cover"
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

export default PreviewPost
