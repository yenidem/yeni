import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/articles/article-list/article-list').then((m) => m.ArticleList),
    title: 'YENİDEM | Edebiyat, Felsefe ve Tefekkür Mecmuası',
  },
  {
    path: 'sayilar',
    loadComponent: () =>
      import('./features/issues/issue-archive').then((m) => m.IssueArchiveComponent),
    title: 'Mecmua Sayıları & Fasiküller | YENİDEM',
  },
  {
    path: 'fasikuller',
    redirectTo: 'sayilar',
    pathMatch: 'full',
  },
  {
    path: 'ciltler',
    redirectTo: 'sayilar',
    pathMatch: 'full',
  },
  {
    path: 'yazilarim',
    loadComponent: () =>
      import('./features/articles/personal-blog/personal-blog').then((m) => m.PersonalBlogComponent),
    title: 'Tefekkür Defteri & Şahsi Makalelerim | Orçun KUNDAKCI - YENİDEM',
  },
  {
    path: 'blog',
    redirectTo: 'yazilarim',
    pathMatch: 'full',
  },
  {
    path: 'gunluk',
    redirectTo: 'yazilarim',
    pathMatch: 'full',
  },
  {
    path: 'makale/:id',
    loadComponent: () =>
      import('./features/articles/article-detail/article-detail').then((m) => m.ArticleDetail),
    title: 'Makale İncelemesi | Orçun KUNDAKCI',
  },
  {
    path: 'yaz',
    loadComponent: () =>
      import('./features/articles/article-editor/article-editor').then((m) => m.ArticleEditor),
    title: 'Akademik Makale Editörü | Orçun KUNDAKCI',
  },
  {
    path: 'lugat',
    loadComponent: () =>
      import('./features/lugat/lugat').then((m) => m.LugatComponent),
    title: 'Akademik Felsefe & Edebiyat Lügatı | Orçun KUNDAKCI',
  },
  {
    path: 'sozluk',
    redirectTo: 'lugat',
    pathMatch: 'full',
  },
  {
    path: 'siir-laboratuvari',
    loadComponent: () =>
      import('./features/poetics/poetics-lab').then((m) => m.PoeticsLabComponent),
    title: 'Şiir Tahlil & Aruz/Hece Laboratuvarı | Orçun KUNDAKCI',
  },
  {
    path: 'vezin',
    redirectTo: 'siir-laboratuvari',
    pathMatch: 'full',
  },
  {
    path: 'erenler-ve-makamlar',
    loadComponent: () =>
      import('./features/makamlar/makam-atlas/makam-atlas').then((m) => m.MakamAtlas),
    title: 'Erenler Atlası & Dört Kapı Kırk Makam | Orçun KUNDAKCI',
  },
  {
    path: 'anadolu-irfani',
    redirectTo: 'erenler-ve-makamlar',
    pathMatch: 'full',
  },
  {
    path: 'hakkinda',
    loadComponent: () =>
      import('./features/portfolio/academic-bio/academic-bio').then((m) => m.AcademicBio),
    title: 'Akademik Yaklaşım & Hakkında | Orçun KUNDAKCI',
  },
  {
    path: 'kaynaklar',
    loadComponent: () =>
      import('./features/resources/academic-resources').then((m) => m.AcademicResourcesComponent),
    title: 'Doğrulanmış Akademik Kaynaklar & Telifsiz Deyiş Kürsüsü | YENİDEM',
  },
  {
    path: 'topluluk-onayi',
    loadComponent: () =>
      import('./features/community/community-consensus').then((m) => m.CommunityConsensusComponent),
    title: 'Topluluk Konsensüsü, Sıkı Üyelik (KYC) & %96 Blok Zinciri Onay Merkezî | YENİDEM',
  },
  {
    path: 'konsensus',
    redirectTo: 'topluluk-onayi',
    pathMatch: 'full',
  },
  {
    path: 'linkler',
    redirectTo: 'kaynaklar',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
