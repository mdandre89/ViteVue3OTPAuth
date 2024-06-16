<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loggedIn = computed(() => authStore.loggedIn)
const currentYear = ref(new Date().getFullYear())

async function logout() {
  await authStore.logout()
  window.location.reload()
}
</script>

<template>
  <v-app id="app">
    <v-app-bar app color="indigo">
      <v-toolbar-title class="white--text">My Website</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" to="/">Home</v-btn>
      <div v-if="!loggedIn">
        <v-btn class="white--text">
          <router-link to="/login" class="white--text">Login</router-link>
        </v-btn>
        <v-btn class="white--text">
          <router-link to="/register" class="white--text">Register</router-link>
        </v-btn>
      </div>
      <v-btn v-else class="white--text" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>

    <v-footer app color="indigo" dark>
      <v-container>
        <span class="white--text">&copy; {{ currentYear }} My Website</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style>
.v-application {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
