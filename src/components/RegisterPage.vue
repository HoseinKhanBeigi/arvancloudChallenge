<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Create Account</h1>
      <p class="register-subtitle">Please fill in the information below to create your account</p>
      
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <InputField
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Enter your username"
            :has-error="errors.username"
            :error-message="errors.username"
            @blur="validateField('username')"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <InputField
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            :has-error="errors.email"
            :error-message="errors.email"
            @blur="validateField('email')"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <InputField
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            :has-error="errors.password"
            :error-message="errors.password"
            @blur="validateField('password')"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <InputField
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            :has-error="errors.confirmPassword"
            :error-message="errors.confirmPassword"
            @blur="validateField('confirmPassword')"
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="login-link">
        Already have an account? 
        <a href="#" @click.prevent="goToLogin" class="link">Sign in here</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import InputField from './InputField.vue'

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)

const validateField = (fieldName) => {
  const value = formData[fieldName]
  
  switch (fieldName) {
    case 'username':
      if (!value.trim()) {
        errors.username = 'Username is required'
      } else if (value.length < 3) {
        errors.username = 'Username must be at least 3 characters'
      } else {
        errors.username = ''
      }
      break
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(value)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
      break
      
    case 'password':
      if (!value) {
        errors.password = 'Password is required'
      } else if (value.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      } else {
        errors.password = ''
      }
      break
      
    case 'confirmPassword':
      if (!value) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match'
      } else {
        errors.confirmPassword = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('username')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  
  return !errors.username && !errors.email && !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Registration successful:', formData)
    // Here you would typically make an API call to register the user
    // and handle the response accordingly
    
    alert('Account created successfully!')
    
    // Reset form
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
    
  } catch (error) {
    console.error('Registration failed:', error)
    alert('Registration failed. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const goToLogin = () => {
  // Navigate to login page (implement routing later)
  console.log('Navigate to login page')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  width: 100%;
  max-width: 480px;
}

.register-title {
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 8px 0;
  text-align: center;
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
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.submit-button {
  background: linear-gradient(135deg, #018FE1 0%, #009595 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(1, 143, 225, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .register-card {
    padding: 32px 24px;
    margin: 16px;
  }
  
  .register-title {
    font-size: 28px;
  }
  
  .register-subtitle {
    font-size: 14px;
  }
}
</style> 