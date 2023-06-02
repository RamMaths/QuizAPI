const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const MailGen = require('mailgen');

dotenv.config({path: './config.env'});

const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports = async function() {
  try {
    const mailGenerator = new MailGen({
      theme: 'salted',
      product: {
        name: 'TriviaRam',
        link: 'https://rammaths.github.io/QuizGame/',
        copyright: 'Copyright © 2023 TriviaRam. All rights reserved.'
      }
    });

    const response = {
      body: {
        greeting: false,
        intro: ['Please do not share this code with anyone else and introduce it in order to authenticate', `${this.otp}`],
        outro: 'Making your account socres more secure',
        signature: false
      }

    }

    let mail = mailGenerator.generate(response);
    let message = {
      from: MAIL_SETTINGS.auth.user,
      to: this.email,
      subject: "Two Factor OTP Authentication",
      html: mail
    }

    console.log(this);
    transporter.sendMail(message);
  } catch(err) {
    throw err;
  }
};
