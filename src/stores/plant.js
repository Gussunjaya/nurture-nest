import { reactive, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { notify } = useNotification()

// State default untuk SATU tanaman (bibit baru)
const getDefaultPlantState = () => ({
  moisture: 70,
  light: 70,
  cleanliness: 70,
  stage: 'seed',
  history: [],
  isGameOver: false,
  careCount: 0,
  matureNotified: false,
})

// State global aplikasi (menampung semua tanaman + data reset)
const defaultGlobalState = {
  currentPlantType: 'cactus',
  plants: {
    sawit: getDefaultPlantState(),
    cactus: getDefaultPlantState(),
    beringin: getDefaultPlantState(),
  },
  subscriptionPlan: 'free',
  freeActionsLeft: 3,
  userName: '',
  resetCount: 0,
  resetCooldownUntil: null,
}

let currentUser = null
export const state = reactive({ ...defaultGlobalState })
let timer = null

// Helper: ambil data tanaman yang aktif
function getActivePlant() {
  return state.plants[state.currentPlantType]
}

// ========== LOAD & SAVE ==========
export function loadUserData(email) {
  if (!email) return
  currentUser = email
  const saved = localStorage.getItem(`nurturenest_${email}`)
  if (saved) {
    const parsed = JSON.parse(saved)
    // struktur plants)
    if (!parsed.plants) {
      const oldPlant = {
        moisture: parsed.moisture ?? 70,
        light: parsed.light ?? 70,
        cleanliness: parsed.cleanliness ?? 70,
        stage: parsed.stage ?? 'seed',
        history: parsed.history ?? [],
        isGameOver: parsed.isGameOver ?? false,
        careCount: parsed.careCount ?? 0,
        matureNotified: parsed.matureNotified ?? false,
      }
      const oldType = parsed.plantType || 'cactus'
      const newPlants = {
        sawit: getDefaultPlantState(),
        cactus: getDefaultPlantState(),
        beringin: getDefaultPlantState(),
      }
      newPlants[oldType] = oldPlant
      state.plants = newPlants
      state.currentPlantType = oldType
      state.subscriptionPlan = parsed.subscriptionPlan ?? 'free'
      state.freeActionsLeft = parsed.freeActionsLeft ?? 3
      state.userName = parsed.userName ?? ''
      state.resetCount = parsed.resetCount ?? 0
      state.resetCooldownUntil = parsed.resetCooldownUntil ?? null
    } else {
      Object.assign(state, parsed)
      for (const type of ['sawit', 'cactus', 'beringin']) {
        if (!state.plants[type]) {
          state.plants[type] = getDefaultPlantState()
        } else {
          state.plants[type] = { ...getDefaultPlantState(), ...state.plants[type] }
        }
      }
    }
    // Jika cooldown sudah lewat, reset status
    if (state.resetCooldownUntil && Date.now() >= state.resetCooldownUntil) {
      state.resetCooldownUntil = null
      state.resetCount = 0
    }
  } else {
    resetAllPlantsToDefault()
  }
}

function resetAllPlantsToDefault() {
  state.currentPlantType = 'cactus'
  state.plants = {
    sawit: getDefaultPlantState(),
    cactus: getDefaultPlantState(),
    beringin: getDefaultPlantState(),
  }
  state.subscriptionPlan = 'free'
  state.freeActionsLeft = 3
  state.userName = ''
  state.resetCount = 0
  state.resetCooldownUntil = null
}

// ========== RESET GAME DENGAN LIMIT & COOLDOWN ==========
export function resetGame() {
  // Cek apakah sedang dalam cooldown
  if (state.resetCooldownUntil && Date.now() < state.resetCooldownUntil) {
    const remaining = Math.ceil((state.resetCooldownUntil - Date.now()) / 1000)
    return
  }

  // Jika cooldown sudah lewat, bersihkan status
  if (state.resetCooldownUntil && Date.now() >= state.resetCooldownUntil) {
    state.resetCooldownUntil = null
    state.resetCount = 0
  }

  // Cek limit reset (maksimal 5 kali)
  if (state.resetCount >= 5) {
    // Mulai cooldown 60 detik
    state.resetCooldownUntil = Date.now() + 60000
    state.resetCount = 0
    alert('⚠️ Mohon sabar ini ujian')
    return
  }

  // Lakukan reset untuk tanaman aktif
  const plant = getActivePlant()
  const defaultState = getDefaultPlantState()
  Object.assign(plant, defaultState)
  state.resetCount++
  addHistory('🔄 Game dimulai ulang')
  checkNotify()
}

// ========== FUNGSI INTI LAINNYA (tidak berubah) ==========
function updateStage() {
  const plant = getActivePlant()
  if (plant.careCount >= 10) plant.stage = 'mature'
  else if (plant.careCount >= 5) plant.stage = 'sprout'
  else plant.stage = 'seed'
}

function addHistory(action) {
  const plant = getActivePlant()
  plant.history.unshift({ action, time: new Date().toLocaleTimeString() })
  if (plant.history.length > 10) plant.history.pop()
  updateStage()
}

function addSystemLog(action) {
  const plant = getActivePlant()
  plant.history.unshift({ action, time: new Date().toLocaleTimeString() })
  if (plant.history.length > 10) plant.history.pop()
}

function checkNotify() {
  const plant = getActivePlant()
  if (plant.isGameOver) return
  if (plant.moisture < 30) notify('NurtureNest', '🌱 Tanamanmu haus! Siram segera.')
  if (plant.light < 20) notify('NurtureNest', '☀️ Tanamanmu butuh sinar matahari.')
  if (plant.cleanliness < 20) notify('NurtureNest', '🧹 Tanamanmu kotor! Bersihkan segera.')
  if (plant.stage === 'mature' && !plant.matureNotified) {
    notify('NurtureNest', '🌲 Selamat! Tanamanmu Besar!')
    addSystemLog('🌲 Tanaman sudah dewasa')
    plant.matureNotified = true
  }
  if (plant.moisture <= 0 || plant.light <= 0 || plant.cleanliness <= 0) {
    plant.isGameOver = true
    let causeDie = ''
    if (plant.moisture <= 0) causeDie = 'kehabisan air'
    else if (plant.light <= 0) causeDie = 'kekurangan cahaya'
    else if (plant.cleanliness <= 0) causeDie = 'kotor'
    notify('NurtureNest', '💔 Tanamanmu layu... Mulai lagi untuk mencoba.')
    addSystemLog(`💀 Tanaman mati karena ${causeDie}`)
  }
}

function checkActionLimit() {
  if (state.subscriptionPlan === 'free' && state.freeActionsLeft <= 0) {
    window.dispatchEvent(new CustomEvent('show-subscription-modal'))
    return false
  }
  return true
}

export function water() {
  const plant = getActivePlant()
  if (plant.isGameOver) return
  if (!checkActionLimit()) return
  plant.moisture = Math.min(100, plant.moisture + 25)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`💧 Disiram (${state.freeActionsLeft} aksi tersisa)`)
  } else {
    addHistory('💧 Disiram')
  }
  plant.careCount++
  updateStage()
  checkNotify()
}

export function giveLight() {
  const plant = getActivePlant()
  if (plant.isGameOver) return
  if (!checkActionLimit()) return
  plant.light = Math.min(100, plant.light + 20)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`☀️ Diberi cahaya (${state.freeActionsLeft} tersisa)`)
  } else {
    addHistory('☀️ Diberi cahaya')
  }
  plant.careCount++
  updateStage()
  checkNotify()
}

export function clean() {
  const plant = getActivePlant()
  if (plant.isGameOver) return
  if (!checkActionLimit()) return
  plant.cleanliness = Math.min(100, plant.cleanliness + 30)
  if (state.subscriptionPlan === 'free') {
    state.freeActionsLeft--
    addHistory(`🧹 Dibersihkan (${state.freeActionsLeft} tersisa)`)
  } else {
    addHistory('🧹 Dibersihkan')
  }
  plant.careCount++
  updateStage()
  checkNotify()
}

export function changePlantType(type) {
  if (state.subscriptionPlan !== 'premium') return
  if (state.currentPlantType === type) return
  state.currentPlantType = type
  if (!state.plants[type]) {
    state.plants[type] = getDefaultPlantState()
  }
  updateStage()
  const name = { sawit: 'Sawit', cactus: 'Kaktus', beringin: 'Beringin' }[type]
  addSystemLog(`🌿 Ganti tanaman ke ${name}`)
  checkNotify()
}

export function setSubscriptionPlan(plan) {
  const wasPremium = state.subscriptionPlan === 'premium'
  state.subscriptionPlan = plan
  if (plan === 'premium') {
    state.freeActionsLeft = null
    addSystemLog('💎 Upgrade ke Premium! Aksi tidak terbatas.')
  } else if (wasPremium) {
    state.freeActionsLeft = 3
    addSystemLog('📉 Turun ke paket Free. Aksi terbatas 3.')
  }
}

export function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (currentUser) {
      const plant = getActivePlant()
      if (!plant.isGameOver) {
        plant.moisture = Math.max(0, plant.moisture - 3)
        plant.light = Math.max(0, plant.light - 2)
        plant.cleanliness = Math.max(0, plant.cleanliness - 1)
        checkNotify()
      }
    }
  }, 10000)
}

export function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

// Auto-save
watch(
  state,
  () => {
    if (currentUser) {
      const toSave = {
        currentPlantType: state.currentPlantType,
        plants: state.plants,
        subscriptionPlan: state.subscriptionPlan,
        freeActionsLeft: state.freeActionsLeft,
        userName: state.userName,
        resetCount: state.resetCount,
        resetCooldownUntil: state.resetCooldownUntil,
      }
      localStorage.setItem(`nurturenest_${currentUser}`, JSON.stringify(toSave))
    }
  },
  { deep: true },
)
