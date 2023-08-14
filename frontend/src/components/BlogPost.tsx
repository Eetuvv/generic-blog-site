import React, { useEffect } from "react"

import { useParams } from "react-router-dom"
import { TwitterTweetEmbed } from "react-twitter-embed"
import parse from "html-react-parser"
import { useDispatch, useSelector } from "react-redux"

import { RootState, AppDispatch } from "../store"
import { fetchSinglePost } from "../postSlice"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatDate } from "../utils/dateutils"

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>()

  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: RootState) => state.post.posts)
  const status = useSelector((state: RootState) => state.post.status)
  const post = posts.find((post) => post._id === postId)

  useEffect(() => {
    if (postId) {
      dispatch(fetchSinglePost(postId))
    }
  }, [dispatch, postId])

  if (status === "loading") {
    return <LoadingSpinner />
  }

  if (!post) {
    return null
  }

  const date = post.timestamp ? new Date(post.timestamp) : null
  const formattedDate = date ? formatDate(date) : null

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  const parseContent = (content: string) => {
    const regex = /{(tweet:[\d][^}]+?)}/g
    let matches
    const blocks = []
    let lastIndex = 0

    while ((matches = regex.exec(content)) !== null) {
      if (matches.index !== lastIndex) {
        blocks.push(content.slice(lastIndex, matches.index))
      }
      blocks.push(matches[1])
      lastIndex = regex.lastIndex
    }

    if (lastIndex !== content.length) {
      blocks.push(content.slice(lastIndex))
    }

    return blocks.map((block: string, index: number) => {
      if (block.startsWith("tweet:")) {
        const tweetId = block.slice(6)
        const key = `${block}+${index}`
        return (
          <div className="w-full my-3 flex justify-center" key={key}>
            <div style={{ maxWidth: "550px", width: "100%" }}>
              <TwitterTweetEmbed
                tweetId={tweetId}
                options={{ width: "100%", theme: "dark" }}
              />
            </div>
          </div>
        )
      }

      return parse(block)
    })
  }

  return (
    <div className="bg-black py-6 px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {post.titleImageURL !== null && (
          <div>
            <img
              src={post.titleImageURL}
              alt={post.title}
              className="flex justify-center max-w-full max-h-full mb-10"
              onError={handleImageError}
            />
          </div>
        )}
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="text-lg text-gray-400 flex items-center mb-10">
          <span>{post.author}</span>
          <span className="mx-2">|</span>
          <span>{formattedDate}</span>
        </div>
        <div>{parseContent(post.content)}</div>
      </div>
    </div>
  )
}

export default BlogPost
