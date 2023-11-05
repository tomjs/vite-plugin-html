<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <a-button type="primary" @click="count++">count is {{ count }}</a-button>

    <div style="margin-top: 16px">
      <a-date-picker />
    </div>
    <div style="margin-top: 16px">
      <a-calendar />
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
