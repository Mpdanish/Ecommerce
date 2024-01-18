import Userdb from "../model/userSchema.js";
import Otpdb from "../model/otpSchema.js";
import Productdb from "../model/productSchema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function newuser(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const dupemail = await Userdb.findOne({ email });

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Content cannot be empty" });
    }

    if (password != confirmPassword) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Password does not match" });
    }

    if (dupemail) {
      return res
        .status(401)
        .json({ errStatus: true, message: "User already exist" });
    }

    const otp = generateOTP();
    const otpp = new Otpdb({
      email: req.body.email,
      otp: otp,
    });

    const otpInfo = await otpp.save();
    req.session.email = req.body.email;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with hashed password and save it
    const user = new Userdb({
      name,
      email,
      password: hashedPassword,
    });

    const data = await user.save();

    // Send email with OTP
    sendOtpEmail(req.body.email, otp);

    // Render OTP entry page
    res.status(200).render("otpentry");
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      res.status(400).send("Validation Error");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
}

export async function isUser(req, res) {
  if (!req.body) {
    res.status(400).redirect("/login");
    return;
  }

  const { email, password, otp } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ errStatus: true, message: "Enter email" });
    }

    if (!password) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Password" });
    }

    // if (!email || !password) {
    //   return res.status(401).json({ errStatus: true, message: "Content cannot be empty" });
    // }

    const user = await Userdb.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Invalid email" });
    }

    if (user.status === false) {
      return res
        .status(401)
        .json({ errStatus: true, message: "User is blocked by admin" });
    }
    const data = await Userdb.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, data.password);

    if (isPasswordMatch) {
      // Set session and redirect to home
      req.session.userId = user.id;
      req.session.email = email;
      res.send("login successfully")
    } else {
      res.status(401).json({ errStatus: true, message: "Invalid password" });
    }
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
}

export async function otp(req, res) {
  try {
    const otp = generateOTP();
    const otptyped =
      req.body.a +
      req.body.b +
      req.body.c +
      req.body.d +
      req.body.e +
      req.body.f;

    const otpDocument = await Otpdb.findOne({ email: req.session.email });

    if (!otpDocument) {
      return res.status(400).send({ message: "No OTP found for the user" });
    }

    const storedOTP = otpDocument.otp;

    if (otptyped === storedOTP) {
      const updateResult = await Userdb.updateOne(
        { email: req.session.email },
        { $set: { verified: true } }
      );
      res.redirect("/");
    } else {
      res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

// Function to send OTP via email
function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_MAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_MAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for email verification is: ${otp} . This OTP will expire within 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export async function logoutUser(req, res){
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/'); // Redirect to login page after logout
  });
};