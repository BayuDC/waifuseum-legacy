# Waifuseum

Waifuseum (Museum Waifu) is a simple REST API for storing and managing my waifu picture collection on a Discord server

## Available Routes

| Path                           | Method | Parameter                                      | Description |
| ------------------------------ | ------ | ---------------------------------------------- | ----------- |
| `/museum/[category]?n=[count]` | GET    | `{ category }`                                 | -           |
| `/museum/[category]`           | POST   | `{ category, picture, sauce? }`                | -           |
| `/museum/[id]`                 | PUT    | `{ id, category?, picture?, sauce? }`          | -           |
| `/museum/[id]`                 | DELETE | `{ id }`                                       | -           |
| `/auth/login`                  | POST   | `{ username, password }`                       | -           |
| `/auth/logout`                 | DELETE | `{ }`                                          | -           |
| `/user`                        | POST   | `{ username, password, ...permissions }`       | -           |
| `/user/[id]`                   | PUT    | `{ id, username?, password?, ...permissions }` | -           |
| `/user/[id]`                   | DELETE | `{ id }`                                       | -           |
