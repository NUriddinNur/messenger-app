

registrBtn.onclick = async event => {
    event.preventDefault()

    let userName = inputUserName.value
    let password = inputPass.value
    const file = inputFile.files[0]

    if (!(userName && password && file)) return

    const formData = new FormData()
    formData.append('userName', userName)
    formData.append('password', password)
    formData.append('file', file)

    let response = await request('register', 'POST', formData)

    if (response.status === 400) {
        message.textContent = response.message
        message.style.color = 'red'
        return
    }
    if(response.status === 200) {
        message.textContent = response.message
        message.style.color = 'green'
        setTimeout(() => {
            window.location = '/login'
        }, 1000)
    }
}


loginBtn.onclick = async (event) => {
    event.preventDefault()

    let userName = user.value
    let password = pass.value

    if (!userName?.trim() || !password?.trim()) return


    const formData = new FormData()
    formData.append('userName', userName)
    formData.append('password', password)

    let response = await request('login', 'POST', formData)

    if (response.status === 400) {
        message.textContent = response.message
        message.style.color = 'red'
        return
    }
    if(response.status === 200) {
        message.textContent = response.message
        message.style.color = 'green'
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('userImg', response.data.user_img)
        window.localStorage.setItem('username', response.data.username)
        setTimeout(() => {
            window.location = '/'
        }, 1000)
    }
}
