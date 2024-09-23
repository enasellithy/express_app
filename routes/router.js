const { getTodos, createTodo, updateTodo, deleteTodo } = require("../controllers/TodoController");
const { registerUser, loginUser, getUserProfile, logoutUser } = require("../controllers/userController");
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');

router.get("/todos", getTodos);
router.post("/todos", createTodo);
router.put("/todos/:todoID", updateTodo);
router.delete("/todos/:todoID", deleteTodo);

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/getUserProfile", protect , getUserProfile);
router.get("/logoutUser", protect , logoutUser);

module.exports = router;