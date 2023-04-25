const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

exports.emailNotify = functions.firestore
    .document("posts/{postId}")
    .onCreate(async (snap, context) => {
      const post = snap.data();
      const usersRef = admin.firestore().collection("students");
      const users = await usersRef.get();
      const emails = users.docs.map((user) => user.data().email_or_phone);
      const id = post.postId;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "junioratta2929@gmail.com",
          pass: "jvbsyhzavpfmbqdj",
        },
      });

      const mailOptions = {
        // eslint-disable-next-line max-len
        from: "Ashesi Hub(ashHub) <" + process.env.EMAIL_ADDRESS + ">",
        to: emails.join(","),
        subject: "New post created on ashHUb",
        // eslint-disable-next-line max-len
        text: `A new post has been created by: ${post.username} with description: ${post.description} click this link https://ashesi-hub-b528e.web.app/#/post/${id}`,
      };

      await transporter.sendMail(mailOptions);
    });
