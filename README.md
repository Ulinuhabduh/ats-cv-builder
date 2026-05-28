# ATS CV Builder

Platform web untuk membuat CV yang **ramah ATS** (Applicant Tracking System). Dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS. Semua data disimpan di browser (localStorage) — tidak ada server, tidak ada data yang dikirim keluar.

## Fitur

- **Editor + Live Preview** — isi form, hasil langsung terlihat di samping dalam ukuran A4.
- **3 Template ATS-friendly** — Classic, Modern, Minimal. Semua single-column dengan teks asli (selectable) agar mudah dibaca mesin ATS.
- **Pilihan warna aksen** — sesuaikan tampilan tanpa mengorbankan keterbacaan.
- **Analisa Skor ATS** — checklist otomatis (kontak, ringkasan, kata kerja aksi, pencapaian terukur, dll) dengan skor 0–100.
- **Pencocokan Lowongan** — tempel deskripsi pekerjaan, lihat kata kunci yang sudah/belum ada di CV Anda.
- **Ekspor PDF** — via dialog cetak browser (Save as PDF), menghasilkan PDF dengan teks asli yang bisa di-parse ATS.
- **Save & Import Project** — unduh seluruh isi CV sebagai file `.cvproj.json`, lalu impor kembali kapan saja untuk melanjutkan/mengedit. Cocok untuk menyimpan beberapa versi CV.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

## Tips ekspor PDF terbaik untuk ATS

1. Klik **⬇ Unduh PDF**.
2. Di dialog cetak, pilih tujuan **Save as PDF**.
3. Set **Margins = None** dan aktifkan **Background graphics** agar warna aksen ikut tercetak.

## Struktur

```
app/
  layout.tsx        # root layout + metadata
  page.tsx          # halaman utama: toolbar, editor/ats tabs, preview
  globals.css       # Tailwind + print stylesheet (A4)
components/
  CVForm.tsx        # form editor semua section
  CVDocument.tsx    # render CV (3 varian template)
  ATSPanel.tsx      # skor ATS, checklist, keyword matching
  ui.tsx            # primitif input/section/button
lib/
  types.ts          # tipe data CV
  store.ts          # state Zustand + persist localStorage
  atsAnalyzer.ts    # heuristik skor ATS + analisa kata kunci
  sampleData.ts     # data contoh & template kosong
```

## Catatan ATS

Template sengaja dibuat **single-column tanpa tabel, ikon, atau kolom ganda**, memakai heading standar ("Pengalaman Kerja", "Pendidikan", "Keahlian"), dan font umum (Calibri/Arial/Georgia) — semua faktor yang membuat CV mudah di-parse oleh ATS modern.
