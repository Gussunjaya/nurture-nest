import { ref } from 'vue'

const toast = ref([])

export function useNotification() {
  // Meminta izin notifikasi browser
  const requestPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }
  /** Fungsi untuk mengirim notifikasi */
  const notify = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }

    // Tambahkan ke toast lokal untuk ditampilkan di UI
    const id = Date.now()
    toast.value.push({ id, title, body })
    setTimeout(() => {
      toast.value = toast.value.filter((t) => t.id !== id)
    }, 3000)
  }

  return { requestPermission, notify, toast }
}
