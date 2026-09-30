import {Injectable} from '@angular/core';
import {AcademicArticle, DisciplineType, SocialCardFormat, SocialCardTheme} from '../models/article.model';

export interface CardRenderOptions {
  article: AcademicArticle;
  theme: SocialCardTheme;
  format: SocialCardFormat;
  customQuote?: string;
  customSubtitle?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocialCardService {
  /**
   * Render the social card onto a given HTML5 Canvas element
   */
  async renderCard(canvas: HTMLCanvasElement, options: CardRenderOptions): Promise<void> {
    const {article, theme, format, customQuote} = options;

    let width = 1200;
    let height = 675;
    if (format === 'instagram-story') {
      width = 1080;
      height = 1920;
    } else if (format === 'instagram-square') {
      width = 1080;
      height = 1080;
    } else if (format === 'linkedin') {
      width = 1200;
      height = 628;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Render Background Theme
    this.drawBackground(ctx, width, height, theme);

    // 2. Load and draw the logo emblem
    await this.drawLogo(ctx, 80, 75, 80);

    // 3. Draw Brand & Discipline Header
    this.drawHeader(ctx, 180, 95, article.discipline, theme);

    // 4. Draw Article Title
    const titleY = 220;
    const nextY = this.drawTitle(ctx, article.title, 80, titleY, width - 160, theme);

    // 5. Draw Featured Quote or Subtitle Callout
    const quoteText = customQuote || article.featuredQuote || article.abstract;
    if (quoteText) {
      const quoteY = Math.max(nextY + 35, 340);
      this.drawQuoteBox(ctx, quoteText, 80, quoteY, width - 160, height - quoteY - 140, theme);
    }

    // 6. Draw Footer Signature Bar
    this.drawFooter(ctx, 80, height - 60, width - 160, article, theme);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, theme: SocialCardTheme): void {
    if (theme === 'royal-blue') {
      // Prestigious Midnight Ink & Gold Leaf
      const grad = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.5, height * 0.5, width * 0.9);
      grad.addColorStop(0, '#152238');
      grad.addColorStop(0.4, '#0d1627');
      grad.addColorStop(0.8, '#080c16');
      grad.addColorStop(1, '#04070d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm gold ambient light
      ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
      ctx.beginPath();
      ctx.arc(width - 150, 150, 260, 0, Math.PI * 2);
      ctx.fill();

      // Refined double border with gold accents
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(32, 32, width - 64, height - 64);

    } else if (theme === 'parchment') {
      // Warm literary parchment (traditional book/scholarly aesthetic)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fefbf6');
      grad.addColorStop(1, '#f5ede0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Fine ornamental double border
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, 36, width - 72, height - 72);

    } else {
      // dark-editorial: deep charcoal / obsidian
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#131824');
      grad.addColorStop(1, '#080c14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Clean academic divider
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, width - 48, height - 48);
    }
  }

  private drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, x, y, size, size);
        resolve();
      };
      img.onerror = () => {
        // Fallback: draw circular emblem placeholder with geometric monogram
        ctx.save();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(size * 0.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('YD', x + size / 2, y + size / 2);
        ctx.restore();
        resolve();
      };
      img.src = '/assets/logo.svg';
    });
  }

  private drawHeader(ctx: CanvasRenderingContext2D, x: number, y: number, discipline: DisciplineType, theme: SocialCardTheme): void {
    ctx.save();
    
    // Author Name & Mecmua
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme === 'parchment' ? '#1c1917' : '#ffffff';
    ctx.letterSpacing = '1px';
    ctx.fillText('ORÇUN KUNDAKCI • YENİDEM', x, y);

    // Discipline Tag Badge
    let disciplineLabel = 'AÖF TÜRK DİLİ VE EDEBİYATI';
    let badgeBg = 'rgba(56, 189, 248, 0.2)';
    let badgeText = '#38bdf8';

    if (discipline === 'felsefe') {
      disciplineLabel = 'AÖF FELSEFE';
      badgeBg = theme === 'parchment' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(16, 185, 129, 0.2)';
      badgeText = theme === 'parchment' ? '#065f46' : '#34d399';
    } else if (discipline === 'kesisim') {
      disciplineLabel = 'DİSİPLİNLERARASI (TDE & FELSEFE)';
      badgeBg = theme === 'parchment' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(96, 165, 250, 0.2)';
      badgeText = theme === 'parchment' ? '#0369a1' : '#93c5fd';
    } else {
      if (theme === 'parchment') {
        badgeBg = 'rgba(217, 119, 6, 0.15)';
        badgeText = '#92400e';
      }
    }

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    const tagWidth = ctx.measureText(disciplineLabel).width + 24;
    
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(x, y + 12, tagWidth, 26, 13);
    ctx.fill();

    ctx.fillStyle = badgeText;
    ctx.fillText(disciplineLabel, x + 12, y + 29);

    ctx.restore();
  }

  private drawTitle(ctx: CanvasRenderingContext2D, title: string, x: number, y: number, maxWidth: number, theme: SocialCardTheme): number {
    ctx.save();
    ctx.font = '600 38px "Lora", Georgia, serif';
    ctx.fillStyle = theme === 'parchment' ? '#0f172a' : '#f8fafc';

    const words = title.split(' ');
    let line = '';
    let currentY = y;
    const lineHeight = 50;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        linesDrawn++;
        if (linesDrawn >= 3 && n < words.length - 1) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    ctx.restore();
    return currentY + 15;
  }

  private drawQuoteBox(
    ctx: CanvasRenderingContext2D,
    quote: string,
    x: number,
    y: number,
    width: number,
    maxHeight: number,
    theme: SocialCardTheme,
  ): void {
    ctx.save();

    // Box background
    const bgFill = theme === 'royal-blue'
      ? 'rgba(2, 65, 158, 0.35)'
      : theme === 'parchment'
      ? 'rgba(255, 255, 255, 0.75)'
      : 'rgba(255, 255, 255, 0.05)';
      
    const borderStroke = theme === 'royal-blue'
      ? 'rgba(56, 189, 248, 0.35)'
      : theme === 'parchment'
      ? 'rgba(217, 119, 6, 0.3)'
      : 'rgba(255, 255, 255, 0.15)';

    // Compute text height first
    ctx.font = 'italic 400 22px "Lora", Georgia, serif';
    const words = quote.split(' ');
    let testLine = '';
    const lines: string[] = [];
    const textMaxWidth = width - 70;

    for (let i = 0; i < words.length; i++) {
      const candidate = testLine + words[i] + ' ';
      if (ctx.measureText(candidate).width > textMaxWidth && i > 0) {
        lines.push(testLine.trim());
        testLine = words[i] + ' ';
        if (lines.length >= 4) {
          testLine += '...';
          break;
        }
      } else {
        testLine = candidate;
      }
    }
    lines.push(testLine.trim());

    const boxHeight = Math.min(maxHeight, lines.length * 36 + 40);

    ctx.fillStyle = bgFill;
    ctx.beginPath();
    ctx.roundRect(x, y, width, boxHeight, 16);
    ctx.fill();

    ctx.strokeStyle = borderStroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Left decorative bar
    ctx.fillStyle = theme === 'royal-blue' ? '#38bdf8' : theme === 'parchment' ? '#b45309' : '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x + 12, y + 16, 4, boxHeight - 32, 2);
    ctx.fill();

    // Text
    ctx.fillStyle = theme === 'parchment' ? '#334155' : '#e2e8f0';
    ctx.font = 'italic 400 21px "Lora", Georgia, serif';
    let textY = y + 36;
    for (const l of lines) {
      ctx.fillText(l, x + 35, textY);
      textY += 34;
    }

    ctx.restore();
  }

  private drawFooter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    article: AcademicArticle,
    theme: SocialCardTheme,
  ): void {
    ctx.save();
    // Divider line
    ctx.strokeStyle = theme === 'parchment' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + width, y - 20);
    ctx.stroke();

    // Footer Left: Academic Motto / Identification
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme === 'parchment' ? '#64748b' : '#94a3b8';
    ctx.fillText('YENİDEM Mecmuası • Kelâm, Şerh ve Tefekkür Külliyatı', x, y + 4);

    // Footer Right: Reading time & Date
    const dateStr = new Date(article.publishedAt).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const infoText = `${article.readingTimeMinutes} dk okuma • ${dateStr}`;
    const infoWidth = ctx.measureText(infoText).width;
    ctx.fillText(infoText, x + width - infoWidth, y + 4);

    ctx.restore();
  }

  /**
   * Download the rendered canvas as high-resolution PNG
   */
  downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * Share via Native Web Share API if supported
   */
  async shareCanvas(canvas: HTMLCanvasElement, title: string, text: string): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (!blob) return false;

      const file = new File([blob], 'orcun-kundakci-makale.png', {type: 'image/png'});
      if (navigator.canShare && navigator.canShare({files: [file]})) {
        await navigator.share({
          title,
          text,
          files: [file],
        });
        return true;
      } else {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        return true;
      }
    } catch (e) {
      console.warn('Share was cancelled or failed:', e);
      return false;
    }
  }
}
