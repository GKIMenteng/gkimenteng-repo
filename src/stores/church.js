import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChurchStore = defineStore('church', () => {
  // News Data
  const news = ref([
    { id: 1, title: 'Christmas Service 2024', content: 'Join us for our special Christmas service on December 25th. All are welcome!', date: '2024-12-20', image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600' },
    { id: 2, title: 'Youth Retreat Registration Open', content: 'Register now for our annual youth retreat. Early bird discounts available until January 15th.', date: '2024-12-15', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' },
    { id: 3, title: 'Community Outreach Program', content: 'Volunteer for our monthly community service program. Making a difference together.', date: '2024-12-10', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600' }
  ])

  // Daily Reflections
  const reflections = ref([
    { id: 1, verse: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.', message: 'Today, remember that your strength comes from God. No challenge is too great when you walk with Him.' },
    { id: 2, verse: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord.', message: 'Trust in God\'s plan for your life. He has a purpose and a future filled with hope for you.' },
    { id: 3, verse: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', message: 'Let the Lord guide you today. He will provide everything you need and lead you to green pastures.' }
  ])

  // Events Data
  const events = ref([
    { id: 1, title: 'Sunday Worship Service', date: '2024-12-22', time: '09:00', location: 'Main Sanctuary', description: 'Weekly worship service with holy communion' },
    { id: 2, title: 'Bible Study Group', date: '2024-12-23', time: '19:00', location: 'Fellowship Hall', description: 'Weekly bible study and discussion group' },
    { id: 3, title: 'Christmas Eve Service', date: '2024-12-24', time: '20:00', location: 'Main Sanctuary', description: 'Special candlelight Christmas Eve service' },
    { id: 4, title: 'Christmas Day Service', date: '2024-12-25', time: '10:00', location: 'Main Sanctuary', description: 'Celebrate the birth of our Savior' },
    { id: 5, title: 'Youth Fellowship', date: '2024-12-27', time: '18:00', location: 'Youth Center', description: 'Fun and fellowship for young people' },
    { id: 6, title: 'Prayer Meeting', date: '2024-12-28', time: '07:00', location: 'Prayer Room', description: 'Early morning prayer and worship' }
  ])

  // Volunteers Data
  const volunteers = ref([
    { id: 1, name: 'John Doe', role: 'Worship Leader', service: 'First Service', contact: 'john@email.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', role: 'Usher', service: 'Second Service', contact: 'jane@email.com', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, name: 'Robert Johnson', role: 'Sound Engineer', service: 'First Service', contact: 'robert@email.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 4, name: 'Maria Garcia', role: 'Children Ministry', service: 'Second Service', contact: 'maria@email.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 5, name: 'David Lee', role: 'Worship Singer', service: 'First Service', contact: 'david@email.com', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: 6, name: 'Sarah Williams', role: 'Greeter', service: 'Second Service', contact: 'sarah@email.com', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { id: 7, name: 'Michael Brown', role: 'Multimedia', service: 'First Service', contact: 'michael@email.com', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: 8, name: 'Lisa Anderson', role: 'Prayer Team', service: 'Second Service', contact: 'lisa@email.com', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' }
  ])

  const currentReflectionIndex = ref(0)

  const currentReflection = computed(() => {
    return reflections.value[currentReflectionIndex.value]
  })

  const upcomingEvents = computed(() => {
    const today = new Date()
    return events.value
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4)
  })

  const getEventsByMonth = (year, month) => {
    return events.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }

  const getVolunteersByService = (service) => {
    return volunteers.value.filter(vol => vol.service === service)
  }

  return {
    news,
    reflections,
    events,
    volunteers,
    currentReflectionIndex,
    currentReflection,
    upcomingEvents,
    getEventsByMonth,
    getVolunteersByService
  }
})