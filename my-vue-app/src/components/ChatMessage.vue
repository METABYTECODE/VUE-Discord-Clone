<template>
  <div
    :class="{ 'my-message': isMyMessage }"
    class="chat-message"
  >
    <div class="chat-message-avatar">
      <img :src="avatar" alt="Avatar" />
    </div>
    <div class="chat-message-content">
      <div class="chat-message-header">
        <span class="chat-message-username">{{ username }}</span>
        <span class="chat-message-timestamp">{{ formattedTimestamp }}</span>
      </div>
      <div v-if="message.type === 'poll'">
        <PollMessage :pollData="message.pollData" :pollId="message._id" :currentUser="currentUser" />
      </div>
      <div v-else class="chat-message-text" v-html="message.text"></div>
    </div>
  </div>
</template>

<script>
import PollMessage from "./PollMessage.vue";

export default {
  name: "ChatMessage",
  components: {
    PollMessage,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
    selectedUser: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isMyMessage() {
      return this.currentUser && this.message.senderId === this.currentUser.discordId;
    },
    avatar() {
      return this.getUserAvatar(this.message.senderId);
    },
    username() {
      return this.getUserName(this.message.senderId);
    },
    formattedTimestamp() {
      return this.formatDate(this.message.timestamp);
    },
  },
  methods: {
    getUserName(userId) {
      return this.currentUser?.discordId === userId
        ? this.currentUser.username || "Вы"
        : this.selectedUser?.username || "Неизвестный пользователь";
    },
    getUserAvatar(userId) {
      const defaultAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";
      if (userId === this.currentUser.discordId) {
        return this.currentUser.avatar
          ? `https://cdn.discordapp.com/avatars/${this.currentUser.discordId}/${this.currentUser.avatar}.png`
          : defaultAvatar;
      }
      return this.selectedUser?.avatar || defaultAvatar;
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
      });
    },
  },
};
</script>

<style scoped>
/* Стили из оригинального компонента Chat */
.chat-message {
  display: flex;
  gap: 5px;
  align-items: flex-start;
  flex-shrink: 0;
  animation: fadeInUp 0.3s ease-in-out;
}

.chat-message:hover {
  background: #2e3035;
}

.chat-message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #202225;
  flex-shrink: 0;
}

.chat-message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-message-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 60px);
  padding: 10px 12px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  flex-shrink: 1;
}

.chat-message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 4px;
}

.chat-message-username {
  font-weight: bold;
  color: #ffffff;
}

.chat-message-timestamp {
  font-size: 12px;
  color: #72767d;
}

.message-text {
  white-space: pre-wrap; /* Сохраняет переносы строк */
  word-wrap: break-word; /* Перенос длинных слов */
  color: #dcddde;
  font-size: 16px;
  line-height: 1.4;
}

.message-text p {
  margin: 0; /* Убираем отступы у <p> */
}

.message-text br {
  display: block; /* Делаем <br> видимым */
  content: ""; /* Добавляем пустое содержимое */
  margin-bottom: 8px; /* Отступ после <br> */
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>