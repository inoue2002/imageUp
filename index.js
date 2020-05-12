"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;
const mesFunc = require("./message");
const followFunc = require("./follow");
var request = require('request');
const dotenv = require("dotenv");
dotenv.config();
const config = {
  channelAccessToken:  process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.get("/", (req, res) => res.send("Hello（GET)"));
app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  if (
    req.body.events[0].replyToken === "00000000000000000000000000000000" &&
    req.body.events[1].replyToken === "ffffffffffffffffffffffffffffffff"
  ) {
    res.send("Hello!(POST)");
    console.log("ok");
    return;
  }
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

const client = new line.Client(config);

async function handleEvent(e) {
  switch (e.type) {
    case "message":
      mes = await mesFunc.message(e);
      break;
    case "follow":
      mes = await followFunc.follow(e);
      if (mes !== undefined) {
        const pro = await client.getProfile(e.source.userId);
        mes.text = `${pro.displayName}さん追加ありがとう！`;
      }
      break;
  }

  if (mes !== undefined) {
    return client.replyMessage(e.replyToken, mes);
  }
}

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
console.log(`Server running at ${PORT}`);
