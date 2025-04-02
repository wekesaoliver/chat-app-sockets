import { io } from "socket.io-client"

export const chatSocket = io(`${import.meta.env.VITE_SOCKET_BASE_URL}/chat`, {autoConnect: false});
export const taskSocket = io(`${import.meta.env.VITE_SOCKET_BASE_URL}/tasks`, {autoConnect: false});


