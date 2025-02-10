<template>
    <div class="friends-view">
      <div class="search-bar">
        <input type="text" placeholder="Поиск" />
        <i class="fas fa-search"></i>
      </div>
      <div class="online-title">В СЕТИ — {{ onlineFriends.length }}</div>
      <div class="friends-list">
        <div
          v-for="friend in onlineFriends"
          :key="friend.id"
          class="friend-item"
          @click="$emit('open-chat', friend)"
        >
          <img :src="friend.avatar" alt="avatar" />
          <div class="friend-info">
            <p class="friend-name">{{ friend.username }}</p>
            <p class="friend-status">{{ friend.status }}</p>
          </div>
          <div class="friend-actions">
            <button class="action-button"><i class="fas fa-comment-dots"></i></button>
            <button class="action-button"><i class="fas fa-ellipsis-h"></i></button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FriendsView",
    data() {
      return {
        onlineFriends: [
          { id: 1, username: "DOC_LTV", avatar: "https://placehold.co/32", status: "В сети" },
          { id: 2, username: "MorkovkaRave", avatar: "https://placehold.co/32", status: "В сети" },
          { id: 3, username: "Nooky", avatar: "https://placehold.co/32", status: "Вызов" },
          { id: 4, username: "phiststated", avatar: "https://placehold.co/32", status: "мои соболезнования" },
          { id: 5, username: "Dead-Bloom", avatar: "https://placehold.co/32", status: "Жизнь Заебала!!!" },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .friends-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 20px;
    background-color: #313338;
    scrollbar-width: none;
  }
  
  .search-bar {
  display: flex;
  align-items: center;
  position: relative; /* Относительное позиционирование для контейнера */
  padding: 8px 10px;
  background: #1e1f22;
  border-radius: 5px;
  margin-bottom: 10px;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  padding-right: 25px; /* Добавляем отступ, чтобы текст не заезжал на иконку */
}

.search-bar input::placeholder {
  color: #72767d;
}

.search-bar i {
  position: absolute; /* Абсолютное позиционирование для иконки */
  right: 10px; /* Располагаем иконку справа внутри поля */
  color: #72767d;
  font-size: 14px;
  pointer-events: none; /* Чтобы иконка не мешала взаимодействию с input */
}
  
  .online-title {
    font-size: 12px;
    color: #72767d;
    margin-bottom: 10px;
    margin: 16px 20px 16px 30px;
    color: v#72767d;
  }
  
  .friends-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .friend-item {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #2b2d31;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .friend-item:hover {
    background-color: #40444b;
  }
  
  .friend-item img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0 12px 0 0;
  }
  
  .friend-info {
    flex-grow: 1;
  }

  .friend-info p {
  margin: 0;
}

  
  .friend-name {
    font-weight: bold;
    color: #ffffff;
  }
  
  .friend-status {
    font-size: 12px;
    color: #b9bbbe;
  }
  
  .friend-actions {
    display: flex;
    gap: 8px;
  }
  
  .action-button {
    background: none;
    border: none;
    color: #72767d;
    cursor: pointer;
    font-size: 16px;
  }
  
  .action-button:hover {
    color: #ffffff;
  }
  </style>
  