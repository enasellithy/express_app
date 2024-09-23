const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createTodo = async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
        });

        const savedTodo = await todo.save();
        res.json(savedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            { _id: req.params.todoID },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    completed: req.body.completed,
                },
            },
            { new: true },
        );
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.deleteOne({ _id: req.params.todoID })
            .then(() => res.json({ message: "Todo Deleted" }))
            .catch((err) => res.send(err));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};