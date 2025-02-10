<template>
  <div class="user-profile">
    <div class="avatar-wrapper">
      <div class="avatar">
        <!-- Безопасный доступ к фото пользователя -->
        <img :src="avatarUrl" alt="User Avatar" />
      </div>
      <div class="user-info">
        <!-- Безопасный доступ к имени пользователя -->
        <div class="username">{{ user?.username || 'Неизвестный пользователь' }}</div>
        <div class="status-text">В сети</div>
      </div>
    </div>
    <div class="button-container">
      <button class="button" aria-label="Mute">
        <i class="fas fa-microphone icon"></i>
      </button>
      <button class="button" aria-label="Headphones">
        <i class="fas fa-headphones icon"></i>
      </button>
      <button class="button" aria-label="Settings">
        <i class="fas fa-cog icon"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    user: {
      type: Object,
      required: true, // Данные пользователя обязательны
    },
  },
  computed: {
    avatarUrl() {
      // Возвращаем URL аватара или заглушку
      if (!this.user || !this.user.avatar) {
        return 'https://cdn.discordapp.com/embed/avatars/0.png';
      }
      return `https://cdn.discordapp.com/avatars/${this.user.discordId}/${this.user.avatar}.png`;
    },
  },
};
</script>

  
  <style scoped>
  .user-profile {
  height: 52px;
  background-color: var(--user-profile-bg);
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-top: 1px solid #202225; /* Отделяем верхнюю часть */
  flex-shrink: 0; /* Запрещаем профилю уменьшаться */
}

.avatar-wrapper {
    margin-right: 8px;
    align-items: center;
    display: flex;
    margin-left: -2px;
    min-width: 120px;
    padding-left: 2px;
}

.avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex-grow: 1;
  width: 84px;
  max-width: 84px;
  overflow: hidden; /* Скрытие текста за пределами контейнера */
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap; /* Текст всегда в одной строке */
  overflow: hidden; /* Скрытие текста, выходящего за пределы контейнера */
  text-overflow: ellipsis; /* Добавление троеточия для длинного текста */
}

.status-text {
  font-size: 12px;
  color: #b9bbbe;
}

/* Buttons */
.button-container {
  display: flex;
}

.button {
  background-color: var(--button-bg);
  width: var(--button-size);
  height: var(--button-size);
  border-radius: var(--button-border-radius);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--button-hover-bg);
}

.button i {
  font-size: 16px;
  color: var(--button-icon-color);
  transition: color 0.2s;
}

.button:hover i {
  color: var(--button-icon-hover);
}
  </style>
  