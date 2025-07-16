async function authmiddleware(req, res, next){
    const {username, email, password, role}= req.body;

    if(!email|| !password){
        return res.status(500).json({
            message:"Field are requires"
        })
    }
    next()
}

module.exports = {authmiddleware}