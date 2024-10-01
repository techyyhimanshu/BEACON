const db=require('../models')
const Project=db.Project
const DailyTask=db.dailytask

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ project_name: req.body.project_name }, { fields: ['project_name'] });
    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failssssure', message: 'Internal server error' });
  }
};
const getProjectList = async (req, res) => {
  try {
    const data = await Project.findAll({
      attributes: ['project_id', 'project_name'],
      raw: true,
    });
    res.json({ status: 'success', data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { id: project_id } = req.params;
    const tasks = await DailyTask.findAll({
      where: { project_id },
      attributes: ['task_id', 'title', 'description', 'validFrom', 'validTill', 'priority'],
    });
    res.json({ status: 'success', data: tasks });
  } catch (error) {
    res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
}
module.exports = {
    createProject,
    getProjectList,
    getProjectTasks
}