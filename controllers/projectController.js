const db=require('../models')
const Project=db.Project

const createProject = async (req, res) => {
    try {
        const project=await Project.create({
            project_name:req.body.project_name
        })
        res.status(200).json({ status: "success", data: project })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }
}
const getProjectList=async (req,res)=>{
    try {
        const data=await Project.findAll({
            attributes:['project_id','project_name']
        })
        res.status(200).json({ status: "success", data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }
}
module.exports = {
    createProject,
    getProjectList
}