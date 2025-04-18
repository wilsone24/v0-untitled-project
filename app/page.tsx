import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Twitter Clone</h1>
          <p className="mt-2 text-gray-600">Inicia sesión o regístrate para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
