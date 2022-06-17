## List Of Services (sprint planning)

1. Auth (postgree-express) [table:users]

   - register ✅
   - login ✅
   - logout ✅
   - refresh token (jwt) ✅
   - get current user data ✅
   - get all users (+filter by name & offset based pagination) ✅
   - get detail user ✅

2. Project (mariadb-express) [table:project,card,users]

   - create project
   - get projects (+filter by name & offset based pagination)
   - get detail project (including card)
   - update project
   - delete project (cascade delete card)
   - create card
   - update card
   - delete card
   - get cards by projectId (+filter by status & cursor based pagination)
   - get detail card

3. Comment (mariadb-express) [table:comment,users,card,project]

   - create comment
   - get comments by cardId (cursor based pagination)
   - get detail comments
   - update comment
   - delete comment

4. Notif (MongoDB-express) [collections: notif ]

   - gets notifications (search by title, filter by type, cursor based pagination )

## List Of Event

1. Auth:

   ### Publish :

   A. syncUser

   ### Consume :

   A.

2. Project:

   #### Publish :

   A. x

   #### Consume :

   A. syncUser
