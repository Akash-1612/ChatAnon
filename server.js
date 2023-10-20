// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const formatMessage = require('./utils/messages');
// const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);


// app.use(express.static(path.join(__dirname, 'host')));

// const teamWork = 'TeamWork Greetings.';

// //Runs when user connects.
// io.on('connection', socket => {
//     socket.on('joinRoom', ({username, room}) => {
//         const user = userJoin(socket.id, username, room);

//         socket.join(user.room);

//     //Greetings for new user.
//     socket.emit('message', formatMessage(teamWork, 'Welcome.'));

//     //Message to display when user connects.
//     socket.broadcast.to(user.room).emit('message', 
//     formatMessage(teamWork, `${user.username} has joined the chat.`));

//     //Send users and room info.
//     io.to(user.room).emit('roomUsers', {
//         room: user.room,
//         users: getRoomUsers(user.room)
//     });

//     });

    

//     //Chat content typed by user.
//     socket.on('newMessage', (msg) => {
//         const user = getCurrentUser(socket.id);

//         io.to(user.room).emit('message', formatMessage(user.username, msg));
//     });

//     //Message to display when user leaves.
//     socket.on('disconnect', () => {
//         const user = userLeave(socket.id);

//         if(user) {
//             io.to(user.room).emit('message', formatMessage(teamWork, `${user.username} has left the chat.`));

//             io.to(user.room).emit('roomUsers', {
//                 room: user.room,
//                 users: getRoomUsers(user.room)
//             });
//         }
//     });
// });

// let tasks = [];

// // Handle a client creating a new task
// socket.on('createTask', ({ text, status }) => {
//   tasks.push({ text, status });
//   io.emit('createTask', { text, status });
// });

// // Handle a client moving a task
// socket.on('moveTask', ({ text, oldStatus, newStatus }) => {
//   const task = tasks.find(task => task.text === text && task.status === oldStatus);
//   task.status = newStatus;
//   io.emit('moveTask', { text, oldStatus, newStatus });
// });

// // Handle a client deleting a task
// socket.on('deleteTask', ({ text, status }) => {
//   tasks = tasks.filter(task => !(task.text === text && task.status === status));
//   io.emit('deleteTask', { text, status });
// });

// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'host')));

const teamWork = 'TeamWork Greetings.';

// Runs when user connects.
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Greetings for new user.
        socket.emit('message', formatMessage(teamWork, 'Welcome.'));

        // Message to display when the user connects.
        socket.broadcast.to(user.room).emit('message', formatMessage(teamWork, `${user.username} has joined the chat.`));

        // Send users and room info.
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        // Handle a client creating a new task
        socket.on('createTask', ({ text, status }) => {
            tasks.push({ text, status });
            io.emit('createTask', { text, status });
        });

        // Handle a client moving a task
        socket.on('moveTask', ({ text, oldStatus, newStatus }) => {
            const task = tasks.find((task) => task.text === text && task.status === oldStatus);
            task.status = newStatus;
            io.emit('moveTask', { text, oldStatus, newStatus });
        });

        // Handle a client deleting a task
        socket.on('deleteTask', ({ text, status }) => {
            tasks = tasks.filter((task) => !(task.text === text && task.status === status));
            io.emit('deleteTask', { text, status });
        });
    });

    // ... (rest of your code)
});

let tasks = [];

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
