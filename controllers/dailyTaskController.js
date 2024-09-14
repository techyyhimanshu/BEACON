const { Sequelize } = require("sequelize");
const db = require("../models");
const DailyTask = db.dailytask;
const PersonnelRecords = db.PersonnelRecords;

// Get all tasks
const getAllTask = async (req, res) => {
    try {
        const {count, rows } = await DailyTask.findAndCountAll({});
        if (rows) {
            return res.status(200).json({ status: "success",count:count,  data: rows });
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
            }
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
        if (Tasks[0]==1) {
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
        const {count, rows} = await DailyTask.findAndCountAll({
            where: {
                personnel_id: req.params.id
            },
            order: [
                ['validTill', 'DESC']  // or 'ASC' if you want descending order
            ]
        });
        if (rows) {
            return res.status(200).json({ status: "success",count: count,data: rows });
        } else {
            return res.status(200).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
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
        if (Tasks==1) {
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
    try {
        const person = await PersonnelRecords.findOne({
            where: {
                personnel_id: req.body.personnel_id
            }
        });
        if (!person) {
            return res.status(200).json({ status: "failure", message: "Person ID does not exist" });
        }

        req.body.status = "assigned";  // Set the default status to 'assigned'
        const data = await DailyTask.create(req.body);

        if (data) {
            return res.status(200).json({ status: "success", message: "Created successfully" });
        } else {
            return res.status(200).json({ status: "failure", message: "Error occurred" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(500).json({ status: "failure", message: errorMessages });
        } else {
            return res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }
};

// Update task status (Report)
const taskReport = async (req, res) => {
    const allowedStatusValues = ['pending', 'in-progress', 'completed', 'on-hold'];

    // Validate status
    if (!allowedStatusValues.includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const Report = await DailyTask.update(
            { status: req.body.status },
            { where: { task_id: req.body.task_id } }
        );
        if (Report[0]==1) {
            return res.status(200).json({ status: "success", message: `Task ID : ${req.body.task_id} status is changed to ${req.body.status}. `});
        } else {
            return res.status(200).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};

// Export the modules
module.exports = {
    getAllTask,
    getSingleTask,
    updateTask,
    getPersonTask,
    deleteTask,
    asignTask,
    taskReport
};
