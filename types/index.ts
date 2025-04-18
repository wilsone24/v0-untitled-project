export interface User {
  username: string
  password: string
}

export interface Reply {
  id: string
  content: string
  author: string
  date: string
}

export interface Post {
  id: string
  content: string
  author: string
  date: string
  likes: string[]
  replies: Reply[]
}
