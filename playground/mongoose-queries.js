const { ObjectID } = require("mongodb");

const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");

const id = "5ba500803603322934b1598f";

if (!ObjectID.isValid(id)) console.log("ID not valid");

Todo.find({ _id: id }).then(todos => {
  console.log("todos.find", todos);
});

Todo.findOne({ _id: id }).then(todo => {
  console.log("todo.findOne", todo);
});

Todo.findById(id)
  .then(todo => {
    console.log("todo.findById", todo);
  })
  .catch(e => console.log("Error:", e));
