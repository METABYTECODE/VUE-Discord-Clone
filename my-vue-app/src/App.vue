<template>
  <div id="app">
    <!-- Пока идёт проверка авторизации, показываем индикатор загрузки -->
    <div v-if="loading" class="loading-screen">
      Загрузка...
    </div>

    <!-- Если пользователь не авторизован, показываем компонент регистрации -->
    <template v-else-if="!isAuthenticated">
      <Register />
    </template>

    <!-- Если пользователь авторизован, показываем основной интерфейс -->
    <template v-else>
      <Sidebar />
      <div class="main-content">
        <MessageNav :user="currentUser" @open-chat="openChat" />
        <component
  :is="currentView"
  :selected-user="selectedUser"
  :current-user="currentUser"
  @open-chat="openChat"
    />
      </div>
    </template>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import MessageNav from './components/MessageNav.vue';
import Chat from './components/Chat.vue';
import Register from './components/Register.vue';
import FriendsView from './components/FriendsView.vue';

export default {
  components: {
    Sidebar,
    MessageNav,
    Register,
    FriendsView,
    Chat,
  },
  data() {
    return {
      loading: true, // Флаг состояния загрузки
      isAuthenticated: false, // Состояние авторизации
      currentView: 'FriendsView', // Начальное отображение
      selectedUser: null, // Данные выбранного пользователя
      currentUser: null, // Данные текущего авторизованного пользователя
    };
  },
  async created() {
    try {
      // Запрос на сервер для проверки авторизации
      const response = await fetch('http://localhost:3000/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const user = await response.json();
        console.log('Пользователь авторизован:', user);
        this.isAuthenticated = true;
        this.currentUser = user; // Сохраняем данные пользователя
      } else {
        console.warn('Пользователь не авторизован');
      }
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
    } finally {
      this.loading = false; // Завершаем состояние загрузки
    }
  },
  methods: {
    openChat(user) {
      this.selectedUser = user; // Сохраняем выбранного пользователя
      this.currentView = 'Chat'; // Переключаемся на чат
    },
  },
};
</script>

<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  font-size: 24px;
  font-weight: bold;
}
</style>
