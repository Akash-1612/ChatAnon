const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

//Joining room.
socket.emit('joinRoom', { username, room });

//Get room and users.
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});


// Create a new task
function createTask(text, status) {
    const task = document.createElement('div');
    task.classList.add('kanban-task');
    task.textContent = text;
    task.draggable = true;
    task.addEventListener('dragstart', handleDragStart);
    task.addEventListener('dragend', handleDragEnd);
  
    // Add the task to the appropriate column
    document.getElementById(`${status}-tasks`).appendChild(task);
  }
  
  // Handle the start of a drag event
  function handleDragStart(e) {
    e.target.classList.add('dragging');
  }
  
  // Handle the end of a drag event
  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
  }
  
  // Handle a task being dropped into a new column
  function handleDrop(e) {
    const task = document.querySelector('.dragging');
    const oldStatus = task.parentElement.id.split('-')[0];
    const newStatus = e.target.id.split('-')[0];
  
    // Move the task in the DOM
    e.target.appendChild(task);
  
    // Emit a socket event to move the task
    socket.emit('moveTask', { text: task.textContent, oldStatus, newStatus });
  }
  
  // Add event listeners to the dropzones
  document.querySelectorAll('.kanban-dropzone').forEach(dropzone => {
    dropzone.addEventListener('drop', handleDrop);
    dropzone.addEventListener('dragover', e => e.preventDefault());
  });
  
  // Listen for socket events to create, move, and delete tasks
  socket.on('createTask', ({ text, status }) => createTask(text, status));
  socket.on('moveTask', ({ text, oldStatus, newStatus }) => {
    // Remove the task from the old column
    const oldColumn = document.getElementById(`${oldStatus}-tasks`);
    const task = Array.from(oldColumn.children).find(child => child.textContent === text);
    oldColumn.removeChild(task);
  
    // Add the task to the new column
    createTask(text, newStatus);
  });
  socket.on('deleteTask', ({ text, status }) => {
    // Remove the task from the column
    const column = document.getElementById(`${status}-tasks`);
    const task = Array.from(column.children).find(child => child.textContent === text);
    column.removeChild(task);
  });

//Message from server.
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const msg =  e.target.elements.msg.value;

    socket.emit('newMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`; 
    document.querySelector('.chat-messages').appendChild(div);
}

//adding room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//adding users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}