const otpGenerator = require("otp-generator");

const generateOTP = () => {

  // Generate new OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    specialChars: false,
  });

  return otp;
};

module.exports = { generateOTP };

