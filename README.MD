## Bug Tracker (Redis Stream Version)

### 🌙 sample bug tracker app with event-driven microservices architecture using Redis Stream as message broker just for educational purpose

![service map](https://i.postimg.cc/1t2JNzZB/bugtracker-drawio-drawio-1.png)

## Intro 🌴

- Stack: Nodejs, Express, Postgre, MariaDB, MongoDB, Redis, JWT Auth, PM2, KrakenD API Gateway
- API Docs: **[Postman](https://www.getpostman.com/collections/33de3709312453dcdc95)**
- Find Kafka example ? **[bugtracker-kafka](https://github.com/Faeshal/bugtracker-kafka)**
- Step run the app :
  - install dependency & setup env for each services
  - install [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) & run each services with that
  - install [Krakend](https://www.krakend.io/docs/overview/installing/), go to gateway folder & type `krakend run -c krakend.json`
  - ready to go 🏎️

## Detail Services 🔅

**1. Auth (postgree-express) [table:users]**

- endpoint:

  - register
  - login
  - logout
  - refresh jwt token
  - get current user data
  - get all users (+filter by name & offset based pagination)
  - get detail user

- event
  - publish: newUser, newNotif
  - consume: -

**2. Project (mariadb-express) [table:project,card,comment,users]**

- note : here, i am still merging project service with the card service, i think the **coupling is too tight** to be place in separated services and because it is only for learning purpose, so ya i think it's ok to place it in the same service, for now.

- endpoint:

  - create project
  - get projects (+filter by project title & offset based pagination)
  - get detail project
  - update, delete project (cascade delete card)
  - create,update & delete card
  - get cards by projectId (+filter by status & cursor based pagination)
  - get detail card

- event
  - publish: newProject, newCard, deleteProject, updateCard, changeCardStatus, newNotif
  - consume: newUser, newComment, deleteComment

**3. Comment (mariadb-express) [table:comment,users,card,project]**

- endpoint:

  - create comment (when comment create, totalComment in card must be update too)
  - get comments by cardId (cursor based pagination)
  - get detail comments
  - delete comment

- event:
  - publish: newComment, deleteComment, newNotif
  - consume: newUser, newProject, newCard, updateCard, deleteProject, updateCardStatus

4. Notif (MongoDB-express) [collections: notif ]

- endpoint:

  - get notifications by userId (mongoose paginate). type notification: registration, create project, delete project, create card, change status card, create commet

- event:
  - publish: -
  - consume: newNotif

## what's missing ? (reason: dont have free time to add it) 🙏

- you can add, category services for grouping card inside project
- better error handling & query validation
- some primary feature, ex: forgot password, change password, kick member from project, advance permission etc..

## improvement that can be done 🚧

- add security package (hpp,helmet,csrf etc)
- you can setup consumer group to each services for better load balancing
- setup better event data storage scenario, ex: if more than 90 days, store event to file not just in memory
- write unit & integration test
- add docker & kubernetes (if you have a lot of free time)
