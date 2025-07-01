<template>
  <div class="register-container">
    <div class="register-card">
      <div class="section-header">
        <div class="header-content">
          <h1 class="register-title">Sign in</h1>
        </div>
      </div>
      
      <div class="section-body">
        <form @submit.prevent="handleLogin" class="register-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <InputField
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              :has-error="showErrors && !!emailError"
              :error-message="emailError"
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <InputField
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              :has-error="showErrors && !!passwordError"
              :error-message="passwordError"
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="medium"
            :disabled="isSubmitting"
            :loading="isSubmitting"
        
          >
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>
        
        <div class="login-link">
          Don't have an account? 
          <router-link to="/register" class="link">Sign up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '../components/InputField.vue'
import Button from '../components/Button.vue'
import { fetcherWrapper } from '@/composables/useFetcherWrapper'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { notify } = useNotification()

const formData = reactive({
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const showErrors = ref(false)
const loginError = ref('')

const emailError = computed(() => {
  if (!formData.email) {
    return 'Email is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    return 'Invalid email format'
  }
  return ''
})

const passwordError = computed(() => {
  if (!formData.password) {
    return 'Password is required'
  } else if (formData.password.length < 8) {
    return 'Password must be at least 8 characters'
  } else if (!/\d/.test(formData.password)) {
    return 'Password must include at least one number'
  }
  return ''
})

const hasAnyErrors = computed(() => {
  return emailError.value || passwordError.value
})

const validateForm = () => {
  if (hasAnyErrors.value) {
    showErrors.value = true
    return false
  }
  return true
}

const handleLogin = async () => {
  loginError.value = ''
  if (!validateForm()) {
    return
  }
  isSubmitting.value = true
  try {
    const { data, error } = await fetcherWrapper(
      'https://api-3281216083-arvancloud-challenge.apps.ir-central1.arvancaas.ir/api/users/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          user: {
            email: formData.email,
            password: formData.password
          }
        }
      }
    )
    if (error) throw new Error(error)
    localStorage.setItem('token', data.user.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    notify({ message: 'Login successful!', type: 'success' })
    router.push('/')
  } catch (error) {
    loginError.value = error.message || 'Login failed. Please try again.'
    notify({ message: loginError.value, type: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 16px 0px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 480px;
  height: 410px;
  display: flex;
  flex-direction: column;
}

.section-header {
  width: 480px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  width: 432px;
  height: 24px;
  display: flex;
  align-items: center;
}

.section-body {
  width: 480px;
  height: 310px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
}

.register-title {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #333333;
  margin: 0;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}


.form-label {
  font-size: 0.875rem; /* 14px */
  font-weight: 600;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem; /* 14px */
  color: #666666;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.link {
  color: #667eea;
  text-decoration: underline;
  margin-left: 4px;
}
</style> 