const transporter = require("../config/nodemailer");
const crypto = require("crypto");

const sendVerificationEmail = async (email, verificationCode) => {
  console.log(
    "usesr is :",
    email,
    "\n verification code is :",
    verificationCode
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Your verification code is ${verificationCode}. It is valid for 1 minutes.`,
  };

  let prb_transporter = await transporter.sendMail(mailOptions);
  console.log(prb_transporter);
};

module.exports = sendVerificationEmail;
