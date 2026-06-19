import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export const useChurchStore = defineStore('church', () => {
  const news = ref([])
  const reflections = ref([
    { id: 1, verse: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.', message: 'Today, remember that your strength comes from God. No challenge is too great when you walk with Him.' },
    { id: 2, verse: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord.', message: 'Trust in God\'s plan for your life. He has a purpose and a future filled with hope for you.' },
    { id: 3, verse: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', message: 'Let the Lord guide you today. He will provide everything you need and lead you to green pastures.' }
  ])

  const events = ref([])
  const volunteers = ref([])
  const currentReflectionIndex = ref(0)
  const isLoading = ref(false)

  const sanitizeHTML = (html) => {
      if (!html) return ''
      let result = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/\son\w+="[^"]*"/gi, '')
          .replace(/\son\w+='[^']*'/gi, '')

      const allowed = new Set(['b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'p', 'br', 'span'])

      result = result.replace(/<\/?(\w+)(\s[^>]*)?>/gi, (match, tag) => {
          const lower = tag.toLowerCase()
          if (lower === 'br') return match
          if (!allowed.has(lower)) return ''
          return match
      })

      result = result.replace(/\s+>/g, '>')

      return result
  }

  const sanitizedNews = computed(() => {
      return news.value.map(item => ({
          ...item,
          content: sanitizeHTML(item.content)
      }))
  })

  const initializeData = async () => {
    isLoading.value = true
    try {
      const newsSnapshot = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')))
      news.value = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')))
      events.value = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      const volunteersSnapshot = await getDocs(query(collection(db, 'volunteers'), orderBy('createdAt', 'desc')))
      volunteers.value = volunteersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error initializing data:', error)
    } finally {
      isLoading.value = false
    }
  }

  const setUpRealtimeListeners = () => {
    onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc')), (snapshot) => {
      news.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })

    onSnapshot(query(collection(db, 'events'), orderBy('date', 'asc')), (snapshot) => {
      events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })

    onSnapshot(query(collection(db, 'volunteers'), orderBy('createdAt', 'desc')), (snapshot) => {
      volunteers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
  }

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

  const addVolunteer = async (volunteer) => {
    try {
      const docRef = await addDoc(collection(db, 'volunteers'), {
        ...volunteer,
        createdAt: serverTimestamp()
      })
      volunteers.value.push({ id: docRef.id, ...volunteer })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addEvent = async (event) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: serverTimestamp()
      })
      events.value.push({ id: docRef.id, ...event })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addNews = async (newsItem) => {
    try {
      const docRef = await addDoc(collection(db, 'news'), {
        ...newsItem,
        createdAt: serverTimestamp()
      })
      news.value.push({ id: docRef.id, ...newsItem })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const fetchNews = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')))
      news.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')))
      events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const fetchVolunteers = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'volunteers'), orderBy('createdAt', 'desc')))
      volunteers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    news,
    sanitizedNews,
    reflections,
    events,
    volunteers,
    currentReflectionIndex,
    currentReflection,
    upcomingEvents,
    getEventsByMonth,
    getVolunteersByService,
    isLoading,
    initializeData,
    setUpRealtimeListeners,
    addVolunteer,
    addEvent,
    addNews,
    fetchVolunteers,
    fetchEvents,
    fetchNews
  }
})