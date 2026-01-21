'use client'


import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"


export default function LoginPage() {

    //TODO: Create state variables
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        //TODO: Implement login logic
        //Prevent page reload
        e.preventDefault();

        //Clear previous error
        setError('');

        //Call NextAuth signIn
        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        if (result?.error) {
            setError('Invalid email or password')
        } else {
            router.push('/')
        }


    }




    return (
        //TODO: Create the form UI

        <div className="flex justify-center items-center min-h-screen p-5 bg-zinc-200 dark:bg-zinc-950 transition-colors">
            <ThemeToggle />
            <div className="w-full max-w-md p-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-lg transition-colors">
                <h1 className="text-3xl font-bold text-center mb-6 text-zinc-700 dark:text-zinc-100">Login</h1>
                {error && (
                    <div className="p-3 mb-4 text-center text-red-700
                    bg-red-100 border border-red-300 rounded">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input  */}
                    <input type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required className="w-full px-4 py-3 border 
                    border-zinc-500 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-100 
                    focus:outline-none focus:ring-2 dark:bg-zinc-800
                    focus:ring-blue-300 focus:border-transparent placeholder-zinc-800 dark:placeholder-zinc-400"/>

                    {/* Password input */}
                    <input type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border 
                    border-zinc-500 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-100
                    focus:outline-none focus:ring-2 dark:bg-zinc-800
                    focus:ring-blue-300 focus:border-transparent placeholder-zinc-800 dark:placeholder-zinc-400"/>

                    {/* Submit button */}
                    <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-400 
                    rounded-md hover:bg-blue-600
                    focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors">Login</button>
                </form>

                <p className="mt-6 text-center text-zinc-800 dark:text-zinc-300">Don't have an account? <Link href="/register" className="font-semibold 
                text-blue-700 hover:underline dark:text-blue-400">Register</Link></p>
            </div>
        </div>
    )
}