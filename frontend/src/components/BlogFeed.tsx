import { useEffect, useState } from "react"
import axios from "axios"
import PostPreview from "./PostPreview"
import { IPost } from "../types/post"
import LoadingSpinner from "./LoadingSpinner"

const BlogFeed = () => {
  const [posts, setPosts] = useState<IPost[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts`
        )
        setPosts(response.data)
      } catch (error: any) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!posts) {
    return (
      <div className="bg-black text-white text-4xl mt-12 flex justify-center">
        No posts yet!
      </div>
    )
  }

  return (
    <div className="bg-black text-white">
      <PostPreview posts={posts} />
    </div>
  )
}

export default BlogFeed
