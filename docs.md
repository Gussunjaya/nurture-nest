# 📘 Catatan Ojan – NurtureNest

_“Dibantuin AI, tapi tetep ribet sendiri.”_

## 🌱 Tentang Proyek

NurtureNest itu aplikasi tanaman virtual yang kamu rawat setiap hari. Ada parameter kelembaban, cahaya, kebersihan, stage tumbuh (bibit → tunas → dewasa), paket langganan (free/premium), notifikasi kalau tanamannya mau mati, dan kutipan inspirasi dari API. Semua data disimpan di localStorage, jadi kalau refresh gak hilang—kecuali bugnya belum ketemu semua.

Proyek ini pake **Vue 3 (Composition API) + TailwindCSS + Vue Router + Pinia** (store). Awalnya dari template Vue + Vite.

---

## 🤖 AI Dipakai buat Apa?

Jujur, banyak yang dibantu AI, tapi gak sepenuhnya copas. AI bantu:

- Bikin struktur awal komponen (Navbar, PlantWidget, Modal, Profile).
- Nulis logika store buat perawatan tanaman, timer, dan batasan aksi gratis (3x buat user free).
- Integrasi notifikasi browser (ternyata repot juga soalnya butuh izin dan handling event).
- Ambil kutipan dari API ZenQuotes, lengkap dengan fallback kalau error.
- Bikin modal subscription & modal profile popup (yang tadinya halaman terpisah).
- Desain responsif pakai Tailwind.

Tapi ya… setelah dikasih AI, kode diedit manual habis-habisan. Soalnya AI kadang ngasih solusi yang bikin bug baru, atau lupa hal-hal kecil kayak manggil fungsi `onMounted`. Akhirnya saya yang harus debug dan nyari sendiri.

---

## 🐛 Masalah Paling Ngeselin & Solusinya

### 1. Stage tanaman tiba-tiba balik ke seed setelah ganti tanaman

**Penyebab:** AI ngitung stage berdasarkan panjang `careHistory` (array riwayat aksi). Setiap ganti tanaman, history-nya ke-reset, padahal stage harusnya ikut tanaman baru.  
**Solusi:** Pisahin antara _aksi rawat_ (siram, cahaya, bersih) dan _aksi sistem_ (ganti tanaman, upgrade, reset). Stage sekarang dihitung dari `careCount` (jumlah aksi rawat sejak tanaman dipilih), bukan panjang history.

### 2. Refresh halaman, progress tanaman ngulang dari awal

**Penyebab:** AI bikin store dan komponen, tapi lupa manggil `loadUserData()` di `onMounted` komponen utama.  
**Solusi:** Tambahin sendiri di `App.vue` dan `PlantWidget.vue` – panggil `plantStore.loadFromLocalStorage()` pas komponen dipasang.

### 3. Modal subscription gak muncul pas aksi ke-4 user free

**Penyebab:** AI pake nama event `show-subscription-modal` di `PlantWidget`, tapi di `App.vue` listen-nya `showSubscription` (camelCase vs kebab-case).  
**Solusi:** Samakan jadi `show-subscription-modal` di kedua tempat. Plus modal subscription dibuat reusable dengan props `visible` dan event `close`.

### 4. Notifikasi “Tanaman Besar” muncul terus setiap nambah stage

**Penyebab:** Kondisi `if (stage === 'mature' && !notified)` – tapi flag `matureNotified` gak di-reset pas tanaman diganti atau game di-reset.  
**Solusi:** Flag disimpan per tanaman (di dalam objek tanaman). Saat reset game, flag di-reset juga. Sekarang notifikasi cuma muncul sekali per stage.

### 5. Reset game malah ngilangin status subscription

**Penyebab:** Fungsi `resetState()` buatan AI menimpa seluruh state termasuk `subscriptionPlan` dan `userData`.  
**Solusi:** Pisahkan state user (langganan, email, dll) dari state tanaman. Reset hanya properti yang terkait dengan tanaman saat ini, subscription tetep dipertahankan.

### 6. Quotes dari API sering gagal, tapi pesan error gak muncul

**Penyebab:** Kode AI cuma `console.error` tanpa menampilkan ke user. Plus saat retry otomatis, pesan error ketimpa spinner.  
**Solusi:** Bikin state `status` (`'idle'|'loading'|'error'|'success'`). Pas error pertama, muncul pesan _“❌ Gagal mengambil quotes dari perpustakaan negara”_ tanpa kutipan. Delay 1,5 detik, lalu retry. Kalau retry gagal, tampilkan kutipan cadangan (bergantian antar dua kutipan) tanpa pesan error. Alurnya:  
`quotes default → klik refresh → error → pesan error (tanpa quotes) → delay → retry → sukses/gagal → quotes baru (bersih)`

### 7. Halaman profile terpisah, pengen jadi modal popup dari navbar

**Penyebab:** Desain awal punya `ProfileView.vue` dan rute `/profile`.  
**Solusi:** Hapus file `ProfileView.vue`, hapus rute `/profile` di `router`, lalu buat modal di `MainNavbar.vue` dengan efek blur (`backdrop-blur-sm`). Semua info user (email, nama, plan, tombol kelola langganan, logout) dipindah ke modal. Sekarang klik avatar di navbar → muncul popup.

---

## ✅ Fitur yang (Akhirnya) Jalan

- Login/register dummy (disimpan di localStorage)
- User free cuma bisa 3 aksi rawat, habis itu muncul modal ajakan subscribe
- Premium bisa ganti tanaman & reset game kapan aja
- Stage tumbuh: **Bibit (0-2 aksi) → Tunas (3-5) → Dewasa (10+)**
- Parameter: Kelembaban, Cahaya, Kebersihan (berkurang tiap 10 detik)
- Notifikasi browser: haus, kurang cahaya, kotor, mati, dan stage naik
- Timer global 10 detik untuk ngurangin stat (bisa di-pause kalau tanaman mati)
- Quotes inspirasi dari API ZenQuotes + fallback lokal + retry otomatis
- Responsif di HP, tablet, desktop (berkat Tailwind)
- Tombol-tombol ada animasi hover dan klik
- Modal subscription reusable (untuk upgrade dari free ke premium)
- Modal profile popup (tanpa halaman terpisah)
  dan masih banyak lagi

# 🙏 Catatan Akhir

Proyek ini akhirnya jadi, walau berdarah-darah. AI helpful buat ngasih gambaran kasar dan mempercepat penulisan boilerplate, tapi debugging, logic bisnis, dan edge cases tetep dikerjain manual. Kalau ada bug lain, mungkin karena pengaruh bulan purnama atau saya lupa commit.

“Saya tanam, saya siram, saya koding, saya putus asa, eh jadi.”
— Ojan, 2026
