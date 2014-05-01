FORMAT: 1A
HOST: http://simplifeed.me

# Docs
Notes API is a *short texts saving* service similar to its physical paper presence on your table.

# Group Posts
Notes related resources of the **Notes API**

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
                          "email": "dominic.mcphee@gmail.com",
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
                  "email": "dominic.mcphee@gmail.com",
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

        { "content": "This is a post update." }

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
