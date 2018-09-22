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
    text: "Second",
    completed: true,
    completedAt: new Date().getTime()
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
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toEqual(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return a todo", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toEqual(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for invalid ObjectID", done => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete a todo", done => {
    const testID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${testID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toEqual(testID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(testID)
          .then(todo => {
            expect(todo).toEqual(null);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for invalid ObjectID", done => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    const text = "New text";
    const id = todos[0]._id;

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        const todo = res.body.todo;

        expect(todo.text).toEqual(text);
        expect(todo.completed).toEqual(true);
        expect(typeof todo.completedAt).toEqual("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const text = "New text";
    const id = todos[1]._id;

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        const todo = res.body.todo;

        expect(todo.text).toEqual(text);
        expect(todo.completed).toEqual(false);
        expect(todo.completedAt).toEqual(null);
      })
      .end(done);
  });
});
