import User from '../models/user-model.js'; // Assuming you have 'user-model.js'
import bcrypt from 'bcrypt';

export default class UserService {
    createUser = async (data) => {
        const user = new User(data)
        return await user.save();
    }

    findAll = async () => {
        return await User.find();
    }

    findById = async (id) => {
        return await User.findById(id);
    }

    findByEmail = async (email) => {
        return await User.findOne({email})
    }

    updateUser = async (id, updatedData) => {
        // Handle password updates separately if necessary
        if (updatedData.password) {
            const saltRounds = 10; // Adjust for security
            updatedData.hash_password = await bcrypt.hash(updatedData.password, saltRounds);
        }

        return await User.findByIdAndUpdate(id, updatedData, { new: true });
    }

    deleteUser = async (id) => {
        return await User.findByIdAndDelete(id);
    }
}