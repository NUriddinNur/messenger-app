const url = 'http://localhost:4005/'


async function request(route, method, body) {
    let response = await fetch(url + route, {
        method,
        body: body
    })
    return await response.json()
}

// render online users
function appendOnlineUsers(users) {
    rowSidebar.innerHTML = null

    for (let user of users) {
        if (user.username === username) continue
        let span2 = document.createElement('span')
        let span = document.createElement('span')
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        let div4 = document.createElement('div')
        let div5 = document.createElement('div')
        let div6 = document.createElement('div')
        let div7 = document.createElement('div')
        let img = document.createElement('img')

        div1.addEventListener("click", selectUser(user.user_id))

        div7.classList.add('col-sm-4', 'col-xs-4', 'pull-right', 'sideBar-time')
        div2.classList.add('col-sm-3', 'col-xs-3', 'sideBar-avatar')
        div4.classList.add('col-sm-9', 'col-xs-9', 'sideBar-main')
        div6.classList.add('col-sm-8', 'col-xs-8', 'sideBar-name')
        span2.classList.add('time-meta', 'pull-right')
        div1.classList.add('row', 'sideBar-body')
        div3.classList.add('avatar-icon')
        img.classList.add('avatar-icon')
        span.classList.add('name-meta')
        div5.classList.add('row')

        rowSidebar.append(div1)
        div7.append(span2)
        div2.append(div3)
        div1.append(div2)
        div6.append(span)
        div5.append(div6)
        div4.append(div5)
        div5.append(div7)
        div1.append(div4)
        div3.append(img)

        span2.textContent = user.user_updated_at
        span.textContent = user.username
        img.src = user.user_img
    }

}

// render all users
function renderAllUsers(users) {
    allUsersList.innerHTML = null

    for (let user of users) {
        if (user.username === username) continue
        let span2 = document.createElement('span')
        let span = document.createElement('span')
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        let div4 = document.createElement('div')
        let div5 = document.createElement('div')
        let div6 = document.createElement('div')
        let div7 = document.createElement('div')
        let img = document.createElement('img')

        div1.addEventListener("click", selectUser(user.user_id))

        div1.classList.add('row', 'sideBar-body')
        div2.classList.add('col-sm-3', 'col-xs-3', 'sideBar-avatar')
        div3.classList.add('avatar-icon')
        img.classList.add('avatar-icon')

        div7.classList.add('col-sm-4', 'col-xs-4', 'pull-right', 'sideBar-time')
        div4.classList.add('col-sm-9', 'col-xs-9', 'sideBar-main')
        div6.classList.add('col-sm-8', 'col-xs-8', 'sideBar-name')
        span2.classList.add('time-meta', 'pull-right')
        span.classList.add('name-meta')
        div5.classList.add('row')

        allUsersList.append(div1)
        div7.append(span2)
        div2.append(div3)
        div1.append(div2)
        div6.append(span)
        div5.append(div6)
        div4.append(div5)
        div5.append(div7)
        div1.append(div4)
        div3.append(img)

        span2.textContent = user.user_updated_at
        span.textContent = user.username
        img.src = user.user_img
    }
}

// render messages
function renderMessages({ messages, userId, userTo }) {
    window.localStorage.setItem('userTo', userTo.user_id)
    conversation.innerHTML = null
    selectedUserName.textContent = userTo.username
    selectedUserImg.src = userTo.user_img

    for (let mess of messages) {
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        let div4 = document.createElement('div')
        let span = document.createElement('span')
        div1.classList.add('row', 'message-body')

        if (mess.user_from === userId) {
            div3.classList.add('sender')
            div2.classList.add('col-sm-12', 'message-main-sender')
        } else {
            div3.classList.add('receiver')
            div2.classList.add('col-sm-12', 'message-main-receiver')

        }
        div4.classList.add('message-text')
        span.classList.add('message-time', 'pull-right')
        div4.textContent = mess.body
        span.textContent = mess.message_created_at
        div3.append(div4)
        div3.append(span)
        div2.append(div3)
        div1.append(div2)
        conversation.append(div1)
        conversation.scrollTo({
            top: 1000000000,
          });
    }
}


function selectUser(user_id) {
    return function () {
        socket.emit('select user', user_id)
    }
}

// render new message
function appendNewMessage(data) {
    userTo = window.localStorage.userTo
    if (data.userId == userTo) {
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        let div4 = document.createElement('div')
        let span = document.createElement('span')
        div1.classList.add('row', 'message-body')
        div3.classList.add('receiver')
        div2.classList.add('col-sm-12', 'message-main-receiver')
        div4.classList.add('message-text')
        span.classList.add('message-time', 'pull-right')
        div4.textContent = data.body
        span.textContent = data.date
        div3.append(div4)
        div3.append(span)
        div2.append(div3)
        div1.append(div2)
        conversation.append(div1)
        conversation.scrollTo({
            top: 1000000000,
          });
    }
}


function renderSendMessage(value, date) {
    userTo = window.localStorage.userTo

    if (userTo) {
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        let div4 = document.createElement('div')
        let span = document.createElement('span')
        div1.classList.add('row', 'message-body')
        div3.classList.add('sender')
        div2.classList.add('col-sm-12', 'message-main-sender')
        div4.classList.add('message-text')
        span.classList.add('message-time', 'pull-right')
        div4.textContent = value
        span.textContent = date
        div3.append(div4)
        div3.append(span)
        div2.append(div3)
        div1.append(div2)
        conversation.append(div1)

        conversation.scrollTo({
            top: 1000000000,
          });
    }
}