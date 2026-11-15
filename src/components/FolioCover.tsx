// src/components/FolioCover.tsx — gambar sampul portofolio dengan urutan cadangan:
// 1) header postingan (imageUrl) → 2) logo perusahaan klien (dari Pengalaman) → 3) logo Hikimori.
import React from 'react';
import { useContent } from '../content/ContentContext';
import { cld } from './ui';
import { LOGO_FULL } from './LogoMark';
import type { PortfolioItem } from '../hooks/usePortfolio';
import type { Experience } from '../content/types';

const norm = (s: string) => (s || '').trim().toLowerCase();

/** Logo perusahaan dari Pengalaman yang namanya cocok dengan klien proyek (sama persis atau saling memuat). */
export const clientLogo = (client: string, exps: Experience[]): string | undefined => {
  const c = norm(client);
  if (!c) return undefined;
  const withLogo = exps.filter(e => e.logoUrl);
  return (withLogo.find(e => norm(e.company) === c) || withLogo.find(e => norm(e.company).includes(c) || c.includes(norm(e.company))))?.logoUrl;
};

const FolioCover: React.FC<{ item: PortfolioItem; className: string; width?: number; alt?: string }> = ({ item, className, width = 640, alt = '' }) => {
  const { content } = useContent();
  if (item.imageUrl) return <img className={className} src={cld(item.imageUrl, width)} alt={alt} loading="lazy" decoding="async" />;
  const logo = clientLogo(item.client, content.experience);
  return (
    <div className={`${className} folio-logo ${logo ? '' : 'hk'}`}>
      <img src={logo ? cld(logo, 320) : LOGO_FULL(120)} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
};

export default FolioCover;
