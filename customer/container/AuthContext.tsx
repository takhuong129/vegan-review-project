/*'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
    user: any;
    setUser: (user: any) => void;
    login: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('token');
            if (token) {
                const response = await fetch('http://127.0.0.1:8080/api/user/get_authentication', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            }
            setLoading(false)
        };

        fetchUser();
    }, []);

    const login = async (token: string) => {
        Cookies.set('token', token);
        const response = await fetch('http://127.0.0.1:8080/api/user/login', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
*/