import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">CollabHub</h1>
            <div>
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => setShowLogin(true)}
                            className="bg-green-500 px-4 py-2 rounded mr-2"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setShowRegister(true)}
                            className="bg-yellow-500 px-4 py-2 rounded"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
            />
            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
            />
        </nav>
    );
};

export default Navbar;
