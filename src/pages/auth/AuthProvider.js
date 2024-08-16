import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const { data } = await axiosInstance.get('/auth/status', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser({ ...data.user, token });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
