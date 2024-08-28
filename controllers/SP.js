const db = require("../models")
const Sequelize = require("sequelize")


const callSP = async (req, res) => {
    try {
        const bodyData = req.bodyData
        const data = await db.sequelize.query(`
            call sp_mngUser(?,'?','?')
            `,
            [11,'shyam','saharanpur']
            , (err , result) => {
                if(err)
                {
                    return res.status(400).json({ status: "failure", message: err.message})
                } else{
                    return  res.status(200).json({ status: "success", message: "sp run successfully" ,data:result})
                }
            }
            )
        if (data) {
            return res.status(200).json({ status: "success", message: "Created successfully" ,data:data})
        }
        else{
            return res.status(200).json({ status: "fail", message: "data is not found"  })
        }

    } catch (error) {
        return res.status(400).json({ status: "failure", message: error.message });
    }

}

module.exports = {
    callSP
}