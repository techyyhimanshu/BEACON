const jwt=require('jsonwebtoken')
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (username === "cit_superadmin" && password === "citpvt") {
            const token=jwt.sign({username:username},process.env.JWT_SECRET,{expiresIn:'30m'})
            res.status(200).json({ status: "success",authorization:token });

        } else {
            res.status(200).json({ status: "failure", message: "Login failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }
};

module.exports = {
    adminLogin
}