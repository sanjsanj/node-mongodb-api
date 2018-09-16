const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, client) => {
    if (err) console.log("Unable to connect to MongoDB server:", err);

    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    // db.collection("Todos").deleteOne({text: "Something"}).then((result) => {
    //   console.log(result);
    // })

    // db.collection("Todos").findOneAndDelete({text: "Something"}).then((result) => {
    //   console.log(result);
    // })

    db.collection("Users").deleteMany({_id:ObjectID("5b9e5b65601e782a74571d14")}).then((res) => {
      console.log(res);
    })

    client.close();
  }
);
