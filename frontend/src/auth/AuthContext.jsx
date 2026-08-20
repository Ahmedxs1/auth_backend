import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getMe } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Important: we don't know whether the user is authenticated yet.
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = localStorage.getItem("access_token");

        // No token = definitely not logged in
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Ask the backend if the token is valid
            const userData = await getMe(token);

            setUser(userData);
        } catch {
            // Token is invalid/expired
            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(token) {
        localStorage.setItem("access_token", token);

        // Immediately verify/get the user
        try {
            const userData = await getMe(token);
            setUser(userData);
        } catch {
            localStorage.removeItem("access_token");
            setUser(null);

            throw new Error("Invalid token");
        }
    }

    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}