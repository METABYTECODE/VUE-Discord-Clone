<template>
  <div class="poll-overlay">
    <div class="poll-creator">
      <!-- Заголовок -->
      <div class="poll-header">
        <h1 class="poll-title">Создание опроса</h1>
        <button class="close-button" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Тело опроса -->
      <div class="poll-body">
        <!-- Вопрос -->
        <div class="poll-question">
          <label for="poll-question">ВОПРОС</label>
          <div class="textarea-wrapper">
            <textarea
              id="poll-question"
              v-model="pollQuestion"
              class="poll-question-text"
              placeholder="Какой вопрос вы хотите задать?"
              maxlength="50"
            ></textarea>
            <span class="char-count">{{ pollQuestion.length }} / 50</span>
          </div>
        </div>

        <!-- Ответы -->
        <div class="poll-answers">
          <label>ОТВЕТЫ</label>
          <div class="answer-row" v-for="(answer, index) in answers" :key="index">
            <div class="emoji-wrapper">
              <i class="fas fa-smile"></i>
            </div>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="answers[index]"
                placeholder="Введите ответ"
                maxlength="55"
                class="answer-input"
              />
              <span class="char-count">{{ answers[index].length }} / 55</span>
            </div>
            <button class="delete-button" @click="removeAnswer(index)" aria-label="Удалить ответ">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button class="add-answer" @click="addAnswer">
            <i class="fas fa-plus-circle"></i> Добавить ещё один ответ
          </button>
        </div>

        <!-- Срок -->
        <div class="poll-settings">
          <label>Срок</label>
          <div class="custom-dropdown-container">
            <div class="custom-dropdown" @click="toggleDropdown">
              {{ selectedDuration.label }}
              <i :class="dropdownOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </div>
            <ul v-if="dropdownOpen" class="dropdown-menu">
              <li
                v-for="option in durationOptions"
                :key="option.value"
                @click="selectDuration(option)"
                :class="{ selected: selectedDuration.value === option.value }"
              >
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <div class="poll-footer">
        <div class="allow-multiple">
          <input type="checkbox" v-model="allowMultiple" id="allow-multiple" />
          <label for="allow-multiple">Разрешить несколько ответов</label>
        </div>
        <button class="publish-button" @click="publishPoll">Публикация</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PollCreator",
  data() {
    return {
      pollQuestion: "", // Вопрос опроса
      answers: ["", ""], // Два ответа по умолчанию
      allowMultiple: false, // Флаг для множественных ответов
      durationOptions: [
        { value: 1 / 60, label: "1 минута" }, // ✅ Добавляем 1 минуту
        { value: 1, label: "1 ч." },
        { value: 4, label: "4 ч." },
        { value: 8, label: "8 ч." },
        { value: 24, label: "24 ч." },
        { value: 72, label: "3 дня" },
        { value: 168, label: "1 неделя" },
        { value: 336, label: "2 недели" },
      ],
      selectedDuration: { value: 24, label: "24 ч." }, // Значение по умолчанию
      dropdownOpen: false,
    };
  },
  methods: {
    addAnswer() {
      if (this.answers.length < 10) {
        this.answers.push("");
      }
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectDuration(option) {
      this.selectedDuration = option;
      this.dropdownOpen = false;
    },
    publishPoll() {
      const pollData = {
        question: this.pollQuestion,
        answers: this.answers.filter((answer) => answer.trim() !== ""), // Убираем пустые ответы
        duration: this.selectedDuration, // ✅ Теперь можно выбрать 1 минуту
        allowMultiple: this.allowMultiple,
      };

      this.$emit("publishPoll", pollData); // Отправляем событие с данными опроса
      this.$emit("close"); // Закрываем компонент после публикации
    },
  },
};
</script>


  
  <style scoped>
.poll-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
  
.poll-creator {
  background: #2b2d31;
  border-radius: 8px;
  width: 600px;
  max-height: 800px;
  min-height: 400px;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
  
  /* Заголовок */
  .poll-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
  
  .poll-title {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #b9bbbe;
    font-size: 18px;
    cursor: pointer;
  }
  
  /* Тело опроса */
  .poll-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 20px; /* Добавляем padding по бокам */
  }
  
  /* Вопрос */
  .poll-question label {
  display: block;
  font-size: 12px;
  color: #b9bbbe;
  margin-bottom: 8px;
  text-transform: uppercase;
  padding-left: 4px; /* Отступ слева */
}
  
  .textarea-wrapper {
    position: relative;
  }
  
  .poll-question-text {
  width: 100%;
  padding: 0 12px; /* Боковые отступы */
  background: #1e1f22;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  resize: none;
  box-sizing: border-box;
  font-size: 14px;
  height: 40px; /* Фиксированная высота */
  line-height: 40px; /* Высота строки равна высоте контейнера */
  vertical-align: middle; /* Для центрирования текста */
}

  
  .char-count {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 12px;
    color: #b9bbbe;
    pointer-events: none; /* Чтобы клики проходили сквозь элемент */
  }
  

.poll-answers label {
    font-size: 12px;
    color: #b9bbbe;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
}

.input-wrapper {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
  
.answer-row {
  display: flex;
  align-items: center;
  background: #1e1f22;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.answer-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: transparent;
  border: none;
  color: #ffffff;
}

.emoji-wrapper,
.delete-button {
  width: 44px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b2d31;
  flex-shrink: 0;
}
  
.delete-button {
  background: none;
  color: #ff5555;
  font-size: 18px;
  cursor: pointer;
  border: none;
}
  
.add-answer {
  width: 100%;
  padding: 8px;
  height: 44px;
  background: #1e1f22;
  color: #7289da;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
  
  .add-answer i {
    font-size: 16px;
  }
  
  .poll-settings {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-dropdown-container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  min-width: 6rem;
  gap: 4px;
  width: 150px;
}

.custom-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #1e1f22;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 400;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2b2d31;
  border-radius: 4px;
  list-style: none;
  padding: 8px 0;
  margin: 4px 0;
  width: 100%;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
  z-index: 1000;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.dropdown-menu li {
  padding: 8px 12px;
  color: #ffffff;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #40444b;
}

.dropdown-menu li.selected {
  background: #5865f2;
}
  
  .poll-duration {
    background: #202225;
    color: #ffffff;
    padding: 8px;
    border: none;
    border-radius: 4px;
  }
  
  /* Футер */
  .poll-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.emoji-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 40px;
  background: #1e1f22;
  color: #b9bbbe;
}
  
  .allow-multiple {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .allow-multiple input {
    appearance: none; /* Убираем стандартный стиль */
    width: 18px;
    height: 18px;
    border: 2px solid #b9bbbe;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    position: relative;
  }
  
  .allow-multiple input:checked {
    background: #5865f2; /* Цвет как у кнопки "Публикация" */
    border-color: #5865f2;
  }
  
  .allow-multiple input:checked::after {
    content: "✔";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 12px;
}
  
.publish-button {
  background: #5865f2;
  min-height: 44px;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
  </style>