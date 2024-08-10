const transporter = require("../config/nodemailer");
const crypto = require("crypto");

const sendVerificationEmail = async (user, verificationCode) => {
  console.log(
    "usesr is :",
    user,
    "\n verification code is :",
    verificationCode
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    text: `Your verification code is ${verificationCode}. It is valid for 1 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
