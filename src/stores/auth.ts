import { defineStore } from 'pinia';
import Api from "@/API/api";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      user: null
    }
  },
  persist: true,

  getters: {
    loggedIn(state) {
      return !!state?.user?.id;
    },
    authUser(state) {
      return state.user;
    },
  },

  actions: {
    async allowed() {
      try {
        const response = await Api.get('/allowed')
        console.log("allowed", response)
      } catch (error) {
        this.user = null;
      }
    },
    checkAuth() {
      const authToken = getCookie('auth_token');
      if (authToken) {
      } else {
        this.user = null;
      }
    },
    async login(payload: { email: string; password: string; }) {
      const response = await Api.post('/auth/login', payload)

      this.setUser(
        {
          name: response.name,
          otp_enabled: response.otp_enabled,
          otp_verified: response.otp_enabled,
          email: response.email,
          id: response.id
        })
      return response.otp_enabled
    },
    async logout() {
      try {
        this.user = null;
        await Api.get('/auth/logout')
      } catch (error) {
        this.user = null;
        console.log(error)
      }
    },
    setUser(value: { name: string; otp_enabled: boolean; otp_verified: boolean; email: string; id: number; } | null) {
      this.user = value;
    },
  }
})