const sgMail = require("@sendgrid/mail");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userWelcomeTemplate = _compile("user-welcome.hbs");
const emailConfirmTemplate = _compile("email-confirm.hbs");
const userNotificationTemplate = _compile("user-notification.hbs");

async function _sendMail(msg) {
  msg["from"] = "solice@example.com";
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

function _compile(file) {
  const temp = fs.readFileSync(path.join(__dirname, "../views/" + file));
  return Handlebars.compile(temp.toString());
}

async function sendUserWelcome(user) {
  const data = { firstname: user.firstname };
  const email = {
    subject: "Welcome to Solice",
    html: userWelcomeTemplate(data),
    to: user.email
  };

  await _sendMail(email);
}

async function sendEmailVerification(user, url, token) {
  const link = `${url}/verify-email?token=${token}`;
  const data = { firstname: user.firstname, link: link };
  const email = {
    subject: "Solice: Confirm Email Address",
    html: emailConfirmTemplate(data),
    to: user.email
  };

  await _sendMail(email);
}

async function sendUserNotification(user) {
  const data = { firstname: user.firstname };
  const email = {
    subject: "Solice: New Notifications",
    html: userNotificationTemplate(data),
    to: user.email
  };

  await _sendMail(email);
}

module.exports = {
  sendUserWelcome,
  sendEmailVerification,
  sendUserNotification
};
