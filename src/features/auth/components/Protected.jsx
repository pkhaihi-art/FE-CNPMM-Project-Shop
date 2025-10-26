import { useSelector } from "react-redux"
import { selectIsAuthChecked, selectLoggedInUser } from "../AuthSlice"
import { Navigate } from "react-router"


export const Protected = ({children}) => {
    const loggedInUser = useSelector(selectLoggedInUser)
    const isAuthChecked = useSelector(selectIsAuthChecked)
    const persist = useSelector(state => state._persist)
    const authStatus = useSelector(state => state.AuthSlice.status)

    console.log('Protected render:', {
        rehydrated: persist?.rehydrated,
        isAuthChecked,
        hasUser: !!loggedInUser,
        authStatus,
        userDetails: loggedInUser
    });

    // Wait for redux-persist rehydration
    if (!persist?.rehydrated) {
        console.log('Waiting for rehydration...');
        return null;
    }

    // Show content while checking auth if we have a user
    if (loggedInUser) {
        return children;
    }

    // Only redirect to login if auth check is complete and we have no user
    if (isAuthChecked) {
        console.log('Auth check complete, no user found');
        return <Navigate to={'/login'} replace={true}/>;
    }

    // Still checking auth
    console.log('Still checking auth...');
    return null;
}
