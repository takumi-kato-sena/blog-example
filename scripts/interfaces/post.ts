export interface PostMetaData {
  title: string
  description: string
  category?: string
}

export interface Post {
  fileName: string
  attributes: PostMetaData
}

export type PostsByCategory = { [key: string]: Post[] }
