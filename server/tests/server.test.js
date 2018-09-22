const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");

const todos = [
  {
    _id: new ObjectID(),
    text: "First"
  },
  {
    _id: new ObjectID(),
    text: "Second"
  }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", done => {
    const text = "Something";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toEqual(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toEqual(1);
            expect(todos[0].text).toEqual(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create a new todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toEqual(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toEqual(2)
      })
      .end(done)
  })
})

describe("GET /todos/:id", () => {
  it("should return a todo", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toEqual(todos[0].text)
      })
      .end(done)
  })
  
  it("should return 404 if todo not found", (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })
  
  it("should return 404 for invalid ObjectID", (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done)
  })
})
