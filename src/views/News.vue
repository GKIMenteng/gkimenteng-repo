<template>
    <div class="news-page">
        <div class="container-fluid">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-newspaper"></i> Church News
            </h1>
            <div class="golden-divider"></div>

            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow animated-card">
                        <div class="card-header bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <h5 class="mb-0"><i class="bi bi-journal-richtext"></i> Latest Updates</h5>
                                <span class="badge text-dark">{{ sortedNews.length }} News</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <template v-if="sortedNews.length > 0">
                                <div class="row">
                                    <div v-for="(item, index) in sortedNews" :key="item.id" class="col-md-4 mb-4"
                                        :style="{ animationDelay: index * 0.1 + 's' }">
                                        <div class="card h-100 news-card">
                                            <div class="position-relative overflow-hidden">
                                                <img :src="item.image" class="card-img-top" :alt="item.title"
                                                    style="height: 220px; object-fit: cover;">
                                                <div class="news-overlay">
                                                    <i class="bi bi-book"></i>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <p class="text-muted small mb-2">
                                                    <i class="bi bi-calendar text-warning"></i> {{ formatDate(item.date) }}
                                                </p>
                                                <h5 class="card-title">{{ item.title }}</h5>
                                                <p class="card-text text-muted">{{ item.content }}</p>
                                            </div>
                                            <div class="card-footer bg-transparent border-0">
                                                <button class="btn btn-outline-primary w-100 shine-effect" disabled>
                                                    Read More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div v-else class="text-center py-5">
                                <i class="bi bi-newspaper display-1 text-warning mb-3"></i>
                                <h4 class="text-primary">No news available</h4>
                                <p class="text-muted mb-0">Check back soon for the latest updates from GKI Menteng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChurchStore } from '../stores/church'

const store = useChurchStore()

const sortedNews = computed(() => {
    return [...store.news].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>

<style scoped>
.news-card {
    border: 1px solid rgba(212, 175, 55, 0.18);
    animation: fadeInUp 0.6s ease-out both;
}

.news-card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 45px rgba(74, 44, 94, 0.2);
}

.news-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(74, 44, 94, 0.72), rgba(44, 24, 16, 0.72));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: var(--primary-gold);
    font-size: 2.5rem;
}

.news-card:hover .news-overlay {
    opacity: 1;
}

.news-card .btn:disabled {
    cursor: default;
    transform: none;
    box-shadow: none;
}
</style>
