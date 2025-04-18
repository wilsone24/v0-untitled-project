"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { usePosts } from "@/context/post-context"

export default function PostForm() {
  const [content, setContent] = useState("")
  const { user } = useAuth()
  const { createPost } = usePosts()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    createPost({
      id: Date.now().toString(),
      content,
      author: user?.username || "",
      date: new Date().toISOString(),
      likes: [],
      replies: [],
    })

    setContent("")
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="¿Qué está pasando?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!content.trim()}
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  )
}
