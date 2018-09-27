const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const todos = [
  {
    _id: new ObjectID(),
    text: "First todo"
  },
  {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: new Date().getTime()
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => {
      done();
    });
};

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: "a@a.com",
    password: "userOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneID, access: "auth" }, "asdf").toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "ab@ab.com",
    password: "userTwoPass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userTwoID, access: "auth" }, "asdf").toString()
      }
    ]
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
