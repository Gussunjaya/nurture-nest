# 🌱 NurtureNest

> Rawat tanamanmu. Rawat dirimu. Satu siram sehari bikin hidup lebih berwarna.

NurtureNest adalah aplikasi tanaman virtual berbasis web di mana kamu merawat tanaman setiap hari—menyiram, memberi cahaya, membersihkan—dan melihatnya tumbuh dari bibit menjadi tanaman dewasa. Dibangun dengan Vue 3, Pinia, dan TailwindCSS.

---

🔗 **Demo:** [https://nurturenest.demo.com](https://nurture-nest-eight.vercel.app/)  
📦 **Repository:** [https://github.com/username/nurturenest](https://github.com/Gussunjaya/nurture-nest)

---

## ✨ Fitur Utama

- 🌱 **Siklus Tumbuh** — Tanaman berkembang dari Bibit → Tunas → Dewasa berdasarkan aksi perawatan
- 💧 **Parameter Vital** — Kelembaban, Cahaya, dan Kebersihan berkurang otomatis setiap 10 detik
- 🔔 **Notifikasi Browser** — Peringatan real-time saat tanaman haus, kurang cahaya, kotor, atau hampir mati
- 💬 **Kutipan Inspirasi** — Diambil dari API ZenQuotes, dengan fallback lokal dan retry otomatis
- 🔐 **Autentikasi Dummy** — Login/register berbasis localStorage
- 💎 **Sistem Langganan** — User free mendapat 3 aksi perawatan; premium mendapat akses penuh
- 👤 **Profil Modal** — Popup profil dari navbar tanpa halaman terpisah
- 📱 **Responsif** — Tampilan optimal di HP, tablet, dan desktop

---

## 🛠️ Tech Stack

| Teknologi                               | Keterangan                        |
| --------------------------------------- | --------------------------------- |
| [Vue 3](https://vuejs.org/)             | Framework utama (Composition API) |
| [Vite](https://vitejs.dev/)             | Build tool & dev server           |
| [Pinia](https://pinia.vuejs.org/)       | State management                  |
| [Vue Router](https://router.vuejs.org/) | Routing                           |
| [TailwindCSS](https://tailwindcss.com/) | Styling & responsivitas           |
| [ZenQuotes API](https://zenquotes.io/)  | Sumber kutipan inspirasi          |

---

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js versi 18 ke atas
- npm atau yarn

### Instalasi

```sh
# Clone repositori
git clone https://github.com/Gussunjaya/nurture-nest.git
cd nurturenest

# Install dependensi
npm install
```

### Menjalankan untuk Development

```sh
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build untuk Produksi

```sh
npm run build
```

### Preview Build Produksi

```sh
npm run preview
```

### Lint

```sh
npm run lint
```

---

## 📁 Struktur Proyek

```
NUTURE-NEST/
├── public/
├── src/
│  ├── assets/
│  ├── components
│  │   ├── Modal.vue
│  │   ├── NotificationToast.vue
│  │   └── PlantWidget.vue
│  ├── composables
│  │   └── useNotification.js
│  ├── router
│  │   └── index.js
│  ├── stores
│  │   ├── auth.js
│  │   └── plant.js
│  ├── views
│  │   └── HomeView.vue
│  ├── App.vue
│  └── main.js
├── .gitattributes
├── .gitignore
├── docs.md
├── index.html
├── package.json
├── .editorconfig
├── .oxlintrc.json
├── .prettierrc.json
├── eslint.config.js
├── package-lock.json
├── postcss.config.js
├── README.md
├── vercel.json
├── vite.config.js
└── jsconfig.json

---

## 🎮 Cara Bermain

1. **Daftar / Login** — Buat akun dummy untuk menyimpan progress
2. **Pilih Tanaman** — Mulai dengan bibit yang siap dirawat
3. **Rawat Setiap Hari** — Siram 💧, beri cahaya ☀️, dan bersihkan 🧹 tanamanmu
4. **Pantau Parameter** — Kelembaban, cahaya, dan kebersihan turun otomatis—jangan sampai nol!
5. **Tonton Tumbuh** — Kumpulkan aksi perawatan untuk naik stage: Bibit (0–2) → Tunas (3–5) → Dewasa (10+)
6. **Upgrade Premium** — User free dibatasi 3 aksi; upgrade untuk akses tak terbatas dan fitur ganti tanaman

---

## 🔔 Izin Notifikasi

Notifikasi browser membutuhkan izin dari pengguna. Saat pertama kali membuka aplikasi, browser akan meminta izin notifikasi. Pastikan izinkan agar tidak melewatkan peringatan penting.

---

## 🐛 Known Issues & Catatan

Beberapa bug telah diperbaiki selama pengembangan, di antaranya:

- Stage tanaman yang reset saat ganti tanaman (diselesaikan dengan memisahkan `careCount` dari history)
- Progress hilang saat refresh (diselesaikan dengan memanggil `loadFromLocalStorage()` di `onMounted`)
- Status subscription terhapus saat reset game (diselesaikan dengan memisahkan state user dan state tanaman)
- Notifikasi stage muncul berulang (diselesaikan dengan menyimpan flag per tanaman)

Kalau menemukan bug baru, mungkin itu pengaruh bulan purnama. Atau buka Issue saja.

---

## 🤝 Berkontribusi

Pull request terbuka lebar. Untuk perubahan besar, buka Issue terlebih dahulu untuk mendiskusikan apa yang ingin diubah.

1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit perubahanmu (`git commit -m 'Tambah fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

---

## 📄 Lisensi

none

---

## 🙏 Kredit

- Dikembangkan oleh **Gussun**
- Kutipan inspirasi dari [ZenQuotes.io](https://zenquotes.io/)
- Dibangun di atas [Vue + Vite template](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

---

_"Saya tanam, saya siram, saya koding, saya putus asa, eh jadi."_ — Ojan, 2026
```
