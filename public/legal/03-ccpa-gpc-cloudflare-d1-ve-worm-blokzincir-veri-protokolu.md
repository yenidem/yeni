# DOSYA 3: CCPA/CPRA, KÜRESEL GİZLİLİK KONTROLÜ (GPC) VE CLOUDFLARE D1 / WORM BLOK ZİNCİRİ VERİ PROTOKOLÜ

- **Belge Kodu:** `DOC-03-CCPA-CLOUDFLARE-WORM`
- **Yürürlük Tarihi:** 29 Eylül 2026
- **Hukuki Dayanak:** California Consumer Privacy Act & Privacy Rights Act (CCPA/CPRA Cal. Civ. Code § 1798.100), W3C Global Privacy Control (GPC) ve NIST FIPS 202 / FIPS 205 Kuantum-Dirençli Kriptografi Standartları

---

## 1. Kişisel Verilerin Satılmaması ve Paylaşılmaması Garantisi (Do Not Sell or Share My Personal Information)

CCPA ve CPRA standartları uyarınca **YENİDEM**, hiçbir ziyaretçinin veya topluluk üyesinin kişisel verisini üçüncü taraflara **satmaz, kiralamaz ve ticari veri simsarlarıyla paylaşmaz.** Tarayıcınızdan gönderilen `Sec-GPC: 1` (Global Privacy Control) sinyalleri sistemimiz tarafından otomatik olarak tanınır ve onurlandırılır.

---

## 2. Cloudflare D1 (Edge SQL), R2 WORM ve HSM Şifre Kasası Güvenliği

1. **Cloudflare Edge WAF & Turnstile:** Platform trafiği Katman-7 DDoS, bot ve SQL enjeksiyonu saldırılarına karşı Cloudflare sınır ağında korunur.
2. **Cloudflare D1 & R2 WORM:** Veritabanı şeması (`cloudflare-d1-schema.sql`) ve değişmez medya depolaması (`R2 Object Lock WORM`) uçtan uca şifrelidir.
3. **Sıfır-Açık Anahtar İzolasyonu (`Encrypted Secrets`):** Hiçbir veritabanı jetonu (`CF_D1_API_TOKEN`), 2FA anahtarı (`AUTHOR_TOTP_SECRET`) veya imzalama anahtarı (`CODE_INTEGRITY_SIGNING_KEY`) kaynak kodda veya GitHub üzerinde yer almaz; tamamı Cloudflare Donanımsal Şifre Kasasında (`wrangler secret put`) tutulur.

---

## 3. Blok Zinciri Değişmezliği ve GDPR Uyumu (Off-Chain PII / On-Chain Hash)

Katman-1 WORM Emanet Zinciri (`PRE-CERT-PQC`) ve Katman-2 %96 Ana Blok Zinciri (`MAINNET-CERT-PQC`) kayıtlarında **kişisel veriler blok zincirine açık metin olarak yazılmaz.** Zincir üzerinde yalnızca akademik eserin `SHA3-512` ve `BLAKE2b-512` kriptografik özetleri ile `SLH-DSA` imzası yer alır.
