<template>
  <div
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-[#222] bg-opacity-50"
  >
    <div class="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
      <div class="relative bg-white rounded-lg shadow pa-3">
        <h3 class="text-xl font-semibold text-gray-900 p-4 border-b">
          Two-Factor Authentication (2FA)
        </h3>
        <div class="pa-6">
          <h4 class="textClass border-b mb-2">Configuring Google Authenticator or Authy</h4>
          <ul class="">
            <li>Install Google Authenticator (iOS - Android) or Authy (iOS - Android).</li>
            <li>In the authenticator app, select the "+" icon.</li>
            <li>
              Select "Scan a barcode (or QR code)" and use the phone's camera to scan this barcode.
            </li>
          </ul>
          <div>
            <div class="flex justify-center">
              <img class="block w-64 h-64 object-contain" :src="qrcodeUrl" alt="QR Code" />
            </div>
          </div>
          <div>
            <h4 class="">Or Enter This Code Into Your App</h4>
            <p class="text-sm border-b mb-2">SecretKey: {{ base32 }} (Base32 encoded)</p>
          </div>
          <div>
            <h4 class="textClass">Verify the Code</h4>
          </div>
          <form @submit="onSubmitHandler">
            <input
              v-model="token"
              class="bg-gray-500 border ceborder-gray-900 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Authentication Code"
            />
            <!-- <p class="mt-2 text-xs text-red-600">
              {{ errors.token ? errors.token.message : null }}
            </p> -->
            <div class="flex items-center space-x-2 rounded-b mt-3">
              <v-btn variant="outlined" @click="closeModal" class="mr-3">Close</v-btn>
              <v-btn variant="outlined" type="submit" class="">Verify & Activate</v-btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import { useAuthStore } from '@/stores/auth'
import Api from '@/API/api'
import { useNotification } from '@kyvg/vue3-notification'

export default {
  props: {
    otpauth_url: {
      type: String,
      required: true
    },
    base32: {
      type: String,
      required: true
    },
    user_id: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const { otpauth_url, user_id } = props
    const token = ref('')
    const qrcodeUrl = ref('')
    const store = useAuthStore()
    const { notify } = useNotification()

    const verifyOtp = async () => {
      try {
        if (token.value?.length == 6) {
          const data = await Api.post('/auth/otp/verify', {
            token: token.value,
            user_id
          })
          await store.setUser(data.user)
          notify({
            title: 'Successful OTP verification'
          })
          emit('close')
        } else {
          notify({
            type: 'error',
            title: 'Error on OTP verification',
            text: 'Please enter a 6 digit OTP code'
          })
        }
      } catch (error) {
        const resMessage = error?.toString()
        notify({
          type: 'error',
          title: 'Error on OTP verification',
          text: resMessage
        })
      }
    }

    const onSubmitHandler = (event) => {
      event.preventDefault()
      verifyOtp()
    }

    const closeModal = () => {
      emit('close')
    }

    onMounted(() => {
      QRCode.toDataURL(otpauth_url).then((url) => {
        qrcodeUrl.value = url
      })
    })

    return {
      token,
      qrcodeUrl,
      onSubmitHandler,
      closeModal
    }
  }
}
</script>

<style>
.textClass {
  font-size: 1.25rem; /* Example font size */
  color: #2b6cb0; /* Example text color */
  font-weight: 500; /* Example font weight */
}
</style>
