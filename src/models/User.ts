
import { Schema, model } from "mongoose";

interface User extends Document {
  email: string;
  password: string;
  ethereumAddress: string;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ethereumAddress: { type: String }
});

const UserModel = model('User', userSchema);

export default UserModel;
