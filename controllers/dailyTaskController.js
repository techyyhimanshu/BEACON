const { Sequelize } = require("sequelize");
const db = require("../models");
const DailyTask = db.dailytask;
const PersonnelRecords = db.PersonnelRecords;
const DailyTaskReport = db.DailyTaskReport;
const Project = db.Project;
const AssignedTask = db.assignedtask;

const moment = require('moment-timezone');
const { SELECT } = require("sequelize/lib/query-types");

// Get all tasks
const getAllTask = async (req, res) => {
    try {
        const { count, rows } = await DailyTask.findAndCountAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (rows) {
            return res.status(200).json({ status: "success", count: count, data: rows });
        } else {
            return res.status(200).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Get single task by ID
const getSingleTask = async (req, res) => {
    try {
        const Tasks = await DailyTask.findOne({
            where: {
                task_id: req.params.id
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (Tasks) {
            return res.status(200).json({ status: "success", data: Tasks });
        } else {
            return res.status(200).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const person = await PersonnelRecords.findOne({
            where: {
                personnel_id: req.body.personnel_id
            }
        });
        if (!person) {
            return res.status(200).json({ status: "failure", message: "Person ID does not exist" });
        }

        const Tasks = await DailyTask.update(req.body, {
            where: {
                task_id: req.params.id
            }
        });
        if (Tasks[0] == 1) {
            return res.status(200).json({ status: "success", message: "Updated Succesfully" });
        } else {
            return res.status(200).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Get tasks by personnel ID
const getPersonTask = async (req, res) => {
    try {
        // First, get the task count
        const taskCountResult = await db.sequelize.query(
            `SELECT COUNT(dt.task_id) AS task_count
            FROM DailyTasks dt
            JOIN AssignedTasks ast ON ast.task_id = dt.task_id
            JOIN PersonnelRecords pr ON pr.personnel_id = ast.personnel_id
            WHERE pr.device_id = ?`,
            {
                type: db.Sequelize.QueryTypes.SELECT,
                replacements: [req.params.id]
            }
        );

        const task_count = taskCountResult[0].task_count;

        // Then, get the actual task details
        const tasks = await db.sequelize.query(
            `SELECT dt.task_id, dt.asignBy, dt.title, dt.description,
            dt.validFrom, dt.validTill, dt.priority, p.project_name
            FROM DailyTasks dt
            JOIN AssignedTasks tp ON tp.task_id = dt.task_id
            JOIN PersonnelRecords pr ON pr.personnel_id = tp.personnel_id
            JOIN Projects p ON p.project_id = dt.project_id
            WHERE pr.device_id = ? order by priority desc`,
                {
                    type: db.Sequelize.QueryTypes.SELECT,
                    replacements: [req.params.id]
                }
            );

        // Check if tasks are found
        if (tasks.length > 0) {
            return res.status(200).json({ status: "success", count: task_count, data: tasks });
        } else {
            return res.status(404).json({ status: "failure", message: "No tasks found for this person" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const Tasks = await DailyTask.destroy({
            where: {
                task_id: req.params.id
            }
        });
        if (Tasks == 1) {
            return res.status(200).json({ status: "success", message: "deleted successfully" });
        } else {
            return res.status(200).json({ status: "failure", message: "Task Not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Assign a task
const asignTask = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { assignedBy, project_id, title, description, validFrom, validTill, priority } = req.body;
        const personel_ids = Array.isArray(req.body.personnel_id) ? req.body.personnel_id : [req.body.personnel_id];
        const existingPersonnel = await PersonnelRecords.findAll({
            where: {
                personnel_id: personel_ids
            },
            attributes: ['personnel_id']
        });
        const existingPersonnelIds = existingPersonnel.map(p => p.personnel_id);

        const notExistingPersonnelIds = personel_ids.filter(id => !existingPersonnelIds.includes(id));

        if (notExistingPersonnelIds.length > 0) {
            return res.status(200).json({ status: "failure", message: `Person ID ${notExistingPersonnelIds.join(', ')} does not exist` });
        };
        const project = await Project.findByPk(project_id)
        if (!project) {
            return res.status(200).json({ status: "failure", message: "Project not found" });
        }
        const taskData = {
            assignedBy,
            project_id,
            title,
            description,
            validFrom,
            validTill,
            priority
        };

        // create task 
        const data = await DailyTask.create(taskData, {t});
        let task_id = data.task_id*1
        console.log(task_id);
        
        // assiged to PERSON
        const assignData = personel_ids.map(personnel_id => ({
            task_id,personnel_id
        }));
        const assignTask = await AssignedTask.bulkCreate(assignData , {t});
        await t.commit();
        return res.status(200).json({ status: "success", message: "Created successfully" });

    } catch (error) {
        await t.rollback();
        if (error instanceof Sequelize.ValidationError) {            
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({ status: "failure", message: errorMessages });
        } 
        else if(error instanceof Sequelize.AggregateError){
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({ status: "failure", message: errorMessages });
        }else {
            console.log(error);
            return res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }
};
// Update task status (Report)
const taskReport = async (req, res) => {

    try {
        const currentDateTime = moment().tz('Asia/Kolkata').format('HH:mm:ss');
        if (!(currentDateTime > "14:00:00" && currentDateTime < "18:00:00")) {
            return res.status(200).json({ status: "failure", message: "Not allowed! Try between 4PM to 6PM" });
        }
        const allowedStatusValues = ['pending', 'in-progress', 'completed',];

        // Validate status
        if (!allowedStatusValues.includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const person = await PersonnelRecords.findOne({
            attributes: ["personnel_id"],
            where: {
                device_id: req.body.device_id
            }
        })
        if (!person) {
            return res.status(200).json({ status: "failure", message: "User does not exist" });
        }
        const Report = await DailyTaskReport.create({
            task_id: req.body.task_id,
            personnel_id: person.personnel_id,
            status: req.body.status,
            description: req.body.description
        }

        );
        if (Report) {
            return res.status(200).json({ status: "success", message: `Report submitted` });
        } else {
            return res.status(200).json({ status: "failure", message: "Error occured" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

const dailyTaskList = async (req, res) => {
    try {
        const tasks = await DailyTask.findAll({
            attributes: ["task_id", "project", "title", "description"]
        })
        console.log(tasks);
        return res.status(200).json({ status: "success", data: tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
}

// Export the modules
module.exports = {
    getAllTask,
    getSingleTask,
    updateTask,
    getPersonTask,
    deleteTask,
    asignTask,
    taskReport,
    dailyTaskList
};
