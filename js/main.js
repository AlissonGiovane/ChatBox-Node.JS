const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Pegando o username e a sala do url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Entra na sala do chat
socket.emit('joinRoom', { username, room });

// Pegando usuários e sala
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Mensagem do servidor
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Mensagem de enviado
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Pegando mensagem de texto
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emitir mensagem ao servidor
  socket.emit('chatMessage', msg);

  // limpar input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// mensagem output para o DOM
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

// Adicionar nome da sala ao DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Adicionar usuarios ao DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt que o usuário saiu da sala
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
