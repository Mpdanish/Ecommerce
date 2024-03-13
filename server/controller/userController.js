import Userdb from "../model/userSchema.js";
import Otpdb from "../model/otpSchema.js";
import Productdb from "../model/productSchema.js";
import Addressdb from "../model/addressSchema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import Walletdb from "../model/walletSchema.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import flash from "express-flash";
import NodeCache from "node-cache";
const myCache = new NodeCache();

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function newuser(req, res) {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;

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

    // console.log(otp);

    const otpInfo = await otpp.save();
    req.session.email = req.body.email;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with hashed password and save it
    const user = new Userdb({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();
    // res.redirect('/otp')
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

    const isPasswordMatch = bcrypt.compare(password, data.password);

    if (isPasswordMatch) {
      // Set session and redirect to home
      req.session.userId = user.id;
      req.session.email = email;
      myCache.flushAll();
      res.send("login successfully");
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
    const otptyped =
      req.body.a +
      req.body.b +
      req.body.c +
      req.body.d +
      req.body.e +
      req.body.f;

    const otpDocument = await Otpdb.findOne({ email: req.session.email });

    if (!otpDocument) {
      return res.status(400).send({ message: "OTP Expired" });
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

export async function resendOtp(req, res) {
  try {
    const email = req.session.email;

    await Otpdb.findOneAndDelete({ email: email });

    // Generate a new OTP
    const newOTP = generateOTP();

    // Save the new OTP to the database
    await Otpdb.create({ email, otp: newOTP });
    sendOtpEmail(email, newOTP);

    console.log(`New OTP generated for ${email}: ${newOTP}`);

    // Redirect back to the page with a success message or handle it as needed
    res.send();
  } catch (error) {
    console.error("Error while resending OTP:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function forgotPassEmailVerify(req, res) {
  try {
    console.log(req.body);
    const email = req.body.email;
    if (!email) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Email" });
    }

    if (email && !/^[A-Za-z0-9]+@gmail\.com$/.test(email)) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Enter Valid Email Address" });
    }


    const data = await Userdb.findOne({ email: email });

    if (!data) {
      res
        .status(401)
        .json({ errStatus: true, message: "No user with that Email" });

      return res.status(401).redirect("/forgotPassword");
    }

    req.session.userId = data._id;
    req.session.verifyEmail = email;

    // Generate a new OTP
    const newOTP = generateOTP();

    // Save the new OTP to the database
    await Otpdb.create({ email, otp: newOTP });

    sendOtpEmail(email,newOTP);
    
  } catch (err) {
    console.error("Error querying the database:", err);
  }
}

export async function forgotPassOtpVerify(req, res) {
  try {
    const otp = req.body.otp;
    if (!otp) {
      return res
      .status(401)
      .json({ errStatus: true, message: "Enter OTP" });
    }

    if (String(otp).length > 4) {
      return res
      .status(401)
      .json({ errStatus: true, message: "Enter Valid Number" });
    }


    const response = await userOtpVerify(req, res, "/forgotPassword");

    if (response) {
      deleteOtpFromdb(req.session.otpId);
      req.session.resetPasswordPage = true;

      delete req.session.verifyEmail;
      res.status(200).redirect("/loginResetPassword");
    }
  } catch (err) {
    console.error("Internal delete error", err);
    res.status(500).render("errorPages/500ErrorPage");
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

export async function logoutUser(req, res) {
  req.session.userId = null;
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/");
  });
}

export async function changepassowrd(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user by email
    const user = await Userdb.findOne({ email: req.session.email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentPassword) {
      return res.status(400).json({ error: "Required Current Password" });
    }
    // Check if current password is correct

    const passwordmatch = bcrypt.compare(currentPassword, user.password);
    if (!passwordmatch) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    // Hash the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addAddress(req, res) {
  try {
    let { name, phonenumber, pincode, locality, district, state, addressType } =
      req.body;
    (phonenumber = parseInt(phonenumber)), (pincode = parseInt(pincode));

    if (
      !name ||
      !phonenumber ||
      !pincode ||
      !locality ||
      !district ||
      !state ||
      !addressType
    ) {
      return res
        .status(401)
        .json({ errStatus: true, message: "Content cannot be empty" });
    }

    let user = req.session.userId;

    const userId = await Userdb.findById(user);

    const newAddress = new Addressdb({
      userId: userId,
      name,
      phonenumber,
      pincode,
      locality,
      district,
      state,
      addressType,
    });
    const saved = await newAddress.save();

    // if (saved) res.status(200).send(true);
    if (saved) {
      res.status(201).json({ message: "Address Added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateaddress(req, res) {
  try {
    let { name, phonenumber, pincode, locality, district, state, addressType } =
      req.body;

    const newAdd = await Addressdb.updateOne(
      { _id: req.session.addressId },
      {
        $set: {
          name,
          phonenumber,
          pincode,
          locality,
          district,
          state,
          addressType,
        },
      }
    );

    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteaddress(req, res) {
  try {
    const id = req.params.id;
    await Addressdb.findByIdAndDelete(id);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateprofile(req, res) {
  try {
    const { name, email, phoneNumber } = req.body;
    // Update the profile in the database
    const result = await Userdb.updateOne(
      { _id: req.session.userId },
      { $set: { name, email, phoneNumber } }
    );

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function filterproduct(req, res) {
  try {
    const selectedCategory = req.query.category;
    let filteredProducts;

    if (selectedCategory && selectedCategory !== "All") {
      filteredProducts = await Productdb.find({ category: selectedCategory });
    } else {
      filteredProducts = await Productdb.find();
    }

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addToWallet(req, res) {
  try {
    const { amount } = req.body;

    const money = Number(amount);
    req.session.amount = money;

    var instance = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });

    var options = {
      amount: money * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    instance.orders.create(options, function (err, order) {
      return res.json({ order });
    });

    const walletdb = await Walletdb.find();
  } catch (error) {
    console.error("Error adding to wallet:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function walletRazorpayVerification(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.rzp_key_id,
      key_secret: process.env.rzp_key_secret,
    });

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const generated_signature = crypto
      .createHmac("sha256", process.env.rzp_key_secret)
      .update(body_data)
      .digest("hex");

    const isValid = generated_signature === razorpay_signature;
    if (isValid) {
      const newTransaction = { amount: req.session.amount, type: "+ CREDIT" };

      const wallet = await Walletdb.updateOne(
        { userId: req.session.userId },
        {
          $push: { transactions: newTransaction },
          $inc: { walletBalance: req.session.amount },
        },
        { upsert: true }
      );

      delete req.session?.amount;
      req.flash("success", true);
      res.redirect("/wallet");
    }
  } catch (error) {
    // If there's an error, send an error response
    delete req.session?.amount;
    console.error("Error while verifying", error);
    res.status(500).send("Error verifiying razorpay payment");
  }
}
