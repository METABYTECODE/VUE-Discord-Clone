<template>
  <div class="message-nav">
    <!-- Меню друзей -->
    <div class="friend-menu">
      <div class="menu-item">
        <i class="fas fa-user-friends icon"></i>
        <span>Друзья</span>
      </div>
      <div class="menu-item">
        <i class="fas fa-envelope icon"></i>
        <span>Запросы общения</span>
      </div>
      <div class="menu-item">
        <i class="fas fa-store icon"></i>
        <span>Магазин</span>
      </div>
    </div>

    <!-- Личные сообщения -->
    <div class="dm-title">Личные сообщения</div>
    <div class="dm-container">
      <div
        v-for="user in users"
        :key="user.id"
        class="dm-item"
        @click="$emit('open-chat', user)"
      >
        <div class="avatar">
          <img :src="user.avatar" :alt="user.username" />
        </div>
        <span class="dm-name">{{ user.username }}</span>
      </div>
    </div>

    <!-- Профиль пользователя -->
    <UserProfile :user="user" v-if="user" />
  </div>
</template>

<script>
import UserProfile from './UserProfile.vue';

export default {
  name: 'MessageNav',
  components: {
    UserProfile,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      users: [], // Пустой массив для данных пользователей
    };
  },
  async created() {
    try {
      // Запрос к серверу для получения списка пользователей
      const response = await fetch('http://localhost:3000/users', {
        credentials: 'include', // Для работы с сессиями
      });
      if (response.ok) {
        this.users = await response.json(); // Сохраняем полученные данные
      } else {
        console.error('Не удалось загрузить пользователей');
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  },
};
</script>

  
  <style scoped>
  .message-nav {
  display: flex;
  flex-direction: column; /* Колонка: друзья, сообщения и профиль */
  height: 100%;
  width: 240px;
  background-color: #2b2d31;
}

.channels {
  padding: 10px;
  flex: 1; /* Этот flex-grow позволяет блоку "расти", оставляя место для блока профиля */
  overflow-y: auto;
}

.channel {
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.channel:hover {
  background-color: #40444b;
}

/* Меню друзей */
.friend-menu {
  margin-bottom: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #40444b;
}

.menu-item .icon {
  display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    margin-right: 12px;
}

.menu-item span {
  font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 0 1 auto;
}

.dm-title {
  font-size: 12px;
  font-family: var(--font-display);
  color: #72767d;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 5px;
}

.dm-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1; 
  overflow-y: auto; 
  scrollbar-width: none;
}

.dm-container::-webkit-scrollbar {
  display: none;
}

.dm-item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dm-item:hover {
  background-color: #40444b;
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
  width: 100%; /* Растягиваем изображение по ширине контейнера */
  height: 100%; /* Растягиваем изображение по высоте контейнера */
  object-fit: cover; /* Сохраняем пропорции, заполняя контейнер */
  border-radius: 50%; /* Делаем изображение круглым */
}

</style>
  