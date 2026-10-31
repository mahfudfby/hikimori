import { sanitizeHtml, isRichHtml, legacyToHtml, hyphenate, hyphenateHtml } from './richHtml';

test('membuang skrip, event, iframe, url berbahaya', () => {
  const out = sanitizeHtml('<p onclick="x()">Hai<script>alert(1)</script><img src=x onerror=alert(1)></p><iframe src="https://evil"></iframe><a href="javascript:alert(1)">klik</a>');
  expect(out).toBe('<p>Hai</p>klik');
  expect(sanitizeHtml('<span style="background-image:url(javascript:x);color:red">a</span>')).toBe('<span style="color: red;">a</span>');
});

test('menyimpan format gaya Word', () => {
  expect(sanitizeHtml('<b>a</b><i>b</i><u>c</u><strike>d</strike><sub>e</sub><sup>f</sup>')).toBe('<strong>a</strong><em>b</em><u>c</u><s>d</s><sub>e</sub><sup>f</sup>');
  expect(sanitizeHtml('<font color="#c00000" face="Arial" size="5">x</font>')).toBe('<span style="color: rgb(192, 0, 0); font-family: Arial; font-size: 24px;">x</span>');
  expect(sanitizeHtml('<p style="text-align:center;line-height:1.5;border-bottom:1px solid #9a9488">x</p>')).toContain('text-align: center');
  expect(sanitizeHtml('<ol style="list-style-type:upper-roman"><li>a</li></ol>')).toBe('<ol style="list-style-type: upper-roman;"><li>a</li></ol>');
  expect(sanitizeHtml('<span class="fx-gold evil">x</span>')).toBe('<span class="fx-gold">x</span>');
  expect(sanitizeHtml('<a href="https://x.id">x</a>')).toBe('<a href="https://x.id" target="_blank" rel="noopener noreferrer">x</a>');
});

test('tempelan dari Word: tag o:p & komentar dibuang, isi tetap', () => {
  expect(sanitizeHtml('<p class="MsoNormal"><!--[if gte mso 9]>x<![endif]--><span style="mso-bidi-font-weight:bold">Teks<o:p></o:p></span></p>')).toBe('<p><span>Teks</span></p>');
  expect(sanitizeHtml('<p><br></p>')).toBe('');
});

test('format lama tetap terbaca', () => {
  expect(isRichHtml('<p>a</p>')).toBe(true);
  expect(isRichHtml('Teks **biasa**')).toBe(false);
  expect(legacyToHtml('Halo **dunia** <b>\n\nbaris 2')).toBe('<p>Halo <strong>dunia</strong> &lt;b&gt;</p><p>baris 2</p>');
});

test('pemenggalan suku kata otomatis', () => {
  const show = s => hyphenate(s).replace(/\u00AD/g, '-');
  expect(show('pembangunan')).toBe('pem-ba-ngu-nan');
  expect(show('instrumen')).toBe('in-stru-men');
  expect(show('Kesejahteraan')).toBe('Ke-se-jah-te-raan');
  expect(show('masyarakat')).toBe('ma-sya-ra-kat');
  expect(show('paragraf')).toBe('pa-ra-graf');
  expect(show('kontrak putra')).toBe('kon-trak putra');
  expect(show('angka kecil')).toBe('angka kecil');
  expect(hyphenateHtml('<p>pembangunan <strong>masyarakat</strong></p>').replace(/\u00AD/g, '-')).toBe('<p>pem-ba-ngu-nan <strong>ma-sya-ra-kat</strong></p>');
  expect(sanitizeHtml('<a class="btn-link" href="https://x.id">Demo</a>')).toBe('<a class="btn-link" href="https://x.id" target="_blank" rel="noopener noreferrer">Demo</a>');
});
