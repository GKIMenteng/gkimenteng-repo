import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  const loadProfile = async (uid) => {
    if (!uid) {
      profile.value = null
      return
    }

    const snapshot = await getDoc(doc(db, 'users', uid))
    profile.value = snapshot.exists() ? snapshot.data() : null
  }

  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser
    await loadProfile(firebaseUser?.uid || null)
    loading.value = false
  })

  const logout = async () => {
    await signOut(auth)
  }

  const isAuthenticated = computed(() => Boolean(user.value))

  return {
    user,
    profile,
    loading,
    logout,
    isAuthenticated,
    loadProfile
  }
})
