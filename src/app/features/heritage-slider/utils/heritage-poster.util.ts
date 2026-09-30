import {HeritageQuote, HeritageSlide} from '../models/heritage-slide.model';

export function downloadHeritageSlidePoster(slide: HeritageSlide, quote: HeritageQuote): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Deep scholarly dark background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, '#0c1324');
  bgGrad.addColorStop(0.45, '#080d1a');
  bgGrad.addColorStop(1, '#03060c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Subtle gold/emerald radial glow
  const glow = ctx.createRadialGradient(540, 580, 80, 540, 680, 720);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
  glow.addColorStop(0.6, 'rgba(14, 165, 233, 0.05)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1920);

  // Double classic manuscript border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.48)';
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, 996, 1836);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(58, 58, 964, 1804);

  // Header brand
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 34px "Lora", Georgia, serif';
  ctx.fillText('YENİDEM MECMUASI • İRFAN VE AYDINLANMA KÜRSÜSÜ', 540, 155);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${slide.categoryLabel.toUpperCase()} • ${slide.birthDeath}`, 540, 200);

  // Divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 235);
  ctx.lineTo(780, 235);
  ctx.stroke();

  // Figure Name & Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Lora", Georgia, serif';
  ctx.fillText(slide.name, 540, 340);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 25px "Lora", Georgia, serif';
  ctx.fillText(slide.title, 540, 390);

  ctx.fillStyle = '#64748b';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(slide.region, 540, 430);

  // Quote Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.beginPath();
  ctx.roundRect(90, 490, 900, 480, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 500 36px "Lora", Georgia, serif';
  if (quote.secondLine) {
    wrapCenteredText(ctx, `“ ${quote.text}`, 540, 610, 800, 52);
    wrapCenteredText(ctx, `${quote.secondLine} ”`, 540, 735, 800, 52);
  } else {
    wrapCenteredText(ctx, `“ ${quote.text} ”`, 540, 625, 800, 54);
  }

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Kaynak: ${quote.source}`, 540, 885);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(quote.yearOrContext, 540, 922);

  // Synthesis Section
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 28px "Lora", Georgia, serif';
  ctx.fillText('AKADEMİK VE FELSEFİ BAĞLAM (ORÇUN KUNDAKCI)', 540, 1085);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 27px "Lora", Georgia, serif';
  wrapCenteredText(ctx, slide.scholarlySynthesis, 540, 1155, 840, 46);

  // Philosophical Axis Footer
  ctx.fillStyle = '#fbbf24';
  ctx.font = '600 22px monospace';
  ctx.fillText(slide.philosophicalAxis, 540, 1600);

  // Bottom Seal
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(120, 1715);
  ctx.lineTo(960, 1715);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('YENİDEM • Edebiyat, Felsefe ve Tefekkür Mecmuası', 540, 1775);

  ctx.fillStyle = '#64748b';
  ctx.font = '19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Cumhuriyet Aydınlanması • Anadolu İrfanı • Yedi Ulu Ozan Külliyatı', 540, 1818);

  const link = document.createElement('a');
  link.download = `yenidem-${slide.id}-ozlu-soz.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
