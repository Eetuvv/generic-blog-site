import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store"
import PostPreview from "./PostPreview"
import LoadingSpinner from "./LoadingSpinner"
import { fetchPosts } from "../postSlice"

const BlogFeed = () => {
  const dispatch = useDispatch<AppDispatch>()
  const posts = useSelector((state: RootState) => state.post.posts)
  const status = useSelector((state: RootState) => state.post.status)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  if (status === "loading") {
    return <LoadingSpinner />
  }

  return (
    <div className="bg-black text-white">
      <PostPreview posts={posts} />
    </div>
  )
}

export default BlogFeed
