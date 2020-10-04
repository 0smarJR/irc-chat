// Local no qual o servidor está hospedado
const socket = io('http://localhost:3030');

// Pegando elementos do HTML
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

// Nome do usuário
const name= prompt('Qual o seu nome?')
appendMessage('Você entrou')
// Display do usuário que entrou
socket.emit('new-user', name)


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

// Submit button
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value;
    appendMessage(`Você: ${message}`)
    // Enviar mensagem para o servidor
    socket.emit('send-chat-message', message)
    // Limpando input apos enviar
    messageInput.value = '';
})

// Adicionando a mensagem ao cliente
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}