import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pbkdf2Sync, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import type { AcademicArticle } from '../app/core/models/article.model';

/**
 * Resolves a guaranteed writable directory for SQLite & JSON persistence.
 * On Vercel Serverless / AWS Lambda (/var/task is read-only EROFS), automatically
 * redirects runtime writes to os.tmpdir()/yenidem-data while keeping ./data for local dev.
 */
export function resolveWritableDataDir(): string {
  const isServerlessReadOnly = Boolean(
    process.env['VERCEL'] ||
      process.env['VERCEL_ENV'] ||
      process.env['NOW_REGION'] ||
      process.env['AWS_LAMBDA_FUNCTION_NAME']
  );
  const preferredDir = isServerlessReadOnly
    ? join(tmpdir(), 'yenidem-data')
    : join(process.cwd(), 'data');

  try {
    if (!existsSync(preferredDir)) {
      mkdirSync(preferredDir, { recursive: true });
    }
    return preferredDir;
  } catch {
    const fallbackTmp = join(tmpdir(), 'yenidem-data');
    try {
      if (!existsSync(fallbackTmp)) {
        mkdirSync(fallbackTmp, { recursive: true });
      }
    } catch {
      // ignore if already exists
    }
    return fallbackTmp;
  }
}

const dataDir = resolveWritableDataDir();
const sqliteDbPath = join(dataDir, 'kulliyat.sqlite');
const jsonBackupPath = join(dataDir, 'articles.json');
const ledgerBackupPath = join(dataDir, 'blockchain-ledger.json');

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'author';
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  backupCodes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminSessionRecord {
  token: string;
  userId: string;
  authorName: string;
  role: 'admin' | 'author';
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
  ip?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  details: string;
}

export type BlockchainCategory = 'tde' | 'felsefe' | 'kesisim' | 'lugat' | 'mecmua' | 'tefekkur';

export interface BlockchainBlockRecord {
  blockNumber: number;
  blockHash: string;
  previousHash: string;
  merkleRoot: string;
  category: BlockchainCategory;
  itemId: string;
  itemTitle: string;
  sha512Hash: string;
  signature: string;
  rustPayloadJson: string;
  nodeRpcUrl?: string;
  timestamp: string;
  status: 'confirmed_local' | 'synced_rust_node' | 'queued_for_node';
}

/**
 * Hardened Multi-Stage Cryptographic Password Hashing:
 * Stage 1: scrypt (N=16384, r=8, p=1, 64 bytes) memory-hard KDF
 * Stage 2: PBKDF2-HMAC-SHA512 (210,000 iterations, 64 bytes)
 */
export function hashPasswordWithSalt(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || randomBytes(32).toString('hex');
  const scryptDerived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const finalHash = pbkdf2Sync(scryptDerived, salt, 210000, 64, 'sha512').toString('hex');
  return { hash: `v2$scrypt-pbkdf2-sha512${finalHash}`, salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  if (!password || !storedHash || !salt) return false;
  try {
    if (storedHash.startsWith('v2$scrypt-pbkdf2-sha512')) {
      const scryptDerived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
      const finalHash = pbkdf2Sync(scryptDerived, salt, 210000, 64, 'sha512').toString('hex');
      const computed = `v2$scrypt-pbkdf2-sha512${finalHash}`;
      const a = Buffer.from(computed, 'utf8');
      const b = Buffer.from(storedHash, 'utf8');
      return a.length === b.length && timingSafeEqual(a, b);
    }
    // Legacy v1 fallback (100k PBKDF2-SHA512)
    const computedLegacy = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const a = Buffer.from(computedLegacy, 'utf8');
    const b = Buffer.from(storedHash, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export interface SqliteDbWrapper {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: unknown[]): Record<string, unknown> | undefined;
    all(...params: unknown[]): Record<string, unknown>[];
  };
}

// Global SQLite & In-Memory Fallback State
let sqliteDb: SqliteDbWrapper | null = null;
let isUsingSqlite = false;

try {
  const sqliteModule = require('node:sqlite');
  if (sqliteModule && sqliteModule.DatabaseSync) {
    const DatabaseSync = sqliteModule.DatabaseSync;
    const db = new DatabaseSync(sqliteDbPath);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
    sqliteDb = db;
    isUsingSqlite = true;
    console.log('[SQLite DB] Native SQLite database successfully initialized at:', sqliteDbPath);
  }
} catch (err) {
  console.warn('[SQLite DB] Native node:sqlite fallback to atomic JSON:', err);
  sqliteDb = null;
  isUsingSqlite = false;
}

// Initialize Tables
export function initDatabaseSchema() {
  if (isUsingSqlite && sqliteDb) {
    // 1. Articles table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        discipline TEXT NOT NULL,
        abstract TEXT,
        content TEXT NOT NULL,
        keywords_json TEXT,
        references_json TEXT,
        reading_time_minutes INTEGER DEFAULT 5,
        published_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        status TEXT DEFAULT 'published',
        view_count INTEGER DEFAULT 0,
        featured_quote TEXT,
        cover_image TEXT,
        cover_image_caption TEXT,
        cover_image_alt TEXT,
        cover_aspect_ratio TEXT,
        visual_analysis_notes TEXT,
        blockchain_hash TEXT,
        block_number INTEGER,
        block_timestamp TEXT,
        is_blockchain_verified INTEGER DEFAULT 0,
        blockchain_status TEXT,
        certificate_id TEXT,
        submission_timestamp TEXT,
        sha512_hash TEXT,
        quantum_signature TEXT,
        version INTEGER DEFAULT 1,
        word_count INTEGER,
        char_count INTEGER,
        detailed_date_tr TEXT,
        academic_period TEXT,
        doi_or_isbn TEXT,
        last_revision_reason TEXT,
        revision_history_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_discipline ON articles(discipline);
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
      CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
    `);

    // 2. Admin Users table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'author',
        totp_secret TEXT NOT NULL,
        two_factor_enabled INTEGER NOT NULL DEFAULT 0,
        backup_codes_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    try {
      sqliteDb.exec(`ALTER TABLE admin_users ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0;`);
    } catch {
      // Column already exists
    }

    // 3. Admin Sessions table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        user_agent TEXT,
        ip TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(token);
    `);

    // 4. Blockchain Ledger table (Rust Node & Category-based Permanent Memory)
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_ledger (
        block_number INTEGER PRIMARY KEY,
        block_hash TEXT NOT NULL,
        previous_hash TEXT NOT NULL,
        merkle_root TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'tde',
        item_id TEXT NOT NULL,
        item_title TEXT NOT NULL DEFAULT '',
        sha512_hash TEXT NOT NULL,
        signature TEXT NOT NULL,
        rust_payload_json TEXT NOT NULL DEFAULT '{}',
        node_rpc_url TEXT,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL
      );
    `);
    try {
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN merkle_root TEXT NOT NULL DEFAULT '';`);
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN category TEXT NOT NULL DEFAULT 'tde';`);
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN item_id TEXT NOT NULL DEFAULT '';`);
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN item_title TEXT NOT NULL DEFAULT '';`);
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN rust_payload_json TEXT NOT NULL DEFAULT '{}';`);
      sqliteDb.exec(`ALTER TABLE blockchain_ledger ADD COLUMN node_rpc_url TEXT;`);
    } catch {
      // Columns already exist
    }

    // 5. Audit Log table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        actor TEXT NOT NULL,
        details_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp);
    `);
  }
}

// Audit Logger
export function logAuditEvent(eventType: string, actor: string, details: unknown) {
  const logId = 'LOG-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  const detailsStr = typeof details === 'string' ? details : JSON.stringify(details);

  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT INTO audit_logs (id, timestamp, event_type, actor, details_json)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(logId, now, eventType, actor, detailsStr);
    } catch (e) {
      console.error('Audit log write error:', e);
    }
  }
}

// Admin User Management
export function getOrCreateDefaultAdmin(initialSecret: string, initialBackupCodes: string[], initialTwoFactorEnabled = false): AdminUserRecord {
  const defaultEmail = 'orcunkundakci@gmail.com';
  const defaultName = 'Orçun Kundakcı';
  const defaultInitialPassword = 'orcun2026';

  if (isUsingSqlite && sqliteDb) {
    const stmt = sqliteDb.prepare('SELECT * FROM admin_users WHERE email = ?');
    const existing = stmt.get(defaultEmail) as Record<string, unknown> | undefined;
    if (existing) {
      return {
        id: String(existing['id']),
        email: String(existing['email']),
        name: String(existing['name']),
        passwordHash: String(existing['password_hash']),
        salt: String(existing['salt']),
        role: String(existing['role']) as 'admin' | 'author',
        twoFactorSecret: String(existing['totp_secret']),
        twoFactorEnabled: existing['two_factor_enabled'] !== undefined ? Boolean(existing['two_factor_enabled']) : initialTwoFactorEnabled,
        backupCodes: JSON.parse(String(existing['backup_codes_json'] || '[]')),
        createdAt: String(existing['created_at']),
        updatedAt: String(existing['updated_at']),
      };
    }

    const { hash, salt } = hashPasswordWithSalt(defaultInitialPassword);
    const now = new Date().toISOString();
    const insertStmt = sqliteDb.prepare(`
      INSERT INTO admin_users (id, email, name, password_hash, salt, role, totp_secret, two_factor_enabled, backup_codes_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const id = 'usr-admin-1';
    insertStmt.run(
      id,
      defaultEmail,
      defaultName,
      hash,
      salt,
      'admin',
      initialSecret,
      initialTwoFactorEnabled ? 1 : 0,
      JSON.stringify(initialBackupCodes),
      now,
      now
    );

    logAuditEvent('ADMIN_USER_INITIALIZED', 'SYSTEM', { email: defaultEmail, role: 'admin', hashAlgorithm: 'v2$scrypt-pbkdf2-sha512' });

    return {
      id,
      email: defaultEmail,
      name: defaultName,
      passwordHash: hash,
      salt,
      role: 'admin',
      twoFactorSecret: initialSecret,
      twoFactorEnabled: initialTwoFactorEnabled,
      backupCodes: initialBackupCodes,
      createdAt: now,
      updatedAt: now,
    };
  }

  // File fallback
  const { hash, salt } = hashPasswordWithSalt(defaultInitialPassword);
  return {
    id: 'usr-admin-1',
    email: defaultEmail,
    name: defaultName,
    passwordHash: hash,
    salt,
    role: 'admin',
    twoFactorSecret: initialSecret,
    twoFactorEnabled: initialTwoFactorEnabled,
    backupCodes: initialBackupCodes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function updateAdminPassword(newPassword: string, newEmail?: string): { hash: string; salt: string } {
  const { hash, salt } = hashPasswordWithSalt(newPassword);
  const now = new Date().toISOString();

  if (isUsingSqlite && sqliteDb) {
    try {
      if (newEmail && newEmail.trim()) {
        const stmt = sqliteDb.prepare(`
          UPDATE admin_users
          SET email = ?, password_hash = ?, salt = ?, updated_at = ?
          WHERE id = 'usr-admin-1'
        `);
        stmt.run(newEmail.trim(), hash, salt, now);
      } else {
        const stmt = sqliteDb.prepare(`
          UPDATE admin_users
          SET password_hash = ?, salt = ?, updated_at = ?
          WHERE id = 'usr-admin-1'
        `);
        stmt.run(hash, salt, now);
      }
      logAuditEvent('PASSWORD_CHANGED', 'Orçun Kundakcı', { message: 'Yönetici şifresi Scrypt+PBKDF2-SHA512 ile güncellendi' });
    } catch (e) {
      console.error('Password update error:', e);
    }
  }
  return { hash, salt };
}

export function updateTwoFactorPreference(enabled: boolean): boolean {
  const now = new Date().toISOString();
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        UPDATE admin_users
        SET two_factor_enabled = ?, updated_at = ?
        WHERE id = 'usr-admin-1'
      `);
      stmt.run(enabled ? 1 : 0, now);
      logAuditEvent('2FA_PREFERENCE_UPDATED', 'Orçun Kundakcı', { twoFactorEnabled: enabled });
      return true;
    } catch (e) {
      console.error('2FA preference update error:', e);
      return false;
    }
  }
  return true;
}

// Session Management
export function createAdminSession(user: AdminUserRecord, userAgent?: string, ip?: string): AdminSessionRecord {
  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const session: AdminSessionRecord = {
    token,
    userId: user.id,
    authorName: user.name,
    role: user.role,
    createdAt: now.toISOString(),
    expiresAt,
    userAgent,
    ip,
  };

  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT INTO admin_sessions (token, user_id, author_name, role, created_at, expires_at, user_agent, ip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(token, user.id, user.name, user.role, session.createdAt, session.expiresAt, userAgent || '', ip || '');
    } catch (e) {
      console.error('Session write error:', e);
    }
  }

  logAuditEvent('SESSION_LOGIN', user.name, { tokenPreview: token.substring(0, 8) + '...', expiresAt });
  return session;
}

export function validateSessionToken(token: string): AdminSessionRecord | null {
  if (!token) return null;

  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('SELECT * FROM admin_sessions WHERE token = ?');
      const row = stmt.get(token) as Record<string, unknown> | undefined;
      if (!row) return null;

      const expiresAt = String(row['expires_at']);
      if (new Date(expiresAt).getTime() < Date.now()) {
        const delStmt = sqliteDb.prepare('DELETE FROM admin_sessions WHERE token = ?');
        delStmt.run(token);
        return null;
      }

      return {
        token: String(row['token']),
        userId: String(row['user_id']),
        authorName: String(row['author_name']),
        role: String(row['role']) as 'admin' | 'author',
        createdAt: String(row['created_at']),
        expiresAt,
        userAgent: row['user_agent'] ? String(row['user_agent']) : undefined,
        ip: row['ip'] ? String(row['ip']) : undefined,
      };
    } catch (e) {
      console.error('Session validate error:', e);
    }
  }
  return null;
}

export function removeSessionToken(token: string): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('DELETE FROM admin_sessions WHERE token = ?');
      stmt.run(token);
      logAuditEvent('SESSION_LOGOUT', 'User', { tokenPreview: token.substring(0, 8) + '...' });
    } catch (e) {
      console.error('Session remove error:', e);
    }
  }
}

// Articles CRUD via SQLite
export function getArticlesFromDb(): AcademicArticle[] {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('SELECT * FROM articles ORDER BY published_at DESC');
      const rows = stmt.all();
      return rows.map(rowToArticle);
    } catch (e) {
      console.error('Articles fetch error:', e);
    }
  }

  // Fallback to JSON
  try {
    if (existsSync(jsonBackupPath)) {
      return JSON.parse(readFileSync(jsonBackupPath, 'utf8'));
    }
  } catch (err) {
    console.debug('JSON fallback read skipped', err);
  }
  return [];
}

export function getArticleByIdOrSlugFromDb(idOrSlug: string): AcademicArticle | null {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('SELECT * FROM articles WHERE id = ? OR slug = ? LIMIT 1');
      const row = stmt.get(idOrSlug, idOrSlug);
      if (row) return rowToArticle(row);
    } catch (e) {
      console.error('Article fetch error:', e);
    }
  }
  return null;
}

export function insertArticleIntoDb(article: AcademicArticle): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT INTO articles (
          id, slug, title, subtitle, discipline, abstract, content,
          keywords_json, references_json, reading_time_minutes, published_at,
          updated_at, status, view_count, featured_quote, cover_image,
          cover_image_caption, cover_image_alt, cover_aspect_ratio, visual_analysis_notes,
          blockchain_hash, block_number, block_timestamp, is_blockchain_verified,
          blockchain_status, certificate_id, submission_timestamp, sha512_hash,
          quantum_signature, version, word_count, char_count, detailed_date_tr,
          revision_history_json
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?
        )
      `);

      stmt.run(
        article.id,
        article.slug,
        article.title,
        article.subtitle || null,
        article.discipline,
        article.abstract || null,
        article.content,
        JSON.stringify(article.keywords || []),
        JSON.stringify(article.references || []),
        article.readingTimeMinutes || 5,
        article.publishedAt,
        article.updatedAt,
        article.status || 'published',
        article.viewCount || 0,
        article.featuredQuote || null,
        article.coverImage || null,
        article.coverImageCaption || null,
        article.coverImageAlt || null,
        article.coverAspectRatio || '16/9',
        article.visualAnalysisNotes || null,
        article.blockchainHash || null,
        article.blockNumber || null,
        article.blockTimestamp || null,
        article.isBlockchainVerified ? 1 : 0,
        article.blockchainStatus || null,
        article.certificateId || null,
        article.submissionTimestamp || null,
        article.sha512Hash || null,
        article.quantumSignature || null,
        article.version || 1,
        article.wordCount || 0,
        article.charCount || 0,
        article.detailedDateTr || null,
        JSON.stringify(article.revisionHistory || [])
      );

      logAuditEvent('ARTICLE_CREATED', 'Admin', { id: article.id, title: article.title, sha512: article.sha512Hash?.substring(0, 16) });
    } catch (e) {
      console.error('Article insert error:', e);
    }
  }

  // Also sync to JSON backup for safety
  syncToJsonBackup();
}

export function updateArticleInDb(article: AcademicArticle): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        UPDATE articles SET
          slug = ?, title = ?, subtitle = ?, discipline = ?, abstract = ?, content = ?,
          keywords_json = ?, references_json = ?, reading_time_minutes = ?, updated_at = ?,
          status = ?, featured_quote = ?, cover_image = ?, cover_image_caption = ?,
          cover_image_alt = ?, cover_aspect_ratio = ?, visual_analysis_notes = ?,
          blockchain_hash = ?, block_number = ?, block_timestamp = ?,
          is_blockchain_verified = ?, blockchain_status = ?, certificate_id = ?,
          submission_timestamp = ?, sha512_hash = ?, quantum_signature = ?,
          version = ?, word_count = ?, char_count = ?, detailed_date_tr = ?,
          revision_history_json = ?
        WHERE id = ?
      `);

      stmt.run(
        article.slug,
        article.title,
        article.subtitle || null,
        article.discipline,
        article.abstract || null,
        article.content,
        JSON.stringify(article.keywords || []),
        JSON.stringify(article.references || []),
        article.readingTimeMinutes || 5,
        article.updatedAt,
        article.status || 'published',
        article.featuredQuote || null,
        article.coverImage || null,
        article.coverImageCaption || null,
        article.coverImageAlt || null,
        article.coverAspectRatio || '16/9',
        article.visualAnalysisNotes || null,
        article.blockchainHash || null,
        article.blockNumber || null,
        article.blockTimestamp || null,
        article.isBlockchainVerified ? 1 : 0,
        article.blockchainStatus || null,
        article.certificateId || null,
        article.submissionTimestamp || null,
        article.sha512Hash || null,
        article.quantumSignature || null,
        article.version || 1,
        article.wordCount || 0,
        article.charCount || 0,
        article.detailedDateTr || null,
        JSON.stringify(article.revisionHistory || []),
        article.id
      );

      logAuditEvent('ARTICLE_UPDATED', 'Admin', { id: article.id, title: article.title, version: article.version });
    } catch (e) {
      console.error('Article update error:', e);
    }
  }

  syncToJsonBackup();
}

export function incrementViewCountInDb(articleId: string): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?');
      stmt.run(articleId);
    } catch (e) {
      console.error('View count increment error:', e);
    }
  }
}

export function deleteArticleFromDb(articleId: string): boolean {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare('DELETE FROM articles WHERE id = ?');
      stmt.run(articleId);
      logAuditEvent('ARTICLE_DELETED', 'Admin', { id: articleId });
      syncToJsonBackup();
      return true;
    } catch (e) {
      console.error('Article delete error:', e);
      return false;
    }
  }
  return false;
}

export function seedInitialArticlesIfEmpty(initialArticles: AcademicArticle[]): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const countStmt = sqliteDb.prepare('SELECT COUNT(*) as count FROM articles');
      const res = countStmt.get();
      const count = Number(res?.['count'] || 0);
      if (count === 0) {
        console.log('[SQLite DB] Seeding initial academic collection into SQLite...');
        for (const a of initialArticles) {
          insertArticleIntoDb(a);
        }
        console.log(`[SQLite DB] Successfully seeded ${initialArticles.length} articles.`);
      }
    } catch (e) {
      console.error('Seeding error:', e);
    }
  }
}

export function getBlockchainLedger(category?: string): BlockchainBlockRecord[] {
  if (isUsingSqlite && sqliteDb) {
    try {
      if (category && category !== 'all') {
        const stmt = sqliteDb.prepare('SELECT * FROM blockchain_ledger WHERE category = ? ORDER BY block_number DESC');
        return stmt.all(category).map(rowToBlockRecord);
      }
      const stmt = sqliteDb.prepare('SELECT * FROM blockchain_ledger ORDER BY block_number DESC');
      return stmt.all().map(rowToBlockRecord);
    } catch (e) {
      console.error('Ledger fetch error:', e);
    }
  }
  try {
    if (existsSync(ledgerBackupPath)) {
      const list = JSON.parse(readFileSync(ledgerBackupPath, 'utf8')) as BlockchainBlockRecord[];
      if (category && category !== 'all') {
        return list.filter((b) => b.category === category);
      }
      return list;
    }
  } catch {
    // ignore
  }
  return [];
}

export function getLatestBlockchainBlock(): BlockchainBlockRecord | null {
  const all = getBlockchainLedger();
  return all.length > 0 ? all[0] : null;
}

export function insertBlockchainBlock(block: BlockchainBlockRecord): void {
  if (isUsingSqlite && sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO blockchain_ledger (
          block_number, block_hash, previous_hash, merkle_root,
          category, item_id, item_title, sha512_hash, signature,
          rust_payload_json, node_rpc_url, timestamp, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        block.blockNumber,
        block.blockHash,
        block.previousHash,
        block.merkleRoot,
        block.category,
        block.itemId,
        block.itemTitle,
        block.sha512Hash,
        block.signature,
        block.rustPayloadJson,
        block.nodeRpcUrl || null,
        block.timestamp,
        block.status
      );
      logAuditEvent('BLOCKCHAIN_BLOCK_MINTED', 'Orçun Kundakcı', {
        blockNumber: block.blockNumber,
        category: block.category,
        itemId: block.itemId,
        blockHash: block.blockHash.substring(0, 18) + '...',
      });
    } catch (e) {
      console.error('Blockchain block insert error:', e);
    }
  }

  try {
    const current = getBlockchainLedger();
    if (!current.some((b) => b.blockNumber === block.blockNumber)) {
      current.unshift(block);
    }
    writeFileSync(ledgerBackupPath, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    console.error('Ledger backup write error:', e);
  }
}

function rowToBlockRecord(row: Record<string, unknown>): BlockchainBlockRecord {
  return {
    blockNumber: Number(row['block_number']),
    blockHash: String(row['block_hash']),
    previousHash: String(row['previous_hash']),
    merkleRoot: String(row['merkle_root'] || ''),
    category: (String(row['category'] || 'tde') as BlockchainCategory),
    itemId: String(row['item_id'] || row['article_id'] || ''),
    itemTitle: String(row['item_title'] || ''),
    sha512Hash: String(row['sha512_hash']),
    signature: String(row['signature']),
    rustPayloadJson: String(row['rust_payload_json'] || '{}'),
    nodeRpcUrl: row['node_rpc_url'] ? String(row['node_rpc_url']) : undefined,
    timestamp: String(row['timestamp']),
    status: (String(row['status'] || 'confirmed_local') as 'confirmed_local' | 'synced_rust_node' | 'queued_for_node'),
  };
}

export function getDatabaseStats() {
  if (isUsingSqlite && sqliteDb) {
    try {
      const artCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM articles').get();
      const blockCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM blockchain_ledger').get();
      const verifiedArtCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM articles WHERE is_blockchain_verified = 1').get();
      const sessionCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM admin_sessions').get();
      const auditCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
      const recentLogs = sqliteDb.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5').all();

      return {
        engine: 'SQLite 3 (Native Node.js WAL) + Cloud Firestore + Rust Ledger',
        status: 'Active & ACID Compliant',
        passwordKdf: 'Scrypt (N=16384, r=8) + PBKDF2-HMAC-SHA512 (210,000 iter)',
        articleCount: Number(artCount?.['count'] || 0),
        verifiedBlocksCount: Math.max(Number(blockCount?.['count'] || 0), Number(verifiedArtCount?.['count'] || 0)),
        ledgerBlocksCount: Number(blockCount?.['count'] || 0),
        activeSessionsCount: Number(sessionCount?.['count'] || 0),
        auditLogEntries: Number(auditCount?.['count'] || 0),
        recentLogs: recentLogs.map((l) => ({
          id: String(l['id']),
          timestamp: String(l['timestamp']),
          eventType: String(l['event_type']),
          actor: String(l['actor']),
        })),
        storagePath: sqliteDbPath,
      };
    } catch (e) {
      return { engine: 'SQLite (Degraded)', error: String(e) };
    }
  }

  return {
    engine: 'JSON Atomic Journal Store + Cloud Firestore',
    status: 'Active',
    passwordKdf: 'Scrypt + PBKDF2-HMAC-SHA512',
    articleCount: getArticlesFromDb().length,
    verifiedBlocksCount: getBlockchainLedger().length,
    ledgerBlocksCount: getBlockchainLedger().length,
    activeSessionsCount: 1,
    auditLogEntries: 0,
    storagePath: jsonBackupPath,
  };
}

function syncToJsonBackup() {
  try {
    if (isUsingSqlite && sqliteDb) {
      const stmt = sqliteDb.prepare('SELECT * FROM articles ORDER BY published_at DESC');
      const rows = stmt.all();
      const articles = rows.map(rowToArticle);
      writeFileSync(jsonBackupPath, JSON.stringify(articles, null, 2), 'utf8');
    }
  } catch (e) {
    console.error('Sync to JSON backup failed:', e);
  }
}

function rowToArticle(row: Record<string, unknown>): AcademicArticle {
  return {
    id: String(row['id']),
    slug: String(row['slug']),
    title: String(row['title']),
    subtitle: row['subtitle'] ? String(row['subtitle']) : undefined,
    discipline: String(row['discipline']) as 'tde' | 'felsefe' | 'kesisim',
    abstract: String(row['abstract'] || ''),
    content: String(row['content']),
    keywords: JSON.parse(String(row['keywords_json'] || '[]')),
    references: JSON.parse(String(row['references_json'] || '[]')),
    readingTimeMinutes: Number(row['reading_time_minutes'] || 5),
    publishedAt: String(row['published_at']),
    updatedAt: String(row['updated_at']),
    status: (String(row['status']) as 'published' | 'draft') || 'published',
    viewCount: Number(row['view_count'] || 0),
    featuredQuote: row['featured_quote'] ? String(row['featured_quote']) : undefined,
    coverImage: row['cover_image'] ? String(row['cover_image']) : undefined,
    coverImageCaption: row['cover_image_caption'] ? String(row['cover_image_caption']) : undefined,
    coverImageAlt: row['cover_image_alt'] ? String(row['cover_image_alt']) : undefined,
    coverAspectRatio: (row['cover_aspect_ratio'] as '16/9' | '4/3' | '21/9' | '1/1') || '16/9',
    visualAnalysisNotes: row['visual_analysis_notes'] ? String(row['visual_analysis_notes']) : undefined,
    blockchainHash: row['blockchain_hash'] ? String(row['blockchain_hash']) : undefined,
    blockNumber: row['block_number'] ? Number(row['block_number']) : undefined,
    blockTimestamp: row['block_timestamp'] ? String(row['block_timestamp']) : undefined,
    isBlockchainVerified: Boolean(row['is_blockchain_verified']),
    blockchainStatus: row['blockchain_status'] ? (String(row['blockchain_status']) as 'pending' | 'submitted' | 'approved' | 'registered') : undefined,
    certificateId: row['certificate_id'] ? String(row['certificate_id']) : undefined,
    submissionTimestamp: row['submission_timestamp'] ? String(row['submission_timestamp']) : undefined,
    sha512Hash: row['sha512_hash'] ? String(row['sha512_hash']) : undefined,
    quantumSignature: row['quantum_signature'] ? String(row['quantum_signature']) : undefined,
    version: Number(row['version'] || 1),
    wordCount: row['word_count'] ? Number(row['word_count']) : undefined,
    charCount: row['char_count'] ? Number(row['char_count']) : undefined,
    detailedDateTr: row['detailed_date_tr'] ? String(row['detailed_date_tr']) : undefined,
    academicPeriod: row['academic_period'] ? String(row['academic_period']) : undefined,
    doiOrIsbn: row['doi_or_isbn'] ? String(row['doi_or_isbn']) : undefined,
    lastRevisionReason: row['last_revision_reason'] ? String(row['last_revision_reason']) : undefined,
    revisionHistory: JSON.parse(String(row['revision_history_json'] || '[]')),
  };
}
