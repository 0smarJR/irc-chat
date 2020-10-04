const io = require('socket.io')(3030)

// Banco de dados
const users = {};


io.on('connection', socket => {

    // Conectando usuário
    socket.on('new-user', name => {
        //Definindo ID único para usuário
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name)
    })

    // Tratando mensagem recebida
    socket.on('send-chat-message', message => {
        // Enviando a mensagem para os outros usuários
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    // Desconenctando usuário
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        // Deletando usuários do array
        delete users[socket.id]
    });
})