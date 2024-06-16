<template>
  <v-container class="bg-ct-blue-600 min-h-screen">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="text-4xl lg:text-6xl text-center font-semibold text-ct-yellow-600 mb-6">
          Welcome Back
        </h1>
        <h2 class="text-lg text-center mb-6 text-ct-dark-200">Verify the Authentication Code</h2>
        <v-card
          class="max-w-md mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <h2 class="text-center text-3xl font-semibold text-ct-yellow-600">
            Two-Factor Authentication
          </h2>
          <p class="text-center text-sm text-ct-dark-200">
            Open the two-step verification app on your mobile device to get your verification code.
          </p>
          <v-form @submit.prevent="onSubmitHandler">
            <v-text-field
              v-model="token"
              label="Authentication Code"
              outlined
              dense
              required
            ></v-text-field>
            <v-btn color="ct-blue-600" :loading="requestLoading" type="submit" class="mt-4">
              Authenticate
            </v-btn>
          </v-form>
          <p v-if="error" class="text-center text-sm text-red-500 mt-2">{{ error }}</p>
          <span class="block text-center mt-4">
            <router-link to="/login" class="text-ct-blue-600">Back to basic login</router-link>
          </span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@kyvg/vue3-notification'
import { useAuthStore } from '@/stores/auth'
import Api from '@/API/api'

export default {
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const token = ref('')
    const { notify } = useNotification()
    const requestLoading = ref(false)
    const error = ref('')

    const validate2fa = async (token) => {
      try {
        const response = await Api.post('/auth/otp/validate', {
          token: token.value,
          user_id: authStore.user?.id
        })

        const otpValid = response.data.otp_valid
        if (otpValid) {
          authStore.setUser({
            ...authStore.user,
            otp_enabled: true,
            otp_verified: true
          })
          router.push('/profile')
        } else {
          error.value = 'Invalid authentication code. Please try again.'
        }
      } catch (error) {
        console.error(error)
        error.value = 'An error occurred while validating the code. Please try again later.'
      } finally {
        requestLoading.value = false
      }
    }

    const onSubmitHandler = async () => {
      if (token.value) {
        requestLoading.value = true
        await validate2fa(token)
      } else {
        error.value = 'Please enter your authentication code.'
      }
    }

    return {
      token,
      requestLoading,
      error,
      onSubmitHandler
    }
  }
}
</script>
