<template>
  <div>
    <h3 class="text-2xl font-semibold">Mobile App Authentication (2FA)</h3>
    <h1 class="text-2xl font-semibold">Profile Page</h1>
    <div class="mt-8">
      <p class="mb-4">ID: {{ user?.id }}</p>
      <p class="mb-4">Name: {{ user?.name }}</p>
      <p class="mb-4">Email: {{ user?.email }}</p>
    </div>
    <p class="mb-4">Secure your account with TOTP two-factor authentication.</p>
    <template v-if="user?.otp_enabled">
      <v-btn color="purple" dark @click="disableTwoFactorAuth(user?.id)"> Disable 2FA </v-btn>
    </template>
    <template v-else>
      <v-btn color="blue" dark @click="generateQrCode({ user_id: user?.id, email: user?.email })">
        Setup 2FA
      </v-btn>
    </template>

    <v-dialog v-model="openModal" max-width="1200">
      <TwoFactorAuth
        v-if="openModal"
        :base32="secret.base32"
        :otpauth_url="secret.otpauth_url"
        :user_id="user.id"
        @close="openModal = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@kyvg/vue3-notification'
import TwoFactorAuth from '@/components/TwoFactorAuth.vue'
import Api from '@/API/api'

export default {
  components: {
    TwoFactorAuth
  },
  setup() {
    const authStore = useAuthStore()
    const { authUser } = authStore
    const { notify } = useNotification()
    const user = computed(() => authStore.user)
    const secret = ref({
      otpauth_url: '',
      base32: ''
    })
    const openModal = ref(false)
    const generateQrCode = async ({ user_id, email }) => {
      try {
        const response = await Api.post('/auth/otp/generate', {
          user_id,
          email
        })

        if (response.base32) {
          openModal.value = true
          secret.value = {
            base32: response.base32,
            otpauth_url: response.otpauth_url
          }
        }
      } catch (error) {
        const resMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          error?.toString()
        notify({
          title: 'Error on QR generation',
          text: resMessage,
          type: 'error'
        })
      }
    }

    const disableTwoFactorAuth = async (user_id) => {
      try {
        const data = await Api.post('/auth/otp/disable', { user_id })
        await authStore.setUser({
          ...data.user
        })

        notify({
          title: 'Two Factor Authentication Disabled',
          type: 'warn'
        })
      } catch (error) {
        const resMessage = error?.response?.data?.message || error?.message || error?.toString()
        notify({
          title: 'Error disabling Two Factor Authentication',
          text: resMessage,
          type: 'error'
        })
      }
    }

    const closeModal = () => {
      openModal.value = false
    }

    return {
      authUser,
      secret,
      openModal,
      generateQrCode,
      disableTwoFactorAuth,
      closeModal,
      user
    }
  }
}
</script>

<style>
/* Add any necessary styles */
</style>
