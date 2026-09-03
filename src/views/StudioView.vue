<template>
  <div class="studio-view-container">
    <PenqraftStudio />
  </div>
</template>

<script setup>
import PenqraftStudio from '../islands/PenqraftStudio.vue'
</script>

<style scoped>
.studio-view-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #090611;
  display: flex;
  flex-direction: column;
}
</style>
