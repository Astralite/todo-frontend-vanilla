// Define the API functions
const getTodos = async () => {
  try {
    const response = await fetch("/todos");
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const createTodo = async (task) => {
  try {
    const response = await fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const updateTodo = async ({ id, ...todoDetails }) => {
  try {
    const response = await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoDetails),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteTodo = async (id) => {
  try {
    await fetch(`/todos/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    throw new Error(err);
  }
};
