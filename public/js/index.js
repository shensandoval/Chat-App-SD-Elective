$(document).ready(function () {
    var socket = io()


    var typing=false;
    var timeout=undefined;
    var user;

    var username; //global variable for username

    // get and store username
    document.getElementById('username').innerHTML = localStorage.getItem("username")

    var username = localStorage.getItem("username");

    let today = new Date().toISOString().slice(0, 10)
    console.log(today)


    // console.log(localStorage.getItem("username"));

    $('.start_btn').click(function (e) { //function for the start button
        username = $('#username').val()

        localStorage.setItem("username", username)//store value in localStorage

        if (!username) {
            alert('Enter username')
        }
        else {
            window.location.href = "/views/index" //redirect page
            username = username
            console.log(username)
        }
    })

    $('#value_msg').keypress((e)=>{
        if(e.which!=13){
          typing=true
          console.log(username)
          socket.emit('typing', {user:username, typing:true})
          clearTimeout(timeout)
          timeout=setTimeout(typingTimeout, 3000)
        }else{
          clearTimeout(timeout)
          typingTimeout()
          //sendMessage() function will be called once the user hits enter
          sendMessage()
        }
      })

    //   typing 
    socket.on('display', (data) => {
        if (data.typing == true) {
            console.log(data.user)
            $('.typing').text(`${data.user} is typing...`)
            
        }else{
            $('.typing').text("")
          }
    })


    $('form').submit(function () {
        let msg = $('#value_msg').val();
        socket.emit('chat message', msg);
        $('#message').append(`
            <p class="text-right text-white" style="font-size: 10px; margin-top: 2%;">You</p>
            <h6 class="text-right text-white mt-"><span class="p-2 test" style="background-color: orange;">${msg}</span></h6>
            <p class="text-right text-white" style="font-size: 7px; margin-top: 2%;">${today}</p>
        `);
        $('#value_msg').val('')
        return false;
    })



    socket.on('chat message', function (msg) {
        console.log(socket.id)
        // console.log(this.id)
        console.log(msg)
        $('#message').append(`
            <p class="text-left text-white" style="font-size: 10px; margin-top: 2%;">${username}</p>
            <h6 class="text-left text-white mt-4"><span class="p-2 test" style="background-color: black;">${msg}</span></h6>
            <p class="text-left text-white" style="font-size: 7px; margin-top: 2%;">${today}</p>
        ` );
        window.scrollTo(0, document.body.scrollHeight)

    })


    //joined chat
    $('#join').click(() => {
        socket.emit('connected', username);
    })

    //on connect
    socket.on('connected', (username) => {
        console.log(username);
        // alert(username + " joined the chat!")
        $('#message').append(`
        <h6 class="text-center text-white mt-4"><span class="p-2 test"></span></h6>
        `)
        var onlineUsers =JSON.parse(window.localStorage.getItem('online'));
        if (onlineUsers) {
            $('.user_infos').empty();
            for(let user in onlineUsers) {
                $('.user_infos').append(`
                    <img src="/images/person.png" class="rounded-circle user_img" style="margin-top: 2%;">
                    <span style="color: white; font-size: 20px">${user} <span style="color: green; font-size: 13px">online</span></span>
                    <p></p>
                `)
            }
        }
    });

    //get online users
    socket.on('online', (users) => {
        console.log(users);
        window.localStorage.setItem('online', JSON.stringify(users));
    })

    var onlineUsers =JSON.parse(window.localStorage.getItem('online'));
    if (onlineUsers) {
        for(let user in onlineUsers) {
            $('.user_infos').append(`
                <img src="/images/person.png" class="rounded-circle user_img" style="margin-top: 2%;">
                <span style="color: white; font-size: 20px">${user} <span style="color: green; font-size: 13px">online</span></span>
				<p></p>
            `)
        }
    }

    //leave chat
    $("#leave").click(() => {
        socket.emit('disco', username);
    })

    //on disconnect
    socket.on('disco', (username) => {
       
        // alert(username + " left the chat!")
        $('#message').append(`
        <h6 class="text-center text-white mt-4"><span class="p-2 test">${username + ' left the chat.'}</span></h6>
        `)
        // delete onlineUsers[socket.id]
        delete onlineUsers[username];
        window.localStorage.setItem('online', JSON.stringify(onlineUsers));
        if (onlineUsers) {
            $('.user_infos').empty();
            for(let user in onlineUsers) {
                $('.user_infos').append(`
                    <img src="/images/person.png" class="rounded-circle user_img" style="margin-top: 2%;">
                    <span style="color: white; font-size: 20px">${user} <span style="color: green; font-size: 13px">online</span></span>
                    <p></p>
                `)
            }
        }

    })

})

