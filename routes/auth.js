const express = require("express");
const { CreateNewUser, getUserByEmail } = require("../services/userService");
const userRoute = express.Router();
const bcrypt = require("bcryptjs");
const { createOtp } = require("../services/otpService");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const Services = require("../model/Services");
const userAuth = require("../middleware/userAuth");
const Booking = require("../model/Booking");
const Items = require("../model/Items");

userRoute.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNo,
    houseNo,
    appartment,
    landmark,
    city,
    state,
  } = req.body.user;
  try {
    if(!name || !email || !password){
      return res.status(400).json({
        type: 0,
        message: "Missing Credentails",
        data: null,
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    let storePass = hashPass;

    const existUser = await getUserByEmail(email);
    if (existUser != null) {
      return res.status(400).json({
        type: 0,
        message: "User Already registered",
        data: true,
      });
    }

    const usr = await CreateNewUser(
      name,
      email,
      storePass,
      phoneNo,
      houseNo,
      appartment,
      landmark,
      city,
      state
    );

    var otpGen = Math.floor(Math.random() * 10000).toString();
    while (otpGen.length < 4) {
      otpGen += "0";
    }
    await createOtp(usr._id, otpGen);

    //   await Mailer({
    //     to:{email:user.email},
    //     subject:"OTP for Account verification",
    //     body:`<h1>Welcome Onboard </h1><h3><br>OTP for your account verificiation is <br> ${otpGen} <br>Do not share the opt with anyone.</h3>`
    //   });

    res.status(201).json({
      type: 0,
      message: "Signed up Success",
      data: { id: usr._id },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body.user;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({
        type: 1,
        message: "Invalid Credentials",
        data: null,
      });
    }
    const authentication = await bcrypt.compare(password, user.password);
    if (!authentication) {
      return res.status(401).send({
        type: 1,
        message: "Invalid Credentials",
        data: null,
      });
    }
    const usr = user.toObject();
    delete usr["password"];
    const key = "Thisismykey@123";
    const Token = jwt.sign({ id: user._id }, key);
    res.cookie("Token", Token);
    res.status(201).json({
      type: 0,
      message: "Login successful",
      data: { usr, Token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

userRoute.get("/getuser",userAuth, async (req, res) => {
    const _id = req.user._id
    try {
    const user = await User.findOne({_id}).select({password:0});
    if (!user) {
      return res.status(401).send({
        type: 1,
        message: "Invalid Credentials",
        data: null,
      });
    }

    res.status(201).json({
      type: 0,
      message: "User Data Detched",
      data:user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

userRoute.post("/service", async (req, res) => {
  const { service, duration, productUsed, description, amount, type } =
    req.body.Service;

  try {
    const srv = new Services({
      service,
      duration,
      productUsed,
      description,
      amount,
      type,
    });
    await srv.save();
    res.status(201).json({
      type: 0,
      message: "Services Added",
      data: srv,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.get("/booking", async (req, res) => {
  try {
    const booking = await Booking.find({}).populate("sid").populate("bid");
    res.status(201).json({
      type: 0,
      message: "Booking List Fetched",
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.post("/booking", userAuth, async (req, res) => {
  const { sid, date, timeslot, extraReq, amount } = req.body;
  const bid = req.user.id;
  try {
    const booking = new Booking({
      bid,
      sid,
      date,
      timeslot,
      extraReq,
      amount,
    });
    await booking.save();
    res.status(201).json({
      type: 0,
      message: "Booking Scheduled Successfullt",
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.get("/service",async (req, res) => {
  try {
    const servicesList = await Services.find({});
    res.status(201).json({
      type: 0,
      message: "Services Fetched",
      data: servicesList,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.patch("/item", async (req, res) => {
  const { id, name, expDate, inStock, Brand, alertValue } = req.body;

  try {
    const Item = await Items.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          expDate,
          inStock,
          Brand,
          alertValue,
        },
      },
      { new: true }
    );
    res.status(201).json({
      type: 0,
      message: "Item Stored in Inventory Updated",
      data: Item,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.post("/item", async (req, res) => {
  const { name, expDate, inStock, Brand, alertValue } = req.body;

  try {
    const Item = new Items({
      name,
      expDate,
      inStock,
      Brand,
      alertValue,
    });
    await Item.save();
    res.status(201).json({
      type: 0,
      message: "Item Stored in Inventory",
      data: Item,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.get("/item", userAuth, async (req, res) => {
  const _id = req.user._id;
  try {
    //later add validation if admin or not using id
    console.log(_id);
    const Itemslist = await Items.find({});
    res.status(201).json({
      type: 0,
      message: "Items Fetched",
      data: Itemslist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.get("/specitem", userAuth, async (req, res) => {
  const _id = req.user._id;
  const { id } = req.body;
  try {
    //later add validation if admin or not using id
    console.log(_id);
    const Itemslist = await Items.find({ _id: id });
    res.status(201).json({
      type: 0,
      message: "Items Fetched",
      data: Itemslist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.get("/userbooking", userAuth, async (req, res) => {
  const _id = req.user._id;
  try {
    const booking = await Booking.find({ bid: _id }).populate("sid");
    console.log(booking);
    res.status(201).json({
      type: 0,
      message: "Booking List Fetched",
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});

userRoute.patch("/canclebooking", userAuth, async (req, res) => {
  const _id = req.user._id;
  const {bookingId} = req.body;
  try {
    const booking = await Booking.deleteOne({ _id: bookingId });
    res.status(201).json({
      type: 0,
      message: "Booking Cancled",
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: 0,
      message: "Something Went Wrong!",
      data: null,
    });
  }
});


module.exports = userRoute;
