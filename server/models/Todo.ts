// models/Todo.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  user: mongoose.Types.ObjectId; // Reference to the User model
}

const TodoSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
