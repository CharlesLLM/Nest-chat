<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { io } from 'socket.io-client';

interface Message {
  text: string
  clientId: string
}

const socket = io('http://localhost:3005')

const messages = ref<Message[]>([])
const inputValue = ref('')
const clientId = ref<string | null>(null)

const handleSendMessage = () => {
  if (!inputValue.value) return

  const newMessage = {
    text: inputValue.value,
    clientId: clientId.value!
  }

  socket.emit('newMessage', newMessage)

  inputValue.value = ''
}

onMounted(() => {
  socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);

    clientId.value = socket.id || null
  })

  socket.on('user-joined', (data: { message: string; clientId: string }) => {
    console.log('User joined:', data);

    messages.value.push({
      text: data.message,
      clientId: data.clientId
    })
  })

  socket.on('user-left', (data: { message: string; clientId: string }) => {
    console.log('User left:', data);

    messages.value.push({
      text: data.message,
      clientId: data.clientId
    })

    clientId.value = null
  })

  socket.on(
    'message',
    (message: { text: string; sender: string; clientId: string }) => {
      console.log('New message:', message);

      messages.value.push(message)
    }
  )
})

onBeforeUnmount(() => {
  socket.off('connect')
  socket.off('user-joined')
  socket.off('user-left')
  socket.off('message')
})

watch(clientId, (value) => {
  if (value === null) {
    clientId.value = socket.id || null
  }
})
</script>

<template>
  <div class="chat-container">
    <!-- Messages -->
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-row"
        :class="message.clientId === clientId ? 'right' : 'left'"
      >
        <div
          class="message-box"
          :class="message.clientId === clientId ? 'my-message' : 'other-message'"
        >
          <div class="message-author">
            {{ message.clientId === clientId ? 'You' : message.clientId }}
          </div>
          <div class="message-text">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="input-group">
      <input
        v-model="inputValue"
        type="text"
        placeholder="Type your message here..."
        @keyup.enter="handleSendMessage"
      />

      <button @click="handleSendMessage">
        ➤
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  height: 100%;
  background: #1a1a1a;
}

.messages {
  flex: 1;
  overflow-y: auto;
}

.message-row {
  display: flex;
  margin-top: 8px;
}

.message-row.left {
  justify-content: flex-start;
}

.message-row.right {
  justify-content: flex-end;
}

.message-box {
  max-width: 80%;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.my-message {
  background: #3182ce;
  color: white;
  text-align: right;
}

.other-message {
  background: #2d3748;
  color: #edf2f7;
  text-align: left;
}

.message-author {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.message-text {
  font-size: 16px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group input {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: #2d3748;
  color: white;
}

.input-group button {
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: #3182ce;
  color: white;
  cursor: pointer;
  font-size: 18px;
}

.input-group button:hover {
  background: #2b6cb0;
}
</style>
