document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.querySelector('.task-list');
  //Important Task Color Background
  const importantTaskColor = '#1e61d6';

  // Load tasks from local storage on page load
  loadTasks();

  taskForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const taskText = taskInput.value.trim();
      if (taskText === '') return;

      // Create task item
      const taskItem = createTaskItem(taskText);
      taskList.prepend(taskItem);

      // Save tasks to local storage
      saveTasks();

      // Clear the input field
      taskInput.value = '';
  });

  taskList.addEventListener('click', function (event) {
      const target = event.target;

      if (target.classList.contains('btn-edit')) {
          // Implement edit functionality
          editTask(target);
      } else if (target.classList.contains('btn-delete')) {
          // Implement delete functionality
          deleteTask(target);
      } else if (target.type === 'checkbox') {
          // Toggle completion status
          toggleCompletion(target);
      } else if (target.classList.contains('btn-important')) {
          // Mark as important and move to the top
          markAsImportant(target);
          sortTasks();
      }
  });

  function createTaskItem(taskText) {
      // Create a new task item
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
          <div class="form-check">
              <input type="checkbox" class="form-check-input" id="taskCheck">
              <label class="form-check-label">${taskText}</label>
          </div>
          <div>
              <span class="btn btn-warning btn-edit" title="Edit">&#9998;</span>
              <span class="btn btn-danger btn-delete" title="Delete">&#128465;</span>
              <span class="btn btn-info btn-important" title="Mark as Important">&#9733;</span>
          </div>
      `;
      return taskItem;
  }

  function editTask(editButton) {
      //  edit functionality
      const taskItem = editButton.closest('.task-item');
      const taskLabel = taskItem.querySelector('.form-check-label');
      const editedTaskText = prompt('Edit task:', taskLabel.textContent);

      // Update the task text if the user entered a new value
      if (editedTaskText !== null) {
          taskLabel.textContent = editedTaskText;
          saveTasks(); // Save tasks to local storage after editing
      }
  }

  function deleteTask(deleteButton) {
      // Implement delete functionality
      const taskItem = deleteButton.closest('.task-item');
      const taskLabel = taskItem.querySelector('.form-check-label');
      if (confirm(`Are you sure you want to delete the task "${taskLabel.textContent}"?`)) {
          taskItem.remove();
          alert(`Task "${taskLabel.textContent}" removed!`);
          saveTasks(); // Save tasks to local storage after deletion
      }
  }

  function toggleCompletion(checkbox) {
      // Toggle completion status
      const taskItem = checkbox.closest('.task-item');
      const taskLabel = taskItem.querySelector('.form-check-label');
      taskLabel.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
      saveTasks(); // Save tasks to local storage after marking as completed
  }

  function markAsImportant(importantButton) {
      // Mark as important and move to the top
      const taskItem = importantButton.closest('.task-item');
      const taskLabel = taskItem.querySelector('.form-check-label');

      if (!taskItem.classList.contains('important')) {
          taskList.prepend(taskItem);
          alert(`Task "${taskLabel.textContent}" moved to Important!`);
      }

      taskItem.classList.toggle('important');
      saveTasks(); // Save tasks to local storage after marking as important
  }

  function sortTasks() {
      // Get all task items
      const taskItems = Array.from(document.querySelectorAll('.task-item'));

      // Sort tasks by importance
      taskItems.sort((a, b) => {
          const isAImportant = a.classList.contains('important');
          const isBImportant = b.classList.contains('important');

          // Sort by importance first
          if (isAImportant !== isBImportant) {
              return isAImportant ? -1 : 1;
          } else {
              return 0;
          }
      });

      // Clear existing tasks
      taskList.innerHTML = '';

      // Add sorted tasks to the task list
      taskItems.forEach(taskItem => {
          taskList.appendChild(taskItem);
      });
  }

  function saveTasks() {
      // Get all task text content and importance status
      const tasks = Array.from(document.querySelectorAll('.task-item')).map(taskItem => {
          const taskLabel = taskItem.querySelector('.form-check-label');
          return {
              text: taskLabel.textContent,
              important: taskItem.classList.contains('important')
          };
      });

      // Save tasks to local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
      // Retrieve tasks from local storage
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

      // Create task items and add to the task list
      tasks.forEach(task => {
          const taskItem = createTaskItem(task.text);
          if (task.important) {
              taskItem.classList.add('important');
          }
          taskList.appendChild(taskItem);
      });

      // Sort tasks based on importance
      sortTasks();
  }
});