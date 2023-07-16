import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IPost {
  _id?: string
  title: string
  content: string
  titleImageURL?: string
  author: string
  timestamp?: Date
}

interface PostState {
  posts: IPost[]
  status: "idle" | "loading" | "failed"
}

const initialState: PostState = {
  posts: [],
  status: "idle",
}

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await fetch("http://localhost:5000/api/posts")
  if (!response.ok) {
    throw new Error("Could not fetch posts")
  }

  const postsData = await response.json()
  const postsWithIds: IPost[] = postsData.map((post: IPost) => {
    return {
      ...post,
      _id: post._id?.toString(),
    }
  })

  return postsWithIds
})

export const addPost = createAsyncThunk(
  "post/addPost",
  async ({ newPost, token }: { newPost: IPost; token: string }) => {
    const response = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPost),
    })

    if (!response.ok) {
      throw new Error("Could not add post")
    }

    return response.json() as Promise<IPost>
  }
)

export const fetchSinglePost = createAsyncThunk(
  "post/fetchSinglePost",
  async (postId: string) => {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}`)
    if (!response.ok) {
      throw new Error("Could not fetch post")
    }

    return response.json() as Promise<IPost>
  }
)

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "idle"
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(addPost.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "idle"
        state.posts.push(action.payload)
      })
      .addCase(addPost.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(fetchSinglePost.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.status = "idle"
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        )
        if (index !== -1) {
          state.posts[index] = action.payload
        } else {
          state.posts.push(action.payload)
        }
      })
      .addCase(fetchSinglePost.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const { setPosts } = postSlice.actions
export default postSlice.reducer
