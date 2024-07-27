exports.createTaskId = (tasks) => {
    const ids = tasks.map(task => task.id);
    const newId = ids.length ? Math.max(...ids) + 1 : 1;
    return newId;
  };