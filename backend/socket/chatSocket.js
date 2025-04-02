//Store all currently online users mapped to their socket IDs
const onlineUsers = new Map();

const chatSocket = (chatNamespace) => {
    chatNamespace.on("connection", (socket) => {
        console.log(`New connection for chat namespace: ${socket.id}`);

        /*
         * (1) User Joins the chat
         * the frontend emits 'joinChat' with the user info when they connect
         * we store that user with their socket id and update all clients (kila msee online)
         */
        socket.on("joinChat", (user) => {
            if (!user || !user.name) return; //Simple guard
            onlineUsers.set(socket.id, user);

            //emit updated online users list to all
            chatNamespace.emit("onlineUsers", Array.from(onlineUsers.values()));

            //broadcast to others that someone has joined (except you)
            socket.broadcast.emit("chatNotification", {
                message: `${user.name} has joined the chat.`,
                type: "info",
            });

            /**
             * (2) User sends a message
             * the frontend emits 'newMessage' with messageObj { user, message }
             * we broadcast this message to everyone including the sender
             */

            socket.on("newMessage", (messageObj) => {
                if (!messageObj && messageObj.user && messageObj.Obj) {
                    chatNamespace.emit("messageReceived", messageObj);
                    console.log(
                        `Message from ${messageObj.user.name}: ${messageObj.message}`
                    );
                }
            });

            /**
             * (3) Handle Typing indicators
             * when a user is typing, we broadcast to others that they are typing.
             */

            socket.on("typing", (user) => {
                if (user && user.name) {
                    socket.broadcast.emit("userTyping", user);
                }
            });

            /**
             * (4) Handle user disconnection
             * when a user leaves or disconnects, remove them and update others
             */

            socket.on("disconnect", () => {
                const user = onlineUsers.get(socket.id);

                //update online users list for everyone
                chatNamespace.emit(
                    "onlineUsers",
                    Array.from(onlineUsers.values())
                );

                //notify others that someone has left
                chatNamespace.emit("chatNotification", {
                    message: `${user.name} has left the chat.`,
                    type: "info",
                });

                console.log(`${user.name} disconnected (${socket.id})`);
            });
        });
    });
};

module.exports = chatSocket;
