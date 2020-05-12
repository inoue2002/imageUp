# LINEbot-template2

$ git clone https://github.com/youkan2002/LINEbot-template2.git

$ cd LINEbot-template2

$ npm install

$ code .

index.js の　xxxx　に代入（２箇所)

$ node index.js


$ ngrok http 3000　　//(別タブ）

https://xxxxxxxxxx.io/webhook をLINEのコンソールに入れる


LINEbotから応答が確認できれば成功。


package.jsonのscriptsに

 "start": "node index.js" 　　　を。
 
 now.jsonに
 
 {
  "version": 2,
  "name": "LINEbot-temple2",
  "builds": [{ "src": "index.js", "use": "@now/node" }],
  "routes": [
      { "src": "/", "dest": "index.js" },
      { "src": "/webhook", "dest": "index.js" }
  ]
}
 
 
 
 を付け加えて、
 
 $now
 
 http://xxxxxxxxxxx.now.sh/webhook　をLINEのコンソールに書き換えて終了
 
 
 
 開発はngrok環境で。
 完成したらnowへ。
 
 






