import { configureStore } from "@reduxjs/toolkit"
import postSlice from "./postSlice"

const store = configureStore({
  reducer: {
    post: postSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
