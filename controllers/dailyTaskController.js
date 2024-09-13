const db = require("../models");
const DailyTask=db.dailytask

const getAllTask = async(req,res)=>{
try {
    const Tasks =await DailyTask.findAll({})
    if(Tasks){
        res.status(200).json({status:"success",data:Tasks})
    }else{
        res.status(200).json({status:"failure",message:"Not found"})
    }
} catch (error) {
    res.status(500).json({status:"failure",message:"Internal server error"})
}
}

const asignTask = async(req,res)=>{
    try {
    const data=await DailyTask.create(req.body)
    if(data){
        res.status(200).json({status:"success",message:"Created successfully"})
    }else{
        res.status(200).json({status:"failure",message:"Error occured"})
    }
    } catch (error) {
        res.status(500).json({status:"failure",message:"Internal server error"})
    }
}
module.exports={
    asignTask,
    getAllTask
}