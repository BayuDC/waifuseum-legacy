# Waifuseum

![Banner](https://media.discordapp.net/attachments/946013429200723989/946013554472013884/banner.png)

![Version](https://img.shields.io/github/package-json/v/BayuDC/waifuseum?style=for-the-badge&logo=node.js)
![Deploy Status](https://img.shields.io/github/workflow/status/BayuDC/waifuseum/Deploy?label=Deploy&logo=github%20actions&style=for-the-badge)

Waifuseum (Museum Waifu) is a simple REST API for storing and managing anime picture collection.
This project use combinaton of ExpressJS, Discord.js, and MongoDB. This uses Discord server as a
place to store picture file and MongoDB to save the picture url. When we upload a file to discord
server, we can right click the message and get the file url, then we can save the file url in a
database, and yeah **free cloud storage to store picture file**. So, I made this project to
automate it. Btw, this project is inspired by [Waifu.pics](https://github.com/Waifu-pics/waifu-api)
and [Nekos.life](https://github.com/Nekos-life/nekos-dot-life).

#### ⚙️ How it works

1. User upload the picture file to the API (Express App)
2. The API send the file to Discord server via discord bot (Discord.js)
3. The API save the url(obtained from discord bot) to database (MongoDB)

#### ⛔ Limitations

The main drawback of this API is the file size limitation. Due to Discord rules, This API can't
save files with size more than 8 mb. _Server Boost_ is needed to increase the maximum file size
limit.

#### 🔑 Permissions

Anyone can get images from this API. But add, update, and delete picture are only available to
authenticated user that has `manageContent` permission. There is no signup method, user account
can only be created by authenticated user that has `manageUser` permission.

## 🔖 Endpoints

Base url: https://waifuseum.herokuapp.com

| Path                           | Method | Body                                           |
| ------------------------------ | ------ | ---------------------------------------------- |
| `/museum/[category]?n=[count]` | GET    | `{ category }`                                 |
| `/museum/[category]`           | POST   | `{ category, picture, sauce? }`                |
| `/museum/[id]`                 | PUT    | `{ id, category?, picture?, sauce? }`          |
| `/museum/[id]`                 | DELETE | `{ id }`                                       |
| `/auth/login`                  | POST   | `{ username, password }`                       |
| `/auth/logout`                 | DELETE | `{ }`                                          |
| `/user`                        | POST   | `{ username, password, ...permissions }`       |
| `/user/[id]`                   | PUT    | `{ id, username?, password?, ...permissions }` |
| `/user/[id]`                   | DELETE | `{ id }`                                       |

#### 📄 Example:

-   Get a picture from category **waifu**  
    `GET /museum/waifu`  
    `GET /museum { category: 'waifu' }`
-   Get **10** pictures from category **waifu**  
    `GET /museum/waifu?n=10`
-   Upload **waifu.jpg** and add it to database  
    `POST /museum/waifu { picture: (file: waifu.jpg) }`  
    `POST /museum { category: 'waifu', picture: (file: waifu.jpg) }`
-   Add picture with optional sauce/source  
    `POST /museum/waifu { picture: (file: waifu.jpg), sauce: 'https://sauce.pic' }`
-   Add picture from an url to database  
    `POST /museum/waifu { picture: 'https://picture.url/waifu.png' }`
-   Update data of a picture with id **6204f85b424db4752b5b81e9**  
    `PUT /museum/6204f85b424db4752b5b81e9 { picture: (file: waifu.jpg) }`  
    `PUT /museum/6204f85b424db4752b5b81e9 { category: 'waifu', sauce: 'https://sauce.new' }`  
    `PUT /museum { id: '6204f85b424db4752b5b81e9', sauce: 'https://sauce.new' }`
-   Delete a picture with id **6204f85b424db4752b5b81e9**  
    `DELETE /museum/6204f85b424db4752b5b81e9`  
    `DELETE /museum/ { id: '6204f85b424db4752b5b81e9' }`

## 🔧 Development

#### 📥 Clone this repo

```
$ git clone https://github.com/BayuDC/waifuseum.git
```

#### 🧩 Configuration

```
# Go to project directory
$ cd waifuseum

# Create env file
$ cp .env.example .env

# Set all required variables
$ nano .env
# or using your favorite text editor

# Install dependencies
$ npm install
# or using yarn
$ yarn
```

#### 🚀 Run

```
# Using npm
$ npm run dev

# Using yarn
$ yarn dev
```

## 📜 License

This project is licensed under [MIT](https://github.com/BayuDC/waifuseum/blob/main/LICENSE) License.
