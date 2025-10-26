import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAsync, selectAuthStatus, selectLoggedInUser } from '../AuthSlice'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
    const dispatch = useDispatch()
    const authStatus = useSelector(selectAuthStatus)
    const navigate = useNavigate()

    useEffect(() => {
        const performLogout = async () => {
            try {
                await dispatch(logoutAsync()).unwrap();
                // Navigate immediately after successful logout
                navigate("/login", { replace: true });
            } catch (error) {
                console.error('Logout failed:', error);
                // Navigate to login even if logout fails
                navigate("/login", { replace: true });
            }
        };
        
        performLogout();
    }, [dispatch, navigate])

    return null;
}