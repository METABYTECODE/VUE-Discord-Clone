<template>
  <div class="chat">
    <!-- Шапка чата -->
    <div class="chat-header">
      <div class="chat-header-left">
        <img
          class="chat-avatar"
          :src="getUserAvatar(selectedUser?.discordId)"
          alt="User Avatar"
        />
        <span class="chat-username">{{ selectedUser?.username || "Пользователь" }}</span>
      </div>
      <div class="chat-header-right">
        <i class="fas fa-phone"></i>
        <i class="fas fa-video"></i>
        <i class="fas fa-thumbtack"></i>
        <i class="fas fa-user-plus"></i>
        <div class="chat-search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Поиск" />
        </div>
      </div>
    </div>

    <!-- Сообщения -->
    <div class="chat-messages" ref="messageContainer">
      <ChatMessage
        v-for="message in messages"
        :key="message._id"
        :message="message"
        :currentUser="currentUser"
        :selectedUser="selectedUser"
      />
    </div>

    <!-- Поле ввода -->
    <ChatInput
      :placeholderText="placeholderText"
      :selectedUser="selectedUser"
      :currentUser="currentUser"
      @sendMessage="handleSendMessage"
      @publishPoll="handlePublishPoll"
    />
  </div>
</template>

<script>
import ChatInput from "./ChatInput.vue";
import ChatMessage from "./ChatMessage.vue";

export default {
  name: "Chat",
  components: {
    ChatInput,
    ChatMessage,
  },
  props: {
    selectedUser: Object, // Выбранный пользователь
    currentUser: Object, // Текущий пользователь
  },
  data() {
    return {
      messages: [], // Массив сообщений
    };
  },
  computed: {
    placeholderText() {
      return this.selectedUser
        ? `Написать @${this.selectedUser.username}`
        : "Написать сообщение...";
    },
  },
  watch: {
    selectedUser: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.loadMessages(newValue.id); // Загружаем сообщения при выборе пользователя
        }
      },
    },
  },
  methods: {
    // Загрузка сообщений
    async loadMessages(userId) {
      try {
        const response = await fetch(`http://localhost:3000/messages/${userId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const rawMessages = await response.json();
          this.messages = rawMessages.map((msg) => ({
            ...msg,
            text: msg.text || "", // Убедимся, что текст существует
          }));
          this.scrollToBottom();
        }
      } catch (error) {
        console.error("Ошибка при загрузке сообщений:", error);
      }
    },

    // Обработка отправки сообщения
    handleSendMessage(message) {
      this.sendMessage(message);
    },

    // Отправка сообщения на сервер
    async sendMessage(message) {
      try {
        const response = await fetch("http://localhost:3000/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            recipientId: this.selectedUser.id,
            text: message,
          }),
        });

        if (response.ok) {
          const savedMessage = await response.json();
          this.messages.push(savedMessage); // Добавляем сообщение в список
          this.scrollToBottom();
        } else {
          console.error("Ошибка ответа сервера:", await response.text());
        }
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    },

    // Обработка публикации опроса
    handlePublishPoll(pollData) {
      this.publishPoll(pollData);
    },

    // Публикация опроса на сервер
    publishPoll(pollData) {
      const pollMessage = {
        recipientId: this.selectedUser.id,
        type: "poll",
        pollData,
      };

      fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pollMessage),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Ошибка при отправке опроса");
          return response.json();
        })
        .then((savedMessage) => {
          this.messages.push(savedMessage); // Добавляем опрос в список сообщений
          this.scrollToBottom();
        })
        .catch((error) => console.error(error));
    },

    // Прокрутка вниз
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    // Получение аватара пользователя
    getUserAvatar(userId) {
      const defaultAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";
      if (userId === this.currentUser.discordId) {
        return this.currentUser.avatar
          ? `https://cdn.discordapp.com/avatars/${this.currentUser.discordId}/${this.currentUser.avatar}.png`
          : defaultAvatar;
      }
      return this.selectedUser?.avatar || defaultAvatar;
    },
  },
};
</script>

<style scoped>
/* Стили из оригинального компонента Chat */
.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2f3136;
  padding: 10px 15px;
  border-bottom: 1px solid #202225;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.chat-username {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.chat-header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chat-header-right i {
  color: #b9bbbe;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.chat-header-right i:hover {
  color: #ffffff;
}

.chat-search {
  display: flex;
  align-items: center;
  background-color: #40444b;
  border-radius: 4px;
  padding: 5px;
}

.chat-search i {
  color: #72767d;
  margin-right: 5px;
}

.chat-search input {
  background: none;
  border: none;
  color: #ffffff;
  outline: none;
  font-size: 14px;
  width: 150px;
}

.chat-search input::placeholder {
  color: #72767d;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-messages::-webkit-scrollbar {
  display: none;
}
</style>