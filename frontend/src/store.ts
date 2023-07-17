import { configureStore } from "@reduxjs/toolkit"
import postSlice from "./postSlice"

const store = configureStore({
  reducer: {
    post: postSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
