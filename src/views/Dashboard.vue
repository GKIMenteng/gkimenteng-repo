<template>
    <div class="dashboard">
        <div class="container-fluid">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-speedometer2"></i> Dashboard
            </h1>
            <div class="golden-divider"></div>

            <!-- Daily Reflection and Upcoming Events -->
            <div class="row mb-4">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div class="card shadow h-100 animated-card" style="animation-delay: 0.2s;">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="bi bi-book"></i> Daily Reflection</h5>
                        </div>
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <h4 class="text-success pulse-animation">{{ store.currentReflection.verse }}</h4>
                                <blockquote class="blockquote">
                                    <p><em>"{{ store.currentReflection.text }}"</em></p>
                                </blockquote>
                                <p class="text-muted">{{ store.currentReflection.message }}</p>
                            </div>
                            <div class="text-center">
                                <button @click="previousReflection" class="btn btn-outline-success me-2 shine-effect">
                                    <i class="bi bi-chevron-left"></i> Previous
                                </button>
                                <button @click="nextReflection" class="btn btn-outline-success shine-effect">
                                    Next <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow h-100 animated-card" style="animation-delay: 0.3s;">
                        <div class="card-header bg-warning text-dark">
                            <h5 class="mb-0"><i class="bi bi-calendar-event"></i> Upcoming Events</h5>
                        </div>
                        <div class="card-body">
                            <template v-if="store.upcomingEvents.length > 0">
                                <div v-for="event in store.upcomingEvents" :key="event.id"
                                    class="mb-3 p-3 border rounded event-item">
                                    <h6 class="text-primary">{{ event.title }}</h6>
                                    <p class="mb-1"><i class="bi bi-calendar"></i> {{ formatDate(event.date) }}</p>
                                    <p class="mb-1"><i class="bi bi-clock"></i> {{ event.time }}</p>
                                    <p class="mb-0"><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
                                </div>
                            </template>
                            <p v-else class="text-muted text-center mb-0">No upcoming events.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- News Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow shine-effect animated-card">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="bi bi-newspaper"></i> Church News</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div v-for="(item, index) in store.news" :key="item.id" class="col-md-4 mb-3"
                                    :style="{ animationDelay: index * 0.1 + 's' }">
                                    <div class="card h-100 animated-card">
                                        <div class="position-relative overflow-hidden">
                                            <img :src="item.image" class="card-img-top" :alt="item.title"
                                                style="height: 200px; object-fit: cover;">
                                            <div class="news-overlay">
                                                <i class="bi bi-book"></i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ item.title }}</h5>
                                            <p class="card-text text-muted small"><i class="bi bi-calendar"></i> {{
                                                formatDate(item.date) }}</p>
                                            <p class="card-text">{{ item.content }}</p>
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
import { useChurchStore } from '../stores/church'

const store = useChurchStore()

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}

const nextReflection = () => {
    store.currentReflectionIndex = (store.currentReflectionIndex + 1) % store.reflections.length
}

const previousReflection = () => {
    store.currentReflectionIndex = store.currentReflectionIndex === 0
        ? store.reflections.length - 1
        : store.currentReflectionIndex - 1
}
</script>

<style scoped>
.card {
    animation: fadeInUp 0.6s ease-out both;
}

.animated-card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.news-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(74, 44, 94, 0.7), rgba(44, 24, 16, 0.7));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: var(--primary-gold);
    font-size: 2rem;
}

.card-img-top:hover+.news-overlay {
    opacity: 1;
}

.event-item {
    transition: all 0.3s ease;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    background: rgba(255, 255, 255, 0.5);
}

.event-item:hover {
    background: rgba(212, 175, 55, 0.1);
    transform: translateX(10px);
}
</style>