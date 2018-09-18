const { MongoClient, ObjectID } = require("mongodb");

const obj = new ObjectID();
console.log(obj);

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) console.log("Unable to connect to MongoDB server:", err);

    console.log("Connected to MongoDB server");

    // const db = client.db("TodoApp");

    // db.collection("Todos").insertOne(
    //   {
    //     text: "Something to do",
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) console.log("Unable to insert todo:", err);

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    const db = client.db("TodoApp");

    db.collection("Users").insertOne(
      {
        name: "Jane Doe",
        age: 41,
        location: "London"
      },
      (err, result) => {
        if (err) console.log("Unable to insert record:", err);

        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
      }
    );

    client.close();
  }
);
