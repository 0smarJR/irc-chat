const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3030

app.set('views', './client') //Definindo pasta com as paginas usadas
app.set('view engine', 'ejs') //Definindo arquivos de pagina como .ejs em vez de .html
app.use(express.static('public')) //Definindo pasta onde ficará o controller
app.use(express.urlencoded({ extended: true }))

const rooms = {}

//Redirecionamento da url '/' para a pagina index e passando as salas como parametro
app.get('/', (req, res) => {
    res.render('index', {rooms: rooms})
})

//Formulario de criação de nova sala
app.post('/room', (req, res) => {
    //Verificando se já não existe uma sala com mesmo nome
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
      }
      rooms[req.body.room] = { users: {} }
      res.redirect(req.body.room)
    //Mensagem informando criação da sala
    io.emit('room-created', req.body.room)
})

//Criando uma url para cada sala
app.get('/:room', (req, res) => {
    //Verificação para impedir que a pessoa entre em uma sala que não existe
    if (rooms[req.params.room] == null){
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room})
})

server.listen(PORT, ()=>{
  console.log("Connected to port:" + PORT);
})

// Banco de dados

io.on('connection', socket => {
    // Conectando usuário
    socket.on('new-user', (room, name) => {
        //Definindo ID único para usuário
        socket.join(room)
        rooms[room].users[socket.id] = name
        socket.to(room).broadcast.emit('user-connected', name)
    })

    // Tratando mensagem recebida
    socket.on('send-chat-message', (room, message) => {
        // Enviando a mensagem para os outros usuários de uma determinada sala
        socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
      })
    // Desconenctando usuário
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
          socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
          delete rooms[room].users[socket.id]
        })
    })
})

//Função para listar todas as salas e os usuarios que se encontram nela
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }