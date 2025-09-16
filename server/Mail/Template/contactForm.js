exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const logoUrl =
    process.env.LOGO_URL ||
    "https://via.placeholder.com/200x50?text=StudyNotion";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact Form Confirmation</title>
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
  <h1 class="email-header">Contact Form Confirmation</h1>
  <div class="email-body">
    <p>Dear ${firstname} ${lastname},</p>
    <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
    <p><strong>Here are the details you provided:</strong></p>
    <p>Name: ${firstname} ${lastname}</p>
    <p>Email: ${email}</p>
    <p>Phone Number: +${countrycode} ${phoneNo}</p>
    <p>Message: ${message}</p>
    <p>We appreciate your interest and will get back to you shortly.</p>
  </div>
  <div class="email-footer">
    If you have any further questions or need immediate assistance, please contact us at 
    <a href="mailto:info@studynotion.com">info@studynotion.com</a>.
  </div>
</div>
</body>
</html>`;
};
