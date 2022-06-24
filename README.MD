## List Of Services (sprint planning)

1. Auth (postgree-express) [table:users]

   - register ✅
   - login ✅
   - logout ✅
   - refresh token (jwt) ✅
   - get current user data ✅
   - get all users (+filter by name & offset based pagination) ✅
   - get detail user ✅

2. Project (mariadb-express) [table:project,card,comment,users]

   - create project ✅
   - get projects (+filter by project title & offset based pagination) ✅
   - get detail project ✅
   - update project ✅
   - delete project (cascade delete card) ✅
   - create card ✅
   - update card ✅
   - delete card ✅
   - get cards by projectId (+filter by status & cursor based pagination) ✅
   - get detail card ✅

3. Comment (mariadb-express) [table:comment,users,card,project]

   - create comment (when comment create, totalComment in card must be update too) ✅
   - get comments by cardId (cursor based pagination) ✅
   - get detail comments ✅
   - delete comment ✅

4. Notif (MongoDB-express) [collections: notif,users ]

   - get notifications by userId (search by content, filter by type, cursor based pagination )

## List Of Event

1. Auth:

   ### Publish :

   A. newUser

   ### Consume :

   -

2. Project:

   #### Publish :

   A. newProject
   B. newCard
   C. deleteProject
   D. updateCardStatus

   #### Consume :

   A. newUser
   B. newComment
   C. deleteComment

3. Comment:

   #### Publish :

   A. newComment
   B. deleteComment

   #### Consume :

   A. newUser
   B. newProject
   c. newCard
   d. deleteProject
   e. updateCardStatus

4. Notif:

   #### Publish :

   -

   #### Consume :

   A. newUser
   B. newProject
   c. newCard
   d. updateCardStatus
   e. newComment
   f. deleteProject
