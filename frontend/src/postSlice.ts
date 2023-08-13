import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

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
  const response = await axios.get("http://localhost:5000/api/posts")
  const postsWithIds: IPost[] = response.data.map((post: IPost) => {
    return {
      ...post,
      _id: post._id?.toString(),
    }
  })
  return postsWithIds
})

export const fetchSinglePost = createAsyncThunk(
  "post/fetchSinglePost",
  async (postId: string) => {
    const response = await axios.get(
      `http://localhost:5000/api/posts/${postId}`
    )
    return response.data
  }
)

export const addPost = createAsyncThunk(
  "post/addPost",
  async ({ newPost }: { newPost: IPost }) => {
    const response = await axios.post(
      "http://localhost:5000/api/posts",
      newPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    return response.data
  }
)

export const editPost = createAsyncThunk(
  "post/editPost",
  async ({ postId, updatedPost }: { postId: string; updatedPost: IPost }) => {
    const response = await axios.put(
      `http://localhost:5000/api/posts/${postId}`,
      updatedPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId: string) => {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
      withCredentials: true,
    })
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
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "idle"
        state.posts.push(action.payload)
      })
      .addCase(addPost.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(editPost.pending, (state) => {
        state.status = "loading"
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.status = "idle"
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        )
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })
      .addCase(editPost.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "idle"
        state.posts = state.posts.filter((post) => post._id !== action.payload)
      })
  },
})

export const { setPosts } = postSlice.actions
export default postSlice.reducer
