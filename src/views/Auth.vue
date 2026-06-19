<template>
    <div class="auth-page">
        <div class="container">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-shield-lock"></i> Account Access
            </h1>
            <div class="golden-divider"></div>

            <template v-if="authStore.isAuthenticated">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow animated-card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0"><i class="bi bi-person-check-fill"></i> Signed In</h5>
                            </div>
                            <div class="card-body">
                                <div class="text-center mb-4">
                                    <i class="bi bi-person-circle auth-avatar text-warning"></i>
                                    <h3 class="text-primary">{{ authStore.profile?.fullname || authStore.user?.email }}</h3>
                                    <p class="text-muted mb-0">{{ authStore.user?.email }}</p>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="p-3 bg-light rounded profile-field">
                                            <small class="text-muted d-block">Username</small>
                                            <strong>{{ authStore.profile?.username || 'Not set' }}</strong>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="p-3 bg-light rounded profile-field">
                                            <small class="text-muted d-block">Role</small>
                                            <strong>{{ authStore.profile?.role || 'guest' }}</strong>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="p-3 bg-light rounded profile-field">
                                            <small class="text-muted d-block">UID</small>
                                            <strong class="text-break">{{ authStore.user?.uid }}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-grid gap-2 mt-4">
                                    <button @click="logout" class="btn btn-outline-primary shine-effect">
                                        <i class="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="row justify-content-center">
                    <div class="col-lg-5">
                        <div class="card shadow animated-card">
                            <div class="card-header bg-primary text-white">
                                <div class="d-flex justify-content-between align-items-center gap-2">
                                    <h5 class="mb-0">
                                        <i :class="isLogin ? 'bi bi-box-arrow-in-right' : 'bi bi-person-plus-fill'"></i>
                                        {{ isLogin ? 'Login' : 'Register' }}
                                    </h5>
                                    <button @click="toggleMode" class="btn btn-light btn-sm shine-effect">
                                        {{ isLogin ? 'Create Account' : 'Login' }}
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="submitAuth">
                                    <div v-if="!isLogin" class="mb-3">
                                        <label class="form-label"><i class="bi bi-person-fill"></i> Full Name</label>
                                        <input v-model.trim="form.fullname" type="text" class="form-control" required>
                                    </div>

                                    <div v-if="!isLogin" class="mb-3">
                                        <label class="form-label"><i class="bi bi-at"></i> Username</label>
                                        <input v-model.trim="form.username" type="text" class="form-control" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label"><i class="bi bi-envelope-fill"></i> Email</label>
                                        <input v-model.trim="form.email" type="email" class="form-control" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label"><i class="bi bi-key-fill"></i> Password</label>
                                        <input v-model="form.password" type="password" class="form-control" minlength="6" required>
                                    </div>

                                    <div v-if="errorMessage" class="alert alert-danger fade-show">
                                        <i class="bi bi-exclamation-circle-fill"></i> {{ errorMessage }}
                                    </div>

                                    <div v-if="successMessage" class="alert alert-success fade-show">
                                        <i class="bi bi-check-circle-fill"></i> {{ successMessage }}
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100 shine-effect" :disabled="isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        {{ isLogin ? 'Login' : 'Register' }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
    fullname: '',
    username: '',
    email: '',
    password: ''
})

const toggleMode = () => {
    isLogin.value = !isLogin.value
    errorMessage.value = ''
    successMessage.value = ''
}

const resetForm = () => {
    form.value = {
        fullname: '',
        username: '',
        email: '',
        password: ''
    }
}

const submitAuth = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        if (isLogin.value) {
            await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
            successMessage.value = 'Login successful.'
        } else {
            const credential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
            await setDoc(doc(db, 'users', credential.user.uid), {
                fullname: form.value.fullname,
                username: form.value.username,
                email: credential.user.email,
                role: 'guest',
                uid: credential.user.uid
            })
            successMessage.value = 'Account created successfully.'
        }

        resetForm()
        await router.push('/')
    } catch (error) {
        errorMessage.value = getFriendlyAuthError(error)
    } finally {
        isLoading.value = false
    }
}

const logout = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        await authStore.logout()
        await router.push('/')
    } catch (error) {
        errorMessage.value = getFriendlyAuthError(error)
    } finally {
        isLoading.value = false
    }
}

const getFriendlyAuthError = (error) => {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect email or password.',
        'auth/invalid-credential': 'Incorrect email or password.'
    }

    return messages[error?.code] || 'Authentication failed. Please try again.'
}
</script>

<style scoped>
.auth-page {
    min-height: calc(100vh - 140px);
}

.auth-avatar {
    font-size: 6rem;
    filter: drop-shadow(0 0 12px #d4af3780);
}

.profile-field {
    border: 1px solid rgba(212, 175, 55, 0.18);
}

.fade-show {
    animation: fadeInUp 0.5s ease-out;
}

.btn:disabled {
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
</style>
