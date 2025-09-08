import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface for the User model
interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

// Mongoose schema for the User model
const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
