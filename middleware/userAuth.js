const jwt = require("jsonwebtoken");
const User = require("../model/User");

const userAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      var token = req.headers.authorization.split(" ")[1];
    } else {
      var token = req.headers.authorization;
    }
    try {
      const key = "Thisismykey@123";
      const data = jwt.verify(token, key);
      const usr = await User.findOne({ _id: data.id });
      //   if(usr.acccount_status != account_status.active){
      //     return res.status(response_type.Unauthorized).json({
      //         type:1,
      //         message:"Un-authorized",
      //         data:null,
      //     })
      // }
      req.user = usr;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: error });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error });
  }
};

module.exports = userAuth;
