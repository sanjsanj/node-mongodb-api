const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) console.log("Unable to connect to MongoDB server:", err);

    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");
    db.collection("Users")
      .find()
      .toArray()
      .then(
        users => {
          console.log("Users:");
          console.log(JSON.stringify(users, undefined, 2));
        },
        err => {
          console.log("Unable to fetch collection:", err);
        }
      );

    client.close();
  }
);
