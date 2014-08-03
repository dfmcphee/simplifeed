FORMAT: 1A
HOST: http://simplifeed.me


# Docs

# Group Getting Started

## Requirements

***Node 0.10.x***

Easiest way is to use nvm: https://github.com/creationix/nvm

***Geddy 0.13.x***

```
[sudo] npm -g install geddy
```

***PostgreSQL***

http://www.postgresql.org/

***ImageMagick***

http://www.imagemagick.org/


## Installation

Open a command line and change to the directory

Run `npm install` to install dependencies

Run `geddy secret` to generate a new secrets file

You will need to add your mailer and s3 config to your secrets file after it has been generated

Run `geddy` to start the server

# Group Posts
Posts related resources of the **Simplifeed API**

## Posts Collection [/posts]

### List all Posts [GET]
+ Response 200 (application/json)

            [
              {
                  "createdAt": "2014-05-01T02:10:28.229Z",
                  "updatedAt": null,
                  "content": "This is a test.",
                  "postType": null,
                  "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                  "user": {
                      "createdAt": "2014-04-29T14:58:17.531Z",
                      "updatedAt": "2014-04-29T14:58:38.209Z",
                      "username": "dom",
                      "familyName": "McPhee",
                      "givenName": "Dominic",
                      "email": "dom@simplifeed.me",
                      "profileImage": null,
                      "profileThumb": null,
                      "phone": null,
                      "address": null,
                      "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                      "type": "User"
                  },
                  "id": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
                  "type": "Post"
              },
              {
                  "createdAt": "2014-04-29T18:13:26.086Z",
                  "updatedAt": null,
                  "content": "Welcome to Simplifeed.",
                  "postType": null,
                  "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                  "likes": [
                      {
                          "createdAt": "2014-04-30T12:09:59.889Z",
                          "updatedAt": null,
                          "userId": "0C9E8ED3-3E96-4C49-8C3D-D9A510C3035A",
                          "postId": "9A521E2C-FE4B-4ABE-969A-E7CF85D1C0CC",
                          "id": "A660B56F-6C09-4FCC-9B78-21342CD517F0",
                          "type": "Like"
                      }
                  ],
                  "comments": [
                      {
                          "createdAt": "2014-04-30T00:00:03.908Z",
                          "updatedAt": null,
                          "content": "Thanks.",
                          "userId": "0C9E8ED3-3E96-4C49-8C3D-D9A510C3035A",
                          "postId": "9A521E2C-FE4B-4ABE-969A-E7CF85D1C0CC",
                          "user": {
                              "createdAt": "2014-04-29T15:02:53.787Z",
                              "updatedAt": null,
                              "username": "nat",
                              "familyName": "Glofcheskie",
                              "givenName": "Natalie",
                              "email": "nglofcheskie@gmail.com",
                              "profileImage": null,
                              "profileThumb": null,
                              "phone": null,
                              "address": null,
                              "id": "0C9E8ED3-3E96-4C49-8C3D-D9A510C3035A",
                              "type": "User"
                          },
                          "id": "B24477C4-8A74-4ABE-89B1-50FF79D6FA7D",
                          "type": "Comment"
                      },
                      {
                          "createdAt": "2014-04-30T00:00:13.416Z",
                          "updatedAt": "2014-04-30T01:15:35.620Z",
                          "content": "You're welcome. :)",
                          "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                          "postId": "9A521E2C-FE4B-4ABE-969A-E7CF85D1C0CC",
                          "user": {
                              "createdAt": "2014-04-29T14:58:17.531Z",
                              "updatedAt": "2014-04-29T14:58:38.209Z",
                              "username": "dom",
                              "familyName": "McPhee",
                              "givenName": "Dominic",
                              "email": "dom@simplifeed.me",
                              "profileImage": null,
                              "profileThumb": null,
                              "phone": null,
                              "address": null,
                              "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                              "type": "User"
                          },
                          "id": "560FA1F1-1D24-48B8-8AB3-054CC69FBBD3",
                          "type": "Comment"
                      }
                  ],
                  "user": {
                      "createdAt": "2014-04-29T14:58:17.531Z",
                      "updatedAt": "2014-04-29T14:58:38.209Z",
                      "username": "dom",
                      "familyName": "McPhee",
                      "givenName": "Dominic",
                      "email": "dom@simplifeed.me",
                      "profileImage": null,
                      "profileThumb": null,
                      "phone": null,
                      "address": null,
                      "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                      "type": "User"
                  },
                  "id": "9A521E2C-FE4B-4ABE-969A-E7CF85D1C0CC",
                  "type": "Post"
              }
            ]

### Create a Post [POST]
+ Request (application/json)

        { "content": "This is a test." }

+ Response 200 (application/json)

            {
                "createdAt": "2014-05-01T02:10:28.229Z",
                "content": "This is a test.",
                "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                "id": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
                "type": "Post"
            }

## Post [/posts/{id}]
A single Post object with all its details

+ Parameters
    + id (required, string, `F00DDBB6-1C6E-416A-808C-57FD9269181B`) ... `id` of the Post to perform action with. Has example value.

### Retrieve a Post [GET]
+ Response 200 (application/json)

    + Body

            {
              "createdAt": "2014-05-01T02:10:28.229Z",
              "updatedAt": null,
              "content": "This is a test.",
              "postType": null,
              "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
              "user": {
                  "createdAt": "2014-04-29T14:58:17.531Z",
                  "updatedAt": "2014-04-29T14:58:38.209Z",
                  "username": "dom",
                  "familyName": "McPhee",
                  "givenName": "Dominic",
                  "email": "dominic.mcphee@gmail.com",
                  "profileImage": null,
                  "profileThumb": null,
                  "phone": null,
                  "address": null,
                  "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                  "type": "User"
              },
              "id": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
              "type": "Post"
            }

### Update a Post [PUT]
+ Request (application/json)

            {
                "content": "This is a post update."
            }

+ Response 200 (application/json)

            {
              "createdAt": "2014-05-01T02:10:28.229Z",
              "updatedAt": "2014-05-01T02:29:00.414Z",
              "content": "This is a post update.",
              "postType": null,
              "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
              "id": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
              "type": "Post"
            }

### Remove a Post [DELETE]

+ Response 200 (application/json)

    + Body

            {
                "createdAt": "2014-05-01T02:10:28.229Z",
                "updatedAt": null,
                "content": "This is a test.",
                "postType": null,
                "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                "id": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
                "type": "Post"
             }

# Group Comments
Comments related resources of the **Simplifeed API**

## Comments Collection [/posts/{post_id}/comment]
### Create a Comment [POST]
+ Request (application/json)

            {
              "content": "This is a comment."
              "postId":
            }

+ Response 200 (application/json)

            {
                "createdAt": "2014-05-01T02:10:28.229Z",
                "content": "This is a comment.",
                "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                "postId": "F00DDBB6-1C6E-416A-808C-57FD9269181B",
                "id": "0C9E8ED3-3E96-4C49-8C3D-D9A510C3035A",
                "type": "Post"
            }

## Comment [/comments/{id}]
A single Comment object with all its details

+ Parameters
    + id (required, string, `F00DDBB6-1C6E-416A-808C-57FD9269181B`) ... `id` of the Comment to perform action with. Has example value.

### Update a Comment [PUT]
+ Request (application/json)

            {
              "content": "This is a comment update."
            }

+ Response 200 (application/json)

            {
              "success": "true"
            }

### Remove a Comment [DELETE]

+ Response 200 (application/json)

    + Body

            {
                "success": "true"
            }

# Group Files
Files related resources of the **Simplifeed API**

## Files Collection [/files/upload]
### Create a File [POST]
+ Request
    + Headers

            Content-Type:multipart/form-data; boundary=----WebKitFormBoundarySBEmo7uXyLXmAz7v

    + Body

            ------WebKitFormBoundarySBEmo7uXyLXmAz7v
            Content-Disposition: form-data; name="content"


            ------WebKitFormBoundarySBEmo7uXyLXmAz7v
            Content-Disposition: form-data; name="files[]"; filename="33b39e3.jpg"
            Content-Type: image/jpeg



+ Response 200 (application/json)

        {
            "files": [
                {
                    "id": "DBB8D884-5560-4D53-8A58-93635F7D0028",
                    "url": "http://simplifeed-dev.s3.amazonaws.com/uploads/img536c41ee3d629.jpg",
                    "small_url": "http://simplifeed-dev.s3.amazonaws.com/uploads/img536c41ee3d629.small.jpg",
                    "thumbnail_url": "http://simplifeed-dev.s3.amazonaws.com/uploads/img536c41ee3d629.thumbnail.jpg",
                    "name": "img536c41ee3d629.jpg",
                    "type": "image/jpeg",
                    "size": 3033362,
                    "delete_url": "/files/DBB8D884-5560-4D53-8A58-93635F7D0028",
                    "delete_type": "DELETE"
                }
            ]
        }

## Files [/files/{id}]
A single File object with all its details

+ Parameters
    + id (required, string, `F00DDBB6-1C6E-416A-808C-57FD9269181B`) ... `id` of the File to perform action with. Has example value.

### Update a File [PUT]
+ Request (application/json)

            {
              "title": "This is a title update."
            }

+ Response 200 (application/json)

            {
              "success": "true"
            }

### Remove a File [DELETE]

+ Response 200 (application/json)

    + Body

            {
                "success": "true"
            }



# Group Users
Users related resources of the **Simplifeed API**

## Users Collection [/users]
### List all Users [GET]
+ Response 200 (application/json)

            {
              "params": {
                  "method": "GET",
                  "controller": "Users",
                  "action": "index",
                  "format": "json"
              },
              "users": [
                  {
                      "createdAt": "2014-04-29T15:02:53.787Z",
                      "updatedAt": null,
                      "username": "nat",
                      "familyName": "Glofcheskie",
                      "givenName": "Natalie",
                      "email": "nat@simplifeed.me",
                      "profileImage": null,
                      "profileThumb": null,
                      "phone": null,
                      "address": null,
                      "id": "0C9E8ED3-3E96-4C49-8C3D-D9A510C3035A",
                      "type": "User"
                  },
                  {
                      "createdAt": "2014-04-29T14:58:17.531Z",
                      "updatedAt": "2014-05-07T22:51:50.244Z",
                      "username": "dom",
                      "familyName": "McPhee",
                      "givenName": "Dominic",
                      "email": "dom@simplifeed.me",
                      "profileImage": null,
                      "profileThumb": null,
                      "phone": null,
                      "address": null,
                      "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                      "type": "User"
                  },
                  {
                      "createdAt": "2014-05-05T23:23:21.334Z",
                      "updatedAt": null,
                      "username": "joe",
                      "familyName": "Bob",
                      "givenName": "Joe",
                      "email": "joe@simplifeed.me",
                      "profileImage": null,
                      "profileThumb": null,
                      "phone": null,
                      "address": null,
                      "id": "1273B821-3C97-4922-9F81-6FCCDE7522EB",
                      "type": "User"
                  }
               ]
            }

### Create a User [POST]
+ Request (application/json)

            {
              "username": "dom",
              "email": "dom@simplifeed.me",
              "password": "superSecret",
              "confirmPassword": "superSecret",
              "givenName": "Dominic",
              "familyName": "McPhee"
            }

+ Response 200 (application/json)

            {
                "createdAt": "2014-04-29T14:58:17.531Z",
                "updatedAt": "2014-05-07T22:51:50.244Z",
                "username": "dom",
                "familyName": "McPhee",
                "givenName": "Dominic",
                "email": "dom@simplifeed.me",
                "profileImage": null,
                "profileThumb": null,
                "phone": null,
                "address": null,
                "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                "type": "User"
            }

## User [/users/{id}]
A single Post object with all its details

+ Parameters
    + id (required, string, `F00DDBB6-1C6E-416A-808C-57FD9269181B`) ... `id` of the Post to perform action with. Has example value.

### Retrieve a User [GET]
+ Response 200 (application/json)

    + Body

            {
                "user": {
                    "createdAt": "2014-04-29T14:58:17.531Z",
                    "updatedAt": "2014-05-07T22:51:50.244Z",
                    "username": "dom",
                    "familyName": "McPhee",
                    "givenName": "Dominic",
                    "email": "dom@simplifeed.me",
                    "profileImage": null,
                    "profileThumb": null,
                    "phone": null,
                    "address": null,
                    "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                    "type": "User"
                },
                "posts": [
                  {
                      "createdAt": "2014-05-08T01:11:25.746Z",
                      "updatedAt": "2014-05-08T01:11:25.776Z",
                      "content": "Whoops",
                      "postType": null,
                      "userId": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                      "files": null,
                      "user": {
                          "createdAt": "2014-04-29T14:58:17.531Z",
                          "updatedAt": "2014-05-07T22:51:50.244Z",
                          "username": "dom",
                          "familyName": "McPhee",
                          "givenName": "Dominic",
                          "email": "dom@simplifeed.me",
                          "profileImage": null,
                          "profileThumb": null,
                          "phone": null,
                          "address": null,
                          "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                          "type": "User"
                      },
                      "id": "E5084631-C1B7-427C-B0BA-6B4FB5A241FE",
                      "type": "Post"
                  }
                ]
            }

### Update a User [PUT]
+ Request (application/json)

            {
                "username": "dom",
                "familyName": "McPhee",
                "givenName": "Dominic",
                "email": "dom@simplifeed.me",
                "phone": null,
                "address": null
            }

+ Response 200 (application/json)

            {
                "createdAt": "2014-04-29T14:58:17.531Z",
                "updatedAt": "2014-05-07T22:51:50.244Z",
                "username": "dom",
                "familyName": "McPhee",
                "givenName": "Dominic",
                "email": "dom@simplifeed.me",
                "profileImage": null,
                "profileThumb": null,
                "phone": null,
                "address": null,
                "id": "AC531EC9-D2D3-429F-8EC8-E5862537586C",
                "type": "User"
            }
