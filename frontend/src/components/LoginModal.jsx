import Modal from "react-modal";
import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const LoginModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const { setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            toast.success("Logged in successfully");
            onClose();
        } catch {
            toast.error("Invalid credentials");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            className="bg-white p-6 rounded shadow w-96 mx-auto mt-20"
        >
            <h2 className="text-xl mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                />
                <button className="bg-blue-500 text-white w-full p-2 rounded">
                    Login
                </button>
            </form>
        </Modal>
    );
};

export default LoginModal;
