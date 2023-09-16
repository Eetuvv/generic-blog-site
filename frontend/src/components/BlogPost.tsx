import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { TwitterTweetEmbed } from "react-twitter-embed"
import parse from "html-react-parser"

import { IPost } from "../types/post"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatDate } from "../utils/dateutils"

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>()

  const [post, setPost] = useState<IPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`
        )
        setPost(response.data[0])
      } catch (error: any) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [postId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!post) {
    return (
      <div className="bg-black text-white text-4xl mt-12 flex justify-center">
        Could not find post!
      </div>
    )
  }

  const date = post?.timestamp ? new Date(post.timestamp) : null
  const formattedDate = date ? formatDate(date) : null

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  const renderTweet = (block: string, index: number) => {
    const tweetId = block.slice(6)
    const key = `tweet-${tweetId}-${index}`
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

  const renderParsedBlock = (block: string, index: number) => {
    const parsedContent = parse(block)
    const key = `parsed-${index}`
    if (Array.isArray(parsedContent)) {
      return parsedContent.map((element, i) => (
        <React.Fragment key={`${key}-${i}`}>{element}</React.Fragment>
      ))
    }
    return <React.Fragment key={key}>{parsedContent}</React.Fragment>
  }

  const getContentBlocks = (content: string, regex: RegExp) => {
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

    return blocks
  }

  const parseContent = (content: string) => {
    const regex = /{(tweet:[\d][^}]+?)}/g
    const contentBlocks = getContentBlocks(content, regex)

    return contentBlocks.map((block: string, index: number) => {
      return block.startsWith("tweet:")
        ? renderTweet(block, index)
        : renderParsedBlock(block, index)
    })
  }

  return (
    <div className="bg-black py-6 px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {post.titleImageURL !== null && (
          <div>
            <img
              src={post?.titleImageURL}
              alt={post?.title}
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
