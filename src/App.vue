<template>
  <div class="app-container">
    <div class="animated-bg"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-building float-icon"></i> GKI Menteng
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/news">
                <i class="bi bi-newspaper"></i> News
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/calendar">
                <i class="bi bi-calendar3"></i> Calendar
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/volunteers">
                <i class="bi bi-people-fill"></i> Volunteers
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">
                <i class="bi bi-info-circle"></i> About
              </router-link>
            </li>
            <li class="nav-item" v-if="authStore.profile?.role === 'admin'">
              <router-link class="nav-link" to="/admin">
                <i class="bi bi-shield-fill-check"></i> Admin
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/auth">
                <i class="bi bi-shield-lock"></i> Login/Register
              </router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <button @click="authStore.logout" class="btn btn-outline-light btn-sm nav-link shine-effect">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="main-content">
      <router-view />
    </div>
    <footer class="bg-dark text-white text-center py-3 mt-5">
      <div class="golden-divider my-3"></div>
      <p class="mb-0">&copy; 2024 GKI Menteng. All rights reserved. | <i class="bi bi-heart-fill text-warning"></i> Made with Love</p>
    </footer>
  </div>
</template>

<script setup>
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 20%, #d4af3705 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, #4a2c5e05 0%, transparent 20%);
  z-index: -1;
  animation: backgroundShift 20s infinite alternate;
}

@keyframes backgroundShift {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(20px, 20px) rotate(1deg); }
}

.main-content {
  margin-top: 80px;
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
}

.navbar-brand i {
  margin-right: 8px;
}
</style>