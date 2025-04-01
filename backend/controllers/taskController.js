const Task = require("../models/taskModel");

const createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;
    const task = await Task.create({ title, description, assignedTo });
    res.status(201).json(task);
};

const getTasks = async (req, res) => {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json(tasks);
};

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
