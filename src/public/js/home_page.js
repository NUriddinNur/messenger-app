const socket = io({
  extraHeaders: {
    token: window.localStorage.getItem('token')
  }
})

const userImg = window.localStorage.userImg
const username = window.localStorage.username
avatarCurrentUser.src = userImg
activName.textContent = username


socket.on('online users', eventOnlinUsers)
socket.on('all users', eventAllUsers)
socket.on('messages', eventMessages)
socket.on('new message', appendNewMessage)
socket.on('error', errorHandler)


function eventMessages(messages) {
  renderMessages(messages)
}

function eventOnlinUsers(users) {
  appendOnlineUsers(users)
}

function eventAllUsers(users) {
  renderAllUsers(users)
}

function errorHandler(data) {
  if (data.name === 'JsonWebTokenError') {
    window.location = '/login'
  }
}


$(function () {
  $(".heading-compose").click(function () {
    $(".side-two").css({
      "left": "0"
    });
    socket.emit('all users')
  });


  $(".newMessage-back").click(function () {
    $(".side-two").css({
      "left": "-100%"
    });
  });
})


function previous(abs) {
  console.log(abs);
}

searchOnlineUsers.onkeyup = () => {
  socket.emit('search online', searchOnlineUsers.value)
}

composeText.onkeyup = () => {
  socket.emit('search all users', composeText.value)
}


exit.onclick = () => {
  socket.emit('log out')
  window.localStorage.clear()
  window.location = '/login'
}


comment.onkeyup = event => {
  if (event.keyCode !== 13 || !comment.value.trim()) return
  var newDate = new Date().toLocaleString()

  renderSendMessage(comment.value, newDate)
  socket.emit('new message', {
    userTo: window.localStorage.userTo,
    body: comment.value,
    date: newDate
  })

  comment.value = null
}


sendBtn.onclick = event => {
  if (!comment.value.trim()) return
  let newDate = new Date().toLocaleString()

  renderSendMessage(comment.value, newDate)
  socket.emit('new message', {
    userTo: window.localStorage.userTo,
    body: comment.value,
    date: newDate
  })
  comment.value = null
}





