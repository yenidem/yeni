# DOSYA 1: ULUSLARARASI ÇEREZ (COOKIE) VE KRİPTOGRAFİK YEREL DEPOLAMA POLİTİKASI

- **Belge Kodu:** `DOC-01-INTL-COOKIE-POLICY`
- **Yürürlük Tarihi:** 29 Eylül 2026
- **Hukuki Dayanak:** AB 2002/58/EC ePrivacy Direktifi (2009/136/EC Değişikliği), AB Genel Veri Koruma Tüzüğü (GDPR Madde 6/1-a), 6698 Sayılı KVKK Çerez Uygulamaları Rehberi ve IAB TCF v2.2 Standartları
- **Veri Sorumlusu & Kurucu Müellif:** Orçun KUNDAKCI (`YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası`)
- **Platform Durumu:** `YAPIM AŞAMASINDA / MİMARİ ÖN İZLEME TASLAĞI`

---

## 1. Amaç ve Sıfır-Gözetim (Zero-Surveillance) Çerez Mimarisi

**YENİDEM**, akademik tefekkür, metin şerhi ve felsefi araştırmalar için inşa edilmiş bağımsız bir kültür kürsüsüdür. Platformumuzda **üçüncü taraf reklam, davranışsal profilleme veya ticari takip çerezleri kesinlikle kullanılmaz.**

Sistemimizde kullanılan çerezler ve tarayıcı içi yerel depolama (`LocalStorage`) birimleri yalnızca şu dört meşru amaç için çalıştırılır:
1. **Zorunlu Siber Güvenlik ve Cloudflare Kalkanı (`strictly_necessary`):** DDoS/Bot saldırılarının önlenmesi (`cf_clearance`), RFC 6238 TOTP (2FA) yazar oturum güvenliği ve SHA3-512 kod bütünlük doğrulaması.
2. **Okuma Konforu ve Site Kişiselleştirme (`functional_comfort`):** Ziyaretçinin seçtiği site teması (*Asil Safir, Horasan Kehribarı, Zümrüt Kubbe, Tam Karartma OLED*), yazı boyutu (`%90 - %135`), yazı tipi (*Inter/Roboto, Lexend, Lora*) ve mavi ışık filtresi ayarlarının korunması.
3. **Web3, `ORXUN` Simüle Cüzdan ve %96 Konsensüs Önbelleği (`web3_governance`):** İlk üyelikte tanımlanan `+1.00 ORXUN` hoş geldin hediyesi simülasyonu, yazar/çizer katkı görevleri ve Kuantum KYC-4 doğrulama mührünün (`SEAL-PQC`) saklanması.
4. **Anonim Akademik Okuma İstatistiği (`privacy_analytics`):** IP adresi veya kimlik bilgisi kaydetmeden yalnızca makalelerin toplam okunma sayılarını (`viewCount`) anonim olarak saymak.

---

## 2. Zaman Ayarlı İkaz ve Zorunlu Giriş Onay Kapısı (Mandatory Consent Gate)

Uluslararası şeffaflık ilkesi gereği ziyaretçilerimiz:
- Siteye ilk girişte **Zorunlu Uluslararası Çerez ve Taslak İkaz Kapısı** ile karşılaşır.
- Onay geçerlilik ve yeniden ikaz süresini **1 Saat (Geçici Taslak Oturumu)**, **24 Saat**, **30 Gün (Standart)** veya **180 Gün** olarak bizzat belirleyebilir.
- Seçilen süre dolduğunda sistem otomatik olarak **Zaman Ayarlı Hukuki İkaz Penceresini** yeniden açar ve güncel onay talep eder.

---

## 3. Kriptografik Onay Sertifikası (`CONSENT-CERT-PQC`) ve İptal Hakkı

Verilen her çerez onayı, **NIST FIPS 202 `SHA3-512`** ve **RFC 7693 `BLAKE2b-512`** algoritmalarıyla özetlenerek ziyaretçiye tekil bir `CONSENT-CERT-PQC-...` sertifika numarası üretir. Ziyaretçi dilediği an sayfanın en altındaki yeşil değişim bandında yer alan **"Çerez & Hukuk (KVKK/GDPR)"** butonuna tıklayarak onayını sıfırlayabilir.
