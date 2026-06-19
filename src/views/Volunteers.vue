<template>
    <div class="volunteers-page">
        <div class="container-fluid">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-people-fill"></i> Sunday Service Volunteers
            </h1>
            <div class="golden-divider"></div>

            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow animated-card">
                        <div class="card-header bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0"><i class="bi bi-person-badge"></i> Volunteer Schedule</h5>
                                <div>
                                    <button @click="showAll" class="btn btn-light btn-sm me-2 shine-effect">All Services</button>
                                    <button @click="filterByService('First Service')"
                                        class="btn btn-outline-light btn-sm me-2 shine-effect">First Service</button>
                                    <button @click="filterByService('Second Service')"
                                        class="btn btn-outline-light btn-sm shine-effect">Second Service</button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div v-if="filteredVolunteers.length > 0">
                                    <div v-for="(volunteer, index) in filteredVolunteers" :key="volunteer.id" class="col-md-3 mb-4">
                                        <div class="card h-100 text-center volunteer-card" :style="{ animationDelay: index * 0.1 + 's' }">
                                            <div class="card-body">
                                                <div class="volunteer-avatar-wrapper">
                                                    <img :src="volunteer.avatar" class="rounded-circle mb-3"
                                                        :alt="volunteer.name">
                                                </div>
                                                <h5 class="card-title">{{ volunteer.name }}</h5>
                                                <p class="text-primary mb-1"><i class="bi bi-person-badge"></i> {{ volunteer.role }}</p>
                                                <p class="text-muted mb-1"><i class="bi bi-clock"></i> {{ volunteer.service }}</p>
                                                <p class="text-muted small mb-0"><i class="bi bi-envelope"></i> {{ volunteer.contact }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="col-12">
                                    <p class="text-muted text-center mb-0">No volunteers registered yet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Volunteer Registration Form -->
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <div class="card shadow animated-card" style="animation-delay: 0.3s;">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="bi bi-person-plus"></i> Volunteer Registration</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="submitVolunteer">
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-person"></i> Full Name</label>
                                    <input type="text" v-model="form.name" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-envelope"></i> Email</label>
                                    <input type="email" v-model="form.email" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-person-badge"></i> Role</label>
                                    <select v-model="form.role" class="form-select" required>
                                        <option value="">Select Role</option>
                                        <option value="Worship Leader">Worship Leader</option>
                                        <option value="Worship Singer">Worship Singer</option>
                                        <option value="Usher">Usher</option>
                                        <option value="Greeter">Greeter</option>
                                        <option value="Sound Engineer">Sound Engineer</option>
                                        <option value="Multimedia">Multimedia</option>
                                        <option value="Children Ministry">Children Ministry</option>
                                        <option value="Prayer Team">Prayer Team</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-clock"></i> Preferred Service</label>
                                    <select v-model="form.service" class="form-select" required>
                                        <option value="">Select Service</option>
                                        <option value="First Service">First Service (07:00 AM)</option>
                                        <option value="Second Service">Second Service (10:00 AM)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"><i class="bi bi-image"></i> Avatar URL (optional)</label>
                                    <input type="url" v-model="form.avatar" class="form-control"
                                        placeholder="https://example.com/avatar.jpg">
                                </div>
                                <button type="submit" class="btn btn-success w-100 shine-effect" :disabled="isSubmitting">
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                    <i class="bi bi-send"></i> Register as Volunteer
                                </button>
                            </form>
                            <div v-if="showSuccess" class="alert alert-success mt-3 fade-show">
                                <i class="bi bi-check-circle-fill"></i> Thank you for registering! We will contact you soon.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChurchStore } from '../stores/church'

const store = useChurchStore()
const currentFilter = ref('all')
const showSuccess = ref(false)
const isSubmitting = ref(false)

const form = ref({
    name: '',
    email: '',
    role: '',
    service: '',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
})

const filteredVolunteers = computed(() => {
    if (currentFilter.value === 'all') {
        return store.volunteers
    }
    return store.getVolunteersByService(currentFilter.value)
})

const filterByService = (service) => {
    currentFilter.value = service
}

const showAll = () => {
    currentFilter.value = 'all'
}

const submitVolunteer = async () => {
    isSubmitting.value = true
    const result = await store.addVolunteer({ ...form.value })
    if (result.success) {
        showSuccess.value = true
        form.value = { name: '', email: '', role: '', service: '', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' }
        setTimeout(() => {
            showSuccess.value = false
        }, 3000)
    }
    isSubmitting.value = false
}
</script>

<style scoped>
.volunteer-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: fadeInUp 0.6s ease-out both;
}

.volunteer-card:hover {
    transform: translateY(-10px) scale(1.03);
}

.volunteer-avatar-wrapper {
    display: inline-block;
    position: relative;
}

.volunteer-avatar-wrapper::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-gold), var(--warm-gold));
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
}

.volunteer-card:hover .volunteer-avatar-wrapper::before {
    opacity: 0.5;
}

.rounded-circle {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 3px solid var(--primary-gold);
    transition: all 0.4s ease;
    position: relative;
    z-index: 1;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.rounded-circle:hover {
    transform: scale(1.1) rotate(5deg);
    border-color: var(--warm-gold);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
}

.fade-show {
    animation: fadeInUp 0.5s ease-out;
}
</style>