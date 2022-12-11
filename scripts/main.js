const appendTodoElement = (id, task, completed, handleUpdate, handleDelete) => {
  const todosContainer = document.querySelector("#todos-container");

  // Create Todo Container
  const todo_el = document.createElement("div");
  // Set Todo Container data-id Attribute to Todo ID for referencing later
  todo_el.setAttribute("data-id", id);
  todo_el.classList.add("todo", "content");

  // Create Todo Input Element
  const todo_input_el = document.createElement("input");
  todo_input_el.classList.add("text", "todo-input");
  if (completed) todo_input_el.classList.add("completed");
  todo_input_el.type = "text";
  todo_input_el.value = task;
  todo_input_el.setAttribute("readonly", "readonly");

  // Create Todo Actions Container
  const todo_actions_el = document.createElement("div");
  todo_actions_el.classList.add("actions");

  // Create Todo Edit and Delete Buttons
  const todo_edit_el = document.createElement("button");
  todo_edit_el.classList.add("edit");
  const todo_delete_el = document.createElement("button");
  todo_delete_el.classList.add("delete");
  
  // Create Todo Edit and Delete Icons
  const todo_edit_icon_el = document.createElement("i");
  todo_edit_icon_el.classList.add("fa-solid", "fa-pen-nib");
  const todo_delete_icon_el = document.createElement("i");
  todo_delete_icon_el.classList.add("fa-solid", "fa-fire");
  
  // Append Icons to Buttons
  todo_edit_el.appendChild(todo_edit_icon_el);
  todo_delete_el.appendChild(todo_delete_icon_el);

  // Append Buttons to Actions Container
  todo_actions_el.appendChild(todo_edit_el);
  todo_actions_el.appendChild(todo_delete_el);

  // Append Input and Actions to Todo Container
  todo_el.appendChild(todo_input_el);
  todo_el.appendChild(todo_actions_el);

  // Append Todo Element to Todos Container
  todosContainer.appendChild(todo_el);

  todo_edit_el.addEventListener("click", () => {
    if (todo_edit_el.innerText == "") {
      todo_edit_el.classList.remove("fa-pen-nib");
      todo_edit_el.innerText = "Save";
      todo_input_el.removeAttribute("readonly");
      todo_input_el.focus();
    } else {
      handleUpdate(
        todo_el.dataset.id,
        todo_input_el.value,
        todo_input_el.classList.contains("completed")
      );
      todo_edit_el.innerText = "";
      todo_edit_el.appendChild(todo_edit_icon_el);
      todo_input_el.setAttribute("readonly", "readonly");
    }
  });

  todo_delete_el.addEventListener("click", () => {
    handleDelete(todo_el.dataset.id);
    todosContainer.removeChild(todo_el);
    checkOverflow(todosContainer);
  });

  todo_input_el.addEventListener("click", async () => {
    if (!todo_input_el.hasAttribute("readonly")) return;
    const newStatus = !todo_input_el.classList.contains("completed");
    try {
      await handleUpdate(todo_el.dataset.id, todo_input_el.value, newStatus);
      if (newStatus) {
        todo_input_el.classList.add("completed");
      } else {
        todo_input_el.classList.remove("completed");
      }
    } catch (error) {
      alert("Error updating todo");
    }
  });

  checkOverflow(todosContainer);
};

// function for checking if scrolled to the bottom
// if so, hide the overflow icon
// if not, show the overflow icon
const checkOverflow = (todosContainer) => {
  const overFlowIcon = document.querySelector("#overflow-icon");
  if (
    todosContainer.scrollTop >=
    todosContainer.scrollHeight - todosContainer.offsetHeight - 3
  ) {
    if (overFlowIcon.classList.contains("show")) {
      overFlowIcon.classList.remove("show");
    }
  } else {
    if (!overFlowIcon.classList.contains("show")) {
      overFlowIcon.classList.add("show");
    }
  }
};

const handleUpdateTodo = async (id, task, completed = false) => {
  try {
    await updateTodo({ id, task, completed });
  } catch (error) {
    alert("Error updating todo");
  }
};

const handleCreateTodo = async (event) => {
  event.preventDefault();
  const input = document.getElementById("new-todo-input");
  const task = input.value;
  try {
    const todo = await createTodo(task);
    appendTodoElement(
      todo.id,
      todo.task,
      false,
      handleUpdateTodo,
      handleDeleteTodo
    );
    input.value = "";
  } catch (error) {
    alert("Error creating todo");
  }
};

const handleDeleteTodo = async (id) => {
  try {
    await deleteTodo(id);
  } catch (error) {
    alert("Error deleting todo");
  }
};

const populateTodos = async () => {
  try {
    const todos = await getTodos();
    for (todo of todos) {
      appendTodoElement(
        todo.id,
        todo.task,
        todo.completed,
        handleUpdateTodo,
        handleDeleteTodo
      );
    }
  } catch (error) {
    alert("Error loading todos");
  }
};

window.onload = () => {
  populateTodos();

  document
    .querySelector("#todos-container")
    .addEventListener("scroll", (event) => {
      checkOverflow(event.target);
    });

  document
    .querySelector("#new-todo-form")
    .addEventListener("submit", (event) => handleCreateTodo(event));
};
