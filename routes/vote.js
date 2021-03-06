const ObjectID = require("mongoose").Types.ObjectId;
const { Paslon } = require("../models");
const express = require("express");
const Router = express.Router();

Router.post("/upvote", (req, res) => {
  const { _id } = req.body;

  if (!_id)
    return res.json({
      error: true,
      message: "Anda harus menambahkan id untuk upvote",
    });

  if (ObjectID.isValid(_id) === true) {
    Paslon.findById(_id).then(async (pasl) => {
      if (pasl) {
        await Paslon.findByIdAndUpdate(_id, { $inc: { memilih: 1 } });
        res.json({ success: true, message: "Paslon sudah terpilih" });
      } else {
        res.json({ error: true, message: "Paslon tidak ditemukan !" });
      }
    });
  } else {
    res.json({ error: true, message: "Parameter body tidak valid !" });
  }
});

module.exports = Router;
