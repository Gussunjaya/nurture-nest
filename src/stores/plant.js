import { reactive, watch } from 'vue'

// State default untuk tanaman baru
const defaultState = {
  moisture: 70, // kelembaban
  light: 70, // cahaya
  cleanliness: 70, // kebersihan
  stage: 'seed', // seed, sprout, mature, flowering
  history: [], // [{ action, time }]
  isGameOver: false, // apakah tanaman mati
  plantType: 'monstera', // monstera, cactus, lavender
  subscriptionPlan: 'free',
  freeActionsLeft: 3, // sisa aksi gratis untuk user free
  userName: '',
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
  Object.assign(state, { ...defaultState, userName: state.userName, freeActionsLeft: 3 })
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
      }
      localStorage.setItem(`nurturenest_${currentUser}`, JSON.stringify(toSave))
    }
  },
  { deep: true },
)

/**
 * Menambahkan aksi ke riwayat dan memperbarui stage pertumbuhan
 * Stage berdasarkan jumlah aksi: 0-4 seed, 5-9 sprout, 10-19 mature, >=20 flowering
 */
function addHistory(action) {
  state.history.unshift({ action, time: new Date().toLocaleTimeString() })
  if (state.history.length > 10) state.history.pop()
  const totalCares = state.history.length
  if (totalCares >= 20) state.stage = 'flowering'
  else if (totalCares >= 10) state.stage = 'mature'
  else if (totalCares >= 5) state.stage = 'sprout'
  else state.stage = 'seed'
}

/** Mengirim notifikasi jika kondisi tertentu terpenuhi (haus, kurang cahaya, dll) */
function checkNotify() {
  if (state.isGameOver) return
  if (state.moisture < 30) notify('NurtureNest', '🌱 Tanamanmu haus! Siram segera.')
  if (state.light < 20) notify('NurtureNest', '☀️ Tanamanmu butuh sinar matahari.')
  if (
    state.stage === 'flowering' &&
    state.history.length &&
    state.history[0].action !== '🌸 Mekar'
  ) {
    notify('NurtureNest', '🌸 Selamat! Tanamanmu berbunga!')
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
  checkNotify()
}

/** Mereset game (tanaman baru) */
export function resetGame() {
  resetState()
  state.isGameOver = false
  addHistory('🔄 Game dimulai ulang')
  checkNotify()
}

/** Mengganti jenis tanaman (hanya untuk premium) */
export function changePlantType(type) {
  if (state.subscriptionPlan === 'premium') {
    state.plantType = type
    addHistory(
      `🌿 Ganti tanaman ke ${type === 'cactus' ? 'Kaktus' : type === 'lavender' ? 'Lavender' : 'Monstera'}`,
    )
  }
}

/** Mengubah paket langganan (free/premium) */
export function setSubscriptionPlan(plan) {
  state.subscriptionPlan = plan
  if (plan === 'premium') {
    state.freeActionsLeft = null // tidak terbatas
    addHistory('💎 Upgrade ke Premium! Aksi tidak terbatas.')
  } else {
    state.freeActionsLeft = 3
    addHistory('💎 Turun ke Free')
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
