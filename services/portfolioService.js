import connectToMongo from "../config/mongodb.js";
import Project from "../models/project-model.js";


export default class ProjectService{
    createProject = async (data) => {
        const project = new Project(data);
        return await project.save();

}

    findAll = async () => {
        return await Project.find();
    }

    findById = async (id) => {
        return await Project.findById(id);
    }

    update = async (id, updatedData) => {
        return await Project.findByIdAndUpdate(id, {$set: updatedData}, { new: true });
    }

    delete = async (id) => {
        return await Project.findByIdAndDelete(id);
    }
}
