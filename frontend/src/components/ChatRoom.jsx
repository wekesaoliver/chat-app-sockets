import { useState, useEffect, useContext } from "react";
import { chatSocket } from "../socket.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const ChatRoom = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [input, setInput] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    //useEffect hook establishes a websocket connection when a user is logged in
    useEffect(() => {
        if (user) {
            chatSocket.connect();
            chatSocket.emit("joinChat", user);

            chatSocket.on("onlineUsers", setOnlineUsers);
            chatSocket.on("messageReceived", (msg) =>
                setMessages((prev) => [...prev, msg])
            );
            chatSocket.on("chatNotification", (note) =>
                toast.info(note.message)
            );
            chatSocket.on("userTyping", setTypingUser);
            //ensures the connection is closed when the component unmounts(user logs out)
            return () => {
                chatSocket.disconnect();
            };
        }
    }, [user]);

    const handleSend = () => {
        if (input.trim()) {
            const messageObj = {
                user: { name: user.name, email: user.email },
                message: input.trim(),
            };
            chatSocket.emit("newMessage", messageObj);
            setInput("");
        }
    };

    const handleTyping = () => {
        chatSocket.emit("typing", { name: user.name });
    };

    return (
        <div className="border p-4 rounded shadow">
            <h2 className="text-xl mb-4">Chat Room</h2>
            <div className="mb-2 text-sm text-gray-600">
                Online Users: {onlineUsers.map((u) => u.name).join(", ")}
            </div>
            <div className="h-48 overflow-y-scroll border mb-4 p-2">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-1">
                        <b>{msg.user.name}:</b> {msg.message}
                    </div>
                ))}
                {typingUser && (
                    <div className="text-gray-400 text-xs">
                        {typingUser.name} is typing...
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleTyping}
                    className="border p-2 flex-1"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
