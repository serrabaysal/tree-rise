# 🇹🇷 Türkiye Haritası Üzerinde Alan Yönetimi

Bu proje, **Next.js** ve **React Leaflet** kullanarak Türkiye haritası üzerinde alan seçimi, manuel alan ekleme ve veritabanına kayıt işlemlerini sağlayan bir web uygulamasıdır.  
Kullanıcılar haritadan belirli bölgeleri (il, ilçe veya özel alan) seçebilir ya da manuel olarak alan ekleyebilir.

## 🚀 Özellikler

- 📍 **Harita Üzerinden Alan Seçimi**
  - Türkiye haritasında belirli alanlar tıklanarak seçilebilir.
  - Seçilen alanın adı ve koordinat bilgileri API’ye gönderilir.

- ✏ **Manuel Alan Ekleme**
  - Harita kullanmadan boş bir alan seçimi yapılabilir.
  - İstenirse manuel olarak koordinatlar girilebilir.

- 🗄 **Veritabanı Entegrasyonu**
  - **Prisma ORM** ile **PostgreSQL** üzerinde veri saklama.
  - Alan bilgileri `/api/alanlar` endpoint’i ile eklenir.

- 💡 **Dinamik Yükleme**
  - Harita bileşeni SSR kapalı şekilde dinamik olarak yüklenir.
  - Yükleme sırasında özel loading ekranı gösterilir.

---

## 🛠 Kullanılan Teknolojiler

- [Next.js](https://nextjs.org/) – React tabanlı modern web framework
- [React Leaflet](https://react-leaflet.js.org/) – Harita görüntüleme
- [Prisma](https://www.prisma.io/) – ORM ve veritabanı yönetimi
- [PostgreSQL](https://www.postgresql.org/) – İlişkisel veritabanı
- [Axios](https://axios-http.com/) – HTTP istekleri
- [Tailwind CSS](https://tailwindcss.com/) – UI stillendirme

---

## 📂 Proje Yapısı

/app
/api
/alanlar -> Alan ekleme API endpoint'i
page.tsx -> Harita ve manuel alan ekleme sayfası
/components
TurkeyMap.tsx -> Harita bileşeni (alan seçimi)

yaml
Kopyala
Düzenle

---

## ⚙️ Kurulum

### 1️⃣ Depoyu Klonlayın
```bash
git clone https://github.com/kullaniciadi/proje-adi.git
cd proje-adi
2️⃣ Bağımlılıkları Yükleyin
bash
Kopyala
Düzenle
npm install
3️⃣ .env Dosyası Oluşturun
.env içine PostgreSQL bağlantı bilgilerinizi girin:

env
Kopyala
Düzenle
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/veritabani"
4️⃣ Prisma Migrasyonunu Çalıştırın
bash
Kopyala
Düzenle
npx prisma migrate dev --name init
5️⃣ Geliştirme Sunucusunu Başlatın
bash
Kopyala
Düzenle
npm run dev
Uygulama şu adreste çalışacaktır:
http://localhost:3000

🖼 Kullanım
Haritadan Seçim Yapma

Haritada tıklayarak bir alan seçin.

Seçilen alan adı ve koordinatlar API’ye gönderilir.

Boş Alan Seçimi

"Boş Alan Seç" butonuna basarak koordinatsız bir alan ekleyin.

Manuel Koordinat Girişi (opsiyonel)

Manuel koordinat girip “Manuel Alan Ekle” butonuna basın.


