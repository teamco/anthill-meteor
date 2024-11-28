const dotenv = require('dotenv');
const speakeasy = require('speakeasy');

dotenv.config({ path: __dirname + '/../../../.env' });

const key = process.env.__SECRET_KEY;

function verifyOTP(otp) {
  const verified = speakeasy.totp.verify({
    secret: key,
    encoding: 'base32',
    token: otp
  });

  return verified;
}

const userOTP = '714124'; // Replace with the OTP entered by the user

const verificationResult = verifyOTP(userOTP);

if (verificationResult) {
  console.log('OTP verification successful!');
} else {
  console.log('OTP verification failed!');
}
