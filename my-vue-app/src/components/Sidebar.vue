<template>
    <div class="sidebar">
      <div class="pm-message"></div>
      <div class="server-icon"></div>
      <div class="server-icon"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
  };
  </script>
  
  <style scoped>
.sidebar {
  width: 72px;
  min-width: 72px;
  background-color: #1e1f22;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.server-icon {
  width: 48px;
  height: 48px;
  margin: 0 0 8px;
  background-color: #5865f2;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color .1s ease-out, color .1s ease-out;
}

.pm-message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 0 8px;
  background-color: #5865f2;
  border-radius: 25%;
  cursor: pointer;
  transition: background-color .1s ease-out, color .1s ease-out;
}

.server-icon:hover {
  background-color: #4752c4;
}
  </style>
  