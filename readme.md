
# Easy Chat
使用 Node.js & Express 打造的簡易社群網站，提供使用者進行即時聊天。

# Features：功能
- 可進行使用者註冊，並且上傳自己的大頭貼﹑背景圖以及自我介紹。
- 提供使用者探索功能，挖掘更多用戶。
- 探索到的使用者可對其進行公開留言或是私人訊息聊天。
- 提供公用平台聊天室，和眾人一起打屁聊天。
- 提供私人聊天室，進行一對一聊天。

# Environment Setup：環境安裝

- Visual Studio Code:1.57.1
- Node.js:v18.18.0
- Express.js:4.18.2
- Express-handlebars:^3.0.0

# Installing Procedure：安裝流程

1.開啟終端機將專案存至本機:
```
git clone https://github.com/WangPinChen/easy_chat_work.git
```
2.進入存放此專案的資料夾
```
cd easy_chat
```
3.環境變數設定
將根目錄.env.example檔案中列為SKIP的部分替換為相關ID與金鑰內容,再把.env.example檔案名稱修改為.env 

4.建立資料庫
開啟 MySQL workbench，再連線至本地資料庫，輸入以下建立資料庫 

```
drop database if exists easy_chat;
create database easy_chat;
use easy_chat;

```
5.安裝 npm 套件
```
npm install
```
6.db:migrate 設定
```
npx sequelize db:migrate 
```
7.加入種子資料
```
npx sequelize db:seed:all 
```
8.啟動專案
```
npm run dev
```
9.使用
終端機出現下列訊息" "Example app listening on port 3000!"
可開啟瀏覽器輸入 http://localhost:3000 使用

10.預設使用者 Seed User
- 一共有250組的user帳號(user01~user250，密碼同帳號)

## 開發人員
王品晟