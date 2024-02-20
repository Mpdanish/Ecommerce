import Userdb from "../model/userSchema.js";
import Otpdb from "../model/otpSchema.js";
import Productdb from "../model/productSchema.js";
import Addressdb from "../model/addressSchema.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

    const otpInfo = await otpp.save();
    req.session.email = req.body.email;
    console.log(otpInfo);
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
    await sendOtpEmail(req.body.email, otp);

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

    const isPasswordMatch = await bcrypt.compare(password, data.password);

    if (isPasswordMatch) {
      // Set session and redirect to home
      req.session.userId = user.id;
      req.session.email = email;
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
  console.log(req.body);

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

    const passwordmatch = await bcrypt.compare(currentPassword, user.password);
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

    // console.log(newAdd);

    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteaddress(req, res) {
  try {
    const id = req.params.id;
    console.log(id, "address id");
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

    res.json({ success: true, message: "Profile updated successfully" });
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
