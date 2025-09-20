exports.passwordUpdated = (email, name) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const logoUrl =
    process.env.LOGO_URL ||
    "https://via.placeholder.com/200x50?text=StudyNotion";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Update Confirmation</title>
<style>
  body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
  .logo { max-width: 200px; margin-bottom: 20px; }
  .email-header { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
  .email-body { font-size: 16px; margin-bottom: 20px; text-align: left; }
  .highlight { font-weight: bold; }
  .email-footer { font-size: 14px; color: #999; margin-top: 20px; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <a href="${baseUrl}"><img class="logo" src="${logoUrl}" alt="StudyNotion Logo"></a>
  <h1 class="email-header">Password Update Confirmation</h1>
  <div class="email-body">
    <p>Hey ${name},</p>
    <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
    <p>If you did not request this password change, please contact us immediately to secure your account.</p>
  </div>
  <div class="email-footer">
    If you have any questions or need further assistance, please contact us at 
    <a href="mailto:info@studynotion.com">info@studynotion.com</a>.
  </div>
</div>
</body>
</html>`;
};
