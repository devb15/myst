//Nodemailer Imported

var nodemailer = require('nodemailer');
let smtpConfig = {
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false, 
    auth: {
        user: 'postmaster@sandboxb20c729e3cbd49f7a5cc38aed1182fe6.mailgun.org',
        pass: '210dd94fa00dd2fcd29079a815329cc5'
    },
    tls: { rejectUnauthorized: false }// upgrade later with STARTTLS
    
};

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(smtpConfig);

// var smtpTransport = nodemailer.createTransport('SMTP',{
//     service: 'gmail',
//     auth: {
//       user: 'apkteam2@gmail.com',
//       pass: 'icanwin123'
//     }
//   });
var mailOptions = {
to: 'rakawupede@20boxme.org',
from: 'passwordreset@demo.com',
subject: 'Your password has been changed',
text: 'Hello,\n\n' +
  'This is a confirmation that the password for your account has just been changed.\n'
};
transporter.sendMail(mailOptions, function(err) {
    console.log(err);
console.log('dont run');
});

// verify connection configuration for email


// transporter.verify(function(error, success) {
//     if (error) {
//          console.log(error);
//     } else {
//          console.log('Server is ready to take our messages');
//     }
//  });
