import { useAuth } from "../auth/AuthContext";

function MainPage() {
    const { user, logout } = useAuth();

    return (
        <main>
            <h1>
                Main Page
            </h1>

            <p>
                Welcome, {user.username}
            </p>

            <p>
                Email: {user.email}
            </p>

            <button onClick={logout}>
                Logout
            </button>
        </main>
    );
}

export default MainPage;