"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Post, Reply } from "@/types"

interface PostContextType {
  posts: Post[]
  getUserPosts: (username: string) => void
  createPost: (post: Post) => void
  deletePost: (postId: string) => void
  likePost: (postId: string, username: string) => void
  replyToPost: (postId: string, reply: Reply) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Load posts from localStorage on initial render
    const storedPosts = localStorage.getItem("posts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts))
  }, [posts])

  // Use useCallback to memoize the function so it doesn't change on every render
  const getUserPosts = useCallback((username: string) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    const userPosts = allPosts.filter((post: Post) => post.author === username)
    // Sort by date (newest first)
    userPosts.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setPosts(userPosts)
  }, [])

  const createPost = useCallback((post: Post) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    const updatedPosts = [post, ...allPosts]
    localStorage.setItem("posts", JSON.stringify(updatedPosts))

    // Update state if the post belongs to the current user view
    setPosts((prevPosts) => [post, ...prevPosts])
  }, [])

  const deletePost = useCallback((postId: string) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    const updatedPosts = allPosts.filter((post: Post) => post.id !== postId)
    localStorage.setItem("posts", JSON.stringify(updatedPosts))

    // Update state
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  }, [])

  const likePost = useCallback((postId: string, username: string) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]")

    const updatedPosts = allPosts.map((post: Post) => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(username)

        if (isLiked) {
          // Unlike
          return {
            ...post,
            likes: post.likes.filter((like: string) => like !== username),
          }
        } else {
          // Like
          return {
            ...post,
            likes: [...post.likes, username],
          }
        }
      }
      return post
    })

    localStorage.setItem("posts", JSON.stringify(updatedPosts))

    // Update state
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(username)

          if (isLiked) {
            return {
              ...post,
              likes: post.likes.filter((like) => like !== username),
            }
          } else {
            return {
              ...post,
              likes: [...post.likes, username],
            }
          }
        }
        return post
      }),
    )
  }, [])

  const replyToPost = useCallback((postId: string, reply: Reply) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]")

    const updatedPosts = allPosts.map((post: Post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [reply, ...post.replies],
        }
      }
      return post
    })

    localStorage.setItem("posts", JSON.stringify(updatedPosts))

    // Update state
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [reply, ...post.replies],
          }
        }
        return post
      }),
    )
  }, [])

  return (
    <PostContext.Provider
      value={{
        posts,
        getUserPosts,
        createPost,
        deletePost,
        likePost,
        replyToPost,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider")
  }
  return context
}
