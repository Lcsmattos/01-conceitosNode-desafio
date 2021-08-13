const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAccount = users.find((user) => user.username === username);

  if (!userAccount) {
    return response.status(404).json({ erro: `Account name ${username} not find` });
  }

  request.username = userAccount;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const alreadyExistUser = users.some(
    (user) => user.username === username
  );

  if (alreadyExistUser) {
    return response.status(400).json({ error: `Account name ${username} already exists, choose a new one` });
  }

  const user = {
    id: uuid(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const userTodos = users.find((user) => user.username === username.username);

  return response.status(200).send(userTodos.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;

  const data = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  username.todos.push(data);

  return response.status(201).send(data);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request;
  const { title, deadline } = request.body;

  const findTodo = username.todos.find(todo => todo.id === id);

  if (!findTodo) {
    return response.status(404).send({ error: `Not Found the Todo with id ${id}` });
  }

  findTodo.title = title;
  findTodo.deadline = new Date(deadline);

  return response.status(200).send(findTodo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const findTodo = username.todos.find(todo => todo.id === id);

  if (!findTodo) {
    return response.status(404).send({ error: `Not Found the Todo with id ${id}` });
  }

  findTodo.done = true;
  return response.status(200).json(findTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const findTodo = username.todos.find(todo => todo.id === id);

  if (!findTodo) {
    return response.status(404).json({ error: `Todo Not Found with id ${id}` });
  }

  username.todos.splice(findTodo, 1);

  return response.status(204).send(username);
});

app.get('/users', (request, response) => {
  const arrayUsers = users;

  return response.status(400).send(arrayUsers);
});

module.exports = app;