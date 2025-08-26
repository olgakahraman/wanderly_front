export async function compressImage(
  file,
  maxW = 512,
  maxH = 512,
  quality = 0.85
) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    const objectUrl = URL.createObjectURL(file);
    i.onload = () => {
      URL.revokeObjectURL(objectUrl);
      res(i);
    };
    i.onerror = err => {
      URL.revokeObjectURL(objectUrl);
      rej(err);
    };
    i.src = objectUrl;
  });

  let { width, height } = img;
  const ratio = Math.min(maxW / width, maxH / height, 1);
  const w = Math.round(width * ratio);
  const h = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise(res =>
    canvas.toBlob(res, 'image/jpeg', quality)
  );
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
    type: 'image/jpeg',
  });
}
