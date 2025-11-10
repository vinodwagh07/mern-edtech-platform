exports.otpTemplate = (otp) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:4000";
  const logoUrl =
    process.env.LOGO_URL ||
    "https://via.placeholder.com/200x50?text=StudyNotion";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Verification Email</title>
<style>
  body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
  .logo { max-width: 200px; margin-bottom: 20px; }
  .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
  .body { font-size: 16px; margin-bottom: 20px; }
  .highlight { font-weight: bold; font-size: 24px; color: #FFD60A; }
  .support { font-size: 14px; color: #999; margin-top: 20px; }
  .cta { display: inline-block; padding: 10px 20px; background-color: #FFD60A; color: #000; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
  <a href="${baseUrl}"><img class="logo" src="${logoUrl}" alt="StudyNotion Logo"></a>
  <h1 class="message">OTP Verification Email</h1>
  <div class="body">
    <p>Dear User,</p>
    <p>Thank you for registering with StudyNotion. Use the following OTP to verify your account:</p>
    <h2 class="highlight">${otp}</h2>
    <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.</p>
  </div>
  <div class="support">For assistance, contact us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>.</div>
</div>
</body>
</html>`;
};
