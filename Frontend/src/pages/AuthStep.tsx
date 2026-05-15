import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'


interface AuthStepProps {
    onNext: (name: string) => void
}

interface UserData {
    name: string
    email: string
    password: string
}

const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export function AuthStep({ onNext }: AuthStepProps) {
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        password: ''
    })
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isLogin) {

            axios.post(SERVER_URL + '/api/login', userData, { headers: HEADERS }).then((response) => {
                console.log(response.data)
                if (response.data.status === 'success') {
                    onNext(response.data.user.name || 'Guest')
                }
            }).catch((error) => {
                console.error('Error during login:', error)
            })
            return
        } else {
            if (!userData.name) {
                alert('Please enter your name to sign up.')
                return
            }

            axios.post(SERVER_URL + '/api/signup', userData, { headers: HEADERS }).then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.error('Error during signup:', error)
            })
            onNext(userData.name || 'Guest')
        }
    }

    return (
        <div className="min-h-screen bg-warm px-6 py-12 flex flex-col max-w-md mx-auto">
            <div className="flex-1 flex flex-col justify-center">
                <motion.div
                    initial={{
                        scale: 0.8,
                        opacity: 0,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.5,
                        type: 'spring',
                    }}
                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl mb-8 mx-auto shadow-inner"
                >
                    🥗
                </motion.div>

                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl text-gray-900 mb-3">
                        {isLogin ? 'Welcome back' : 'Eat better, effortlessly.'}
                    </h1>
                    <p className="text-gray-500 text-sm px-4">
                        Personalized meal plans tailored to your lifestyle, goals, and
                        taste.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <motion.div
                            initial={{
                                height: 0,
                                opacity: 0,
                            }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                            }}
                            className="overflow-hidden"
                        >
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                placeholder="e.g. Alex"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required={!isLogin}
                            />
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            placeholder="hello@example.com"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-4 rounded-xl font-medium mt-6 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-float"
                    >
                        {isLogin ? 'Sign In' : 'Get Started'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-warm text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-surface hover:bg-gray-50 transition-colors">
                            <span className="text-lg">🍎</span>
                            <span className="text-sm font-medium text-gray-700">Apple</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-surface hover:bg-gray-50 transition-colors">
                            <span className="text-lg">🇬</span>
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-8 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                >
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span className="font-semibold text-primary">
                        {isLogin ? 'Sign up' : 'Log in'}
                    </span>
                </button>
            </div>
        </div>
    )
}
