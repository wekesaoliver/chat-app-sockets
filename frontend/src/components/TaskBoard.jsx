import { useState, useEffect, useContext } from "react";
import { taskSocket } from "../socket.js";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api";
import { toast } from "react-toastify";

const TaskBoard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    useEffect(() => {
        if (user) {
            // Load tasks from API
            const loadTasks = async () => {
                const res = await api.get("/tasks");
                setTasks(res.data);
            };
            loadTasks();

            // Socket connection
            taskSocket.connect();
            taskSocket.emit("joinTaskBoard", "main-board");

            // Socket listeners
            taskSocket.on("taskCreated", (task) =>
                setTasks((prev) => [...prev, task])
            );
            taskSocket.on("taskUpdated", (task) =>
                setTasks((prev) =>
                    prev.map((t) => (t._id === task._id ? task : t))
                )
            );
            taskSocket.on("taskDeleted", (data) =>
                setTasks((prev) => prev.filter((t) => t._id !== data._id))
            );

            return () => taskSocket.disconnect();
        }
    }, [user]);

    const handleCreateTask = async () => {
        if (newTaskTitle.trim()) {
            const res = await api.post("/tasks", { title: newTaskTitle });
            taskSocket.emit("taskCreated", {
                ...res.data,
                boardId: "main-board",
            });
            setNewTaskTitle("");
        }
    };

    return (
        <div className="border p-4 rounded shadow mt-6">
            <h2 className="text-xl mb-4">Task Board</h2>
            <div className="flex gap-2 mb-4">
                <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="border p-2 flex-1"
                    placeholder="New task title"
                />
                <button
                    onClick={handleCreateTask}
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Add Task
                </button>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} className="border p-2 mb-2 rounded">
                        <div className="flex justify-between items-center">
                            <div>{task.title}</div>
                            <button
                                onClick={() =>
                                    taskSocket.emit("taskDeleted", {
                                        _id: task._id,
                                        boardId: "main-board",
                                    })
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskBoard;
