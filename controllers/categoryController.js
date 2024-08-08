const db = require("../models");
const Category=db.Category

const getAllCategories= async(req,res)=>{
try {
    const categories=await Category.findAll({
        attributes:['category_id','category_name']
    })
    if(categories){
        res.status(200).json({status:"success",data:categories})
    }else{
        res.status(404).json({status:"failure",message:"Not found"})
    }
} catch (error) {
    res.status(404).json({status:"failure",message:"Internal server error"})
}
}
const addCategory=async(req,res)=>{
    try {
    const data=await Category.create(req.body)
    if(data){
        res.status(200).json({status:"success",message:"Created successfully"})
    }else{
        res.status(200).json({status:"failure",message:"Error occured"})
    }
    } catch (error) {
        
    }
}

// ADD CATEGORY 
const addCategory =  async(req,res)=>{
    try {
        const category =await Category.create(req.body)
        if(category){
            res.status(200).json({status:"success", data:category})
        }else{
            res.status(404).json({status:"failure",message:"catory is not added"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
    }
    }

module.exports={
    getAllCategories,
    addCategory
}