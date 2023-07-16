import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TwitterTweetEmbed } from "react-twitter-embed"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../store"
import { fetchSinglePost } from "../postSlice"
import LoadingSpinner from "../components/LoadingSpinner"

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>()

  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: RootState) => state.post.posts)
  const post = posts.find((post) => post._id === postId)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (postId) {
          await dispatch(fetchSinglePost(postId))
        }
      } catch (error) {
        console.log("Error fetching post:", error)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [dispatch, postId])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!post) {
    return null
  }

  const date = post.timestamp ? new Date(post.timestamp) : null
  const formattedDate = date?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.style.display = "none" // Hide the image if it fails to load
  }

  const parseContent = (content: string) => {
    const regex = /{(tweet:[\d]+)}/g
    let blocks = content.split(regex)

    return blocks.map((block: string, index: number) => {
      if (block.startsWith("tweet:")) {
        const tweetId = block.slice(6)
        return (
          <div className="w-full my-3" key={index}>
            <div className="flex justify-center">
              <TwitterTweetEmbed tweetId={tweetId} />
            </div>
          </div>
        )
      }
      return (
        <p className="text-lg leading-7 mb-8" key={index}>
          {block}
        </p>
      )
    })
  }

  return (
    <div className="bg-black text-white py-16 px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-400 flex items-center">
          <span>{post.author}</span>
          <span className="mx-2">|</span>
          <span>{formattedDate}</span>
        </div>
        {post.imageUrl !== null && (
          <div>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-6/12 h-6/12 rounded-md object-cover"
              onError={handleImageError}
            />
          </div>
        )}
        <div>{parseContent(post.content)}</div>
      </div>
    </div>
  )
}

export default BlogPost
