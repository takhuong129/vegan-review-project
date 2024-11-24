"use client"
import React, { useState, useEffect } from 'react';
import ImageLoader from '@/components/ImageLoader'; // Assuming the correct import path
import { signupLoginBanner, vegan } from '@/container/ImageConstant';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
const LoginPage: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('diner');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 2000); // Adjust the time (3000ms = 3s) as needed

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(username, password, userType)
        const response = await fetch('http://127.0.0.1:8080/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userType }),
        });
        if (response.ok) {

            const data = await response.json();
            Cookies.set('token', data.token)
            router.push('/'); // Redirect to the homepage after successful login
        } else {
            const errorData = await response.json();
            setError(errorData.error);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-center h-[52rem]">
                <div className="flex w-full h-full">
                    {/* Image Column */}
                    <div className="w-1/3 relative h-full">
                        <div className="absolute inset-0">
                            <ImageLoader
                                path={signupLoginBanner.link}
                                alt={signupLoginBanner.alt}
                                cloudinaryAttributes={{
                                    layout: "fill", // Fill the parent container
                                    objectFit: "cover", // Ensure the image covers the container
                                    objectPosition: "center"
                                }}
                            />
                        </div>
                    </div>

                    {/* Signup Form Column */}
                    <div className="w-2/3 flex flex-col items-center justify-center bg-white">
                        {error && (
                            <div role="alert" className="absolute top-24 w-[34rem] alert alert-error text-white flex items-center mt-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center mb-10">
                            <ImageLoader
                                path={vegan.link}
                                alt={vegan.alt}
                                width={100}
                                height={100}
                            />
                        </div>
                        <form onSubmit={handleLoginSubmit} className="w-full max-w-md p-8 bg-white border-2 border-gray-500 rounded">
                            <h2 className="text-2xl text-center font-bold mb-6">Đăng nhập</h2>
                            <div className="mb-4">
                                <input
                                    id="username"
                                    type="text"
                                    className="shadow appearance-none border-2 border-gray-500 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Email hoặc tên đăng nhập"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <input
                                    id="password"
                                    type="password"
                                    className="shadow appearance-none border-2 border-gray-500 rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Mật khẩu"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <button
                                    type="submit"
                                    className="btn w-full py-2 bg-custom-green border-2 border-gray-500 text-white hover:bg-green-800"
                                >
                                    Đăng Nhập
                                </button>
                            </div>
                            <div className="flex items-center justify-center w-full space-x-2 mt-5">
                                <div className="h-[1px] bg-black flex-1"></div>
                                <h1 className="text-md font-medium">Hoặc đăng nhập bằng</h1>
                                <div className="h-[1px] bg-black flex-1"></div>
                            </div>

                            <div className="flex items-center justify-center mt-5">
                                <button
                                    className="btn py-2 border-2 border-gray-500 text-black bg-white"
                                >
                                    <FcGoogle className="text-3xl" />
                                    Đăng nhập bằng Google
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
