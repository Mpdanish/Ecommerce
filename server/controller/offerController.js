import Offerdb from "../model/offerSchema.js";

export async function addOffer(req, res) {
  try {
    const { name, discount, expiry } = req.body;
    console.log(req.body);
    const newOffer = new Offerdb({
      name,
      discount,
      expiry,
    });
    await newOffer.save();
    res.status(201).json({ message: "Offer Added" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
