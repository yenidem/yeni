import {MecmuaIssue} from '../models/issue.model';

export const MECMUA_ISSUES: MecmuaIssue[] = [
  {
    id: 'sayi-1',
    issueNumber: 1,
    season: 'Bahar 2026',
    title: 'Varlık, İrfan ve Gurbet Dosyası',
    themeKicker: 'Ontolojik Açılımlar & Klasik Metinler',
    editorialLetter: {
      title: 'Takdim: YENİDEM’e Bismillah Derken',
      author: 'Orçun KUNDAKCI',
      date: 'Bahar 2026',
      lead: 'Edebiyat ve felsefe; insanın varlık karşısındaki hayretinin iki kadim ve ikiz lisanıdır.',
      body: [
        'YENİDEM Mecmuası’nın bu ilk sayısında, Türk edebiyatının zengin mazmun dünyasını salt tarihsel bir hatıra olarak değil; bugün yaşayan insanın ontolojik boşluğuna, yalnızlığına ve anlam arayışına cevap verebilecek taze bir nefes olarak ele alıyoruz.',
        'İlk cildimizde Yunus Emre’nin duru Türkçesindeki varlık uyanışından Fuzûlî’nin çileyle mayalanmış lirik doruğuna; oradan modern varoluşçuluk ve Ahmet Haşim’in alacakaranlık ontolojisine uzanan bir köprü kurduk.',
        'Okuyucuyu kelimelerin kabuğunu soyup cevherine inmeye, aruzun ve hecenin matematiğinde ruhun ritmini duymaya davet ediyoruz.',
      ],
    },
    articleIds: ['art-1', 'art-3', 'art-5'],
    coverBadge: 'Açılış Sayısı',
    primaryColor: 'amber',
  },
  {
    id: 'sayi-2',
    issueNumber: 2,
    season: 'Yaz 2026',
    title: 'Lisanın Sınırları ve Şiirin Hakikati',
    themeKicker: 'Dil Felsefesi & Poetik Soruşturmalar',
    editorialLetter: {
      title: 'Kelimelerin Ötesindeki Sessizlik',
      author: 'Orçun KUNDAKCI',
      date: 'Yaz 2026',
      lead: 'Konuşabildiğimiz dünya kadar varız; lâkin susabildiğimiz derinlik kadar insanız.',
      body: [
        'İkinci sayımızda dilin hem varlığın evi hem de bir hapishanesi olduğu gerçeğini masaya yatırdık. Wittgenstein’ın dil oyunları ve göstergebilimsel sessizliği ile klasik divan şairlerimizin mazmunlar ardına gizlediği ketum manalar arasında şaşırtıcı bir akrabalık var.',
        'Bu fasikül, okuru sözün bittiği yerde başlayan şiirsel gösterimin ve sezgisel felsefenin berzahına götürüyor.',
      ],
    },
    articleIds: ['art-2', 'art-4'],
    coverBadge: 'Özel Dosya',
    primaryColor: 'cyan',
  },
  {
    id: 'sayi-3',
    issueNumber: 3,
    season: 'Güz 2026',
    title: 'Modern Çağda Bir Derviş Olmak: Hacı Bektâş’tan Spinoza’ya',
    themeKicker: 'Anadolu Hümanizmi, Etik & Tekâmül',
    editorialLetter: {
      title: 'Gönül Çalab’ın Tahtı: 40 Makamın Çağdaş Yankısı',
      author: 'Orçun KUNDAKCI',
      date: 'Güz 2026',
      lead: 'Hacı Bektâş-ı Velî’nin Makâlât’ı ile Spinoza’nın Ethica’sı aynı nehirde yıkanan iki bilge sudur.',
      body: [
        'Üçüncü sayımız, Anadolu irfanının dört kapı kırk makamlık tekâmül haritasını çağdaş bireyin ahlaki krizlerine bir pusula olarak teklif ediyor.',
        'Horasan erenlerinin Anadolu’da inşa ettiği lisan ve gönül mimarisi, bugün yabancılaşmış zihnimize şifa olacak bir ahlak felsefesinin tohumlarını barındırmaktadır.',
      ],
    },
    articleIds: ['art-3', 'art-6', 'art-1'],
    coverBadge: 'İrfan & Etik',
    primaryColor: 'emerald',
  },
];
