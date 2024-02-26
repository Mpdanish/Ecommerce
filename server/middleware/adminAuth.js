import express from "express";
import session from "express-session";

export async function checkAdmin(req, res, next) {
  if (req.session.isAdmin === true) {
    next();
  } else {
    res.redirect("/adminlogin");
  }
}
