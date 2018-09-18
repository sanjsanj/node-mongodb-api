const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) console.log("Unable to connect to MongoDB server:", err);

    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    db.collection("Todos")
      .findOneAndUpdate(
        {
          _id: new ObjectID("5b9e5822c630cb3d9422d121")
        },
        {
          $set: {
            completed: true
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(result => {
        console.log("\n", result);
      });

    client.close();
  }
);
