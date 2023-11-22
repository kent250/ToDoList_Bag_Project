document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.querySelector(".task-list");

  // Load tasks from local storage on page load
  loadTasks();

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    // Create task item
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="taskCheck"">
                <label class="form-check-label">${taskText}</label>
            </div>
            <div>
                <span class="btn btn-warning btn-edit" title="Edit">&#9998;</span>
                <span class="btn btn-danger btn-delete" title="Delete">&#128465;</span>
            </div>
        `;

    // Insert new task at the beginning of the list
    taskList.prepend(taskItem);

    // Save tasks to local storage
    saveTasks();

    // Clear the input field
    taskInput.value = "";
  });

  taskList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("btn-edit")) {
      // Implement edit functionality
      const taskItem = target.closest(".task-item");
      const taskLabel = taskItem.querySelector(".form-check-label");
      const editedTaskText = prompt("Edit task:", taskLabel.textContent);

      // Update the task text if the user entered a new value
      if (editedTaskText !== null) {
        taskLabel.textContent = editedTaskText;
        saveTasks(); // Save tasks to local storage after editing
      }
    } else if (target.classList.contains("btn-delete")) {
      // Implement delete functionality
      target.closest(".task-item").remove();
      saveTasks(); // Save tasks to local storage after deletion
    } else if (target.type === "checkbox") {
      // Check if the clicked element is a checkbox
      const taskItem = target.closest(".task-item");
      const taskLabel = taskItem.querySelector(".form-check-label");

      // Toggle strikethrough style for completed tasks
      taskLabel.style.textDecoration = target.checked ? "line-through" : "none";

      saveTasks(); // Save tasks to local storage after marking as completed
    }
  });

  function saveTasks() {
    // Get all task text content
    const tasks = Array.from(document.querySelectorAll(".task-item")).map(
      (taskItem) => taskItem.querySelector(".form-check-label").textContent
    );

    // Save tasks to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Create task items and add to the task list
    tasks.forEach((taskText) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";
      taskItem.innerHTML = `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="taskCheck"">
                    <label class="form-check-label">${taskText}</label>
                </div>
                <div>
                    <span class="btn btn-warning btn-edit" title="Edit">&#9998;</span>
                    <span class="btn btn-danger btn-delete" title="Delete">&#128465;</span>
                </div>
            `;

      // Insert new task at the beginning of the list
      taskList.appendChild(taskItem);
    });
  }
});
