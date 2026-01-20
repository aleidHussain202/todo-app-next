'use client'

import  { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react";


export default function RegisterPage() {
    // State variables declaration
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent reloading of the page
        e.preventDefault();

        // Clear previous error message
        setError('');

        // Calling register API endpoint
        const res = await fetch('api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        })

        if (res.ok) {

            // Try to auto login
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: email,
                    password: password,
                });
                
                if(result?.ok && !result?.error) {
                    // Auto-login successful. Redirect to home
                    router.push('/');
                } else {
                    // Auto-login failed, redirect to login page as fallback
                    router.push('/login');
                }
            } catch (error) {
                // if signIn throws an error, redirect to login page as fallback
                console.error('Auto-login failed:', error);
                router.push('/login');
            }
        } else {
            // Registration failed
            const data = await res.json();
            setError(data.error || 'Registration failed')
        }

    }


  return (
    <div className="flex justify-center items-center min-h-screen p-5
    bg-zinc-200">
      <div className="w-full max-w-md p-8
      bg-zinc-100 rounded-lg shadow-lg">
        <h1>Register</h1>
        {error && (
                    <div className="p-3 mb-4 text-center text-red-700
                    bg-red-100 border border-red-300 rounded">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* name input */}
            <input type="text" placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required className="w-full px-4 py-3 border border-zinc-500
            rounded-md focus:outline-none focus:ring-2
            focus:ring-blue-300 focus:border-transparent
            placeholder-zinc-800"/>
            {/* email input */}
            <input type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-zinc-500
            rounded-md focus:outline-none focus:ring-2
            focus:ring-blue-300 focus:border-transparent
            placeholder-zinc-800"/>
            {/* password input  */}
            <input type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-zinc-500
            rounded-md focus:outline-none focus:ring-2
            focus:ring-blue-300 focus:border-transparent
            placeholder-zinc-800"/>

            {/* Submit button */}
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-400 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300
            focus:ring-offset-2 transition-colors">Register</button>
        </form>

        <p className="mt-6 text-center text-zinc-800">Already have an account? <Link href="/login" className="font-semibold text-blue-700 hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
