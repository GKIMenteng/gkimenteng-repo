<template>
    <div class="admin-dashboard">
        <div class="container-fluid">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-shield-fill-check"></i> Admin Dashboard
            </h1>
            <div class="golden-divider"></div>

            <div v-if="!authStore.isAuthenticated" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle-fill"></i> Please login to access admin features.
            </div>

            <div v-else-if="authStore.profile?.role !== 'admin'">
                <div class="alert alert-danger">
                    <i class="bi bi-shield-x"></i> Access denied. Admin privileges required.
                </div>
            </div>

            <div v-else>
                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#volunteers-tab"
                            type="button" role="tab">
                            <i class="bi bi-people-fill"></i> Volunteers
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#calendar-tab"
                            type="button" role="tab">
                            <i class="bi bi-calendar3"></i> Calendar
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#news-tab"
                            type="button" role="tab">
                            <i class="bi bi-newspaper"></i> News
                        </button>
                    </li>
                </ul>

                <div class="tab-content">
                    <!-- Volunteers Tab -->
                    <div class="tab-pane fade show active" id="volunteers-tab" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="mb-0"><i class="bi bi-person-plus"></i> Add Volunteer</h5>
                                    </div>
                                    <div class="card-body">
                                        <form @submit.prevent="submitVolunteer">
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-person"></i> Full Name</label>
                                                <input type="text" v-model="volunteerForm.name" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-envelope"></i> Email</label>
                                                <input type="email" v-model="volunteerForm.contact" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-person-badge"></i> Role</label>
                                                <select v-model="volunteerForm.role" class="form-select" required>
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
                                                <label class="form-label"><i class="bi bi-clock"></i> Service</label>
                                                <select v-model="volunteerForm.service" class="form-select" required>
                                                    <option value="">Select Service</option>
                                                    <option value="First Service">First Service (07:00 AM)</option>
                                                    <option value="Second Service">Second Service (10:00 AM)</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-image"></i> Avatar URL</label>
                                                <input type="url" v-model="volunteerForm.avatar" class="form-control"
                                                    placeholder="https://example.com/avatar.jpg">
                                            </div>
                                            <button type="submit" class="btn btn-primary w-100 shine-effect" :disabled="isSubmitting">
                                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                                <i class="bi bi-plus-circle"></i> Add Volunteer
                                            </button>
                                        </form>
                                        <div v-if="alertMessage" :class="`alert alert-${alertType} mt-3 fade-show`">
                                            <i :class="alertIcon"></i> {{ alertMessage }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-success text-white">
                                        <h5 class="mb-0"><i class="bi bi-list-ul"></i> Current Volunteers</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Role</th>
                                                        <th>Service</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="vol in store.volunteers" :key="vol.id">
                                                        <td>{{ vol.name }}</td>
                                                        <td>{{ vol.role }}</td>
                                                        <td>{{ vol.service }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Calendar Tab -->
                    <div class="tab-pane fade" id="calendar-tab" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-warning text-dark">
                                        <h5 class="mb-0"><i class="bi bi-calendar-plus"></i> Add Event</h5>
                                    </div>
                                    <div class="card-body">
                                        <form @submit.prevent="submitEvent">
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-card-heading"></i> Title</label>
                                                <input type="text" v-model="eventForm.title" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-calendar"></i> Date</label>
                                                <input type="date" v-model="eventForm.date" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-clock"></i> Time</label>
                                                <input type="time" v-model="eventForm.time" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-geo-alt"></i> Location</label>
                                                <input type="text" v-model="eventForm.location" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-text-paragraph"></i> Description</label>
                                                <textarea v-model="eventForm.description" class="form-control" rows="3"
                                                    required></textarea>
                                            </div>
                                            <button type="submit" class="btn btn-warning w-100 shine-effect" :disabled="isSubmittingEvent">
                                                <span v-if="isSubmittingEvent" class="spinner-border spinner-border-sm me-2"></span>
                                                <i class="bi bi-plus-circle"></i> Add Event
                                            </button>
                                        </form>
                                        <div v-if="eventAlertMessage" :class="`alert alert-${eventAlertType} mt-3 fade-show`">
                                            <i :class="eventAlertIcon"></i> {{ eventAlertMessage }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-info text-white">
                                        <h5 class="mb-0"><i class="bi bi-calendar-event"></i> Upcoming Events</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="event in store.upcomingEvents" :key="event.id">
                                                        <td>{{ event.title }}</td>
                                                        <td>{{ formatDate(event.date) }}</td>
                                                        <td>{{ event.time }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- News Tab -->
                    <div class="tab-pane fade" id="news-tab" role="tabpanel">
                        <div class="row">
                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-info text-white">
                                        <h5 class="mb-0"><i class="bi bi-journal-plus"></i> Create News</h5>
                                    </div>
                                    <div class="card-body">
                                        <form @submit.prevent="submitNews">
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-card-heading"></i> Title</label>
                                                <input type="text" v-model="newsForm.title" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-calendar"></i> Date</label>
                                                <input type="date" v-model="newsForm.date" class="form-control" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-text-paragraph"></i> Content</label>
                                                <RichTextEditor v-model="newsForm.content" />
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label"><i class="bi bi-image"></i> Image URL</label>
                                                <input type="url" v-model="newsForm.image" class="form-control"
                                                    placeholder="https://example.com/image.jpg">
                                            </div>
                                            <button type="submit" class="btn btn-info w-100 shine-effect" :disabled="isSubmittingNews">
                                                <span v-if="isSubmittingNews" class="spinner-border spinner-border-sm me-2"></span>
                                                <i class="bi bi-plus-circle"></i> Create News
                                            </button>
                                        </form>
                                        <div v-if="newsAlertMessage" :class="`alert alert-${newsAlertType} mt-3 fade-show`">
                                            <i :class="newsAlertIcon"></i> {{ newsAlertMessage }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6 mb-4">
                                <div class="card shadow animated-card">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="mb-0"><i class="bi bi-newspaper"></i> Published News</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in store.news" :key="item.id">
                                                        <td>{{ item.title }}</td>
                                                        <td>{{ formatDate(item.date) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChurchStore } from '../stores/church'
import { useAuthStore } from '../stores/auth'
import RichTextEditor from '../components/RichTextEditor.vue'

const store = useChurchStore()
const authStore = useAuthStore()

// Volunteer form
const volunteerForm = ref({
    name: '',
    contact: '',
    role: '',
    service: '',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
})

// Event form
const eventForm = ref({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
})

// News form
const newsForm = ref({
    title: '',
    date: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600'
})

// Alerts
const alertMessage = ref('')
const alertType = ref('success')
const alertIcon = ref('bi bi-check-circle-fill')
const eventAlertMessage = ref('')
const eventAlertType = ref('success')
const eventAlertIcon = ref('bi bi-check-circle-fill')
const newsAlertMessage = ref('')
const newsAlertType = ref('success')
const newsAlertIcon = ref('bi bi-check-circle-fill')

// Loading states
const isSubmitting = ref(false)
const isSubmittingEvent = ref(false)
const isSubmittingNews = ref(false)

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}

const submitVolunteer = async () => {
    isSubmitting.value = true
    const result = await store.addVolunteer({ ...volunteerForm.value })
    if (result.success) {
        alertMessage.value = 'Volunteer added successfully!'
        alertType.value = 'success'
        alertIcon.value = 'bi bi-check-circle-fill'
        volunteerForm.value = {
            name: '',
            contact: '',
            role: '',
            service: '',
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        }
    } else {
        alertMessage.value = result.error || 'Failed to add volunteer.'
        alertType.value = 'danger'
        alertIcon.value = 'bi bi-exclamation-triangle-fill'
    }
    isSubmitting.value = false
    setTimeout(() => alertMessage.value = '', 3000)
}

const submitEvent = async () => {
    isSubmittingEvent.value = true
    const result = await store.addEvent({ ...eventForm.value })
    if (result.success) {
        eventAlertMessage.value = 'Event added successfully!'
        eventAlertType.value = 'success'
        eventAlertIcon.value = 'bi bi-check-circle-fill'
        eventForm.value = { title: '', date: '', time: '', location: '', description: '' }
    } else {
        eventAlertMessage.value = result.error || 'Failed to add event.'
        eventAlertType.value = 'danger'
        eventAlertIcon.value = 'bi bi-exclamation-triangle-fill'
    }
    isSubmittingEvent.value = false
    setTimeout(() => eventAlertMessage.value = '', 3000)
}

const submitNews = async () => {
    isSubmittingNews.value = true
    const result = await store.addNews({ ...newsForm.value })
    if (result.success) {
        newsAlertMessage.value = 'News created successfully!'
        newsAlertType.value = 'success'
        newsAlertIcon.value = 'bi bi-check-circle-fill'
        newsForm.value = {
            title: '',
            date: '',
            content: '',
            image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600'
        }
    } else {
        newsAlertMessage.value = result.error || 'Failed to create news.'
        newsAlertType.value = 'danger'
        newsAlertIcon.value = 'bi bi-exclamation-triangle-fill'
    }
    isSubmittingNews.value = false
    setTimeout(() => newsAlertMessage.value = '', 3000)
}
</script>

<style scoped>
.nav-tabs .nav-link {
    color: var(--deep-purple);
    border: 1px solid rgba(212, 175, 55, 0.2);
}

.nav-tabs .nav-link.active {
    background: linear-gradient(135deg, var(--royal-purple), var(--deep-purple));
    border-color: var(--primary-gold);
    color: white;
}

.table {
    font-size: 14px;
}

.table th {
    color: var(--deep-purple);
}

.table-hover tbody tr:hover {
    background: rgba(212, 175, 55, 0.1);
}

.animated-card {
    animation: fadeInUp 0.6s ease-out both;
}

.fade-show {
    animation: fadeInUp 0.5s ease-out;
}
</style>