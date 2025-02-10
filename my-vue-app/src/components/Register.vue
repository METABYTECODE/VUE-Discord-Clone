<template>
  <div class="register-container">
    <h1>Регистрация</h1>
    <div class="social-buttons">
      <button class="social-button vk" @click="registerWith('VK')">
        <i class="fab fa-vk"></i> Войти через VK
      </button>
      <button class="social-button discord" @click="registerWith('Discord')">
        <i class="fab fa-discord"></i> Войти через Discord
      </button>
      <button class="social-button telegram" @click="registerWith('Telegram')">
        <i class="fab fa-telegram"></i> Войти через Telegram
      </button>
    </div>
    <p>Уже есть аккаунт? <button @click="authenticate">Войти</button></p>
  </div>
</template>

<script>
export default {
  methods: {
    registerWith(provider) {
      if (provider === "Discord") {
        window.location.href = "http://localhost:3000/auth/discord"; // URL сервера для Discord OAuth2
      } else {
        console.error("Пока поддерживается только Discord");
      }
    },
    authenticate() {
      console.log("Переход к авторизации");
    },
  },
};
</script>

  <style scoped>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #2f3136;
    color: #fff;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #40444b;
    border: none;
    border-radius: 5px;
    padding: 10px;
    color: #fff;
    font-size: 16px;
    width: 300px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .social-button i {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .social-button.vk {
    background: #4a76a8;
  }
  
  .social-button.vk:hover {
    background: #395e8b;
  }
  
  .social-button.discord {
    background: #5865f2;
  }
  
  .social-button.discord:hover {
    background: #4752c4;
  }
  
  .social-button.telegram {
    background: #0088cc;
  }
  
  .social-button.telegram:hover {
    background: #0077b8;
  }
  
  p {
    margin-top: 15px;
  }
  
  p button {
    background: none;
    border: none;
    color: #5865f2;
    cursor: pointer;
    font-size: 14px;
  }
  
  p button:hover {
    color: #4752c4;
  }
  </style>
  