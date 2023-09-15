export interface IPost {
  _id?: string
  title: string
  content: string
  titleImageURL?: string
  author: string
  timestamp?: Date
}

export interface PostContainerProps {
  posts: IPost[]
}
