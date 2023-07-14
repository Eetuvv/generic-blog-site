import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { TwitterTweetEmbed } from "react-twitter-embed"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../store"
import { fetchSinglePost } from "../postSlice"

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>()

  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((state: RootState) =>
    state.post.posts.find((post) => post._id === postId)
  )

  useEffect(() => {
    if (postId) {
      dispatch(fetchSinglePost(postId))
    }
  }, [dispatch, postId])

  if (!post) {
    return <p>Loading...</p>
  }

  // const formattedDate = post.date.toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // })

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
          <span>Anonymous</span>
          {/* <span>{post.author}</span> */}
          <span className="mx-2">|</span>
          {/* <span>{formattedDate}</span> */}
        </div>
        {post.imageUrl !== null && (
          <div
            className="ml-4 md:ml-0 md:mr-4"
            style={{ width: "150px", height: "125px" }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full rounded-md object-cover"
            />
          </div>
        )}
        <div>{parseContent(post.content)}</div>
      </div>
    </div>
  )
}

export default BlogPost
