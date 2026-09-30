# DOSYA 2: 6698 SAYILI KVKK VE AB GDPR (2016/679) ULUSLARARASI VERİ KORUMA AYDINLATMA BEYANNAMESİ

- **Belge Kodu:** `DOC-02-KVKK-GDPR-NOTICE`
- **Yürürlük Tarihi:** 29 Eylül 2026
- **Hukuki Dayanak:** Türkiye Cumhuriyeti 6698 Sayılı Kişisel Verilerin Korunması Kanunu (Madde 10 & 11), Avrupa Birliği Genel Veri Koruma Tüzüğü (EU GDPR Articles 12, 13, 14, 15–22) ve ISO/IEC 27701 Gizlilik Bilgi Yönetimi Standardı
- **Veri Sorumlusu:** Orçun KUNDAKCI (`YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası`)

---

## 1. Veri Sorumlusu Künyesi ve Kapsam

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü ("GDPR") uyarınca kişisel verileriniz, Veri Sorumlusu sıfatıyla **Orçun KUNDAKCI** tarafından aşağıda açıklanan kriptografik güvenlik sınırları çerçevesinde işlenmektedir.

---

## 2. Sıfır-Açık Metin (Zero-Plaintext) Kriptografik Veri İşleme Mimarisi

YENİDEM platformunda hiçbir parola, kimlik numarası veya iki aşamalı doğrulama anahtarı açık metin (`plaintext`) olarak saklanmaz:
- **Parola Güvenliği:** Yazar ve yönetici parolaları **`scrypt (N=16384, r=8, p=1)` + `PBKDF2-HMAC-SHA512 (210.000 İterasyon)` + `256-bit Kriptografik Tuz`** ile tek yönlü özetlenir.
- **Sybil-Dirençli KYC-4 Özeti:** Topluluk konsensüsü (`/topluluk-onayi`) kapsamında yapılan üyelik doğrulamalarında akademik sicil / ORCID ve telefon bilgileri yalnızca `SHA-256` ve `SHA3-512` sıfır-bilgi özeti (`Zero-Knowledge Hash`) olarak mühürlenir.

---

## 3. İlgili Kişinin Hakları (KVKK Madde 11 & GDPR Articles 15–22)

Her okur ve araştırmacı;
1. Kişisel verisinin işlenip işlenmediğini öğrenme (`Right of Access - GDPR Art. 15`),
2. Eksik veya yanlış işlenmişse düzeltilmesini isteme (`Right to Rectification - GDPR Art. 16`),
3. Unutulma ve yerel/sunucu kayıtlarının silinmesini talep etme (`Right to Erasure / Right to be Forgotten - GDPR Art. 17`),
4. Verilerini yapılandırılmış `.JSON` formatında indirme (`Right to Data Portability - GDPR Art. 20`),
5. Çerez ve yerel depolama rızasını tek tıkla geri çekme (`GDPR Art. 7/3`)
haklarına eksiksiz sahiptir.
