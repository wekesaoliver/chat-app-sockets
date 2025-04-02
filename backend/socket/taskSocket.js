const taskSocket = (taskNamespace) => {
    taskNamespace.on("connection", (socket) => {
        console.log(`New connection for tasks namespace: ${socket.id}`);

        /**
         * (1) User joins a specific task board
         * Frontend emits 'joinTaskBoard' with boardId (if multi-board support)
         * The socket joins that board's room.
         */
        socket.on("joinTaskBoard", (boardId) => {
            socket.join(boardId);
            console.log(`User ${socket.id} joined task board: ${boardId}`);
        });

        /**
         * (2️) Handle New Task creation
         * When frontend emits 'taskCreated', we broadcast to the board room or everyone.
         */
        socket.on("taskCreated", (taskData) => {
            if (taskData.boardId) {
                // Emit to only users in this board room
                taskNamespace
                    .to(taskData.boardId)
                    .emit("taskCreated", taskData);
                console.log(`Task created on board ${taskData.boardId}`);
            } else {
                // Fallback: broadcast globally
                taskNamespace.emit("taskCreated", taskData);
            }
        });

        /**
         * (3️) Handle Task updates
         * Example: Mark task as 'done', reassign, edit description, etc.
         */
        socket.on("taskUpdated", (taskData) => {
            if (taskData.boardId) {
                taskNamespace
                    .to(taskData.boardId)
                    .emit("taskUpdated", taskData);
                console.log(`Task updated on board ${taskData.boardId}`);
            } else {
                taskNamespace.emit("taskUpdated", taskData);
            }
        });

        /**
         * (4️) Handle Task deletion
         */
        socket.on("taskDeleted", (taskData) => {
            if (taskData.boardId) {
                taskNamespace
                    .to(taskData.boardId)
                    .emit("taskDeleted", taskData);
                console.log(`Task deleted on board ${taskData.boardId}`);
            } else {
                taskNamespace.emit("taskDeleted", taskData);
            }
        });

        /**
         * (5️) Clean disconnect logging
         */
        socket.on("disconnect", () => {
            console.log(`Task namespace disconnect: ${socket.id}`);
        });
    });
};

module.exports = taskSocket;
