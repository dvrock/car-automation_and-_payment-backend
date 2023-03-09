const nodemailer = require("nodemailer");
const Email = {
  Message: function (req, res) {
    var Transport = new nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: "syeddrrock@gmail.com",
        pass: "dkmwtytzhxwbkmot",
      },
    });

    var mail_options;
    mail_options = {
      from: "syeddrrock@gmail.com",
      to: req.email,
      subject: "Please verify your email address",
      html:
        '<p>Click <a href="http://localhost:3000/new/home/' +
        req.id +
        '">here</a> to go home page</p>',
    };
//     var mailOption = {
//         from: from,
//         to:  to,
//         subject: subject,
//         text: text,
//         html: html,
//         attachments: [{
//             filename: change with filename,
//             path: change with file path
//         }]
// }

    Transport.sendMail(mail_options, function (err, resp) {
      if (err) {
        console.log(err);
      } else {
      }
    });
  },
};
module.exports = Email;
