import { useEffect } from "react"
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
    const regex = /{(tweet:[\d]+|image:[^|]+?\|[^}]+?)}/g
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
        return (
          <div className="w-full my-3 flex justify-center" key={index}>
            <div style={{ maxWidth: "550px", width: "100%" }}>
              <TwitterTweetEmbed
                tweetId={tweetId}
                options={{ width: "100%", theme: "dark" }}
              />
            </div>
          </div>
        )
      } else if (block.startsWith("image:")) {
        const [url, alt] = block.slice(6).split("|")
        return (
          <div key={index}>
            <img
              src={url}
              alt={alt}
              onError={handleImageError}
              className="w-full h-auto object-cover"
            />
          </div>
        )
      }

      return (
        <p
          className="text-lg leading-7 mb-8"
          key={index}
          dangerouslySetInnerHTML={{ __html: block }}
        />
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
