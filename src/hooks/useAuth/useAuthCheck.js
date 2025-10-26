import { useEffect } from 'react'
import { checkAuthAsync } from '../../features/auth/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'

export const useAuthCheck = () => {
    const dispatch = useDispatch();
    const persist = useSelector(state => state._persist);
    const authStatus = useSelector(state => state.AuthSlice.status);
    const isAuthChecked = useSelector(state => state.AuthSlice.isAuthChecked);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await dispatch(checkAuthAsync()).unwrap();
                console.log('Auth check success');
            } catch (error) {
                console.log('Auth check failed:', error);
            }
        };

        // Only check auth once after rehydration and if not already checked
        if (persist?.rehydrated && !isAuthChecked && authStatus !== 'pending') {
            console.log('Starting auth check');
            checkAuth();
        }
    }, [dispatch, persist?.rehydrated, isAuthChecked, authStatus]);
}
