"use client"

import type React from "react"

import { useState } from "react"
import type { Post } from "@/types"
import { useAuth } from "@/context/auth-context"
import { usePosts } from "@/context/post-context"
import { formatDate } from "@/lib/utils"

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No hay publicaciones para mostrar</div>
      ) : (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  )
}

function PostItem({ post }: { post: Post }) {
  const [replyContent, setReplyContent] = useState("")
  const [showReplies, setShowReplies] = useState(false)
  const { user } = useAuth()
  const { likePost, deletePost, replyToPost } = usePosts()

  const handleLike = () => {
    likePost(post.id, user?.username || "")
  }

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      deletePost(post.id)
    }
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim()) return

    replyToPost(post.id, {
      id: Date.now().toString(),
      content: replyContent,
      author: user?.username || "",
      date: new Date().toISOString(),
    })

    setReplyContent("")
  }

  const isLiked = post.likes.includes(user?.username || "")
  const isAuthor = post.author === user?.username

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between">
        <div className="font-bold">{post.author}</div>
        <div className="text-gray-500 text-sm">{formatDate(post.date)}</div>
      </div>
      <div className="mt-2">{post.content}</div>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`text-sm flex items-center ${isLiked ? "text-red-500" : "text-gray-500"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {post.likes.length}
        </button>

        <button onClick={() => setShowReplies(!showReplies)} className="text-sm text-gray-500 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {post.replies.length}
        </button>

        {isAuthor && (
          <button onClick={handleDelete} className="text-sm text-red-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar
          </button>
        )}
      </div>

      {showReplies && (
        <div className="mt-4 border-t pt-4">
          <form onSubmit={handleReply} className="mb-4">
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe una respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!replyContent.trim()}
              >
                Responder
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {post.replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <div className="font-bold">{reply.author}</div>
                  <div className="text-gray-500 text-xs">{formatDate(reply.date)}</div>
                </div>
                <div className="mt-1 text-sm">{reply.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
