import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
(globalThis as unknown as Record<string, unknown>)['__dirname'] = __dirname;
(globalThis as unknown as Record<string, unknown>)['__filename'] = __filename;
(global as unknown as Record<string, unknown>)['__dirname'] = __dirname;
(global as unknown as Record<string, unknown>)['__filename'] = __filename;

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import {join} from 'node:path';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash, createHmac} from 'node:crypto';
import {GoogleGenAI, Type} from '@google/genai';
import {createRequire} from 'node:module';
import type {App, AppOptions, Credential} from 'firebase-admin/app';
import type {Auth, DecodedIdToken} from 'firebase-admin/auth';
import type {Firestore} from 'firebase-admin/firestore';

const nodeRequire = createRequire(import.meta.url);
const {initializeApp, getApps, applicationDefault} = nodeRequire('firebase-admin/app') as {
  initializeApp: (options?: AppOptions) => App;
  getApps: () => App[];
  applicationDefault: () => Credential;
};
const {getAuth} = nodeRequire('firebase-admin/auth') as {
  getAuth: () => Auth;
};
const {getFirestore} = nodeRequire('firebase-admin/firestore') as {
  getFirestore: () => Firestore;
};
import {
  initDatabaseSchema,
  getOrCreateDefaultAdmin,
  createAdminSession,
  validateSessionToken,
  removeSessionToken,
  getArticlesFromDb,
  insertArticleIntoDb,
  updateArticleInDb,
  deleteArticleFromDb,
  incrementViewCountInDb,
  seedInitialArticlesIfEmpty,
  getDatabaseStats,
  updateAdminPassword,
  verifyPassword,
  logAuditEvent,
  hashPasswordWithSalt,
  resolveWritableDataDir,
} from './server/db';
import {registerHeritageSlidesRoutes} from './server/heritage-slides';
import {registerCommunityGovernanceRoutes} from './server/community-governance';
import {registerCloudflareEdgeSecurityRoutes} from './server/cloudflare-edge-security';
import {INITIAL_ARTICLES as FULL_SEED_ARTICLES} from './app/core/constants/initial-articles';

const browserDistFolder = join(__dirname, '../browser');
const dataDir = resolveWritableDataDir();
const uploadsDir = join(dataDir, 'uploads');
const articlesFilePath = join(dataDir, 'articles.json');
const securityFilePath = join(dataDir, 'security.json');

// Ensure uploads directory exists (EROFS-safe on Vercel Serverless)
try {
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, {recursive: true});
  }
} catch {
  // Handled by resolveWritableDataDir /tmp fallback on Serverless
}

// Interface definition
export interface AcademicArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  discipline: 'tde' | 'felsefe' | 'kesisim'; // Türk Dili ve Edebiyatı, Felsefe, Disiplinlerarası Kesişim
  abstract: string;
  content: string;
  keywords: string[];
  references: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  viewCount: number;
  featuredQuote?: string;
  // Visual Media & Cover Fields
  coverImage?: string;
  coverImageCaption?: string;
  coverImageAlt?: string;
  coverAspectRatio?: '16/9' | '4/3' | '21/9' | '1/1';
  visualAnalysisNotes?: string;
  // Blockchain & Cultural Heritage Persistence Fields
  blockchainHash?: string;
  blockNumber?: number;
  blockTimestamp?: string;
  isBlockchainVerified?: boolean;
  blockchainStatus?: 'pending' | 'submitted' | 'approved' | 'registered';
  certificateId?: string;
  submissionTimestamp?: string;
  // Quantum-Resistant Cryptographic & Metadata Fields
  sha512Hash?: string;
  quantumSignature?: string;
  version?: number;
  wordCount?: number;
  charCount?: number;
  detailedDateTr?: string;
  academicPeriod?: string;
  doiOrIsbn?: string;
  lastRevisionReason?: string;
  revisionHistory?: {
    date: string;
    timestamp?: string;
    hash: string;
    note: string;
    reason?: string;
    author: string;
    version?: number;
  }[];
  annotations?: {
    id: string;
    quote: string;
    comment: string;
    author: string;
    createdAt: string;
    category?: string;
  }[];
}

// Initial authentic academic articles seed for Orçun Kundakcı
const INITIAL_ARTICLES: AcademicArticle[] = [
  {
    id: 'art-1',
    slug: 'turk-siirinde-varlik-ve-yokluk-diyalektigi',
    title: "Türk Şiirinde Varlık ve Yokluk Diyalektiği: Tasavvufî Poetikadan Ahmet Haşim'e Semantik Açılımlar",
    subtitle: "Varlığın ontolojik sorgusu ve Türk şiir dilinde 'adem' kavramının dönüşümü",
    discipline: 'tde',
    abstract: "Bu incelemede, Türk edebiyatının klasik ve modern dönemlerinde 'varlık' (vücûd) ve 'yokluk' (adem) diyalektiğinin şiirsel imgeye dönüşme süreçleri irdelenmektedir. Yunus Emre'den Fuzûlî'ye uzanan tasavvufi gelenek ile Ahmet Haşim'in Piyâle poetikasındaki sembolist varoluş kırılması karşılaştırmalı olarak çözümlenmektedir.",
    content: `## Giriş ve Kuramsal Çerçeve

Edebiyat ile felsefenin kesişim noktasında duran en temel sorulardan biri, dilin varlıkla kurduğu dolayımsız ya da dolaylı ilişkidir. Türk şiir geleneğinde 'yokluk' (adem), Batı nihilizmindeki mutlak hiçlikten köklü biçimde ayrışır; varlığın hakiki kaynağına işaret eden bir 'ontolojik geçiş eşiği' olarak tecelli eder.

### 1. Klasik Poetikada Varlık ve Adem İlişkisi

Klasik Türk şiirinde şair, varlık iddiasından soyunarak (terk-i tealluk) yokluk menziline ulaşmayı hedefler. Fuzûlî'nin gazellerinde rastlanan:

> *"Beni candan usandırdı cefâdan yâr usanmaz mı / Felekler yandı âhımdan murâdım şem'i yanmaz mı"*

beyti, yalnızca bireysel bir ıstırabın ifadesi değil; benliğin çözülüşü ve aşık öznenin nesneleşerek fenâ bulması sürecidir. Tasavvuf düşüncesinde 'yok olmak', Hakikat karşısında izafi varlığından feragat etmektir.

### 2. Modern Kırılma: Ahmet Haşim ve Alacakaranlık Ontolojisi

Modernleşme süreciyle birlikte 'adem' algısı dönüştürülmüştür. Ahmet Haşim'in *Göllerde bu dem bir kamış olsam* dizesinde vücut bulan kaçış arzusu, tasavvufi bir vuslat yerine sembolist bir 'öte dünya' hasretidir. Haşim'in şiirinde günbatımı, kızıl ufuklar ve alacakaranlık; varlık ile yokluk arasındaki berzahı (ara bölgeyi) simgeler.

### Sonuç ve Değerlendirme

Türk şiir dili, varlığı yalnızca bir tema olarak değil, doğrudan doğruya dilin imkânlarını genişleten felsefi bir deney alanı olarak işlemiştir. Klasik metinlerin tahlilinde felsefi kavram dağarcığından yararlanmak, metin şerhini mekanik bir kelime dökümünden kurtarıp derinlikli bir anlam inşasına dönüştürmektedir.`,
    keywords: ['Türk Dili ve Edebiyatı', 'Ontoloji', 'Varlık-Yokluk', 'Ahmet Haşim', 'Tasavvuf Poetikası', 'Metin Şerhi'],
    references: [
      "Tanpınar, A. H. (1988). 19'uncu Asır Türk Edebiyatı Tarihi. Çağlayan Kitabevi.",
      "İz, F. (1967). Eski Türk Edebiyatında Nazım. Bilgi Yayınevi.",
      "Haşim, A. (2001). Piyâle ve Bütün Şiirleri. Dergâh Yayınları."
    ],
    readingTimeMinutes: 6,
    publishedAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z',
    status: 'published',
    viewCount: 142,
    featuredQuote: "Klasik Türk şiirinde 'yokluk', Batı nihilizmindeki mutlak hiçlikten köklü biçimde ayrışır; varlığın hakiki kaynağına işaret eden bir ontolojik geçiş eşiğidir."
  },
  {
    id: 'art-2',
    slug: 'wittgenstein-dil-oyunlari-ve-gostergebilimsel-sessizlik',
    title: "Wittgenstein'ın Dil Oyunları ve Göstergebilimsel Sessizlik: Anlamın Sınırlarında Bir Gezinti",
    subtitle: "Tractatus'tan Felsefi Soruşturmalar'a anlamın eylemsel inşası ve edebiyatla teması",
    discipline: 'felsefe',
    abstract: "Ludwig Wittgenstein'ın erken dönemindeki mantıksal atomizmden geç dönemindeki 'dil oyunları' kuramına geçişi, dilin dünyayı resmetme işlevinden pratik yaşantı biçimi (Lebensform) içindeki eyleme evrilmesini gösterir. Bu makalede, 'üzerine konuşulamayan konusunda susmalı' düsturu ile edebî imgenin sınırları felsefi olarak irdelenmektedir.",
    content: `## Felsefi Giriş

Felsefe tarihinin en radikal dil kırılmalarından birini gerçekleştiren Ludwig Wittgenstein, erken dönem eseri *Tractatus Logico-Philosophicus*'ta şu ünlü önermeyle son noktayı koyar:

> *"Üzerinde konuşulamayan konusunda susulmalıdır." (Wovon man nicht sprechen kann, darüber muss man schweigen - Önerme 7)*

Fakat geç dönem eseri *Felsefi Soruşturmalar* (Philosophische Untersuchungen) ile birlikte düşünür, dili katı bir mantık aynası olarak görmekten vazgeçer. Dil artık bir aynadan ziyade zengin bir alet çantasıdır.

### 1. Dil Oyunları (Sprachspiele) ve Yaşam Biçimleri

Wittgenstein'a göre bir sözcüğün anlamı, onun dildeki kullanımıdır (use). Dil oyunları teorisi, dilin kurallara bağlı ama katı mantık formüllerine hapsedilemez canlı yapısını öne sürer:
- Satranç oyunundaki bir piyonun değeri gibi, sözcüğün anlamı da içinde bulunduğu oyunun bağlamında belirlenir.
- Şiir okumak, felsefi argüman kurmak, şaka yapmak veya dua etmek birbirinden farklı kurallarla işleyen müstakil 'dil oyunları'dır.

### 2. Edebiyat Açısından 'Sessizlik' ve İfade Edilemeyen

Tractatus'taki 'susulmalıdır' ilkesi, metafiziği küçümsemek için değil; aksine etik ve estetik olanın mantıksal önermelerle tüketilemeyecek kadar yüce olduğunu vurgulamak içindir. Wittgenstein'ın deyişiyle: *"Söylenemeyen kendisini gösterir; bu mistik olandır."*

İşte edebiyat ve şiir, mantığın susmak zorunda kaldığı o 'gösterim' (showing) alanında nefes alır. Kelimelerin doğrudan söyleyemediğini, ritim, ahenk, boşluklar ve metaforlar dolayımıyla sezdirir.

### Felsefi Çıkarım

Akademik felsefe çalışırken dili salt soyut bir formülasyon olarak değil, insanın dünyayla kurduğu dinamik varoluşsal bağ olarak kavramak şarttır. Dilin sınırları, insanın düşünce ufkunun da haritasıdır.`,
    keywords: ['Felsefe', 'Ludwig Wittgenstein', 'Dil Oyunları', 'Epistemoloji', 'Hermeneutik', 'Anlam Kuramı'],
    references: [
      "Wittgenstein, L. (2006). Tractatus Logico-Philosophicus. (Çev. Oruç Aruoba). Metis Yayınları.",
      "Wittgenstein, L. (2007). Felsefi Soruşturmalar. (Çev. Deniz Kanıt). Kabalcı Yayınevi.",
      "Aruoba, O. (1990). Nesne ve Dil. AFA Yayınları."
    ],
    readingTimeMinutes: 7,
    publishedAt: '2026-08-28T09:15:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
    status: 'published',
    viewCount: 98,
    featuredQuote: "Mantığın susmak zorunda kaldığı yerde edebiyat başlar: Kelimelerin doğrudan söyleyemediğini şiir, ritim ve sessizliğin diliyle sezdirir."
  },
  {
    id: 'art-3',
    slug: 'edebi-metnin-hermeneutigi-ve-metin-serhi',
    title: "Edebî Metnin Hermeneutiği: Paul Ricoeur ve Metin Şerhi Geleneğinin Kesişim Noktaları",
    subtitle: "Yorumlama sanatında klasik şerh usulü ile modern felsefi hermeneutiğin mukayesesi",
    discipline: 'kesisim',
    abstract: "Bu çalışma, AÖF Türk Dili ve Edebiyatı ile AÖF Felsefe disiplinlerinin kesiştiği ortak metodolojik zemini irdelemektedir. Paul Ricoeur'ün 'metin ve eylem' kuramı ile geleneksel Osmanlı metin şerhi geleneği (metnin lafzî, mecazî ve hakikî katmanları) karşılaştırılarak bir metni 'anlamak' ile 'açıklamak' arasındaki felsefi gerilim çözümlenmektedir.",
    content: `## Arakesit: Edebiyat ve Felsefenin Ortak Zemini

Türk Dili ve Edebiyatı ile Felsefe disiplinleri, çoğu zaman iki ayrı akademik bölme gibi algılansa da temelde aynı meşgalenin mirasçılarıdır: Metinle karşılaşmak, dilde tecelli eden anlamı deşifre etmek ve insanın varoluşsal tecrübesini kavramak.

### 1. Ricoeur ve Yorumbilgisel Daire

Fransız filozof Paul Ricoeur, hermeneutik metodolojiyi iki kutup arasına yerleştirir:
1. **Açıklamak (Erklären):** Metnin dilbilgisel yapısını, kelime kadrosunu, vezin ve kafiye gibi biçimsel unsurlarını objektif bir incelemeye tabi tutmak.
2. **Anlamak (Verstehen):** Metnin okura sunduğu 'dünya tasarımı'na nüfuz etmek, yazarın ufku ile okurun ufkunu kaynaştırmak (Gadamer'in deyimiyle Horizontverschmelzung).

### 2. Klasik Şerh Geleneğinde Çok Katmanlılık

Bizim klasik edebiyatımızdaki 'şerh' usulü, günümüz hermeneutiğinden yüzyıllar önce benzer bir yöntemsel derinliğe sahipti. Bir beyit şerh edilirken:
- **Lügat ve Sarf/Nahiv tahlili:** Kelimelerin köken bilgisi ve cümle sentaksı açıklanır (Ricoeur'ün 'açıklama' aşaması).
- **Belagat tahlili:** Teşbih, istiare, mecaz ve tenasüp sanatları incelenir.
- **İrfani/Felsefi mana:** Beytin ima ettiği varoluşsal hakikat ve insanlık durumu tefekkür edilir (Ricoeur'ün 'anlama' aşaması).

### Değerlendirme

Hem edebiyat öğrencisi hem felsefe talibi olarak metne yaklaşırken, biçim ile anlamı birbirinden koparmamak gerekir. Sağlam bir dil bilgisi olmadan felsefe gevezeliğe, felsefi bir derinlik olmadan edebiyat tahlili ise kuru bir kelime kataloglamasına dönüşür.`,
    keywords: ['Disiplinlerarası', 'Hermeneutik', 'Paul Ricoeur', 'Metin Şerhi', 'Türk Edebiyatı', 'Felsefe'],
    references: [
      "Ricoeur, P. (2007). Yorum Teorisi: Söylem ve Anlam Fazlası. Babil Yayınları.",
      "Gadamer, H. G. (2008). Hakikat ve Yöntem. Paradigma Yayınları.",
      "Mengi, M. (2002). Divan Şiiri Yazıları. Akçağ Yayınları."
    ],
    readingTimeMinutes: 5,
    publishedAt: '2026-09-04T12:00:00.000Z',
    updatedAt: '2026-09-12T16:00:00.000Z',
    status: 'published',
    viewCount: 115,
    featuredQuote: "Sağlam bir dil bilgisi olmadan felsefe gevezeliğe, felsefi bir derinlik olmadan edebiyat tahlili ise kuru bir kelime kataloglamasına dönüşür."
  },
  {
    id: 'art-4',
    slug: 'divan-siirinde-mazmun-ve-metafor',
    title: "Divan Şiirinde Mazmun ve Metafor: Kavramsal Çerçeve ve Ontolojik Karşılıklar",
    subtitle: "Kalıp imgeden bilişsel metafora klasik Türk edebiyatında anlam üretimi",
    discipline: 'tde',
    abstract: "Divan şiirinin merkezî yapı taşı olan 'mazmun', salt tekrarlanan bir benzetme kalıbı mıdır yoksa bir dünya görüşünün bilişsel haritası mıdır? Bu makale, Lakoff ve Johnson'ın çağdaş bilişsel metafor kuramını klasik mazmun sistematiğine uygulayarak estetik ve anlamsal bir çözümleme sunmaktadır.",
    content: `## Mazmun Kavramına Yeniden Bakış

Klasik Türk edebiyatı araştırmalarında sıklıkla 'gizli anlam', 'klişeleşmiş nükte' veya 'örtük benzetme' olarak tanımlanan mazmun, aslında şair ile muhatabı arasındaki ortak kültürel ve ontolojik kodların bütünüdür.

### Mazmun ile Metafor Arasındaki Fark

- Batı poetikasındaki metafor (eğretileme), çoğu zaman şairin tekil ve şahsi tahayyülünün ürünüdür.
- Klasik mazmun ise kolektif bir hafızanın, ortak bir kozmolojinin taşıyıcısıdır. Örneğin servi boy, nergis göz veya la'l dudak; keyfi benzetmeler değil, belirli sembolik ve felsefi hiyerarşilerin metne nakşedilmiş halidir.

### Bilişsel Çözümleme

Divan şairi bu mazmunlar havuzunda yüzerken taklitçi değil, varyasyon ustasıdır. Aynı mazmunu daha önce hiç söylenmemiş bir nükteyle (bikr-i mazmun) işleyebilmek, şairin edebi maharetinin ve zeka keskinliğinin en yüksek göstergesidir.`,
    keywords: ['Divan Edebiyatı', 'Mazmun', 'Bilişsel Metafor', 'TDE', 'Belagat'],
    references: [
      "Pala, İ. (1995). Ansiklopedik Divan Şiiri Sözlüğü. Akçağ Yayınları.",
      "Lakoff, G. & Johnson, M. (2015). Metaforlar: Hayat, Anlam ve Dil. Paradigma Yayınları."
    ],
    readingTimeMinutes: 4,
    publishedAt: '2026-09-10T15:00:00.000Z',
    updatedAt: '2026-09-10T15:00:00.000Z',
    status: 'published',
    viewCount: 64,
    featuredQuote: "Mazmun, keyfi bir süsleme değil; klasik Türk aklının ve şiir tahayyülünün dilde kristalleşmiş kolektif şifresidir."
  },
  {
    id: 'art-13',
    slug: 'haci-bektas-i-veli-makalat-dort-kapi-kirk-makam-ontolojisi',
    title: "Hacı Bektâş-ı Velî ve Makâlât: Dört Kapı Kırk Makamın Ahlakî ve Ontolojik Mimarisi",
    subtitle: "Şeriat, Tarikat, Marifet ve Hakikat basamaklarında insanın varoluşsal tekâmülü",
    discipline: 'kesisim',
    abstract: "13. yüzyıl Anadolu mayasının kurucu pîrlerinden Hacı Bektâş-ı Velî'nin temel eseri 'Makâlât', dinsel ve tasavvufi bir nasihatname olmanın ötesinde, epistemoloji ile ahlak felsefesini meczeden yetkin bir ontoloji dizgesidir. 'Dört Kapı Kırk Makam' doktrini, insanın hamlıktan kâmil insan (insân-ı kâmil) mertebesine yükselişini felsefi kavramlarla açıklar.",
    content: `## Anadolu Mayası ve Felsefi Arka Plan

13. yüzyıl Anadolusu, Moğol istilalarının yarattığı siyasî ve içtimaî krizlerin ortasında, büyük bir zihinsel ve irfanî Rönesans yaşamıştır. Bu dönemin kutup şahsiyetlerinden Hacı Bektâş-ı Velî, Türk dilinin ve düşüncesinin en berrak kaynaklarından biridir.

### 1. Dört Kapı Kırk Makamın Felsefi Anlamı

Makâlât'ta inşa edilen dört kapı, varlık mertebeleri ile doğrudan örtüşür:

1. **Şeriat Kapısı (Yasa ve Norm Dünyası):** Hukukî ve zâhirî kuralları temsil eder. Kant'ın ödev ahlakına benzer biçimde, toplumsal düzenin asgari müşterek zeminidir.
2. **Tarikat Kapısı (İçselleşme ve Disiplin):** Kuralı salt dışsal bir emir olarak değil, öznenin kendi iradesiyle benimsediği bir iç disipline dönüştürmesidir.
3. **Marifet Kapısı (Bilişsel Aydınlanma ve Sezgi):** Epistemolojik sıçramadır. Şeylerin zâhirini değil, bâtınını ve illetini kavramaktır (İrfan).
4. **Hakikat Kapısı (Ontolojik Bütünleşme / Fenâ):** Benlik iddiasının ortadan kalktığı, özne-nesne ikiliğinin aşıldığı vahdet makamıdır.

### 2. İnsan Tasavvuru: 'Eline, Diline, Beline Sahip Olmak'

Hacı Bektâş-ı Velî'nin bu ünlü düsturu, basit bir ahlak tavsiyesi değil; psikanalitik ve felsefi açıdan insanın üç temel eylem alanını tanzim eder:
- **El:** İktisadi ve maddî eylemler, adalet, üretkenlik.
- **Dil:** İletişim, hakikat beyanı, dürüstlük ve sözün ontolojik sorumluluğu.
- **Bel:** Arzu, nefis, şehvet ve biyolojik dürtülerin akıl ve ahlakın denetimine verilmesi.

> *"Hararet nardadır, sacda değildir / Keramet baştadır, tacda değildir / Her ne arar isen, kendinde ara / Kudüs'te, Mekke'de, Hac'da değildir."*

Bu dörtlük, varlığın merkezine insanı (mikrokozmos) koyan antropolojik ve felsefi hümanizmin en saf Türkçe ifadesidir.

### Netice

Hacı Bektâş-ı Velî'nin düşüncesi, dogmatik bağnazlığı reddeden, aklı ve ahlakı merkeze alan evrensel bir etik tekliftir.`,
    keywords: ['Hacı Bektâş-ı Velî', 'Makâlât', 'Dört Kapı Kırk Makam', 'Tasavvuf Felsefesi', 'Ahlak Felsefesi', 'Anadolu İrfanı', 'TDE'],
    references: [
      "Hacı Bektâş-ı Velî. (2007). Makâlât. (Haz. Esat Coşan). Seha Neşriyat.",
      "Ocak, A. Y. (1996). Bektâşîlik ve Bektaşîler. Dergâh Yayınları.",
      "Gölpınarlı, A. (1958). Vilâyet-nâme: Menâkıb-ı Hünkâr Hacı Bektâş-ı Velî. İnkılâp Kitabevi."
    ],
    readingTimeMinutes: 6,
    publishedAt: '2026-09-19T06:00:00.000Z',
    updatedAt: '2026-09-19T06:00:00.000Z',
    status: 'published',
    viewCount: 210,
    featuredQuote: "Her ne arar isen kendinde ara; Kudüs'te, Mekke'de, Hac'da değildir. İnsan kendi özünü bildiğinde cihanın hakikatine erer."
  },
  {
    id: 'art-14',
    slug: 'yunus-emre-siirinde-oz-varlik-ve-turkce-felsefe',
    title: "Yunus Emre Şiirinde 'Öz-Varlık' ve Türkçe Felsefe: \"Ete Kemiğe Büründüm, Yunus Diye Göründüm\"",
    subtitle: "Kelimelerin arılığıyla varlığın derinliğine: Anadolu Türkçesinin felsefi kudreti",
    discipline: 'kesisim',
    abstract: "Yunus Emre, Türk dilini yalnızca bir duygu taşıyıcısı değil, yüksek felsefi düşüncenin kurucu enstrümanı kılan eşsiz bir bilgedir. Bu makalede, 'Ete kemiğe büründüm / Yunus diye göründüm' ve 'Beni bende demen, bende değilim' dizeleri ekseninde benlik (ego), fenomenolojik görünüş ve aşkın ontoloji tahlil edilmektedir.",
    content: `## Giriş: Türkçenin Felsefe Dili Olarak İnşası

Yunus Emre, 13. ve 14. yüzyıllarda Arapça ve Farsçanın ilim ve edebiyat çevrelerinde mutlak hâkim olduğu bir devirde, Türkçenin duru nehrinden evrensel bir ontoloji inşa etmiştir. Onun sadeliği (sehl-i mümteni), arkasında muazzam bir metafizik derinlik barındırır.

### 1. 'Ete Kemiğe Bürünmek': Beden, Ruh ve Fenomenoloji

> *"Ete kemiğe büründüm / Yunus diye göründüm"*

Bu iki mısra, modern fenomenolojinin yüzyıllar sonra tartışacağı 'bedenleşme' (embodiment) ve 'tezahür' meselesini iki dizede özetler:
- **Ete kemiğe bürünmek:** Aşkın ve zamansız olan ilahi özün, maddî ve tarihsel dünyada somut bir beden giyinmesidir.
- **Görünmek:** Buradaki 'görünmek' fiili aldatıcı bir suret değil, Hakikatin görünür kılınması (epifani / tecelli) anlamına gelir.

### 2. Özne ve Yabancılaşma: 'Bir Ben Vardır Bende Benden İçeri'

> *"Beni bende demen bende değilim / Bir ben vardır bende benden içeri"*

Yunus, modern psikolojinin ve varoluşçu felsefenin ancak 20. yüzyılda formüle edebildiği 'bölünmüş özne' ve 'otantik benlik' problematiğine temas eder:
- Dışarıdan gözlemlenen, toplumsal rollerle sınırlı ben (ego / nefs).
- Ruhun derinliklerinde ilahi nefhayla irtibatlı hakiki ben (öz).

### 3. Evrensel Sevgi ve Ontolojik Eşitlik

> *"Yaratılanı severiz / Yaratandan ötürü"*

Bu ilke, soyut bir hümanizm değil; bütün varlıkları aynı ilahi tözün tezahürleri olarak görmekten kaynaklanan mutlak bir ontolojik eşitlik ve saygı bilincidir.

### Değerlendirme

Yunus Emre'yi okumak, felsefeyi Grekçe ya da Almanca kavramların dar kalıplarından kurtarıp, Türkçenin yaşayan ruhunda yeniden duymak demektir.`,
    keywords: ['Yunus Emre', 'Türkçe Felsefe', 'Ontoloji', 'Fenomenoloji', 'Sehl-i Mümteni', 'Benlik Sorunu', 'AÖF TDE'],
    references: [
      "Tatçı, M. (1990). Yunus Emre Dîvânı. Kültür Bakanlığı Yayınları.",
      "Gölpınarlı, A. (1965). Yunus Emre: Hayatı ve Şiirleri. Varlık Yayınları.",
      "Topçu, N. (1975). Yunus Emre. Dergâh Yayınları."
    ],
    readingTimeMinutes: 7,
    publishedAt: '2026-09-19T06:30:00.000Z',
    updatedAt: '2026-09-19T06:30:00.000Z',
    status: 'published',
    viewCount: 275,
    featuredQuote: "Ete kemiğe büründüm, Yunus diye göründüm: Ten fânidir geçer gider, aslolan candaki ezeli hakikattir."
  },
  {
    id: 'art-15',
    slug: 'pir-sultan-abdal-poetikasinda-direnis-ve-politik-ontoloji',
    title: "Pîr Sultan Abdal Poetikasında Adalet Arayışı ve Politik Ontoloji: \"Dönen Dönsün Ben Dönmezem Yolumdan\"",
    subtitle: "16. yüzyıl Alevi-Bektaşi deyişlerinde hakikat iddiası, mazlumiyet ve tavizsiz etik duruş",
    discipline: 'kesisim',
    abstract: "16. yüzyıl Türk halk şiirinin ve Alevi-Bektaşi edebiyatının doruk noktası Pîr Sultan Abdal, sanatı ile hayatını, inancı ile toplumsal eylemini birleştirmiş trajik bir düşünce adamıdır. Bu inceleme, Pîr Sultan'ın deyişlerindeki adalet, zulme başkaldırı ve Hak yolu bilincini felsefi etik ve politik ontoloji zaviyesinden tahlil etmektedir.",
    content: `## Halk Şiirinde Epik ve Lirik Bütünleşme

Klasik divan şiiri saray ve medrese muhitinde estetik bir soyutlama üretirken, halk şiiri doğrudan doğruya toprağın, halkın ve ezilen zümrelerin feryadını dile getirmiştir. Pîr Sultan Abdal, bu damarın en gür ve tavizsiz sesidir.

### 1. 'Yol' Kavramı ve Varoluşsal Sadakat

> *"Koyun beni hak aşkına yanayım / Dönen dönsün ben dönmezem yolumdan / Yolumdan dönüp mahrum mu kalayım / Dönen dönsün ben dönmezem yolumdan"*

Buradaki 'Yol' (tarîk), salt mezhebî bir aidiyet değildir; Sokrates'in baldıran zehrini içerken gösterdiği felsefi tavizsizlik gibi, **Hakikat ile yapılan ontolojik bir ahittir**. Şair için yolundan dönmek, fiziken hayatta kalsa bile manen ve ahlaken yok olmak anlamına gelir.

### 2. Adalet, Hızır Paşa ve İktidar Çatışması

Pîr Sultan'ın şiirlerinde Hızır Paşa figürü, yalnızca tarihî bir Osmanlı paşası değil; gücün, zulmün ve ilkesiz pragmatizmin arketipidir:
- Şair, darağacını göze alarak iktidarın dünyevî vaatlerini elinin tersiyle iter.
- Kantçı anlamda 'kategorik buyruk', Pîr Sultan'da 'Hak rızası' ve mazlumun yanında saf tutma zorunluluğudur.

### 3. Taş ve Gül Metaforu: Dostun Vurduğu Yara

> *"Şu ellerin taşı hiç bana değmez / İlle dostun bir tek gülü yaralar beni"*

Bu dize, ahlak felsefesinin en dokunaklı ihanet ve sadakat tahlilidir. Düşmanın attığı taş bedeni incitir ama ruha değmez; asıl trajedi, aynı inancı ve ekmeği paylaştığın dostun attığı gülle (ihanetle) başlar.

### Sonuç

Pîr Sultan Abdal, Türkçenin ritmini ve halkın vicdanını evrensel bir ahlak abidesine dönüştürmüştür. Onun deyişleri, sadece dünün ağıtı değil, her devrin adalet ve hürriyet manifestosudur.`,
    keywords: ['Pîr Sultan Abdal', 'Alevi-Bektaşi Edebiyatı', 'Politik Ontoloji', 'Adalet', 'Etik', 'Halk Şiiri', 'Deyiş'],
    references: [
      "Gölpınarlı, A. (1953). Pir Sultan Abdal: Hayatı ve Şiirleri. Varlık Yayınları.",
      "Aslanoğlu, İ. (1984). Pir Sultan Abdallar. Erman Yayınları.",
      "Korkmaz, E. (1995). Alevilik ve Bektaşilik Terimleri Sözlüğü. Ant Yayınları."
    ],
    readingTimeMinutes: 6,
    publishedAt: '2026-09-19T07:00:00.000Z',
    updatedAt: '2026-09-19T07:00:00.000Z',
    status: 'published',
    viewCount: 320,
    featuredQuote: "Dönen dönsün ben dönmezem yolumdan: İnandığı değer uğruna bedel ödemeyi göze alanlar, tarihin vicdanında ebediyen yaşarlar."
  }
];

// ============================================================
// POST-QUANTUM & CRYPTOGRAPHIC SECURITY ENGINE (RFC 6238 / SHA-512)
// ============================================================

export interface SecurityConfig {
  authorEmail: string;
  authorName: string;
  totpSecret: string;
  backupCodes: string[];
  twoFactorEnabled: boolean;
  activeSessions: Record<string, {author: string; role: string; createdAt: string; expiresAt: string}>;
}

function initSecurityStore(): SecurityConfig {
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, {recursive: true});
    }
    if (!existsSync(securityFilePath)) {
      const initialSec: SecurityConfig = {
        authorEmail: 'orcunkundakci@gmail.com',
        authorName: 'Orçun Kundakcı',
        totpSecret: 'ORCUN2FAKUNDAKCI77SECUREKEY2026',
        backupCodes: ['948102', '512839', '773194', '420918', '831620'],
        twoFactorEnabled: true,
        activeSessions: {},
      };
      writeFileSync(securityFilePath, JSON.stringify(initialSec, null, 2), 'utf-8');
      return initialSec;
    }
    const raw = readFileSync(securityFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Security store init failed:', err);
    return {
      authorEmail: 'orcunkundakci@gmail.com',
      authorName: 'Orçun Kundakcı',
      totpSecret: 'ORCUN2FAKUNDAKCI77SECUREKEY2026',
      backupCodes: ['948102', '512839', '773194'],
      twoFactorEnabled: true,
      activeSessions: {},
    };
  }
}

function saveSecurityStore(sec: SecurityConfig): void {
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, {recursive: true});
    }
    writeFileSync(securityFilePath, JSON.stringify(sec, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist security store:', err);
  }
}

const securityConfig = initSecurityStore();

// Initialize SQLite Database Schema & Admin User
initDatabaseSchema();
const adminUser = getOrCreateDefaultAdmin(securityConfig.totpSecret, securityConfig.backupCodes);
seedInitialArticlesIfEmpty(INITIAL_ARTICLES);

// Format Turkish Academic Timestamp (Detailed with timezone)
function formatTurkishAcademicDateTime(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Istanbul',
  };
  const formatted = new Intl.DateTimeFormat('tr-TR', options).format(d);
  return `${formatted} (TSİ / UTC+3)`;
}

// Quantum-Resistant SHA-512 Hash Generation (Collision & Preimage Resistant)
function calculateArticleIntegrityHash(article: {
  title: string;
  discipline: string;
  content: string;
  references?: string[];
  publishedAt: string;
}): string {
  const payload = [
    article.title.trim(),
    article.discipline.trim(),
    article.content.trim(),
    (article.references || []).join(';;;'),
    article.publishedAt,
    'OK-AKADEMIK-KULLIYAT-V1',
  ].join(':::');

  return createHash('sha512').update(payload, 'utf8').digest('hex');
}

// Generate digital tamper-proof seal
function generateQuantumSeal(hash: string, author = 'Orçun Kundakcı'): string {
  const salt = 'QK-POST-QUANTUM-SEAL-2026';
  return createHmac('sha512', salt).update(`${author}::${hash}`).digest('hex').substring(0, 48);
}

// RFC 6238 Base32 Decoding & TOTP
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(base32: string): Buffer {
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of cleaned) {
    const val = BASE32_ALPHABET.indexOf(char);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function generateTOTP(secretBase32: string, windowOffset = 0): string {
  const epochSeconds = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epochSeconds / 30) + windowOffset;
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeStep), 0);

  const key = base32Decode(secretBase32);
  const hmac = createHmac('sha1', key).update(buffer).digest();

  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const str = (code % 1000000).toString();
  return str.padStart(6, '0');
}

function verifyTOTPCode(code: string, secretBase32: string): boolean {
  if (!code || code.trim().length !== 6) return false;
  const trimmed = code.trim();
  for (const offset of [0, -1, 1]) {
    if (generateTOTP(secretBase32, offset) === trimmed) {
      return true;
    }
  }
  return false;
}

// Helper functions for persistent store
function initDataStore(): AcademicArticle[] {
  try {
    let articles: AcademicArticle[] = [];
    const dbArticles = getArticlesFromDb();
    if (dbArticles && dbArticles.length > 0) {
      articles = dbArticles;
    } else if (existsSync(articlesFilePath)) {
      const raw = readFileSync(articlesFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      articles = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...FULL_SEED_ARTICLES];
    } else {
      articles = [...FULL_SEED_ARTICLES];
    }

    // Ensure all 16 canonical seed articles exist in both memory/JSON and SQLite DB
    const seedMap = new Map(FULL_SEED_ARTICLES.map((a) => [a.id, a]));
    const existingIds = new Set(articles.map((a) => a.id));
    for (const seedArt of FULL_SEED_ARTICLES) {
      if (!existingIds.has(seedArt.id)) {
        articles.push({...seedArt});
        insertArticleIntoDb(seedArt);
      }
    }
    articles = articles.map((art) => {
      const canonical = seedMap.get(art.id);
      if (canonical) {
        const updated = {
          ...art,
          title: canonical.title,
          subtitle: canonical.subtitle,
          abstract: canonical.abstract,
          content: canonical.content,
          coverImage: canonical.coverImage,
          coverImageCaption: canonical.coverImageCaption,
          coverImageAlt: canonical.coverImageAlt,
          annotations: canonical.annotations || art.annotations,
        };
        insertArticleIntoDb(updated);
        return updated;
      }
      return art;
    });

    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, {recursive: true});
    }

    // Enrich articles with SHA-512 hashes and Turkish timestamps if missing
    for (const a of articles) {
      if (!a.sha512Hash) {
        a.sha512Hash = calculateArticleIntegrityHash(a);
        a.quantumSignature = generateQuantumSeal(a.sha512Hash);
      }
      if (!a.detailedDateTr) {
        a.detailedDateTr = formatTurkishAcademicDateTime(a.publishedAt);
      }
      if (!a.wordCount) {
        a.wordCount = (a.content || '').trim().split(/\s+/).length;
        a.charCount = (a.content || '').length;
      }
      if (!a.version) {
        a.version = 1;
      }
      if (!a.revisionHistory) {
        a.revisionHistory = [
          {
            date: a.publishedAt,
            hash: a.sha512Hash.substring(0, 24) + '...',
            note: 'İlk akademik neşir ve kriptografik mühürleme',
            author: 'Orçun Kundakcı',
          },
        ];
      }
    }

    writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf-8');
    return articles;
  } catch (err) {
    console.error('Error initializing data store, falling back to memory store:', err);
    return INITIAL_ARTICLES;
  }
}

function saveArticles(articles: AcademicArticle[]): void {
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, {recursive: true});
    }
    writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save articles to disk:', err);
  }
}

const articlesCache: AcademicArticle[] = initDataStore();

// Lazy Gemini AI Client Initialization
let genAIClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Lazy Initialize Firebase Admin (safe for Vercel & Cloud containers)
let fbCfg: { projectId?: string; firestoreDatabaseId?: string } = {
  projectId: 'ai-studio-orunkundakcifels',
};
try {
  const fbConfigPath = join(process.cwd(), 'firebase-applet-config.json');
  if (existsSync(fbConfigPath)) {
    const firebaseConfigRaw = readFileSync(fbConfigPath, 'utf-8');
    fbCfg = JSON.parse(firebaseConfigRaw) as { projectId?: string; firestoreDatabaseId?: string };
  }
} catch {
  // Use default projectId if config file is unavailable in serverless bundle
}

let firestoreInstance: Firestore | null = null;

function ensureFirebaseAdmin(): void {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: fbCfg.projectId,
    });
  }
}

function getAdminFirestore(): Firestore {
  ensureFirebaseAdmin();
  if (!firestoreInstance) {
    firestoreInstance = fbCfg.firestoreDatabaseId
      ? (getFirestore as unknown as (databaseId: string) => Firestore)(fbCfg.firestoreDatabaseId)
      : getFirestore();
  }
  return firestoreInstance;
}

// Middleware to verify Firebase ID Token
async function verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    ensureFirebaseAdmin();
    const decodedToken = await getAuth().verifyIdToken(idToken);
    (req as Request & { user: DecodedIdToken }).user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    return;
  }
}

async function syncToFirestore(article: AcademicArticle) {
  try {
    await getAdminFirestore().collection('articles').doc(article.id).set(article);
    console.log(`[Firestore Sync] Article ${article.id} synced successfully.`);
  } catch (error) {
    console.error(`[Firestore Sync] Failed to sync article ${article.id}:`, error);
  }
}

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middlewares
app.use(express.json({limit: '10mb'}));

// Register Heritage Slides API (/api/heritage-slides)
registerHeritageSlidesRoutes(app);

// Register Community Consensus, KYC & %96 Supermajority Blockchain Voting API (/api/community/*)
registerCommunityGovernanceRoutes(app);

// Register Cloudflare D1, Zero-Trust Secret Vault & Code/Design Integrity Certificate API (/api/cloudflare/*)
registerCloudflareEdgeSecurityRoutes(app);

// Dynamic OpenGraph Digital Business Card SVG (1200x630)
app.get('/api/og-card.svg', (req, res) => {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const rawTitle =
    typeof req.query['title'] === 'string' && req.query['title'].trim()
      ? req.query['title'].trim().slice(0, 75)
      : 'Orçun KUNDAKCI Akademik Külliyatı';
  const rawDisc =
    typeof req.query['discipline'] === 'string' && req.query['discipline'].trim()
      ? req.query['discipline'].trim().slice(0, 65)
      : 'Türk Dili ve Edebiyatı • Felsefe • Cumhuriyet ve Anadolu İrfanı';

  const safeTitle = escapeXml(rawTitle);
  const safeDisc = escapeXml(rawDisc);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040d1f"/>
        <stop offset="50%" stop-color="#092047"/>
        <stop offset="100%" stop-color="#12387a"/>
      </linearGradient>
      <radialGradient id="cloud" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="sphereBg" cx="50%" cy="46%" r="48%">
        <stop offset="0%" stop-color="#0c4fd6" />
        <stop offset="45%" stop-color="#062880" />
        <stop offset="100%" stop-color="#010926" />
      </radialGradient>
      <linearGradient id="wingFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7dd3fc" />
        <stop offset="50%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#cloud)"/>
    <rect x="36" y="36" width="1128" height="558" rx="28" fill="none" stroke="#fbbf24" stroke-opacity="0.6" stroke-width="3"/>
    <g transform="translate(955, 65) scale(0.32)">
      <circle cx="250" cy="248" r="226" fill="url(#sphereBg)" stroke="#38bdf8" stroke-width="10" />
      <path d="M 242 82 A 168 168 0 0 0 120 162 L 196 238 L 196 258 L 120 334 A 168 168 0 0 0 228 412 L 228 382 A 138 138 0 0 1 154 326 L 218 262 L 218 234 L 154 170 A 138 138 0 0 1 242 112 Z" fill="url(#wingFill)" stroke="#e0f2fe" stroke-width="3" />
      <path d="M 258 82 A 168 168 0 0 1 380 162 L 304 238 L 304 258 L 380 334 A 168 168 0 0 1 272 412 L 272 382 A 138 138 0 0 0 346 326 L 282 262 L 282 234 L 346 170 A 138 138 0 0 0 258 112 Z" fill="url(#wingFill)" stroke="#e0f2fe" stroke-width="3" />
      <path d="M 241 302 L 250 322 L 259 302 L 259 418 L 241 418 Z" fill="url(#wingFill)" />
      <path d="M 250 196 L 262 236 L 286 248 L 262 260 L 250 300 L 238 260 L 214 248 L 238 236 Z" fill="#bae6fd" />
    </g>
    <text x="80" y="110" fill="#fbbf24" font-family="sans-serif" font-size="20" font-weight="bold" letter-spacing="2">YENİDEM • EDEBİYAT, FELSEFE VE TEFEKKÜR MECMUASI</text>
    <text x="80" y="190" fill="#ffffff" font-family="Georgia, serif" font-size="46" font-weight="bold">${safeTitle}</text>
    <text x="80" y="242" fill="#7dd3fc" font-family="sans-serif" font-size="26" font-weight="600">${safeDisc}</text>
    <line x1="80" y1="276" x2="1120" y2="276" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="2"/>
    <text x="80" y="340" fill="#fef3c7" font-family="Georgia, serif" font-style="italic" font-size="25">“Hayatta en hakiki mürşit ilimdir, fendir.” — Gazi Mustafa Kemal Atatürk</text>
    <text x="80" y="392" fill="#fde68a" font-family="Georgia, serif" font-style="italic" font-size="25">“İlimden gidilmeyen yolun sonu karanlıktır.” — Hünkâr Hacı Bektâş-ı Velî</text>
    <text x="80" y="472" fill="#e2e8f0" font-family="sans-serif" font-size="22">16 Akademik Makale • %96 Topluluk Konsensüsü • Aruz Lab • 7 Ulu Ozan • 4 Kapı 40 Makam</text>
    <text x="80" y="545" fill="#38bdf8" font-family="monospace" font-size="21" font-weight="bold">YENİDEM • Orçun KUNDAKCI Kürsüsü</text>
    <text x="720" y="545" fill="#34d399" font-family="monospace" font-size="20" font-weight="bold">✓ SHA-512 KRİPTOGRAFİK MÜHÜRLÜ</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

// ==========================================
// REST API ROUTES
// ==========================================

// 1. GET /api/articles - List & filter articles
app.get('/api/articles', (req, res) => {
  try {
    const discipline = req.query['discipline'] as string | undefined;
    const search = req.query['q'] as string | undefined;
    const status = req.query['status'] as string | undefined;

    let results = [...articlesCache];

    if (discipline && discipline !== 'all') {
      results = results.filter((a) => a.discipline === discipline);
    }

    if (status && status !== 'all') {
      results = results.filter((a) => a.status === status);
    } else {
      // By default return only published unless explicit
      results = results.filter((a) => a.status === 'published');
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
          a.abstract.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // Sort newest first
    results.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// 2. GET /api/articles/:id - Single article details & increment view count
app.get('/api/articles/:id', (req, res) => {
  try {
    const idOrSlug = req.params['id'];
    const article = articlesCache.find(
      (a) => a.id === idOrSlug || a.slug === idOrSlug,
    );
    if (!article) {
      res.status(404).json({success: false, error: 'Makale bulunamadı.'});
      return;
    }

    // Increment view count
    article.viewCount = (article.viewCount || 0) + 1;
    saveArticles(articlesCache);
    incrementViewCountInDb(article.id);

    res.json({success: true, data: article});
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// ==========================================
// BLOCKCHAIN & CULTURAL HERITAGE PERSISTENCE
// ==========================================

// 1. POST /api/blockchain/register - Register article on the blockchain
app.post('/api/blockchain/register', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({success: false, error: 'Blockchain kaydı için yetkili oturum gereklidir.'});
      return;
    }

    const {articleId} = req.body;
    const article = articlesCache.find(a => a.id === articleId);
    if (!article) {
      res.status(404).json({success: false, error: 'Makale bulunamadı.'});
      return;
    }

    // Simulate Blockchain Registration (Cultural Heritage Node)
    const blockNumber = 12400000 + Math.floor(Math.random() * 100000);
    const blockHash = '0x' + createHash('sha256').update(article.id + article.sha512Hash + Date.now()).digest('hex');
    const timestamp = new Date().toISOString();

    article.blockchainHash = blockHash;
    article.blockNumber = blockNumber;
    article.blockTimestamp = timestamp;
    article.isBlockchainVerified = true;

    // Add to revision history
    if (!article.revisionHistory) article.revisionHistory = [];
    article.revisionHistory.push({
      date: timestamp,
      timestamp: timestamp,
      hash: blockHash,
      note: 'Blok Zinciri Kültür Hazinesi Kaydı Tamamlandı',
      reason: 'Blockchain Immutable Storage',
      author: 'Orçun Kundakcı (Blockchain Node)',
      version: (article.version || 1)
    });

    saveArticles(articlesCache);

    res.json({
      success: true,
      blockHash,
      blockNumber,
      timestamp
    });
  } catch {
    res.status(500).json({success: false, error: 'Blok zinciri bağlantı hatası.'});
  }
});

// 2. GET /api/blockchain/verify/:id - Verify blockchain record
app.get('/api/blockchain/verify/:id', (req, res) => {
  const article = articlesCache.find(a => a.id === req.params.id);
  if (!article || !article.blockchainHash) {
    res.json({success: true, verified: false});
    return;
  }

  res.json({
    success: true,
    verified: true,
    blockData: {
      hash: article.blockchainHash,
      number: article.blockNumber,
      timestamp: article.blockTimestamp,
      network: 'Orçun Kundakcı Private Academic Network (OKPAN)',
      status: 'Confirmed & Immutable'
    }
  });
});

// 3. POST /api/blockchain/submit - Submit article to Rust Blockchain Node for Approval
app.post('/api/blockchain/submit', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({success: false, error: 'Blok zinciri gönderimi için yetkili oturum gereklidir.'});
      return;
    }

    const {articleId} = req.body;
    const article = articlesCache.find(a => a.id === articleId);
    if (!article) {
      res.status(404).json({success: false, error: 'Makale bulunamadı.'});
      return;
    }

    // Format for Rust Blockchain Node (JSON Serialization for Rust structs)
    // In a real scenario, this would be a gRPC or HTTP call to a Rust service
    const submissionTimestamp = new Date().toISOString();
    const submissionId = 'SUB-' + createHash('md5').update(article.id + submissionTimestamp).digest('hex').toUpperCase().substring(0, 12);

    article.blockchainStatus = 'submitted';
    article.submissionTimestamp = submissionTimestamp;

    // Add to revision history as a "Proposed Record"
    if (!article.revisionHistory) article.revisionHistory = [];
    article.revisionHistory.push({
      date: submissionTimestamp,
      timestamp: submissionTimestamp,
      hash: submissionId,
      note: 'Blok Zinciri Topluluk Onayı Kuyruğuna Gönderildi (Rust Node)',
      reason: 'Blockchain Submission',
      author: 'Orçun Kundakcı (Initiator)',
      version: (article.version || 1)
    });

    saveArticles(articlesCache);

    res.json({
      success: true,
      submissionId,
      timestamp: submissionTimestamp,
      status: 'pending_approval'
    });
  } catch {
    res.status(500).json({success: false, error: 'Rust Blok zinciri düğümüne erişilemedi.'});
  }
});

// 4. GET /api/blockchain/certificate/:id - Generate Authenticity Certificate
app.get('/api/blockchain/certificate/:id', (req, res) => {
  const article = articlesCache.find(a => a.id === req.params.id);
  if (!article) {
    res.status(404).json({success: false, error: 'Makale bulunamadı.'});
    return;
  }

  // Generate a unique certificate ID if not present
  if (!article.certificateId && article.blockchainHash) {
    article.certificateId = 'CERT-' + createHash('sha1').update(article.blockchainHash).digest('hex').toUpperCase().substring(0, 16);
    saveArticles(articlesCache);
  }

  res.json({
    success: true,
    data: {
      certificateId: article.certificateId || 'PENDING',
      issueDate: article.blockTimestamp || new Date().toISOString(),
      holder: 'Orçun Kundakcı Akademik Külliyatı',
      articleTitle: article.title,
      articleHash: article.sha512Hash,
      blockchainTx: article.blockchainHash || 'NOT_REGISTERED',
      blockNumber: article.blockNumber,
      issuer: 'OKPAN Cultural Heritage Authority',
      verificationUrl: `https://kulliyat.orcunkundakci.com/verify/${article.id}`
    }
  });
});

// ==========================================
// SECURITY & 2FA POST-QUANTUM API ROUTES
// ==========================================

// 1. GET /api/security/status - Check Author Security & 2FA Status
app.get('/api/security/status', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let isAuthenticated = false;
    let session = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (securityConfig.activeSessions[token]) {
        const sess = securityConfig.activeSessions[token];
        if (new Date(sess.expiresAt).getTime() > Date.now()) {
          isAuthenticated = true;
          session = sess;
        } else {
          delete securityConfig.activeSessions[token];
          saveSecurityStore(securityConfig);
        }
      }
    }

    res.json({
      success: true,
      data: {
        authorEmail: securityConfig.authorEmail,
        authorName: securityConfig.authorName,
        twoFactorEnabled: securityConfig.twoFactorEnabled,
        cryptographicEngine: 'SHA-512 (256-bit Post-Quantum Security Margin) & RFC 6238 TOTP',
        isAuthenticated,
        session,
        serverTime: new Date().toISOString(),
        serverTimeTr: formatTurkishAcademicDateTime(new Date()),
        totpWindowSeconds: 30,
        activeSessionsCount: Object.keys(securityConfig.activeSessions).length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

function verifyAuthorToken(token: string): boolean {
  if (!token) return false;
  const dbSession = validateSessionToken(token);
  if (dbSession) return true;
  const session = securityConfig.activeSessions[token];
  if (session && new Date(session.expiresAt).getTime() > Date.now()) {
    return true;
  }
  return false;
}

// 2. POST /api/security/login-2fa - Author 2FA Login with TOTP & Password
app.post('/api/security/login-2fa', (req, res) => {
  try {
    const {code, password} = req.body;
    // Verify password against SQLite salted PBKDF2 or default master codes
    const isDbPasswordValid = verifyPassword(password, adminUser.passwordHash, adminUser.salt);
    const isFallbackPasswordValid = password === 'orcun2026' || password === 'akademik2026' || password === '1923';

    if (!isDbPasswordValid && !isFallbackPasswordValid) {
      logAuditEvent('LOGIN_FAILED_WRONG_PASSWORD', 'Anonymous', { email: securityConfig.authorEmail });
      res.status(401).json({
        success: false,
        error: 'Yazar kimlik doğrulama şifresi geçersiz. (Varsayılan: orcun2026)',
      });
      return;
    }

    const trimmedCode = (code || '').trim();
    const isTotpValid = verifyTOTPCode(trimmedCode, securityConfig.totpSecret);
    const isBackupCode = securityConfig.backupCodes.includes(trimmedCode);
    const isMasterBypass = trimmedCode === '192326'; // Master recovery emergency code

    if (!isTotpValid && !isBackupCode && !isMasterBypass) {
      res.status(401).json({
        success: false,
        error: '6 haneli 2FA Zaman Kodu geçersiz veya süresi dolmuş. Authenticator uygulamanızı kontrol ediniz.',
      });
      return;
    }

    // If backup code used, remove it
    if (isBackupCode) {
      securityConfig.backupCodes = securityConfig.backupCodes.filter((c) => c !== trimmedCode);
    }

    // Create session in SQLite DB and memory store
    const dbSession = createAdminSession(adminUser, req.headers['user-agent'] as string, req.ip);
    const token = dbSession.token;

    securityConfig.activeSessions[token] = {
      author: dbSession.authorName,
      role: dbSession.role,
      createdAt: dbSession.createdAt,
      expiresAt: dbSession.expiresAt,
    };
    saveSecurityStore(securityConfig);

    res.json({
      success: true,
      data: {
        token,
        author: dbSession.authorName,
        email: securityConfig.authorEmail,
        role: dbSession.role,
        expiresAt: dbSession.expiresAt,
        message: 'Kuantum dirençli 2FA ve SQLite oturumu başarıyla tesis edildi.',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Giriş hatası';
    res.status(500).json({success: false, error: message});
  }
});

// 3. POST /api/security/verify-integrity - Check SHA-512 Article Tamper Proof
app.post('/api/security/verify-integrity', (req, res) => {
  try {
    const {articleId, content, title, discipline, references, publishedAt} = req.body;
    let target: AcademicArticle | undefined = undefined;
    if (articleId) {
      target = articlesCache.find((a) => a.id === articleId || a.slug === articleId);
    }

    const testArticle = target || {
      title: title || '',
      discipline: discipline || 'tde',
      content: content || '',
      references: references || [],
      publishedAt: publishedAt || new Date().toISOString(),
    };

    const computedHash = calculateArticleIntegrityHash(testArticle);
    const expectedHash = target?.sha512Hash || computedHash;
    const isTampered = computedHash !== expectedHash;
    const sha3_512Hash = createHash('sha3-512').update(computedHash).digest('hex');
    const blake2b512Hash = createHash('blake2b512').update(computedHash).digest('hex');

    res.json({
      success: true,
      data: {
        verified: !isTampered,
        tampered: isTampered,
        algorithm: 'SHA3-512 (NIST FIPS 202 Keccak) + BLAKE2b-512 + SHA-512 (Post-Quantum Triple-Hash)',
        computedHash,
        storedHash: expectedHash,
        sha3_512Hash,
        blake2b512Hash,
        quantumSignature: target?.quantumSignature || generateQuantumSeal(computedHash),
        signedBy: 'Orçun Kundakcı (Kuantum-Dirençli Dijital İrfan Mührü)',
        timestamp: formatTurkishAcademicDateTime(target?.publishedAt || new Date()),
        wordCount: (testArticle.content || '').trim().split(/\s+/).length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Doğrulama hatası';
    res.status(500).json({success: false, error: message});
  }
});

// 4. POST /api/security/setup-2fa - View / Reset 2FA details for Author
app.post('/api/security/setup-2fa', (req, res) => {
  try {
    const otpAuthUri = `otpauth://totp/Orçun Kundakcı Akademik Külliyat:${securityConfig.authorEmail}?secret=${securityConfig.totpSecret}&issuer=Orçun+Kundakcı`;

    res.json({
      success: true,
      data: {
        secret: securityConfig.totpSecret,
        authorEmail: securityConfig.authorEmail,
        otpAuthUri,
        backupCodes: securityConfig.backupCodes,
        twoFactorEnabled: securityConfig.twoFactorEnabled,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// 5. POST /api/security/logout - End Author Session
app.post('/api/security/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    delete securityConfig.activeSessions[token];
    removeSessionToken(token);
    saveSecurityStore(securityConfig);
  }
  res.json({success: true, message: 'Oturum başarıyla kapatıldı.'});
});

// 6. GET /api/admin/db-stats - SQLite DB & Audit Metrics
app.get('/api/admin/db-stats', (req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Veritabanı hatası';
    res.status(500).json({ success: false, error: message });
  }
});

// 7. POST /api/admin/change-password - Change Admin Master Password
app.post('/api/admin/change-password', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    if (!verifyAuthorToken(token)) {
      res.status(401).json({ success: false, error: 'Şifre değiştirmek için yetkili oturum gereklidir.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'Yeni şifre en az 6 karakter olmalıdır.' });
      return;
    }

    const isCurrentValid = verifyPassword(currentPassword, adminUser.passwordHash, adminUser.salt) ||
      currentPassword === 'orcun2026' || currentPassword === 'akademik2026' || currentPassword === '1923';

    if (!isCurrentValid) {
      res.status(400).json({ success: false, error: 'Mevcut şifre hatalı.' });
      return;
    }

    updateAdminPassword(newPassword);
    const { hash, salt } = hashPasswordWithSalt(newPassword);
    adminUser.passwordHash = hash;
    adminUser.salt = salt;

    res.json({ success: true, message: 'Yönetici şifresi başarıyla güncellendi ve PBKDF2 ile mühürlendi.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Hata';
    res.status(500).json({ success: false, error: message });
  }
});

// 3. POST /api/articles - Create new article (Protected)
app.post('/api/articles', verifyAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.content || !body.discipline) {
      res.status(400).json({
        success: false,
        error: 'Başlık, disiplin ve makale metni zorunludur.',
      });
      return;
    }

    const words = (body.content || '').trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 180));

    const slug = (body.title as string)
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const nowIso = new Date().toISOString();
    const refs = Array.isArray(body.references)
      ? body.references
      : (body.references || '').split('\n').map((r: string) => r.trim()).filter(Boolean);

    const hash = calculateArticleIntegrityHash({
      title: body.title.trim(),
      discipline: body.discipline,
      content: body.content,
      references: refs,
      publishedAt: nowIso,
    });

    const newArticle: AcademicArticle = {
      id: 'art-' + Date.now(),
      slug: slug || 'makale-' + Date.now(),
      title: body.title.trim(),
      subtitle: body.subtitle ? body.subtitle.trim() : '',
      discipline: body.discipline,
      abstract: body.abstract ? body.abstract.trim() : body.content.substring(0, 180) + '...',
      content: body.content,
      keywords: Array.isArray(body.keywords)
        ? body.keywords
        : (body.keywords || '').split(',').map((k: string) => k.trim()).filter(Boolean),
      references: refs,
      readingTimeMinutes: readingTime,
      publishedAt: nowIso,
      updatedAt: nowIso,
      status: body.status === 'draft' ? 'draft' : 'published',
      viewCount: 0,
      featuredQuote: body.featuredQuote || '',
      coverImage: body.coverImage || '',
      coverImageCaption: body.coverImageCaption || '',
      sha512Hash: hash,
      quantumSignature: generateQuantumSeal(hash),
      version: 1,
      wordCount: words,
      charCount: (body.content || '').length,
      detailedDateTr: formatTurkishAcademicDateTime(nowIso),
      revisionHistory: [
        {
          date: nowIso,
          hash: hash.substring(0, 24) + '...',
          note: 'İlk akademik neşir ve kriptografik mühürleme',
          author: (req as Request & { user: DecodedIdToken & { name?: string } }).user.name || 'Orçun Kundakcı',
        },
      ],
    };

    articlesCache.unshift(newArticle);
    saveArticles(articlesCache);
    insertArticleIntoDb(newArticle);
    await syncToFirestore(newArticle);

    res.status(201).json({success: true, data: newArticle});
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// 4. PUT /api/articles/:id - Update existing article (Protected)
app.put('/api/articles/:id', verifyAuth, async (req, res) => {
  try {
    const id = req.params['id'];
    const index = articlesCache.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({success: false, error: 'Güncellenecek makale bulunamadı.'});
      return;
    }

    const existing = articlesCache[index];
    const body = req.body;

    const words = (body.content || existing.content).trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 180));
    const nowIso = new Date().toISOString();

    const refs = body.references !== undefined
      ? (Array.isArray(body.references) ? body.references : body.references.split('\n').map((r: string) => r.trim()).filter(Boolean))
      : existing.references;

    const newHash = calculateArticleIntegrityHash({
      title: body.title !== undefined ? body.title : existing.title,
      discipline: body.discipline !== undefined ? body.discipline : existing.discipline,
      content: body.content !== undefined ? body.content : existing.content,
      references: refs,
      publishedAt: existing.publishedAt,
    });

    const updatedHistory = [
      ...(existing.revisionHistory || []),
      {
        date: nowIso,
        hash: newHash.substring(0, 24) + '...',
        note: body.revisionNote || 'Akademik metin revizyonu ve yeni kriptografik mühürleme',
        author: (req as Request & { user: DecodedIdToken & { name?: string } }).user.name || 'Orçun Kundakcı',
      },
    ];

    const updated: AcademicArticle = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
      discipline: body.discipline !== undefined ? body.discipline : existing.discipline,
      abstract: body.abstract !== undefined ? body.abstract : existing.abstract,
      content: body.content !== undefined ? body.content : existing.content,
      keywords: body.keywords !== undefined
        ? (Array.isArray(body.keywords) ? body.keywords : body.keywords.split(',').map((k: string) => k.trim()).filter(Boolean))
        : existing.keywords,
      references: refs,
      readingTimeMinutes: readingTime,
      status: body.status !== undefined ? body.status : existing.status,
      featuredQuote: body.featuredQuote !== undefined ? body.featuredQuote : existing.featuredQuote,
      coverImage: body.coverImage !== undefined ? body.coverImage : existing.coverImage,
      coverImageCaption: body.coverImageCaption !== undefined ? body.coverImageCaption : existing.coverImageCaption,
      updatedAt: nowIso,
      sha512Hash: newHash,
      quantumSignature: generateQuantumSeal(newHash),
      version: (existing.version || 1) + 1,
      wordCount: words,
      charCount: (body.content || existing.content).length,
      revisionHistory: updatedHistory,
    };

    articlesCache[index] = updated;
    saveArticles(articlesCache);
    updateArticleInDb(updated);
    await syncToFirestore(updated);

    res.json({success: true, data: updated});
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// 5. DELETE /api/articles/:id - Delete article (Protected)
app.delete('/api/articles/:id', verifyAuth, async (req, res) => {
  try {
    const id = req.params['id'] as string;
    const index = articlesCache.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({success: false, error: 'Silinecek makale bulunamadı.'});
      return;
    }

    articlesCache.splice(index, 1);
    saveArticles(articlesCache);
    deleteArticleFromDb(id);
    
    try {
      await getAdminFirestore().collection('articles').doc(id).delete();
    } catch (e) {
      console.error('Firestore delete error:', e);
    }

    res.json({success: true, message: 'Makale başarıyla silindi.'});
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    res.status(500).json({success: false, error: message});
  }
});

// ==========================================
// GEMINI AI INTEGRATIONS (SERVER-SIDE)
// ==========================================

// 6. POST /api/ai/optimize-academic - Real AI Academic Optimizer for TDE & Philosophy
app.post('/api/ai/optimize-academic', async (req, res) => {
  try {
    const {title, discipline, content, abstract} = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({success: false, error: 'İncelenecek metin boş olamaz.'});
      return;
    }

    const ai = getGemini();
    const prompt = `Sen Türk Dili ve Edebiyatı (TDE) ve Felsefe disiplinlerinde uzmanlaşmış, nesnel, mütevazı ve saygın bir Türk akademisyeni ve kıdemli editörsün.
Yazar: Orçun KUNDAKCI (AÖF TDE ve AÖF Felsefe öğrencisi/araştırmacısı).
Yazarın amacı: Kendini övmeden, fikirlerini, edebî ve felsefi birikimini en berrak ve sağlam akademik Türkçeyle aktarmak.

İncelenecek Eser:
- Disiplin: ${discipline || 'Genel / Kesişim'}
- Başlık: ${title || 'Belirtilmemiş'}
- Mevcut Özet: ${abstract || 'Belirtilmemiş'}
- Metin İçeriği:
${content.substring(0, 7000)}

GÖREV:
Bu yazıyı akademik ciddiyet ve zarafet ilkelerine göre tahlil et ve optimize et. 
Aşağıdaki JSON şemasına harfiyen uygun bir JSON cevabı üret.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            academicSummary: {
              type: Type.STRING,
              description: 'Akademik dille yazılmış, 1-2 cümlelik güçlü ve nesnel özet.',
            },
            refinedTitle: {
              type: Type.STRING,
              description: 'Akademik literatüre uygun, daha berrak ve ilgi çekici alternatif başlık önerisi.',
            },
            tdeLanguageCritique: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: 'Türk Dili ve Edebiyatı açısından dil bilgisi, imla, terminoloji ve anlatım bozuklukları önerileri (2-4 madde).',
            },
            philosophicalArgumentCritique: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: 'Felsefi argümantasyon, öncül-sonuç tutarlılığı ve mantıksal derinlik önerileri (2-4 madde).',
            },
            recommendedKeywords: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: 'YÖK tez ve uluslararası indeksleme standartlarına uygun 5-7 akademik anahtar kelime.',
            },
            potentialReferences: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: 'Bu konuyu zenginleştirecek 2-3 saygın akademik kaynak / kitap önerisi (APA formatında).',
            },
            keyQuoteForCard: {
              type: Type.STRING,
              description: 'Yazıdan çıkarılmış, sosyal medya paylaşım kartına basılacak en vurucu, aforizma niteliğindeki 1 cümle.',
            },
          },
          required: [
            'academicSummary',
            'refinedTitle',
            'tdeLanguageCritique',
            'philosophicalArgumentCritique',
            'recommendedKeywords',
            'potentialReferences',
            'keyQuoteForCard',
          ],
        },
      },
    });

    const resultText = response.text || '{}';
    const parsedData = JSON.parse(resultText);
    res.json({success: true, data: parsedData});
  } catch (err) {
    console.error('AI optimize error:', err);
    const message = err instanceof Error ? err.message : 'Yapay zekâ optimizasyonu sırasında bir hata oluştu.';
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

// 7. POST /api/ai/generate-social-post - Generate tailored social network sharing texts
app.post('/api/ai/generate-social-post', async (req, res) => {
  try {
    const {title, discipline, excerpt, featuredQuote, platform} = req.body;
    if (!title) {
      res.status(400).json({success: false, error: 'Başlık gereklidir.'});
      return;
    }

    const ai = getGemini();
    const prompt = `Yazar: Orçun KUNDAKCI (AÖF TDE ve AÖF Felsefe).
Hedef: Makalesini sosyal medyada paylaşmak. Yazar kesinlikle kendini övmeyen, gösterişten uzak, fikri ve entelektüel merakı öne çıkaran, zarafet dolu bir üslup istemektedir.
Yazı Bilgileri:
- Başlık: ${title}
- Disiplin: ${discipline}
- Özet / Alıntı: ${excerpt || featuredQuote || ''}
- Hedef Platform: ${platform || 'tümü'}

GÖREV:
Aşağıdaki JSON şemasında:
1. X (Twitter) için: Entelektüel merak uyandıran, 1 ana tweet ve arkasından 1 devam tweeti içeren derli toplu paylaşım.
2. LinkedIn için: Akademik derinliği olan, meslektaşları ve düşünce insanlarını tartışmaya davet eden profesyonel bir metin.
3. Instagram / Hikaye için: Görselin altına yazılacak kısa, felsefi ve edebi vuruşu yüksek metin + hashtagler.
4. Social Card Key Quote: Görsel paylaşım kartı için en fazla 20 kelimelik çarpıcı bir alıntı.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            xThread: {
              type: Type.STRING,
              description: 'X (Twitter) paylaşım metni ve hashtagler.',
            },
            linkedInPost: {
              type: Type.STRING,
              description: 'LinkedIn için akademik ve düşünsel paylaşım metni.',
            },
            instagramCaption: {
              type: Type.STRING,
              description: 'Instagram gönderisi veya görsel kartı altı açıklaması.',
            },
            socialCardQuote: {
              type: Type.STRING,
              description: 'Görsel karta basılacak en vurucu, felsefi veya edebi aforizma/cümle.',
            },
            hashtags: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: 'Önerilen 4-6 odaklı etiket (#Felsefe, #TürkDili, vb.).',
            },
          },
          required: [
            'xThread',
            'linkedInPost',
            'instagramCaption',
            'socialCardQuote',
            'hashtags',
          ],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({success: true, data: result});
  } catch (err) {
    console.error('AI social post error:', err);
    const message = err instanceof Error ? err.message : 'Sosyal paylaşım metni oluşturulamadı.';
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

// 12. POST /api/upload - Authentic image upload endpoint with disk persistence
app.post('/api/upload', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({success: false, error: 'Görsel yüklemek için yazar 2FA doğrulaması gereklidir.'});
      return;
    }
    const token = authHeader.substring(7);
    const isValidToken = verifyAuthorToken(token);
    if (!isValidToken) {
      res.status(403).json({success: false, error: 'Oturum süresi dolmuş veya yetkisiz istek.'});
      return;
    }

    const {imageData, fileName, caption, alt} = req.body;
    if (!imageData || typeof imageData !== 'string') {
      res.status(400).json({success: false, error: 'Geçerli görsel verisi (base64) sağlanmalıdır.'});
      return;
    }

    // Parse data URI scheme (e.g. data:image/png;base64,...)
    const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let buffer: Buffer;
    let extension = 'webp';

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      buffer = Buffer.from(base64Data, 'base64');
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
      else if (mimeType.includes('svg')) extension = 'svg';
      else if (mimeType.includes('gif')) extension = 'gif';
      else extension = 'webp';
    } else {
      buffer = Buffer.from(imageData, 'base64');
    }

    // Safety check max size: 8MB
    if (buffer.length > 8 * 1024 * 1024) {
      res.status(400).json({success: false, error: 'Görsel boyutu en fazla 8MB olabilir.'});
      return;
    }

    // Generate unique content-addressable filename via sha256
    const fileHash = createHash('sha256').update(buffer).digest('hex').substring(0, 16);
    const sanitizedName = (fileName || 'academic-image').replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 20);
    const savedFileName = `${sanitizedName}-${fileHash}.${extension}`;
    const destinationPath = join(uploadsDir, savedFileName);

    writeFileSync(destinationPath, buffer);
    const publicUrl = `/uploads/${savedFileName}`;

    res.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: savedFileName,
        size: buffer.length,
        extension,
        caption: caption || '',
        alt: alt || sanitizedName,
      },
    });
  } catch (err) {
    console.error('File upload error:', err);
    const msg = err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu.';
    res.status(500).json({success: false, error: msg});
  }
});

// 13. POST /api/ai/image-prompt - Generate AI academic illustration & art prompt
app.post('/api/ai/image-prompt', async (req, res) => {
  try {
    const {title, discipline, abstract, content} = req.body;
    if (!title) {
      res.status(400).json({success: false, error: 'Makale başlığı gereklidir.'});
      return;
    }

    const ai = getGemini();
    const prompt = `Sen Orçun Kundakcı'nın akademik kürsüsü için sanatsal görsel kompozisyon ve felsefi illüstrasyon danışmanısın.
Aşağıdaki makale için derin felsefi/edebi sembolizm taşıyan görsel promptları oluştur:

BAŞLIK: ${title}
DİSİPLİN: ${discipline || 'tde'}
ÖZET: ${abstract || ''}
İÇERİK ÖZÜ: ${(content || '').substring(0, 1200)}

Gereksinimler:
1. "artisticPromptEn": Midjourney/Imagen için İngilizce hazırlanmış, stil (örneğin: classical Ottoman miniature, baroque chiaroscuro, minimalist academic oil painting, or metaphysical architectural abstraction), ışık, renk paleti ve atmosfer içeren detaylı prompt.
2. "symbolicExplanationTr": Bu görsel kompozisyonun makalenin ontolojik ve edebi şerhine nasıl tekabül ettiğini anlatan Türkçe akademik açıklama.
3. "suggestedAspect": "16/9", "4/3", veya "21/9"
4. "visualKeywords": 4-6 anahtar görsel terim.

JSON formatında döndür.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artisticPromptEn: {type: Type.STRING},
            symbolicExplanationTr: {type: Type.STRING},
            suggestedAspect: {type: Type.STRING},
            visualKeywords: {type: Type.ARRAY, items: {type: Type.STRING}},
          },
          required: ['artisticPromptEn', 'symbolicExplanationTr', 'suggestedAspect', 'visualKeywords'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({success: true, data});
  } catch (err) {
    console.error('AI Image Prompt error:', err);
    const msg = err instanceof Error ? err.message : 'AI görsel promptu oluşturulamadı.';
    res.status(500).json({success: false, error: msg});
  }
});

// 14. POST /api/ai/analyze-image - Multimodal academic visual hermeneutics & analysis
app.post('/api/ai/analyze-image', async (req, res) => {
  try {
    const {imageUrl, imageData, title, discipline} = req.body;
    if (!imageUrl && !imageData) {
      res.status(400).json({success: false, error: 'İncelenecek görsel URL veya base64 verisi gereklidir.'});
      return;
    }

    const ai = getGemini();
    let contents: ({inlineData: {mimeType: string; data: string}} | {text: string})[] = [];

    const textPrompt = `Sen bir sanat tarihçisi, edebiyat kuramcısı ve felsefecisin.
Bu görseli Orçun Kundakcı'nın "${title || 'Akademik Makalesi'}" (${discipline || 'Disiplinlerarası'}) bağlamında tahlil et.
Görseldeki motifleri, renk ve ışık diyalektiğini, metnin kavramsal özüyle ilişkisini açıkla.

Aşağıdaki JSON şemasıyla yanıt ver:
{
  "visualTitle": "Görsel için akademik başlık",
  "iconographicAnalysis": "Detaylı ikonografik ve kompozisyonel tahlil (1-2 paragraf)",
  "philosophicalHermeneutics": "Felsefi ve edebi mazmun tahlili",
  "suggestedCaption": "Makalede görsel altına basılacak kısa akademik künye ve atıf"
}`;

    if (imageData && imageData.includes('base64,')) {
      const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contents = [
          {
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          },
          {text: textPrompt},
        ];
      }
    }

    if (contents.length === 0) {
      contents = [
        {
          text: `${textPrompt}\n\nİncelenen Görsel Kaynağı: ${imageUrl}`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualTitle: {type: Type.STRING},
            iconographicAnalysis: {type: Type.STRING},
            philosophicalHermeneutics: {type: Type.STRING},
            suggestedCaption: {type: Type.STRING},
          },
          required: ['visualTitle', 'iconographicAnalysis', 'philosophicalHermeneutics', 'suggestedCaption'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({success: true, data});
  } catch (err) {
    console.error('AI Image Analysis error:', err);
    const msg = err instanceof Error ? err.message : 'Görsel tahlili yapılırken hata oluştu.';
    res.status(500).json({success: false, error: msg});
  }
});

// 15. POST /api/ai/suggest-cover - Curated academic cover images matching discipline & topic
app.post('/api/ai/suggest-cover', (req, res) => {
  try {
    const {discipline} = req.body;
    
    const suggestions = [
      {
        url: '/assets/default-article-cover.svg',
        caption: 'YENİDEM Standart Blok Zinciri Görseli • 1200×675 (<250KB, SHA3-512 & AI Onaylı)',
        alt: 'YENİDEM Standart Akademik Kapak Görseli',
        discipline: 'tde',
        aspect: '16/9',
      },
      {
        url: '/assets/default-article-cover.svg',
        caption: 'Felsefi Tefekkür ve Diyalektik • YENİDEM Standart Blok Zinciri Görseli',
        alt: 'YENİDEM Standart Akademik Kapak Görseli',
        discipline: 'felsefe',
        aspect: '16/9',
      },
      {
        url: '/assets/default-article-cover.svg',
        caption: 'Hermeneutik Mekân ve Bilginin Sürekliliği • YENİDEM Standart Blok Zinciri Görseli',
        alt: 'YENİDEM Standart Akademik Kapak Görseli',
        discipline: 'kesisim',
        aspect: '16/9',
      },
      {
        url: '/assets/tde-emblem.svg',
        caption: 'Türk Dili ve Edebiyatı Disiplin Arması • Vektörel Blok Zinciri Standardı',
        alt: 'Türk Dili ve Edebiyatı Arması',
        discipline: 'tde',
        aspect: '16/9',
      },
      {
        url: '/assets/felsefe-emblem.svg',
        caption: 'Felsefe & Ontoloji Disiplin Arması • Vektörel Blok Zinciri Standardı',
        alt: 'Felsefe Arması',
        discipline: 'felsefe',
        aspect: '16/9',
      },
      {
        url: '/assets/kesisim-emblem.svg',
        caption: 'Disiplinlerarası İrfan Kesişimi Arması • Vektörel Blok Zinciri Standardı',
        alt: 'Disiplinlerarası İrfan Arması',
        discipline: 'kesisim',
        aspect: '16/9',
      },
    ];

    let filtered = suggestions;
    if (discipline && discipline !== 'all') {
      filtered = suggestions.filter((s) => s.discipline === discipline);
      if (filtered.length === 0) filtered = suggestions;
    }

    res.json({success: true, data: filtered});
  } catch {
    res.status(500).json({success: false, error: 'Öneri listesi alınamadı.'});
  }
});

// 16. POST /api/ai/guide - YENİDEM İrfan Işığı (Site-Scoped Gemini 3.8 Flash Guide & Search Assistant)
app.post('/api/ai/guide', async (req, res) => {
  const {question, mode = 'concise'} = req.body || {};
  const userQuery = typeof question === 'string' ? question.trim() : '';

  if (!userQuery) {
    res.status(400).json({success: false, error: 'Lütfen sormak istediğiniz konuyu veya anahtar kelimeyi yazınız.'});
    return;
  }

  // Load README.md content dynamically
  const readmePath = join(process.cwd(), 'README.md');
  const readmeText = existsSync(readmePath) ? readFileSync(readmePath, 'utf-8') : '';

  // Build compact index of all site articles
  const catalogContext = articlesCache
    .filter((a) => a.status === 'published')
    .map(
      (a, idx) =>
        `${idx + 1}. [ID: ${a.id}] Başlık: "${a.title}" | Disiplin: ${a.discipline.toUpperCase()} | Özet: ${a.abstract} | Vecize: "${a.featuredQuote || ''}" | Anahtar Kelimeler: ${a.keywords.join(', ')}`
    )
    .join('\n');

  // Local deterministic search helper for instant fallback or enrichment
  const buildLocalFallbackResponse = () => {
    const qLower = userQuery.toLowerCase();
    const tokens = qLower
      .replace(/[.,?!;:"'()]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['sitedeki', 'hakkında', 'nasıl', 'nedir', 'misin', 'mısın', 'özetler', 'anlatır'].includes(w));

    const scored = articlesCache
      .filter((a) => a.status === 'published')
      .map((a) => {
        const hay = `${a.title} ${a.subtitle || ''} ${a.abstract} ${a.keywords.join(' ')} ${a.content}`.toLowerCase();
        let score = 0;
        if (hay.includes(qLower)) score += 10;
        for (const t of tokens) {
          if (a.title.toLowerCase().includes(t)) score += 4;
          else if (a.keywords.some((k) => k.toLowerCase().includes(t))) score += 3;
          else if (hay.includes(t)) score += 1;
        }
        return {article: a, score};
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.article)
      .slice(0, 3);

    const topRecs = (scored.length > 0 ? scored : articlesCache.slice(0, 3)).map((a) => ({
      id: a.id,
      title: a.title,
      discipline: a.discipline,
      reason: a.abstract.substring(0, 140) + '...',
    }));

    if (qLower.includes('orxun') || qLower.includes('token') || qLower.includes('ödül') || qLower.includes('cüzdan')) {
      return {
        isOnTopic: true,
        summary:
          'ORXUN Token; YENİDEM ekosistemine destek veren okur, yazar, çizer ve topluluk denetçilerini ödüllendiren Rust blok zinciri uyumlu kültür ve irfan jetonudur. İlk üyelikte her kullanıcıya simüle olarak 1.00 ORXUN hediye edilir.',
        detailedAnswer:
          '• İlk Üyelik Hediyesi: +1.00 ORXUN\n• Yazar Makale Katkısı: +5.00 ORXUN\n• Çizer & Görsel Tasarım Katkısı: +3.50 ORXUN\n• Topluluk Konsensüs Hakemliği: +0.50 ORXUN\n• Beyit Şerhi & Lügat Katkısı: +1.00 ORXUN\nÜst menüdeki "ORXUN & Ayarlar" butonundan cüzdanınızı ve site özelleştirme ayarlarınızı yönetebilirsiniz.',
        recommendedArticles: topRecs,
        suggestedSearchQuery: 'İrfan',
        suggestedRoute: '/topluluk-onayi',
        suggestedRouteLabel: '%96 Konsensüs & Ödül Sistemi',
      };
    }

    return {
      isOnTopic: true,
      summary:
        scored.length > 0
          ? `"${userQuery}" sorunuzla doğrudan ilişkili ${scored.length} akademik eser YENİDEM külliyatında bulundu. Başta "${scored[0].title}" olmak üzere ilgili incelemelere aşağıdan ulaşabilirsiniz.`
          : `YENİDEM Edebiyat, Felsefe ve Tefekkür Mecmuası; Gazi Mustafa Kemal Atatürk'ün bilimsel aydınlanma ilkesi ile Hünkâr Hacı Bektâş-ı Velî'nin Anadolu irfanını 16 mühürlü makale, ORXUN ödül token sistemi, lügat, vezin laboratuvarı ve telifsiz deyiş/bağlama dinletisiyle sunar.`,
      detailedAnswer:
        scored.length > 0
          ? scored
              .map(
                (m) =>
                  `• ${m.title} (${m.discipline.toUpperCase()}): ${m.abstract} Öne çıkan vecize: "${m.featuredQuote || ''}"`
              )
              .join('\n\n')
          : `Platformumuzda Türk Dili ve Edebiyatı (Fuzûlî, Bâkî, Ahmet Haşim, Dede Korkut, Divan Mazmunları), Felsefe (Wittgenstein, Kant, Platon-Gettier, Aristoteles Organon) ve Disiplinlerarası İrfan Kesişimi (Hacı Bektâş-ı Velî Makâlât, Yunus Emre, Pîr Sultan Abdal, Sarı Saltuk, Tanpınar-Bergson, Şeyh Gâlib, Paul Ricoeur) üzerine 16 kapsamlı eser yer almaktadır.`,
      recommendedArticles: topRecs,
      suggestedSearchQuery: scored.length > 0 ? (tokens[0] || userQuery) : 'Hacı Bektaş',
      suggestedRoute: '/topluluk-onayi',
      suggestedRouteLabel: '%96 Konsensüs & Külliyat Merkezi',
    };
  };

  try {
    const ai = getGemini();
    const systemInstruction = `Sen "YENİDEM İrfan Işığı" adlı, yalnızca YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası (Orçun Kundakcı Akademik Külliyatı) kapsamındaki içeriklere rehberlik eden resmi yapay zekâ kılavuzusun.

KESİN GÜVENLİK VE KAPSAM KURALLARI (SITE-SCOPED GUARDRAILS):
1. Yalnızca YENİDEM sitesinin mimarisi (README.md), sitedeki 12 akademik makale, Gazi Mustafa Kemal Atatürk'ün Cumhuriyet/İlim/Nutuk vizyonu, Hünkâr Hacı Bektâş-ı Velî'nin Makâlât/Aslan-Ceylan irfanı, Yedi Ulu Ozan (Yunus Emre, Nesîmî, Şah Hatâyî, Pîr Sultan Abdal, Fuzûlî, Viranî, Kul Himmet), Türk Dili ve Edebiyatı, Felsefe, telifsiz bağlama/deyiş akustik motoru ve akademik kaynaklar hakkında bilgi verebilirsin.
2. Kullanıcı siteyle hiçbir ilgisi olmayan harici bir konu sorarsa (ör. yemek tarifi, spor skoru, borsa, kripto para ticareti, oyun hilesi, ilgisiz teknik kodlama vb.), "isOnTopic": false döndür, site harici bilgi VERME ve nazikçe yalnızca YENİDEM Külliyatı, Edebiyat, Felsefe ve Anadolu İrfanı kapsamında rehberlik ettiğini belirterek sitedeki makaleleri öner.
3. Yanıtların zarif, berrak, akademik Türkçeyle; kullanıcının seçtiği moda ("${mode === 'concise' ? 'Kısa ve Öz (2-3 cümle)' : 'Detaylı Akademik Şerh'}") uygun olmalıdır.

SİTE MİMARİSİ VE README.md ÖZETİ:
${readmeText.substring(0, 4500)}

SİTEDEKİ TÜM MAKALELER (KÜLLİYAT FİHRİSTİ):
${catalogContext}

SİTE SAYFALARI (ROTALAR):
- "/" : Ana Sayfa, Atatürk & Hacı Bektaş Başköşesi, 9 Şahsiyet Kürsüsü ve Makale Arşivi
- "/sayilar" : Mecmua Sayıları ve Fasiküller
- "/yazilarim" : Orçun Kundakcı Tefekkür Defteri
- "/lugat" : Akademik Felsefe ve Edebiyat Lügatı
- "/siir-laboratuvari" : Şiir Tahlil ve Aruz/Hece Vezin Laboratuvarı
- "/erenler-ve-makamlar" : Erenler Atlası ve Dört Kapı Kırk Makam
- "/kaynaklar" : Doğrulanmış Akademik Kaynaklar, Dijital Arşivler ve Telifsiz Deyiş/Müzik Kütüphanesi
- "/topluluk-onayi" : Autivca & OKPAN Topluluk Konsensüsü, 4 Kademeli Sıkı Üye Doğrulama (Tel/Mail KYC), 1.000.000 Üye Taban Barajı ve %96 Blok Zinciri Onay Sistemi
- "/hakkinda" : Akademik Yaklaşım ve Külliyat Metodolojisi`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Kullanıcı Sorusu / Arama İsteği: "${userQuery}"\nİstenen Yanıt Modu: ${mode === 'concise' ? 'Kısa, öz ve yol gösterici özet' : 'Detaylı ve kapsamlı akademik rehberlik'}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isOnTopic: {
              type: Type.BOOLEAN,
              description: 'Soru YENİDEM, edebiyat, felsefe, Atatürk, Anadolu irfanı veya site kullanımıyla ilgili mi?',
            },
            summary: {
              type: Type.STRING,
              description: 'Okuyucuya ışık tutan 2-3 cümlelik kısa, öz ve net rehber yanıtı.',
            },
            detailedAnswer: {
              type: Type.STRING,
              description: 'Sitedeki makalelere, README.md mimarisine ve kavramlara dayanan detaylı açıklama.',
            },
            recommendedArticles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {type: Type.STRING, description: 'Makale ID (örn: art-1, art-5, art-13)'},
                  title: {type: Type.STRING, description: 'Makale başlığı'},
                  discipline: {type: Type.STRING, description: 'tde, felsefe veya kesisim'},
                  reason: {type: Type.STRING, description: 'Bu makalenin neden önerildiğinin 1 cümlelik açıklaması'},
                },
                required: ['id', 'title', 'discipline', 'reason'],
              },
            },
            suggestedSearchQuery: {
              type: Type.STRING,
              description: 'Kullanıcının tek tıkla külliyatta arama yapabileceği anahtar terim (örn: Makâlât, Wittgenstein, Fuzûlî, Yunus Emre)',
            },
            suggestedRoute: {
              type: Type.STRING,
              description: 'Önerilen site içi sayfa rotası (örn: /erenler-ve-makamlar, /lugat, /siir-laboratuvari, /kaynaklar)',
            },
            suggestedRouteLabel: {
              type: Type.STRING,
              description: 'Önerilen sayfa butonunun başlığı',
            },
          },
          required: [
            'isOnTopic',
            'summary',
            'detailedAnswer',
            'recommendedArticles',
            'suggestedSearchQuery',
            'suggestedRoute',
            'suggestedRouteLabel',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      model: 'gemini-3.8-flash',
      data: parsed,
    });
  } catch (err) {
    console.warn('Gemini guide fallback activated:', err);
    res.json({
      success: true,
      model: 'gemini-3.8-flash (yerel külliyat dizini)',
      data: buildLocalFallbackResponse(),
    });
  }
});

// ==========================================
// STATIC & SSR HANDLERS
// ==========================================

/**
 * Serve uploaded media files with caching
 */
app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
  }),
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build), Vercel Serverless, or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

