# Waifuseum

Waifuseum (Museum Waifu) is a simple REST API for storing and managing my waifu picture collection on a Discord server

## Endpoints

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

##### Example:

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
