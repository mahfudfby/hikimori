// src/utils/embed.ts — ubah link YouTube / TikTok / Instagram / web biasa menjadi URL iframe, plus jenis media.
export type EmbedKind = 'youtube' | 'tiktok' | 'instagram' | 'web';
export interface Embed { src: string; ratio: string; kind: EmbedKind }

/**
 * Kode embed yang ditempel (Instagram / TikTok / YouTube) → link postingannya saja.
 * HTML-nya tidak pernah dirender: hanya URL yang diambil, lalu tampil lewat iframe resmi.
 */
export function embedUrlFromCode(raw: string): string {
  const s = (raw || '').trim();
  if (!s.includes('<')) return s;
  const attr = (name: string) => s.match(new RegExp(`${name}\\s*=\\s*["'](https:[^"']+)["']`, 'i'))?.[1];
  const url = attr('data-instgrm-permalink') || attr('cite') || attr('src') || s.match(/https:\/\/[^\s"'<>]+/)?.[0] || '';
  return url.replace(/&amp;/g, '&');
}

/** null bila link tidak valid / bukan https. `frameless`: tanpa caption & bingkai platform (TikTok player, IG tanpa caption). */
export function parseEmbed(raw: string, frameless = false): Embed | null {
  let u: URL;
  try { u = new URL(embedUrlFromCode(raw)); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  const h = u.hostname.replace(/^(www\.|m\.)/, '');

  if (h === 'youtu.be' || h === 'youtube.com' || h === 'youtube-nocookie.com' || h === 'music.youtube.com') {
    const raw_id = h === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') || (u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/) || [])[1];
    const id = (raw_id || '').match(/^[\w-]{6,}/)?.[0];
    if (!id) return null;
    return { src: `https://www.youtube-nocookie.com/embed/${id}`, ratio: u.pathname.startsWith('/shorts/') ? '9 / 16' : '16 / 9', kind: 'youtube' };
  }
  if (h === 'tiktok.com' || h.endsWith('.tiktok.com')) {
    // shortcut: link pendek vt.tiktok.com tidak bisa dibaca tanpa server, pakai link lengkap .../video/<angka>
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    if (!id) return null;
    return frameless
      ? { src: `https://www.tiktok.com/player/v1/${id}?description=0&music_info=0&rel=0`, ratio: '9 / 16', kind: 'tiktok' }
      : { src: `https://www.tiktok.com/embed/v2/${id}`, ratio: '9 / 17.5', kind: 'tiktok' };
  }
  if (h === 'instagram.com') {
    const m = u.pathname.match(/^\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/);
    if (!m) return null;
    return { src: `https://www.instagram.com/${m[1] === 'p' || m[1] === 'tv' ? 'p' : 'reel'}/${m[2]}/embed/${frameless ? '' : 'captioned/'}`, ratio: frameless ? '4 / 5.2' : '4 / 5.9', kind: 'instagram' };
  }
  return { src: u.href, ratio: '16 / 10', kind: 'web' };
}

/** Gambar, video file, atau embed (YouTube/TikTok/IG/web). */
export function mediaKind(url: string): 'image' | 'video' | 'embed' | 'none' {
  const s = (url || '').trim();
  if (!s) return 'none';
  if (s.includes('<')) return 'embed';
  if (/res\.cloudinary\.com\/[^/]+\/video\//.test(s) || /\.(mp4|webm|mov)(\?|#|$)/i.test(s)) return 'video';
  if (/res\.cloudinary\.com\/[^/]+\/image\//.test(s) || /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(s) || /images\.unsplash\.com/.test(s)) return 'image';
  return 'embed';
}

/** Teks bergaya sederhana: **tebal**, *miring*, `kode`, [teks](https://link). Hasil berupa token, bukan HTML. */
export type Inline = { t: 'text' | 'b' | 'i' | 'code'; v: string } | { t: 'a'; v: string; href: string };
export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'b', v: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'i', v: m[2] });
    else if (m[3] !== undefined) out.push({ t: 'code', v: m[3] });
    else out.push({ t: 'a', v: m[4], href: m[5] });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) });
  return out;
}
