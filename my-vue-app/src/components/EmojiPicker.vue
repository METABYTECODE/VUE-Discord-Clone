<template>
  <div v-if="isOpen" class="emoji-picker-overlay" @click.self="close">
    <div class="emoji-picker">
      <div class="emoji-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          class="emoji-tab"
          :class="{ active: activeTab === tab.name }"
          role="tab"
          :aria-selected="activeTab === tab.name"
          @click="activeTab = tab.name"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>
      <div class="emoji-search">
        <input type="text" v-model="searchQuery" placeholder="Найдите идеальный эмодзи" />
        <i class="fas fa-search"></i>
      </div>
      <div class="emoji-content">
        <div v-if="activeTab === 'emoji'">
          <div class="emoji-category">
            <h4>ЧАСТО ИСПОЛЬЗУЕМЫЕ</h4>
            <div class="emoji-grid">
              <button
                v-for="emoji in frequentlyUsed"
                :key="emoji"
                class="emoji-wrapper"
                @click="selectEmoji(emoji)"
              >
                <div class="emoji">{{ emoji }}</div>
              </button>
            </div>
          </div>
          <div class="emoji-category">
            <h4>СТАНДАРТНЫЕ ЭМОДЗИ</h4>
            <div class="emoji-grid">
              <button
                v-for="emoji in filteredEmojis"
                :key="emoji"
                class="emoji-wrapper"
                @click="selectEmoji(emoji)"
              >
                <div class="emoji">{{ emoji }}</div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'stickers'">
          <div class="emoji-category">
            <h4>СТИКЕРЫ</h4>
            <div class="sticker-grid">
              <button
                v-for="sticker in filteredStickers"
                :key="sticker"
                class="sticker-wrapper"
                @click="selectSticker(sticker)"
              >
                <img :src="sticker" class="sticker" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'gifs'">
          <div class="emoji-category">
            <h4>GIF-изображения</h4>
            <div class="gif-masonry">
              <template v-for="(gif, index) in filteredGifs" :key="gif">
                <div v-if="index % 3 === 0" class="gif-large">
                  <button class="gif-wrapper" @click="selectGif(gif)">
                    <img :src="gif" class="gif" loading="lazy" />
                  </button>
                </div>
                <div v-else class="gif-small">
                  <button class="gif-wrapper" @click="selectGif(gif)">
                    <img :src="gif" class="gif" loading="lazy" />
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmojiPicker",
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      activeTab: "emoji",
      searchQuery: "",
      tabs: [
        { name: "emoji", label: "Эмодзи", icon: "far fa-smile" },
        { name: "stickers", label: "Стикеры", icon: "fas fa-sticky-note" },
        { name: "gifs", label: "GIF", icon: "fas fa-film" },
      ],
      frequentlyUsed: ["⭐", "📕", "🟦", "🟩", "🟨", "👍", "✅", "❤️", "❤️"],
      allEmojis: ["😂", "🤣", "😍", "😭", "😎", "😡", "😱", "👀", "🔥", "💩"],
      stickers: [
        "https://media1.tenor.com/m/L0SoPurrlEgAAAAC/spongebob-squarepants.gif",
        "https://media1.tenor.com/m/bNFnZSdWcCUAAAAC/momo-ayase-dandadan.gif",
      ],
      gifs: [
        "https://media1.tenor.com/m/L0SoPurrlEgAAAAC/spongebob-squarepants.gif",
        "https://media1.tenor.com/m/bNFnZSdWcCUAAAAC/momo-ayase-dandadan.gif",
        "https://media1.tenor.com/m/obudPDuNJo8AAAAC/dandadan-momo-ayase.gif",
        "https://media1.tenor.com/m/l0HOaQnBiscAAAAC/anime-dandadan.gif",
        "https://media.tenor.com/L0SoPurrlEgAAAAC/spongebob-squarepants.gif",
        "https://media1.tenor.com/m/P7fsIu00v04AAAAd/the-boys-osrs.gif",
      ],
    };
  },
  computed: {
    filteredEmojis() {
      return this.allEmojis.filter(emoji =>
        emoji.includes(this.searchQuery)
      );
    },
    filteredStickers() {
      return this.stickers.filter(sticker =>
        sticker.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredGifs() {
      return this.gifs.filter(gif =>
        gif.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    selectEmoji(emoji) {
      if (!this.frequentlyUsed.includes(emoji)) {
        this.frequentlyUsed.unshift(emoji);
        if (this.frequentlyUsed.length > 9) {
          this.frequentlyUsed.pop();
        }
      }
      this.$emit("select", emoji);
    },
    selectSticker(sticker) {
      this.$emit("select", sticker);
    },
    selectGif(gif) {
      this.$emit("select", gif);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Оверлей */
.emoji-picker-overlay {
  position: absolute;
  bottom: 76px;
  right: 97px;
  height: 498px;
}

/* Основной контейнер */
.emoji-picker {
  background: #2b2d31;
  width: 498px;
  height: 498px; /* Фиксированная высота */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Скрываем переполнение */
}

/* Вкладки */
.emoji-tabs {
  display: flex;
  border-bottom: 1px solid #3a3c43;
  flex-shrink: 0; /* Запрещаем уменьшение высоты */
}

.emoji-tab {
  flex: 1;
  padding: 10px;
  background: #3c3f45;
  color: #b9bbbe;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease;
}
.emoji-tab.active {
  background: #4f545c;
  color: white;
  font-weight: bold;
  border-bottom: 2px solid white; /* Подчеркивание активной вкладки */
}

/* Поиск */
.emoji-search {
  position: relative;
  padding: 8px;
  background: #3c3f45;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* Запрещаем уменьшение высоты */
}
.emoji-search input {
  flex: 1;
  padding: 6px 10px;
  background: #35373c;
  border: none;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}
.emoji-search input:focus {
  background: #4f545c; /* Более темный цвет при фокусе */
}
.emoji-search i {
  margin-left: 10px;
  color: #b9bbbe;
}

/* Контейнер с контентом */
.emoji-content {
  flex: 1; /* Занимает оставшееся пространство */
  overflow-y: auto;
  padding: 10px;
}

.emoji-content::-webkit-scrollbar {
  display: none; /* Для Chrome, Safari и Edge */
}

/* Категории */
.emoji-category h4 {
  color: #b9bbbe;
  font-size: 12px;
  margin-bottom: 5px;
}

/* Эмодзи */
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 4px;
}
.emoji-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s ease;
}
.emoji-wrapper:hover {
  background: #4f545c;
  border-radius: 8px;
}
.emoji {
  font-size: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Стикеры */
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
}
/* ✅ Фикс багов с размерами стикеров */
.sticker-wrapper {
  width: 96px;
  height: 96px;
  border: none;
  background: #2b2d31;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.sticker-wrapper:hover {
  transform: scale(0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Добавляем тень */
}

/* ✅ Теперь стикеры всегда 96x96px, не обрезаются и не сжимаются */
.sticker {
  width: 96px; /* Фиксируем размер в 96px */
  height: 96px; /* Фиксируем размер в 96px */
  object-fit: cover; /* Оставляем пропорции и полностью заполняем блок */
  display: block; /* Убираем возможные отступы */
  border-radius: 4px;
  background: #4f545c;
}


/* GIF */
.gif-masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 100%; /* Ограничиваем высоту */
  overflow-y: auto; /* Добавляем прокрутку, если контент выходит за пределы */
}

.gif-masonry::-webkit-scrollbar {
  display: none; /* Для Chrome, Safari и Edge */
}

.gif-large {
  grid-column: span 2; /* Большой занимает две колонки */
  grid-row: span 2; /* И две строки */
  height: 200px;
  display: flex; /* Добавляем для центрирования */
  align-items: center; /* Центрируем вертикально */
  justify-content: center; /* Центрируем горизонтально */
}
.gif-small {
  height: 96px;
  display: flex; /* Добавляем для центрирования */
  align-items: center; /* Центрируем вертикально */
  justify-content: center; /* Центрируем горизонтально */
}

.gif-wrapper {
  width: 100%;
  height: 100%;
  border: none;
  background: #2b2d31; /* Фон совпадает с основным фоном */
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex; /* Добавляем для центрирования */
  align-items: center; /* Центрируем вертикально */
  justify-content: center; /* Центрируем горизонтально */
  overflow: hidden; /* Скрываем обрезанные части изображения */
  border-radius: 4px; /* Закругляем углы */
}
.gif-wrapper:hover {
  transform: scale(0.9);
}
.gif {
  width: 100%; /* Изображение занимает весь блок */
  height: 100%; /* Изображение занимает весь блок */
  object-fit: cover; /* Обрезаем изображение, чтобы оно заполнило блок */
  border-radius: 4px; /* Сохраняем закругленные углы */
}
</style>
