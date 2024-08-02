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

module.exports={
    getAllCategories
}