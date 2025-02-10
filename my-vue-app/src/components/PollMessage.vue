<template>
  <div class="poll-message">
    <div class="poll-header">
      <h4 class="poll-title">{{ pollData.question }}</h4>
      <p class="poll-prompt">
        {{ pollData.allowMultiple ? "Выберите несколько ответов" : "Выберите один ответ" }}
      </p>
    </div>

    <div class="poll-answers">
      <div
        v-for="(answer, index) in pollData.answers"
        :key="index"
        class="poll-answer"
        :class="{ selected: selectedAnswers.includes(index), disabled: pollExpired }"
        @click="selectAnswer(index)"
      >
        <div class="poll-progress-bar" :style="{ width: getVotePercentage(index) + '%' }"></div>
        
        <div class="poll-answer-text-container">
          <span class="poll-answer-text">{{ answer }}</span>
          <span v-if="pollExpired || hasVoted" class="poll-result">
            {{ pollData.votes[index] || 0 }} голос{{ pollData.votes[index] === 1 ? '' : 'ов' }} • 
            {{ getVotePercentage(index) }}%
          </span>
        </div>
      </div>
    </div>

    <div class="poll-footer">
      <span class="poll-time-left">{{ timeLeft }}</span>
      <div>
        <button v-if="hasVoted && !pollExpired" class="poll-remove-vote" @click="removeVote">
          Удалить голос
        </button>
        <button v-if="!pollExpired && !hasVoted" class="poll-button" @click="submitVote" :disabled="!canVote">
          Проголосовать
        </button>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: "PollMessage",
    props: {
      pollData: Object,
      pollId: String,
      currentUser: Object,
    },
    data() {
      return {
        selectedAnswers: [],
        hasVoted: false,
        pollExpired: false,
        timeRemaining: 0, // Оставшееся время в секундах
        expirationInterval: null, // Интервал для таймера
      };
    },
    computed: {
      canVote() {
        return this.selectedAnswers.length > 0 && !this.hasVoted && !this.pollExpired;
      },
      timeLeft() {
        if (this.timeRemaining <= 0) return "Голосование завершено";
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        return `Осталось ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      },
    },
    mounted() {
      this.checkIfVoted();
      this.updateTimeLeft();
      this.expirationInterval = setInterval(this.updateTimeLeft, 1000);
    },
    beforeUnmount() {
      clearInterval(this.expirationInterval);
    },
    methods: {
      updateTimeLeft() {
      if (!this.pollData.expiresAt) return;

      const expiresAt = new Date(this.pollData.expiresAt).getTime();
      const now = Date.now();

      this.timeRemaining = Math.max(Math.floor((expiresAt - now) / 1000), 0);

      if (this.timeRemaining <= 0 && !this.pollExpired) {
        this.pollExpired = true;
        clearInterval(this.expirationInterval); // Останавливаем таймер только один раз
        this.expirationInterval = null; // Обнуляем переменную, чтобы не пытаться очистить её дважды
      }
    },
      checkIfVoted() {
        if (!this.currentUser || !this.pollData.voters) return;
        const userId = this.currentUser.discordId;
        if (!userId) {
          console.error("❌ Ошибка: currentUser.discordId = undefined");
          return;
        }
        if (this.pollData.voters.includes(userId)) {
          this.hasVoted = true;
          this.selectedAnswers = this.pollData.votersData?.[userId] || [];
        }
      },
      selectAnswer(index) {
        if (this.pollExpired || this.hasVoted) return;
        if (this.pollData.allowMultiple) {
          if (this.selectedAnswers.includes(index)) {
            this.selectedAnswers = this.selectedAnswers.filter((i) => i !== index);
          } else {
            this.selectedAnswers.push(index);
          }
        } else {
          this.selectedAnswers = [index];
        }
      },
      async submitVote() {
        if (!this.canVote) return;
        try {
          const response = await fetch("http://localhost:3000/polls/vote", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              pollId: this.pollId,
              answerIndexes: this.selectedAnswers,
            }),
          });
          if (response.ok) {
            const updatedPoll = await response.json();
            Object.assign(this.pollData, updatedPoll);
            this.hasVoted = true;
            this.selectedAnswers = updatedPoll.votersData[this.currentUser.discordId] || [];
          } else {
            console.error("❌ Ошибка при голосовании");
          }
        } catch (error) {
          console.error("❌ Ошибка при голосовании:", error);
        }
      },
      async removeVote() {
        try {
          const response = await fetch("http://localhost:3000/polls/remove-vote", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              pollId: this.pollId
            }),
          });
          if (response.ok) {
            const updatedPoll = await response.json();
            Object.assign(this.pollData, updatedPoll);
            this.hasVoted = false;
            this.selectedAnswers = [];
          } else {
            console.error("❌ Ошибка при удалении голоса");
          }
        } catch (error) {
          console.error("❌ Ошибка при удалении голоса:", error);
        }
      },
      getVotePercentage(index) {
        const totalVotes = this.pollData.votes.reduce((sum, count) => sum + count, 0);
        if (totalVotes === 0) return 0;
        return ((this.pollData.votes[index] / totalVotes) * 100).toFixed(0);
      },
    },
  };
</script>
  
  <style scoped>
.poll-message {
  background: #2b2d31;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  /*max-width: 472px;*/
  max-width: 695px;
  min-width: 302px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
  
.poll-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.poll-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: inline;
  margin: 0;
  padding: 0;
  line-height: 1;
}

.poll-prompt {
  font-size: 12px;
  color: #b9bbbe;
  display: inline;
  margin: 4px 0 0;
  padding: 0;
  line-height: 1;
}
  
.poll-answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poll-answer {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: #35373c;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.poll-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #3c4060; /* Цвет прогресса */
  transition: width 0.4s ease-in-out;
}

.poll-answer-text-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between; /* Разносит текст и результаты голосов */
  align-items: center;
  width: 100%; /* Упирается в границы */
  min-width: 0; /* Предотвращает схлопывание */
  padding: 4px 8px;
  overflow: hidden;
}
  
.poll-answer:hover {
  background: #36393f;
}

.poll-answer.selected {
  outline: 2px solid #949cf7;
  color: #ffffff;
}
  
  .poll-answer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .poll-answer-text {
    font-size: 14px;
    color: inherit;
  }
  
  .poll-answer-icon {
    flex-shrink: 0;
  }
  
  .poll-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
  
  .poll-details {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .poll-vote-count {
    background: none;
    border: none;
    color: #b9bbbe;
    font-size: 12px;
    cursor: pointer;
  }
  
  .poll-time-left {
    font-size: 12px;
    color: #b9bbbe;
  }

  .poll-button {
  background: #5865f2;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
}

.poll-result {
  white-space: nowrap; /* Запрещаем перенос строки */
  margin-left: 12px; /* Разносим текст и результат */
  font-size: 12px;
  color: #b9bbbe;
  flex-shrink: 0; /* Запрещаем уменьшение */
}
  
  .poll-button,
  .poll-results-button {
    background: #3c4060;
    color: #ffffff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;
  }
  
  .poll-button:disabled {
    background: #3a3c43;
    cursor: not-allowed;
  }
  
  .poll-button:hover:enabled,
  .poll-results-button:hover {
    background: #4752c4;
  }

  .poll-remove-vote {
  background: #4a4c52;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
}
  </style>
  
  
  