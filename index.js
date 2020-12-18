const Request = require("request");
const fs = require("fs");
var AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: "ap-northeast-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.KY,
});

exports.message = async function (e) {
  //タイムスタンプを取得
  var date = new Date();
  var stamp = date.getTime();

  //写真じゃないと対応しない
  if (e.message.type !== "image") {
    mes = { type: "text", text: "対応していません" };
    return mes;
  }

  await getURL(e, stamp);

  mes = { type: "text", text: `<URLをおく>` };
  return mes;
};

async function getURL(e, stamp) {
  const options = {
    url: `https://api.line.me/v2/bot/message/${e.message.id}/content`,
    method: "get",
    headers: {
      Authorization: "Bearer " + process.env.CHANNEL_ACCESS_TOKEN,
    },
    encoding: null,
  };
  Request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fs.writeFileSync(`./${stamp}.jpg`, new Buffer(body), "binary");
      // console.log("file saved");
      up(stamp);
    }
  });
}

function up(stamp) {
  var params = {
    Bucket: "<ストーレジの名前>",
    Key: `${stamp}.jpg`,
  };
  var v = fs.readFileSync(`./${stamp}.jpg`);
  params.Body = v;
  s3.putObject(params, function (err, data) {
    if (err) {
      // console.log(err, err.stack);
    } else {
      // console.log(data);
      // console.log("ok");
      fs.unlinkSync(`./${stamp}.jpg`);
    }
  });
}
