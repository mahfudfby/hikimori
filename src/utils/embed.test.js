import { parseEmbed, mediaKind, parseInline, embedUrlFromCode } from './embed';

test('youtube: watch, youtu.be, shorts', () => {
  expect(parseEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3')).toEqual({ src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', ratio: '16 / 9', kind: 'youtube' });
  expect(parseEmbed('https://youtu.be/dQw4w9WgXcQ?si=x')?.src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  expect(parseEmbed('https://youtube.com/shorts/abcDEF12345')?.ratio).toBe('9 / 16');
  expect(parseEmbed('https://www.youtube.com/')).toBeNull();
});

test('tiktok & instagram', () => {
  expect(parseEmbed('https://www.tiktok.com/@hikimori/video/7301234567890123456?lang=id')?.src).toBe('https://www.tiktok.com/embed/v2/7301234567890123456');
  expect(parseEmbed('https://vt.tiktok.com/ZSabc/')).toBeNull();
  expect(parseEmbed('https://www.instagram.com/reel/C1a2B3c4D5/?igsh=x')?.src).toBe('https://www.instagram.com/reel/C1a2B3c4D5/embed/captioned/');
  expect(parseEmbed('https://www.instagram.com/p/C1a2B3c4D5/')?.src).toBe('https://www.instagram.com/p/C1a2B3c4D5/embed/captioned/');
});

test('web & keamanan', () => {
  expect(parseEmbed('https://demo.hikimori.web.id/app')?.kind).toBe('web');
  expect(parseEmbed('http://insecure.test')).toBeNull();
  expect(parseEmbed('javascript:alert(1)')).toBeNull();
});

test('mediaKind', () => {
  expect(mediaKind('https://res.cloudinary.com/x/image/upload/v1/a.png')).toBe('image');
  expect(mediaKind('https://res.cloudinary.com/x/video/upload/v1/a')).toBe('video');
  expect(mediaKind('https://youtu.be/dQw4w9WgXcQ')).toBe('embed');
  expect(mediaKind('')).toBe('none');
});

test('parseInline', () => {
  expect(parseInline('a **b** *c* `d` [e](https://x.id) f')).toEqual([
    { t: 'text', v: 'a ' }, { t: 'b', v: 'b' }, { t: 'text', v: ' ' }, { t: 'i', v: 'c' }, { t: 'text', v: ' ' },
    { t: 'code', v: 'd' }, { t: 'text', v: ' ' }, { t: 'a', v: 'e', href: 'https://x.id' }, { t: 'text', v: ' f' },
  ]);
  expect(parseInline('[x](javascript:alert(1))')).toEqual([{ t: 'text', v: '[x](javascript:alert(1))' }]);
});

test('kode embed ditempel → hanya link yang dipakai', () => {
  const ig = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DUox8tQk_Rg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"><a href="https://www.instagram.com/reel/DUox8tQk_Rg/">x</a></blockquote>\n<script async src="//www.instagram.com/embed.js"></script>';
  expect(embedUrlFromCode(ig)).toBe('https://www.instagram.com/reel/DUox8tQk_Rg/?utm_source=ig_embed&utm_campaign=loading');
  expect(parseEmbed(ig).src).toBe('https://www.instagram.com/reel/DUox8tQk_Rg/embed/captioned/');
  expect(parseEmbed('<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@a/video/7301234567890123456" data-video-id="7301234567890123456"></blockquote>').kind).toBe('tiktok');
  expect(parseEmbed('<iframe width="560" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=x" title="YouTube"></iframe>').src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  expect(mediaKind(ig)).toBe('embed');
});

test('frameless', () => {
  expect(parseEmbed('https://www.instagram.com/reel/DUox8tQk_Rg/', true).src).toBe('https://www.instagram.com/reel/DUox8tQk_Rg/embed/');
  expect(parseEmbed('https://www.tiktok.com/@a/video/7301234567890123456', true).src).toBe('https://www.tiktok.com/player/v1/7301234567890123456?description=0&music_info=0&rel=0');
});
