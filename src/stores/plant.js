import { reactive, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'
const { notify } = useNotification()

// State default untuk tanaman baru
const defaultState = {
  moisture: 70, // kelembaban
  light: 70, // cahaya
  cleanliness: 70, // kebersihan
  stage: 'seed', // seed, sprout, mature
  history: [], // [{ action, time }]
  isGameOver: false, // apakah tanaman mati
  plantType: 'cactus',
  subscriptionPlan: 'free',
  freeActionsLeft: 3, // sisa aksi gratis untuk user free
  userName: '',
  matureNotified: false, // untuk memastikan notifikasi mature hanya sekali
  careCount: 0, // jumlah total aksi perawatan
}

let currentUser = null
export const state = reactive({ ...defaultState })
let timer = null

/**
 * Memuat data tanaman untuk user tertentu dari localStorage
 * Jika tidak ada data, reset ke default
 */
export function loadUserData(email) {
  if (!email) return
  currentUser = email
  const saved = localStorage.getItem(`nurturenest_${email}`)
  if (saved) {
    const parsed = JSON.parse(saved)
    // Untuk user lama yang tidak punya properti freeActionsLeft
    if (parsed.freeActionsLeft === undefined) parsed.freeActionsLeft = 3
    Object.assign(state, parsed)
  } else {
    resetState()
  }
}

/** Reset semua state ke default */
function resetState() {
  // Hanya reset properti tanaman
  state.moisture = defaultState.moisture
  state.light = defaultState.light
  state.cleanliness = defaultState.cleanliness
  state.stage = defaultState.stage
  state.history = []
  state.isGameOver = false
  state.careCount = 0
  updateStage()
  // Jangan sentuh subscriptionPlan, freeActionsLeft, plantType, userName
}

// Auto-save ke localStorage setiap kali state berubah
watch(
  state,
  () => {
    if (currentUser) {
      const toSave = {
        moisture: state.moisture,
        light: state.light,
        cleanliness: state.cleanliness,
        stage: state.stage,
        history: state.history,
        isGameOver: state.isGameOver,
        plantType: state.plantType,
        subscriptionPlan: state.subscriptionPlan,
        freeActionsLeft: state.freeActionsLeft,
        userName: state.userName,
        matureNotified: state.matureNotified,
        careCount: state.careCount,
      }
      localStorage.setItem(`nurturenest_${currentUser}`, JSON.stringify(toSave))
    }
  },
  { deep: true },
)

/**
 * Menambahkan aksi ke riwayat dan memperbarui stage pertumbuhan
 * Stage berdasarkan jumlah aksi: 0-4 seed, 5-9 sprout, 10+ mature
 */
function addHistory(action) {
  state.history.unshift({ action, time: new Date().toLocaleTimeString() })
  if (state.history.length > 10) state.history.pop()
  updateStage()
}

function updateStage() {
  if (state.careCount >= 10) {
    state.stage = 'mature'
  } else if (state.careCount >= 5) {
    state.stage = 'sprout'
  } else {
    state.stage = 'seed'
  }
}

function addSystemLog(action) {
  state.history.unshift({ action, time: new Date().toLocaleTimeString() })
  if (state.history.length > 10) state.history.pop()
}

/** Mengirim notifikasi jika kondisi tertentu terpenuhi (haus, kurang cahaya, dll) */
function checkNotify() {
  if (state.isGameOver) return
  if (state.moisture < 30) notify('NurtureNest', '🌱 Tanamanmu haus! Siram segera.')
  if (state.light < 20) notify('NurtureNest', '☀️ Tanamanmu butuh sinar matahari.')
  if (state.cleanliness < 20) notify('NurtureNest', '🧹 Tanamanmu kotor! Bersihkan segera.')
  if (state.stage === 'mature' && !state.matureNotified) {
    notify('NurtureNest', '🌲 Selamat! Tanamanmu Besar!')
    state.matureNotified = true
  }
  if (state.moisture <= 0 || state.light <= 0 || state.cleanliness <= 0) {
    state.isGameOver = true
    notify('NurtureNest', '💔 Tanamanmu layu... Mulai lagi untuk mencoba.')
  }
}

/** Cek batasan aksi untuk user free (maksimal 3 aksi) */
function checkActionLimit() {
  if (state.subscriptionPlan === 'free' && state.freeActionsLeft <= 0) {
    window.dispatchEvent(new CustomEvent('show-subscription-modal'))
    return false
  }
  return true
}

/** Aksi Menyiram: menambah kelembaban 25 poin */
export function water() {
  if (state.isGameOver) return
  if (!checkActionLimit()) return
  state.moisture = Math.min(100, state.moisture + 25)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`💧 Disiram (${state.freeActionsLeft} aksi tersisa)`)
  } else {
    addHistory('💧 Disiram')
  }
  state.careCount++
  updateStage()
  checkNotify()
}

/** Aksi Memberi Cahaya: menambah cahaya 20 poin */
export function giveLight() {
  if (state.isGameOver) return
  if (!checkActionLimit()) return
  state.light = Math.min(100, state.light + 20)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`☀️ Diberi cahaya (${state.freeActionsLeft} tersisa)`)
  } else {
    addHistory('☀️ Diberi cahaya')
  }
  state.careCount++
  updateStage()
  checkNotify()
}

/** Aksi Membersihkan: menambah kebersihan 30 poin */
export function clean() {
  if (state.isGameOver) return
  if (!checkActionLimit()) return
  state.cleanliness = Math.min(100, state.cleanliness + 30)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`🧹 Dibersihkan (${state.freeActionsLeft} tersisa)`)
  } else {
    addHistory('🧹 Dibersihkan')
  }
  state.careCount++
  updateStage()
  checkNotify()
}

/** Mereset game (tanaman baru) */
export function resetGame() {
  resetState()
  state.isGameOver = false
  state.careCount = 0
  updateStage()
  addHistory('🔄 Game dimulai ulang')
  checkNotify()
}

/** Mengganti jenis tanaman (hanya untuk premium) */
export function changePlantType(type) {
  if (state.subscriptionPlan === 'premium') {
    state.plantType = type
    addSystemLog(
      `🌿 Ganti tanaman ke ${type === 'cactus' ? 'Kaktus' : type === 'lavender' ? 'Lavender' : 'Monstera'}`,
    )
  }
}

/** Mengubah paket langganan (free/premium) */
export function setSubscriptionPlan(plan) {
  state.subscriptionPlan = plan
  if (plan === 'premium') {
    state.freeActionsLeft = null // tidak terbatas
    addSystemLog('💎 Upgrade ke Premium! Aksi tidak terbatas.')
  } else {
    state.freeActionsLeft = 3
    addSystemLog('💎 Turun ke Free')
  }
}

/** Memulai timer yang menurunkan stat setiap 20 detik */
export function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (!state.isGameOver && currentUser) {
      state.moisture = Math.max(0, state.moisture - 3)
      state.light = Math.max(0, state.light - 2)
      state.cleanliness = Math.max(0, state.cleanliness - 1)
      checkNotify()
    }
  }, 10000)
}

/** Menghentikan timer */
export function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}
