<template>
  <div class="register-container">
    <div class="register-card">
      <div class="section-header">
        <div class="header-content">
          <h1 class="register-title">Sign up</h1>
        </div>
      </div>
      
      <div class="section-body">
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <InputField
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="Enter your username"
              :has-error="showErrors && !!usernameError"
              :error-message="usernameError"
            />
          </div>
          
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
            style="margin-top: 16px;"
          >
            {{ isSubmitting ? 'Signing up...' : 'Sign up' }}
          </Button>
        </form>
        
        <div class="login-link">
          Already have an account? 
          <router-link to="/login" class="link">Sign in</router-link>
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
import { API_BASE_URL } from '@/config/api'

const router = useRouter()
const { notify } = useNotification()

const formData = reactive({
  username: '',
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const showErrors = ref(false)

const usernameError = computed(() => {
  if (!formData.username) {
    return 'Username is required'
  }
  return ''
})

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
  return usernameError.value || emailError.value || passwordError.value
})

const validateForm = () => {
  if (hasAnyErrors.value) {
    showErrors.value = true
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }
  isSubmitting.value = true
  try {
    const { data, error } = await fetcherWrapper(
       `${API_BASE_URL}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          user: {
            username: formData.username,
            email: formData.email,
            password: formData.password
          }
        }
      }
    )
    if (error) throw new Error(error)
    notify({ message: 'Registration successful! Please sign in.', type: 'success' })
    router.push('/login')
  } catch (error) {
    notify({ message: error.message || 'Registration failed. Please try again.', type: 'error' })
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
  height: 496px;
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
  height: 396px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.register-title {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #333333;
  margin: 0;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.register-subtitle {
  font-size: 16px;
  color: #666666;
  margin: 0 0 32px 0;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 65px;
}

.form-label {
  font-size: 0.875rem; /* 14px */
  font-weight: 600;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.submit-button {
  margin-top: 16px;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem; /* 14px */
  color: #666666;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.link {
  color: #018FE1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: #009595;
}

@media (max-width: 768px) {
  .register-card {
    width: 100%;
    max-width: 400px;
    height: auto;
    min-height: 450px;
    padding: 16px 8px;
    margin: 16px;
  }
  
  .section-header {
    width: 100%;
    height: 80px;
    padding: 0;
  }
  
  .header-content {
    width: 100%;
    height: 20px;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
  }
  
  .section-body {
    width: 100%;
    height: auto;
    min-height: 350px;
    padding: 15px 24px;
    box-sizing: border-box;
  }
  
  .register-title {
    font-size: 1.75rem; /* 28px */
  }
  
  .register-form {
    gap: 1rem;
  }
  
  .form-group {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .register-card {
    max-width: 320px;
    padding: 16px 8px;
    margin: 12px;
  }
  
  .section-header {
    height: 60px;
    padding: 0;
  }
  
  .header-content {
    height: 18px;
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
  }
  
  .section-body {
    min-height: 300px;
    padding: 15px 12px;
    box-sizing: border-box;
  }
  
  .register-title {
    font-size: 1.5rem; /* 24px */
  }
  
  .register-form {
    gap: 0.875rem;
  }
}
</style> 