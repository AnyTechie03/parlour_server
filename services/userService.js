const Review = require("../model/Review");
const User = require("../model/User");


const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.find({});
      resolve(usr ? usr : null);
    })();
  });
};

const getUserById = (_id) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.findById({ _id});
      resolve(usr ? usr : null);
    })();
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.findOne({ email });      
      resolve(usr ? usr : null);
    })();
  });
};

const getUserByEmailorPhone = (userinput) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.findOne({$or:[{email:userinput},{phoneNo:userinput}]} );
      resolve(usr);
    })();
  });
};

const updateUserStatus = (id, user_status) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.updateOne(
        { _id: id },
        { $set: { user_status: user_status } }
      );
      resolve(usr ? usr : null);
    })();
  });
};

const UpdateUser= (id, data) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const usr = await User.findOneAndUpdate(
        { _id: id },
        { $set: data },
        {new:true}
      );
      resolve(usr);
    })();
  });
};

const CreateNewUser = (
  name,email,password,phoneNo,houseNo,appartment,landmark,city,state) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const newUser = new User({name,email,password,phoneNo,houseNo,appartment,landmark,city,state});
      newUser.account_status = "unverified";
      await newUser.save();
      resolve(newUser);
    })();
  });
};


const PostReviewByBar = (
  eid,
  reviewer,
  detail,
  overall,
  experience,
  staff,
  value,
) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const newReview = new Review({eid,reviewer,detail,overall,experience,staff,value });
      await newReview.save();
      resolve(newReview);
    })();
  });
};


module.exports=  {
  getAllUsers,
  CreateNewUser,
  getUserByEmail,
  updateUserStatus,
  getUserById,
  getUserByEmailorPhone,
  UpdateUser,
  PostReviewByBar,
};
