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
        const response = await axios.get(`http://localhost:5000/api/posts`)
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
    return null
  }

  return (
    <div className="bg-black text-white">
      <PostPreview posts={posts} />
    </div>
  )
}

export default BlogFeed
