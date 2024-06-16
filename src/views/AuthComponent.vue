<template>
  <v-row>
    <v-card>
      <v-tabs v-model="activeTab" bg-color="var(--aws-dark-blue)">
        <v-tab
          value="signIn"
          :class="{
            'primary--text': activeTab === 'signIn',
            'white--text': activeTab !== 'signIn'
          }"
        >
          Sign In
        </v-tab>
        <v-tab
          value="register"
          :class="{
            'primary--text': activeTab === 'register',
            'white--text': activeTab !== 'register'
          }"
        >
          Register
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <v-window-item value="signIn">
            <v-form @submit.prevent="signIn">
              <v-text-field v-model="signInData.email" label="Email" required></v-text-field>
              <v-text-field
                v-model="signInData.password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary">Sign In</v-btn>
            </v-form>
          </v-window-item>

          <v-window-item value="register">
            <v-form @submit.prevent="register">
              <v-text-field v-model="registerData.name" label="Name" required></v-text-field>
              <v-text-field v-model="registerData.email" label="Email" required></v-text-field>
              <v-text-field
                v-model="registerData.password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="success">Register</v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import Api from '@/API/api'
import { useAuthStore } from '@/stores/auth'

export default {
  props: {
    defaultTab: {
      type: String,
      default: 'signIn',
      validator: (value) => value === 'signIn' || value === 'register'
    }
  },
  data() {
    return {
      activeTab: this.defaultTab,
      signInData: {
        email: '',
        password: ''
      },
      registerData: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn() {
      try {
        const authStore = useAuthStore()
        const otpEnabled = await authStore.login(this.signInData)

        this.$notify({
          title: 'Two Factor Authentication Disabled',
          type: 'warn'
        })

        if (otpEnabled) {
          this.$router.push('/login/validateOtp')
        } else {
          this.$router.push('/profile')
        }
      } catch (error) {
        this.$notify({
          title: 'Error on Signin',
          type: 'warn'
        })
      }
    },
    async register() {
      try {
        const response = await Api.post('/auth/register', this.registerData)
        if (response.success) {
          this.activeTab = 'signIn'
        }
      } catch (error) {
        this.$notify({
          title: 'Error on register',
          type: 'warn',
          text: error
        })
      }
    }
  }
}
</script>

<style></style>
