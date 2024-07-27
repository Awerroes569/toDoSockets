const express = require('express');
const socket = require('socket.io');
const { createTaskId } = require('./utils.js');

const tasks = [{id:1, name: 'Shopping'}, {id:2, name: 'Go out with a dog'}, {id:3, name: 'Do homework'}];

const app = express();

app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });


const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
    });

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id ' + socket.id);
  io.to(socket.id).emit('updateData', JSON.stringify(tasks));

  socket.on('addTask', (name) => {
      const task = {
          id: createTaskId(tasks),
          name: name,
      };
      tasks.push(task);
      console.log('Oh, I\'ve added new task: ' + task.name);
      console.log('tasks', tasks);
      io.emit('updateData', JSON.stringify(tasks));
  });

  socket.on('removeTask', (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if(index === -1) return;
    const name = tasks[index].name;
    tasks.splice(index, 1);
    console.log('Oh, I\'ve removed a task: ' + name);
    io.emit('updateData', JSON.stringify(tasks));
  });
  
  socket.on('disconnect', () => {
      console.log('Oh, socket ' + socket.id + ' has left');
  });
  
});