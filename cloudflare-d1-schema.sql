-- ============================================================================
-- YENİDEM — CLOUDFLARE D1 (EDGE SQLITE) TAM VERİTABANI ŞEMASI
-- Çalıştırma Komutu:
--   npx wrangler d1 execute yenidem-kulliyat-d1 --file=./cloudflare-d1-schema.sql
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Kurucu Külliyat ve %96 Konsensüs Onaylı Makaleler Tablosu
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  discipline TEXT NOT NULL,
  abstract TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords_json TEXT NOT NULL DEFAULT '[]',
  references_json TEXT NOT NULL DEFAULT '[]',
  reading_time_minutes INTEGER NOT NULL DEFAULT 5,
  published_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  view_count INTEGER NOT NULL DEFAULT 0,
  featured_quote TEXT,
  cover_image TEXT DEFAULT '/assets/default-article-cover.svg',
  cover_image_caption TEXT,
  cover_image_alt TEXT,
  sha512_hash TEXT NOT NULL,
  sha3_512_hash TEXT,
  blake2b_512_hash TEXT,
  quantum_signature TEXT NOT NULL,
  is_founder_genesis INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  word_count INTEGER NOT NULL DEFAULT 0,
  char_count INTEGER NOT NULL DEFAULT 0,
  detailed_date_tr TEXT,
  academic_period TEXT,
  doi_or_isbn TEXT,
  revision_history_json TEXT NOT NULL DEFAULT '[]',
  annotations_json TEXT NOT NULL DEFAULT '[]'
);

-- 2. Yazar & Yönetici Kriptografik Kimlik Tablosu (Zero-Plaintext: scrypt + PBKDF2-HMAC-SHA512)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL, -- v2$scrypt-pbkdf2-sha512 formatında, açık şifre ASLA tutulmaz
  salt TEXT NOT NULL,          -- 256-bit kriptografik rastgele tuz
  role TEXT NOT NULL DEFAULT 'author',
  two_factor_secret_ref TEXT NOT NULL, -- Cloudflare Secret Vault referansı
  two_factor_enabled INTEGER NOT NULL DEFAULT 1,
  backup_codes_hash_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Katman-1 WORM Ön-Konsensüs Emanet Sertifikaları (Oylama Öncesi Değişmezlik)
CREATE TABLE IF NOT EXISTS worm_staging_certificates (
  pre_cert_id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  author_kyc_seal TEXT NOT NULL,
  sha3_512_hash TEXT NOT NULL,
  blake2b_512_hash TEXT NOT NULL,
  slh_dsa_signature TEXT NOT NULL,
  worm_merkle_leaf TEXT NOT NULL,
  sealed_at_utc TEXT NOT NULL,
  immutable_lock INTEGER NOT NULL DEFAULT 1
);

-- 4. Katman-2 Ana Blok Zinciri & Rust BFT Blok Defteri
CREATE TABLE IF NOT EXISTS blockchain_ledger (
  block_number INTEGER PRIMARY KEY,
  block_hash TEXT NOT NULL UNIQUE,
  previous_hash TEXT NOT NULL,
  merkle_root TEXT NOT NULL,
  category TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  sha512_hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  rust_payload_json TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed_local'
);

-- 5. Site Tasarım ve Kod Bütünlüğü Değişmezlik Sertifikaları (GitHub CI/CD & AST Lock)
CREATE TABLE IF NOT EXISTS code_design_certificates (
  cert_id TEXT PRIMARY KEY,
  git_commit_sha TEXT NOT NULL,
  design_styles_sha3_512 TEXT NOT NULL,
  founder_canon_sha3_512 TEXT NOT NULL,
  consensus_engine_sha3_512 TEXT NOT NULL,
  ui_shell_sha3_512 TEXT NOT NULL,
  combined_merkle_root TEXT NOT NULL,
  pqc_signature TEXT NOT NULL,
  verified_at_utc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'VERIFIED_IMMUTABLE'
);

-- 6. Güvenlik Denetim İzi (Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  cf_ray TEXT,
  details TEXT NOT NULL
);
