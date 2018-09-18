const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

const Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

const newTodo = new Todo({
  text: "Blah blah blah"
});

newTodo.save().then(
  doc => {
    console.log("Saved:", doc);
  },
  e => {
    console.log("Error saving:".e);
  }
);

const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

const newUser = new User({
  email: "a@a.com"
});

newUser.save().then(
  doc => {
    console.log("Saved:", doc);
  },
  e => {
    console.log("Error:", e);
  }
);
