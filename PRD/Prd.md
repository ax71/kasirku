📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

Sistem POS UMKM Berbasis Web
📌 1. Product Overview
Nama Produk: KasirKu
Deskripsi:
KasirKu adalah aplikasi Point of Sale (POS) berbasis web yang dirancang untuk membantu UMKM makanan dalam mengelola transaksi penjualan, menu produk, serta laporan keuangan secara digital, sederhana, dan efisien.

📌 2. Problem Statement
Banyak UMKM makanan masih menghadapi kendala dalam operasional sehari-hari, seperti:

Pencatatan transaksi masih manual (nota/kertas)
Kesalahan perhitungan total pembayaran
Tidak adanya pencatatan laporan penjualan yang rapi
Kesulitan dalam mengetahui stok produk
Tidak memiliki sistem kasir digital yang terjangkau

📌 3. Solution
KasirKu hadir sebagai solusi digital dengan menyediakan:

Sistem kasir berbasis web yang mudah digunakan
Manajemen menu dan harga
Pencatatan transaksi otomatis
Laporan penjualan real-time
Sistem autentikasi untuk keamanan data

📌 4. Target Users
Pemilik UMKM makanan
Kasir di warung/kedai
Penjual makanan rumahan (contoh: brownies, snack, dll)

📌 5. Goals (Tujuan Produk)
Mempermudah proses transaksi penjualan
Mengurangi kesalahan pencatatan manual
Memberikan laporan penjualan yang jelas dan akurat
Membantu UMKM beralih ke sistem digital

📌 6. Success Metrics
User dapat menyelesaikan transaksi dalam < 30 detik
Semua transaksi tersimpan dengan benar di database
User dapat melihat laporan harian tanpa error
Sistem dapat digunakan tanpa pelatihan teknis khusus

📌 7. Features
Core Features (Wajib)
Authentication
Login menggunakan email & password
Menggunakan Supabase Auth

POS (Point of Sale)
Menampilkan daftar menu
Menambahkan produk ke keranjang
Menghitung total harga otomatis
Checkout & simpan transaksi

Manajemen Menu
Tambah menu
Edit menu
Hapus menu
Kategori produk (opsional)

Laporan Penjualan
Riwayat transaksi
Total penjualan harian
Total pendapatan

Optional Features (Nilai Tambah)
Notifikasi stok habis
Grafik penjualan
Role user (admin & kasir)
Filter laporan berdasarkan tanggal

📌 8. User Flow
Alur Utama:
User login
Masuk ke dashboard
Membuka halaman POS
Memilih produk
Menambahkan ke keranjang
Melakukan checkout
Transaksi tersimpan
Data masuk ke laporan

📌 9. Functional Requirements
Sistem harus dapat menyimpan data transaksi
Sistem harus menghitung total harga secara otomatis
Sistem harus menampilkan daftar menu dari database
Sistem harus mengautentikasi user sebelum akses

📌 10. Non-Functional Requirements
UI harus responsif (desktop & tablet)
Waktu loading < 3 detik
Data tersimpan secara aman di database
Sistem mudah digunakan oleh non-teknis

📌 11. Database (High-Level Design)
Entities utama:
Users
Products
Orders
Order Items

📌 12. Tech Stack
Frontend
React (Vite)
Tailwind CSS
shadcn UI

Data & State
TanStack Query (data fetching & caching)
Zod (validasi data & schema)

Backend & Database
Supabase (PostgreSQL Database)
Supabase Auth (Authentication)

📌 13. Scope (Batasan Project)
Tidak menggunakan payment gateway real (hanya simulasi)
Tidak mencakup aplikasi mobile
Tidak mencakup multi-branch bisnis
Fokus pada web application

📌 14. Risks & Mitigation
Risiko:
Kurangnya pengalaman dalam integrasi Supabase
Over-scope fitur

Solusi:
Fokus pada MVP terlebih dahulu
Mengembangkan fitur secara bertahap

📌 15. Development Plan
Phase 1 (MVP)
Setup project
Authentication
POS (transaksi dasar)
Manajemen menu

Phase 2
Laporan penjualan
Penyempurnaan UI

Phase 3 (Optional)
Grafik
Notifikasi stok
Role user
