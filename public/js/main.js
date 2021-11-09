const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//open and connect to socket
const socket = io();

let data;

function setup() {
    var canvas = createCanvas(500, 500);
    canvas.parent('p5canvas')
    background(65, 32, 125,0);


    // socket.on('msg', (data) => {
    //     msgInput = document.getElementById("msg-input").value;
    //     msgName = document.getElementById("name-input").value;
    //     // console.log(data);
    //     // fill(0, 0, 0)
    //     var img;
    //     let posX = random(500);
    //     let posY = random(500);
    //     // ellipse(posX,posY, 20, 20)
    //     fill(102, 0, 100, 100);
    //     noStroke();
    //     ellipse(posX + 40, posY, 75, 75);
    //     ellipse(posX, posY + 5, 60, 60);
    //     ellipse(posX + 80, posY + 5, 60, 60);
    //     fill(255)
    //     textSize(30);
    //     text(msgName + ":", posX, posY - 3);
    //     text(msgInput, posX, posY + 17);
    //     loadImage('wave.png',img => {
    //     image(img, posX, posY,2,2)
    //     })
    // })
}

// function mouseClicked() {
//     noStroke();
//     ellipse(mouseX, mouseY, 20, 20);
//     let mousePos = {
//         x: mouseX,
//         y: mouseY
//     }
//     socket.emit('mousePosition', mousePos);
// }



// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave this room?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
