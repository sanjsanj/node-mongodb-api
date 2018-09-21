const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../models/todo");

const todos = [
  {
    text: "First"
  },
  {
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
