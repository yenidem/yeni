import {DailyVerse} from '../../../core/models/daily-verse.model';

export function downloadStoryCard(v: DailyVerse): void {
  if (typeof document === 'undefined') return;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920; 
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.3, '#0b1120');
  bgGrad.addColorStop(0.7, '#070b14');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Ambient Radial Lighting
  const glow = ctx.createRadialGradient(540, 600, 100, 540, 700, 700);
  glow.addColorStop(0, 'rgba(34, 211, 238, 0.12)');
  glow.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative Borders
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1000, 1840);

  // Top Brand
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 36px "Lora", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('YENİDEM MECMUASI', 540, 170);

  // Poet
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(v.poet.toUpperCase(), 540, 380);

  // Verse Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.roundRect(100, 490, 880, 360, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Verse Lines
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 500 38px "Lora", Georgia, serif';
  ctx.fillText(`“ ${v.stanzaLine1}`, 540, 610);
  ctx.fillText(`${v.stanzaLine2} ”`, 540, 690);

  // Commentary
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 28px "Lora", Georgia, serif';
  ctx.fillText('ORÇUN KUNDAKCI ŞERHİ', 540, 970);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 400 28px "Lora", Georgia, serif';
  wrapText(ctx, v.scholarlyCommentary, 540, 1070, 820, 48);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `yenidem-${v.id}-story.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function wrapText(
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
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
