const Sequelize = require("sequelize");
const db = require("../models");
const TemplatesLike = db.tbl_temp_like;
const Template = db.tbl_template;



const likeTemplate = async (req, res) => {
    try {
        var try_to="" ;
        if (req.body.tryLike == 0) {
            try_to = 'DISLIKE'   
        } 
        else if (req.body.tryLike == 1) {
            try_to = 'LIKE'   
        }
        else {
            return res.status(400).json({ status: "failure", message: ' "trytoLike" vlaue is not valid'  })
        };
        console.log('tryto like by body ' ,req.body.tryLike );
        console.log('try to for exe', try_to);
        
        
        const Temp = await Template.findOne({
            attributes: ['temp_id'],
            where: { temp_id: req.body.temp_id }
        }); 
        if (!Temp){
            return res.status(400).json({ status: "failure", message: `Template ${req.body.temp_id} is not exist`})
        }
        const rows = await db.sequelize.query(`
            call sp_like_temp(?,?,?);
        `, {
            type: Sequelize.QueryTypes.UPDATE,
            replacements : [req.body.temp_id,req.body.user_uniqueID,try_to]
        });
        if (rows.length > 0 ) {
            res.status(200).json({ status: "success", data: rows })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }
};

const templateLikes = async (req, res) => {
    try {
        const data = await TemplatesLike.findAll({
            attributes: ['user_uniqueID',['createdAt','liked_At']],
            where:{
                temp_id : req.params.id,
                status : 1
            }
        });
        if (data.length > 0) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(200).json({ status: "success", data: '0 View'  })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }
}

module.exports = {
    likeTemplate,
    templateLikes
}