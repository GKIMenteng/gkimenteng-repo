<template>
    <div class="calendar-page">
        <div class="container-fluid">
            <h1 class="mb-4 glow-text">
                <i class="bi bi-calendar3"></i> Church Calendar
            </h1>
            <div class="golden-divider"></div>

            <div class="card shadow animated-card">
                <div class="card-header bg-primary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <button @click="previousMonth" class="btn btn-light btn-sm shine-effect">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <h4 class="mb-0">{{ monthNames[currentMonth] }} {{ currentYear }}</h4>
                        <button @click="nextMonth" class="btn btn-light btn-sm shine-effect">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Calendar Grid -->
                    <div class="calendar-grid">
                        <div class="row mb-3">
                            <div v-for="day in dayNames" :key="day" class="col text-center fw-bold" style="color: var(--primary-gold);">
                                {{ day }}
                            </div>
                        </div>

                        <div v-for="(week, weekIndex) in calendarDays" :key="weekIndex" class="row mb-2">
                            <div v-for="day in week" :key="day.date" class="col">
                                <div v-if="day.date" class="calendar-day p-2 text-center" :class="{
                                    'bg-primary text-white rounded': day.isToday,
                                    'has-events': day.events.length > 0
                                }">
                                    <div class="fw-bold">{{ day.dayNumber }}</div>
                                    <div v-if="day.events.length > 0" class="mt-1">
                                        <span v-for="event in day.events" :key="event.id"
                                            class="badge bg-warning text-dark me-1 mb-1 event-badge">
                                            {{ event.title.substring(0, 15) }}
                                        </span>
                                    </div>
                                </div>
                                <div v-else class="p-2 text-center">&nbsp;</div>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Events List -->
                    <div class="mt-4">
                        <h5 class="mb-3" style="color: var(--deep-purple);"><i class="bi bi-book"></i> Upcoming Events</h5>
                        <div v-if="monthEvents.length > 0" class="row">
                            <div v-for="event in monthEvents" :key="event.id" class="col-md-6 mb-3">
                                <div class="card bg-light h-100 shine-effect">
                                    <div class="card-body">
                                        <h6 class="card-title text-primary">{{ event.title }}</h6>
                                        <p class="mb-1"><i class="bi bi-calendar text-warning"></i> {{ formatDate(event.date) }}</p>
                                        <p class="mb-1"><i class="bi bi-clock text-warning"></i> {{ event.time }}</p>
                                        <p class="mb-1"><i class="bi bi-geo-alt text-warning"></i> {{ event.location }}</p>
                                        <p class="mb-0 text-muted">{{ event.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-else class="text-muted">No events scheduled for this month.</p>
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

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const monthEvents = computed(() => {
    return store.getEventsByMonth(currentYear.value, currentMonth.value)
})

const calendarDays = computed(() => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
    const startingDay = firstDay.getDay()

    let currentDay = 1
    let week = []

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
        week.push({ date: null, dayNumber: '', events: [], isToday: false })
    }

    // Add days of the month
    while (currentDay <= lastDay.getDate()) {
        const dateString = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
        const isToday = currentDay === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()
        const events = monthEvents.value.filter(e => e.date === dateString)

        week.push({
            date: dateString,
            dayNumber: currentDay,
            events: events,
            isToday: isToday
        })

        if (week.length === 7) {
            days.push(week)
            week = []
        }

        currentDay++
    }

    // Add remaining days to complete the last week
    if (week.length > 0) {
        while (week.length < 7) {
            week.push({ date: null, dayNumber: '', events: [], isToday: false })
        }
        days.push(week)
    }

    return days
})

const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}

const previousMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
}

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
}
</script>

<style scoped>
.calendar-day {
    min-height: 80px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.05);
    animation: fadeInUp 0.5s ease-out both;
}

.calendar-day:hover {
    background: rgba(212, 175, 55, 0.1);
    transform: scale(1.08) rotate(1deg);
}

.calendar-day.bg-primary {
    background: linear-gradient(135deg, var(--royal-purple) 0%, var(--deep-purple) 100%) !important;
    box-shadow: 0 0 20px rgba(74, 44, 94, 0.4);
}

.has-events {
    border: 2px solid var(--primary-gold) !important;
    background: rgba(212, 175, 55, 0.05);
}

.calendar-grid {
    font-size: 14px;
}

.event-badge {
    font-size: 9px;
    animation: glow 2s ease-in-out infinite;
}
</style>