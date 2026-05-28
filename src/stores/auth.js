import { ref, watch } from 'vue'
import { loadUserData, stopTimer, startTimer } from './plant'

// State reaktif yang diambil dari localStorage
export const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
export const userEmail = ref(localStorage.getItem('userEmail') || '')
export const userName = ref(localStorage.getItem('userName') || '')

// Watch setiap perubahan state untuk otomatis simpan ke localStorage
watch(isLoggedIn, (val) => localStorage.setItem('isLoggedIn', val))
watch(userEmail, (val) => localStorage.setItem('userEmail', val))
watch(userName, (val) => localStorage.setItem('userName', val))

if (isLoggedIn.value && userEmail.value) {
  loadUserData(userEmail.value)
  startTimer()
}

export function useAuth() {
  /**
   * Fungsi registrasi dummy
   * @param {string} name - Nama lengkap
   * @param {string} email - Email (harus unik)
   * @param {string} password - Password (bebas)
   * @returns {boolean} - true jika berhasil
   */
  const register = (name, email, password) => {
    if (!name || !email || !password) return false

    // Cek apakah email sudah terdaftar (dummy)
    if (localStorage.getItem(`nurturenest_${email}`)) return false

    isLoggedIn.value = true
    userEmail.value = email
    userName.value = name
    loadUserData(email)
    startTimer()

    // Data tanaman akan diinisialisasi nanti di plant store
    return true
  }

  /**
   * Fungsi login dummy
   * @param {string} email - Email apapun
   * @param {string} password - Password apapun (asal tidak kosong)
   * @returns {boolean} - true jika berhasil
   */
  const login = (email, password) => {
    if (!email || !password) return false
    const accountExists = localStorage.getItem(`nurturenest_${email}`) !== null
    if (!accountExists) {
      return false
    }

    isLoggedIn.value = true
    userEmail.value = email
    loadUserData(email)
    startTimer()

    // Ambil nama dari localStorage jika sudah pernah register, jika tidak pakai bagian depan email
    const saved = localStorage.getItem(`nurturenest_${email}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        userName.value = parsed.userName || email.split('@')[0]
      } catch {
        userName.value = email.split('@')[0]
      }
    } else {
      userName.value = email.split('@')[0]
    }
    return true
  }

  /**
   * Logout: hapus status login
   */
  const logout = () => {
    isLoggedIn.value = false
    userEmail.value = ''
    userName.value = ''
    stopTimer()
  }

  return { isLoggedIn, userEmail, userName, register, login, logout }
}
