export async function saveJournalImage(source, city, notify) {
  if (!source) return;
  let svgUrl;

  try {
    await document.fonts?.ready;
    const rect = source.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    if (!width || !height) throw new Error('预览为空');

    const clone = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];

    originals.forEach((node, index) => {
      const computed = getComputedStyle(node);
      for (let i = 0; i < computed.length; i += 1) {
        const property = computed[i];
        copies[index].style.setProperty(
          property,
          computed.getPropertyValue(property),
          computed.getPropertyPriority(property),
        );
      }
    });

    clone.style.width = `${width}px`;
    clone.style.maxWidth = 'none';
    clone.style.margin = '0';

    await Promise.all(
      [...clone.querySelectorAll('img')].map(async (image) => {
        if (!image.src || image.src.startsWith('data:')) return;
        const response = await fetch(image.src, { mode: 'cors' });
        if (!response.ok) throw new Error('图片读取失败');
        const blob = await response.blob();
        image.src = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }),
    );

    const scale = Math.min(2, Math.sqrt(16_000_000 / (width * height)));
    const pixelWidth = Math.round(width * scale);
    const pixelHeight = Math.round(height * scale);
    const markup = new XMLSerializer().serializeToString(clone);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelWidth}" height="${pixelHeight}" viewBox="0 0 ${width} ${height}"><foreignObject width="${width}" height="${height}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px">${markup}</div></foreignObject></svg>`;

    svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const image = new Image();
    image.src = svgUrl;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('无法创建图片');
    context.drawImage(image, 0, 0, pixelWidth, pixelHeight);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('图片生成失败');

    const safeCity = (city || '旅行').replace(/[\\/:*?"<>|]/g, '_');
    const file = new File([blob], `${safeCity}-旅行手账.png`, { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: `${city || '旅行'}旅行手账`, files: [file] });
      notify('已打开分享面板，可保存图片或发送给朋友。');
      return;
    }

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = file.name;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
    notify('手账图片已下载，可在浏览器下载列表中查看。');
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    notify('图片生成暂不可用，请使用“保存 PDF”。');
  } finally {
    if (svgUrl) URL.revokeObjectURL(svgUrl);
  }
}
