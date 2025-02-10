<template>
  <div class="chat-input">
    <!-- Левая часть: Кнопка добавления файла/опроса -->
    <div class="input-buttons-left">
      <i
        class="fas fa-plus-circle"
        @click="toggleFileUploadPopout"
        ref="fileUploadButton"
        title="Добавить файл или опрос"
      ></i>
    </div>

    <!-- Поле ввода сообщения (Tiptap) -->
    <div class="editor-wrapper">
      <editor-content class="input-container" :editor="editor" />
    </div>

    <!-- Правая часть: Кнопки эмодзи, GIF, стикеры -->
    <div class="input-buttons-right">
      <i class="fas fa-image" title="Добавить GIF"></i>
      <i class="fas fa-sticky-note" title="Добавить стикер"></i>
      <i
        class="fas fa-smile"
        title="Добавить эмодзи"
        ref="emojiButton"
        @click="toggleEmojiPicker"
      ></i>
    </div>

    <!-- Попап выбора эмодзи -->
    <EmojiPicker
      v-if="showEmojiPicker"
      :isOpen="showEmojiPicker"
      @select="insertEmoji"
      @close="toggleEmojiPicker"
    />

    <!-- Попап загрузки файлов/создания опросов -->
    <FileUploadPopout
      v-if="showFileUploadPopout"
      :position="fileUploadPopoutPosition"
      @close="toggleFileUploadPopout"
      @openPollCreator="openPollCreator"
    />
    <PollCreator
      v-if="showPollCreator"
      @close="closePollCreator"
      @publishPoll="handlePublishPoll"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EmojiPicker from "./EmojiPicker.vue";
import FileUploadPopout from "./FileUploadPopout.vue";
import PollCreator from "./PollCreator.vue";

// Эмиссия событий
const emit = defineEmits(["sendMessage", "publishPoll"]);

// Пропсы
const props = defineProps({
  selectedUser: Object, // Кому пишем
  currentUser: Object,  // Текущий пользователь
});

// Состояния попапов
const showFileUploadPopout = ref(false);
const fileUploadPopoutPosition = ref({ top: 0, left: 0 });
const showPollCreator = ref(false);
const showEmojiPicker = ref(false);

// Динамический placeholder (имя собеседника)
const dynamicPlaceholder = computed(() => {
  return props.selectedUser?.username
    ? `Написать @${props.selectedUser.username}`
    : "Написать сообщение...";
});

// Авторасширение поля
const adjustHeight = () => {
  const editorEl = document.querySelector(".input-container");
  if (!editorEl) return;
  editorEl.style.height = "auto"; // Сбрасываем высоту
  editorEl.style.height = `${Math.min(500, editorEl.scrollHeight)}px`; // Ограничиваем максимальную высоту
};

// Инициализация редактора
const editor = useEditor({
  content: "",
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ editor }) => dynamicPlaceholder.value,
    }),
  ],
  onUpdate: adjustHeight,
});

// ✅ Следим за `selectedUser` и обновляем `Placeholder`
watch(dynamicPlaceholder, (newPlaceholder) => {
  if (editor.value) {
    editor.value.setOptions({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: newPlaceholder,
        }),
      ],
    });
  }
});

// Пересчитываем высоту при изменении текста
watch(
  () => editor.value?.getText(),
  () => {
    adjustHeight();
  }
);

// Вставка эмодзи в редактор
const insertEmoji = (emoji) => {
  if (editor.value) {
    editor.value.chain().focus().insertContent(emoji).run();
  }
  toggleEmojiPicker();
};

// Переключение попапа эмодзи
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// Переключение попапа загрузки файлов/опросов
const toggleFileUploadPopout = () => {
  showFileUploadPopout.value = !showFileUploadPopout.value;

  if (showFileUploadPopout.value) {
    const button = document.querySelector(".fa-plus-circle");
    if (button) {
      const rect = button.getBoundingClientRect();
      fileUploadPopoutPosition.value = {
        top: rect.top - 10,
        left: rect.left,
      };
    }

    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
};

// Обработчик кликов вне попапа
const handleClickOutside = (event) => {
  if (
    !event.target.closest(".input-buttons-left") &&
    !event.target.closest(".file-upload-popout")
  ) {
    showFileUploadPopout.value = false;
    document.removeEventListener("click", handleClickOutside);
  }
};

// Обработка нажатия клавиш
const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Отправка сообщения
const sendMessage = () => {
  if (!editor.value) return;

  // Получаем HTML-содержимое редактора
  const htmlContent = editor.value.getHTML();

  // Оборачиваем содержимое в <span>
  const wrappedMessage = `<span class="message-text">${htmlContent}</span>`;

  console.log("Отправлено сообщение:", wrappedMessage);

  // Отправляем сообщение наверх
  emit("sendMessage", wrappedMessage);

  // Очищаем поле ввода
  editor.value.commands.clearContent();
};
// Открытие создателя опросов
const openPollCreator = () => {
  showPollCreator.value = true;
  showFileUploadPopout.value = false;
};

// Закрытие создателя опросов
const closePollCreator = () => {
  showPollCreator.value = false;
};

// Публикация опроса
const handlePublishPoll = (pollData) => {
  console.log("Опрос опубликован:", pollData);
  emit("publishPoll", pollData);
};

// Подключаем обработчик клавиатуры
onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  setTimeout(adjustHeight, 100);
});

// Отключаем обработчик перед размонтированием
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>

.chat-input {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #313338;
    border-top: 1px solid #202225;
  }

  .editor-wrapper {
  flex: 1;
  position: relative;
  }

  .input-buttons-left,
  .input-buttons-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .input-buttons-left {
    margin-right: 10px;
  }

  .input-buttons-right {
    margin-left: 10px;
  }

  .input-buttons-left i,
  .input-buttons-right i {
    color: #b9bbbe;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .input-buttons-left i:hover,
  .input-buttons-right i:hover {
    color: #ffffff;
  }

  .input-container {
  flex: 1;
  min-height: 44px;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #40444b;
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  resize: none;
  box-sizing: border-box;
  display: block;
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

.input-container:focus {
  outline: none;
}

  .input-container:empty::before {
    content: attr(placeholder);
    color: #72767d;
    position: absolute;
    white-space: nowrap;
    pointer-events: none;
  }

  .input-container:focus {
    outline: none;
  }

  .input-container::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  .input-container::-webkit-scrollbar-track {
    background-color: #2b2d31;
    border-radius: 8px;
    border: 4px solid transparent;
    /* Создаем эффект отступа */
    background-clip: padding-box;
    /* Отступы от границ */
  }

  .input-container::-webkit-scrollbar-thumb {
    background-color: #1a1b1e;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: padding-box;
    /* Чтобы границы выглядели аккуратно */
    min-height: 40px;
    /* Минимальная высота ползунка */
  }

  .input-container::-webkit-scrollbar-thumb:hover {
    background-color: #25272a;
    /* Цвет ползунка при наведении */
  }
  .input-container::placeholder {
  position: absolute;
  color: #72767d;
  font-size: 16px;
  pointer-events: none;
  }
  ::v-deep(.tiptap p.is-empty::before) {
  content: attr(data-placeholder);
  color: #72767d;
  font-size: 16px;
  pointer-events: none;
  user-select: none;
  position: absolute;
}


</style>