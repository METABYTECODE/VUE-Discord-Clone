<template>
  <div class="popout" :style="popoutStyle" ref="fileUploadPopout">
    <div class="popout-content">
      <div v-for="item in menuItems" :key="item.id" class="menu-item" @click="item.action">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menuItems: [
        {
          id: "upload-file",
          icon: "fas fa-upload",
          label: "Отправить файл",
          action: this.handleFileUpload,
        },
        {
          id: "upload-text-file",
          icon: "fas fa-file-import",
          label: "Загрузить сообщение в виде файла",
          action: this.handleFileUpload,
        },
        {
          id: "create-poll",
          icon: "fas fa-poll",
          label: "Создать опрос",
          action: this.handleCreatePoll,
        },
      ],
    };
  },
  computed: {
    popoutStyle() {
      const popoutHeight = 175;
      const windowHeight = window.innerHeight;
      let top = this.position?.top || 0;
      if (top + popoutHeight > windowHeight) {
        top = windowHeight - popoutHeight - 10; // Не выходим за экран
      }
      return {
        top: `${top}px`,
        left: `${this.position?.left || 0}px`,
        position: "absolute",
      };
    },
  },
  methods: {
  handleFileUpload() {
    console.log("Отправить файл");
  },
  handleCreatePoll() {
    this.$emit("openPollCreator"); // Уведомляем родителя, что нужно открыть PollCreator
  },
  handleClickOutside(event) {
    const popout = this.$refs.fileUploadPopout;
    if (popout && !popout.contains(event.target)) {
      this.$emit("close"); // Закрываем попап
    }
  },
},
  mounted() {
    // Подключаем обработчик кликов после рендера компонента
    document.addEventListener("mousedown", this.handleClickOutside);
  },
  beforeDestroy() {
    // Убираем обработчик перед удалением компонента
    document.removeEventListener("mousedown", this.handleClickOutside);
  },
};
</script>

<style scoped>
.popout {
  position: absolute;
  background: var(--background-floating);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  min-width: 200px;
  max-width: none;
  padding: 10px;
  font-size: 14px;
  transition: opacity 0.2s ease-in-out;
}

.popout-content {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #dcddde;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.menu-item:hover {
  background-color: #4752c4;
}

.menu-item i {
  margin-right: 10px;
  font-size: 18px;
}
</style>
