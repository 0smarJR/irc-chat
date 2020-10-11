// Local no qual o servidor está hospedado
const socket = io();

// Pegando elementos do HTML
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');


//Verificando se o form para novo usuario é solicitado na página (verificação feita para evitar que esse form apareça na pagina index)
if(messageForm != null){
    // Nome do usuário
    const name= prompt('Qual o seu nome?')
    appendMessage('Você entrou')
    // Display do usuário que entrou
    socket.emit('new-user', roomName, name)
    // Submit button
    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value;
        appendMessage(`Você: ${message}`)
        // Enviar mensagem para o servidor
        socket.emit('send-chat-message', roomName, message)
        // Limpando input apos enviar
        messageInput.value = '';
    })
}

//Criando nova sala
socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'Entrar'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
    // Diplay da Mensagem no cliente
    appendMessage(`${data.name}: ${data.message}`)
})


// Usuário conectado
socket.on('user-connected', name => {
    appendMessage(`${name} Conectou`)
})

// Usuário desconectado
socket.on('user-disconnected', name => {
    appendMessage(`${name} Desconectou`)
})

// Adicionando a mensagem ao cliente
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
