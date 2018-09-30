const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");
const { User } = require("../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    const text = "Something";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toEqual(1);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return a todo", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toEqual(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 for invalid ObjectID", done => {
    request(app)
      .get(`/todos/123`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  
  it("should not return a todo created by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete a todo", done => {
    const testID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${testID}`)
      .set("x-auth", users[1].tokens[0].token)
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
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 for invalid ObjectID", done => {
    request(app)
      .delete(`/todos/123`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
  
  it("should not delete a todo from other user", done => {
    const testID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${testID}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(testID)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    const text = "New text";
    const id = todos[0]._id;

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
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
  
  it("should not update the todo from other user", done => {
    const text = "New text";
    const id = todos[0]._id;

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({ text, completed: true })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const text = "New text";
    const id = todos[1]._id;

    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
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

describe("GET .users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toEqual(users[0]._id.toHexString());
        expect(res.body.email).toEqual(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if user not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    const email = "bb@bb.com";
    const password = "123asdf!";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toEqual(email);
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return validation errors if request invalid", done => {
    const email = "";
    const password = "";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    const password = "123asdf!";

    request(app)
      .post("/users")
      .send({ email: users[0].email, password })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("should login user and return auth token", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toEqual(
              expect.objectContaining({
                access: "auth",
                token: res.headers["x-auth"]
              })
            );
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should reject invalid login", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: ""
      })
      .expect(400)
      .end(done);
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toEqual(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
