// routes/todoRoutes.ts
import express, { Request, Response } from "express";
import Todo from "../models/Todo";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Get all todos for the authenticated user
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await Todo.find({ user: req.body.userId });
      res.json(todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create a new todo for the authenticated user
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { text } = req.body;

    try {
      const todo = new Todo({
        text,
        user: req.body.userId,
      });

      const newTodo = await todo.save();
      res.status(201).json(newTodo);
    } catch (err) {
      console.error("Error creating todo:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Toggle completion status of a todo
router.patch(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const todo = await Todo.findOne({ _id: id, user: req.body.userId });
      if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
      }

      todo.completed = !todo.completed;
      await todo.save();
      res.json(todo);
    } catch (err) {
      console.error("Error updating todo:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a todo
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const todo = await Todo.findOneAndDelete({
        _id: id,
        user: req.body.userId,
      });
      if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
      }

      res.json({ message: "Deleted Todo" });
    } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
