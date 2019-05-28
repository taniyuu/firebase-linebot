'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
    channelSecret: 'hogehoge', // LINE Developersでの準備②でメモったChannel Secret
    channelAccessToken: 'piyopiyo' // LINE Developersでの準備②でメモったアクセストークン
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((result) => console.error('error!!!'));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type == 'message' && event.message.type == 'sticker') {
    return client.replyMessage(event.replyToken, [{
      type: 'text',
      text: 'スタンプを受け取りました。'
    },{
      type: 'sticker',
      "packageId": "11537",
      "stickerId": "52002742"
    }]);
  }
  if (event.type !== 'message' || event.message.type !== 'text') {
    return client.replyMessage(event.replyToken, [{
      type: 'text',
      text: `不明なメッセージなので、とりあえずSing Out聴こう！
https://www.youtube.com/watch?v=XiYjkSPsQWI
`
    }]);
  }
  
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text + 'を受け取りました。'
  });
}

exports.app = functions.https.onRequest(app);