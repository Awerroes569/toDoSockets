import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

const App = () => {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState(''); 

  useEffect(() => {
      const socket = io('ws://localhost:8000', { transports: ['websocket'] });
      setSocket(socket);
      socket.on('connect', () => {
        console.log('Connected to server', socket);
      });
  
      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socket.on('updateData', (jsonedTasks) => {
        setTasks(JSON.parse(jsonedTasks));
      });

      return () => {
        socket.disconnect();
      };
  }, []);

  const removeTask = (id) => {
    if (!socket) return;
    socket.emit('removeTask', id);
    setTasks([]);
  };

  const addTask = (event) => {
    event.preventDefault(); 
    if (socket && taskName) {
      socket.emit('addTask', taskName);
      setTaskName('');  
    }
  };

  return (
    <div className="App">
  
      <header>
        <h1>
          ToDoList.app
        </h1>
      </header>
  
      <section
        className="tasks-section"
        id="tasks-section"
      >
        <h2>
          Tasks
        </h2>
  
        <ul
          className="tasks-section__list"
          id="tasks-list"
        >
          {tasks.map(task => (
            <li
              key={task.id}
              className="task"
            >
              {task.name}
              <button
                className="btn btn--red"
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={addTask}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
          <button
            className="btn"
            type="submit"
          >
            Add
          </button>
        </form>
  
      </section>
    </div>
  );
}

export default App;