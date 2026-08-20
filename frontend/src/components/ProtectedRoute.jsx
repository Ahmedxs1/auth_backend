import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // Don't redirect while we're checking the token.
    if (loading) {
        return (
            <div>
                Checking authentication...
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Authenticated
    return children;
}

export default ProtectedRoute;