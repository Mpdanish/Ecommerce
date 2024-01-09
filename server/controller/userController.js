import Userdb from '../model/userSchema.js';
import Otpdb from '../model/otpSchema.js';
import Productdb from '../model/productSchema.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
// Function to generate a random OTP

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
    };


// create and save new user
  export async function newuser (req, res) {
        // validate request
        if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty' });
        return;
        }

        // Password matching
        if (req.body.password !== req.body.confirmpassword) {
        return res.status(400).send({ message: 'Password and Confirm Password do not match!' });
        }
 
        const otp = generateOTP()
        const otpp= new Otpdb({
          email: req.body.email,
          otp: otp
        })

        const otpInfo = await otpp.save(); 
        req.session.email = req.body.email;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create a new user with hashed password and save it
        const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        });

        try {
        const data = await user.save();

        // Send email with OTP
        sendOtpEmail(req.body.email, otp);

        // Render OTP entry page
        res.render('otpentry');
        } catch (err) {
        console.log(err);
        res.redirect('/register');
        }
  };


// export async function newuser(req, res) {
//   try {
//     // Validate request using express-validator
//     await Promise.all([
//       body('name').trim().isLength({ min: 3 }).withMessage('Name cannot be empty').run(req),
//       body('email').trim().isEmail().withMessage('Invalid email address').run(req),
//       body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req),
//       body('confirmpassword').custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error('Password and Confirm Password do not match!');
//         }
//         return true;
//       }).run(req),
//     ]);

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const otp = generateOTP();
//     const otpp = new Otpdb({
//       email: req.body.email,
//       otp: otp,
//     });

//     const otpInfo = await otpp.save();
//     req.session.email = req.body.email;

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = new Userdb({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//     });

//     const data = await user.save();
//     sendOtpEmail(req.body.email, otp);

//     res.render('otpentry');
//   } catch (error) {
//     console.error(error);
//     res.redirect('/register');
//   }
// }


  export async function isUser (req, res) {
        if (!req.body) {
        res.status(400).redirect('/login');
        return;
        }

        const { email, password, otp } = req.body;
        try {
        const user = await Userdb.findOne({ email });

        if (!user) {
          return res.status(401).send({ message: 'Invalid email' });
      }

      if (user.status === false) {

        return res.status(401).send({ message: 'User is blocked by admin' });
    }
        const data = await Userdb.findOne({email});

        const isPasswordMatch = await bcrypt.compare(password, data.password);


        if (isPasswordMatch) {

            // Set session and redirect to home

            req.session.userId = user.id;
            req.session.email = email;
            res.redirect('/homepage1');

        } else {
            res.status(401).send({ message: 'Invalid password' });
        } 
        } catch (err) {
        console.error(err);
        res.redirect('/login');
        }
  };


  export async function otp (req, res) {
  try {
    const otp = generateOTP();
    const otptyped = req.body.a + req.body.b + req.body.c + req.body.d + req.body.e + req.body.f;
    // console.log(otptyped);

    // Retrieve the OTP from the database based on your user or session identifier
    const otpDocument = await Otpdb.findOne({ email: req.session.email }); // Replace 'userId' with your actual field
    // console.log(otpDocument);

    if (!otpDocument) {
      return res.status(400).send({ message: 'No OTP found for the user' });
    }

    const storedOTP = otpDocument.otp;
    // console.log(storedOTP);

    if (otptyped === storedOTP) {

      const updateResult = await Userdb.updateOne({ email: req.session.email }, { $set: { verified: true } });
      console.log(updateResult);
      res.redirect('/homepage1');
    } else {
      console.log('OTP does not match');
      res.status(400).send({ message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Function to send OTP via email
function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_MAIL, 
      pass: process.env.AUTH_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.AUTH_MAIL,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for email verification is: ${otp} . This OTP will expire within 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}  

export async function productpageshow(req, res) {
  const data = await Productdb.findOne({ _id: req.params.id });
  res.send(data);
}


