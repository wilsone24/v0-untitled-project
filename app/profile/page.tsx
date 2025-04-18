"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Layout from "@/components/layout"
import PostList from "@/components/post-list"
import { usePosts } from "@/context/post-context"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { posts, getUserPosts } = usePosts()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else if (!isLoaded) {
      getUserPosts(user?.username || "")
      setIsLoaded(true)
    }
  }, [isAuthenticated, router, user, getUserPosts, isLoaded])

  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">Perfil de {user?.username}</h1>
          <p className="text-gray-600 mt-2">Todos tus posts</p>
        </div>

        <div className="mt-8">
          <PostList posts={posts} />
        </div>
      </div>
    </Layout>
  )
}
