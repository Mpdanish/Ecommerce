import express from "express";
import session from "express-session";
import Userdb from "../model/userSchema.js";

export async function checkBlocked(req, res, next) {

    const userid = req.session.userId;

    const user = await Userdb.findOne({_id: userid})

    // console.log(user);

    if (!userid || user.status === false) {
      req.session.destroy();
      return res.redirect('/');
    }
    next();
}