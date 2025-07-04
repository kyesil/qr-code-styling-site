const BASE_FONT = "Arial";
const BASE_FONT_SIZE = 35;
const LINE_HEIGHT = 35;

function getFont(fontSize = BASE_FONT_SIZE, type = "") {
  return `${type} ${fontSize}px ${BASE_FONT}`;
}
export async function drawText({ qrCode, text, pos = "bottom" }) {
  if (text === undefined || text === null || text === "")
    return;

  await qrCode._canvasDrawingPromise; // canvasın çizilmesini bekle
  const canvas = qrCode._domCanvas;
  const ctx = canvas.getContext("2d");
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  const qrwith = canvas.width;
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);

  const lines = text.split('\n');
  let maxwidth = 0;
  const oldWidth = canvas.width;
  ctx.font = getFont(BASE_FONT_SIZE+10);
  ctx.textAlign = "left";
  lines.forEach((line) => {
    const width = ctx.measureText(line).width;
    if (width > maxwidth) maxwidth = width;
  });

  const plusHeight = 20 + LINE_HEIGHT * lines.length;
  
  if (pos === "right")
    canvas.width += maxwidth+50; // 400
  else canvas.height += plusHeight; // 400 
  ctx.fillStyle = qrCode._options.backgroundOptions.color || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  ctx.fillStyle = "black";
  ctx.baseAlign = "top";
  let x = 0, y = 0;
  if (pos === "right") {
    x = oldWidth+ 10;
    y =30;
    ctx.textAlign = "left";
  } else {
    ctx.textAlign = "center";
    x = canvas.width / 2;
    y = canvas.height - plusHeight;
  }
  drawMarkdownText(ctx, text, x, y, LINE_HEIGHT);
}



export function drawMarkdownText(ctx, markdown, startX, startY, lineHeight = 30) {
  const lines = markdown.split('\n');
  let y = startY;

  lines.forEach(line => {
    let x = startX;
    let font = getFont(BASE_FONT_SIZE);
    ctx.textBaseline = 'top';

    // Başlıklar
    if (line.startsWith('### '))
      font = getFont(BASE_FONT_SIZE + 3);
    if (line.startsWith('## '))
      font = getFont(BASE_FONT_SIZE + 6);
    else if (line.startsWith('# '))
      font = getFont(BASE_FONT_SIZE + 9);

    line = line.replace(/^#+ /, '');

    // Inline biçimlendirmeler: **bold**, *italic*
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|[^*]+)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      parts.push(match[0]);
    }

    parts.forEach(part => {
      if (/^\*\*(.*?)\*\*$/.test(part)) {
        ctx.font = getFont(BASE_FONT_SIZE, "bold");
        part = part.slice(2, -2);
      } else if (/^\*(.*?)\*$/.test(part)) {
        ctx.font = getFont(BASE_FONT_SIZE, "italic");
        part = part.slice(1, -1);
      } else {
        ctx.font = font;
      }

      ctx.fillText(part, x, y);
      x += ctx.measureText(part).width;
    });

    y += lineHeight;
  });
}