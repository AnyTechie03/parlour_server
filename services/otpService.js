const Otp =  require("../model/Otp");

const getOtp = (id) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const otp = await Otp.findOne({ _id: id });
      resolve(otp);
    })();
  });
};

const deleteOtp = (id) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const otp = await Otp.deleteMany({ uid: id });
      resolve(otp);
    })();
  });
};

const VerifyOtp = (id, storedOtp) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const otp = await Otp.findOne({ uid: id, otp: storedOtp });
      resolve(otp);
    })();
  });
};

const createOtp = (id, GenOtp) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const otp = new Otp({ uid: id, otp: GenOtp });
      otp.save();
      resolve(otp ? otp : null);
    })();
  });
};

module.exports = { getOtp, deleteOtp, createOtp, VerifyOtp };
