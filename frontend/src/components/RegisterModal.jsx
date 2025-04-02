import Modal from "react-modal";
import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const RegisterModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const { setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            toast.success("Registered successfully");
            onClose();
        } catch {
            toast.error("Registration failed");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            className="bg-white p-6 rounded shadow w-96 mx-auto mt-20"
        >
            <h2 className="text-xl mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 w-full"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
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
                <button className="bg-green-500 text-white w-full p-2 rounded">
                    Register
                </button>
            </form>
        </Modal>
    );
};

export default RegisterModal;
