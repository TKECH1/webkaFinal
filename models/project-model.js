import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    img: {
        type: [String], // Array of image URLs
        required: true  // Images are mandatory
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Project = mongoose.model('projects', projectSchema);

export default Project