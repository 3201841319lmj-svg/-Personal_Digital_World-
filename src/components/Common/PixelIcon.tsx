import React from 'react';

// Icon Map with distinct category mappings
const ICON_PATHS: Record<string, string> = {
  // Main Categories / Showcase Cards
  farm_house: '/assets/icons/farm/farm_house.png',
  sprout_field: '/assets/icons/farm/sprout_field.png',
  farm: '/assets/icons/farm/sprout_field.png',
  farm_icon: '/assets/icons/farm/sprout_field.png',

  workshop: '/assets/icons/workshop/workshop_icon.png',
  workshop_icon: '/assets/icons/workshop/workshop_icon.png',

  feather_ink: '/assets/icons/library/feather_ink.png',
  ancient_tome: '/assets/icons/library/ancient_tome.png',
  library: '/assets/icons/library/ancient_tome.png',
  library_icon: '/assets/icons/library/ancient_tome.png',
  study: '/assets/icons/library/ancient_tome.png',

  sofa: '/assets/icons/livingroom/sofa.png',
  livingroom: '/assets/icons/livingroom/sofa.png',

  tea_bread: '/assets/icons/restaurant/tea_bread.png',
  restaurant: '/assets/icons/restaurant/tea_bread.png',
  restaurant_icon: '/assets/icons/restaurant/tea_bread.png',

  // UI Glyphs
  menu: '/assets/icons/library/ancient_tome.png',
  settings: '/assets/icons/ui/settings.png',
  send: '/assets/icons/ui/send.png',
  attachment: '/assets/icons/ui/attachment.png',
  paperclip: '/assets/icons/ui/attachment.png',
  agent: '/assets/icons/ui/agent.png',
  users: '/assets/icons/ui/agent.png',
  history: '/assets/icons/ui/history.png',
  clock: '/assets/icons/ui/history.png',
  trash: '/assets/icons/ui/trash.png',
  delete: '/assets/icons/ui/trash.png',
  edit: '/assets/icons/ui/edit.png',
  quill: '/assets/icons/ui/edit.png',
  thinking: '/assets/icons/ui/thinking.png',
  sparkles: '/assets/icons/ui/thinking.png',
  back: '/assets/icons/ui/back.png',
  close: '/assets/icons/ui/close.png',
  search: '/assets/icons/ui/search.png',

  // Study Sub-tabs (100% Unique)
  gazette: '/assets/icons/library/gazette_clip.png',
  gazette_clip: '/assets/icons/library/gazette_clip.png',
  tarot: '/assets/icons/library/tarot_crystal.png',
  tarot_crystal: '/assets/icons/library/tarot_crystal.png',
  mail: '/assets/icons/library/wax_envelope.png',
  wax_envelope: '/assets/icons/library/wax_envelope.png',
  diary: '/assets/icons/library/locked_diary.png',
  locked_diary: '/assets/icons/library/locked_diary.png',

  // Actions & Controls (100% Pixel Icons)
  copy: '/assets/icons/library/gazette_clip.png',
  refresh: '/assets/icons/ui/history.png',
  regenerate: '/assets/icons/ui/history.png',
  reply: '/assets/icons/library/wax_envelope.png',
  star: '/assets/icons/library/tarot_crystal.png',
  bookmark: '/assets/icons/library/tarot_crystal.png',
  favorite: '/assets/icons/library/tarot_crystal.png',
  folder: '/assets/icons/library/ancient_tome.png',

  // Decoration
  sparkle: '/assets/icons/ui/thinking.png',
  leaf: '/assets/icons/decoration/potted_plant.png',
  plant: '/assets/icons/decoration/potted_plant.png',
  potted_plant: '/assets/icons/decoration/potted_plant.png',
};

export interface PixelIconProps {
  name: string;
  size?: number;
  animate?: 'none' | 'sparkle' | 'steam' | 'sway' | 'pulse' | 'bounce';
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 24,
  animate = 'none',
  alt = '',
  className = '',
  style = {}
}) => {
  const iconSrc = ICON_PATHS[name.toLowerCase()] || ICON_PATHS['sprout_field'];

  const getAnimClass = () => {
    switch (animate) {
      case 'sparkle': return 'pixel-anim-sparkle';
      case 'steam': return 'pixel-anim-steam';
      case 'sway': return 'pixel-anim-sway';
      case 'pulse': return 'pixel-anim-pulse';
      case 'bounce': return 'pixel-anim-bounce';
      default: return '';
    }
  };

  return (
    <img 
      src={iconSrc} 
      alt={alt || name} 
      className={`pixel-icon-img ${getAnimClass()} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: 'pixelated',
        verticalAlign: 'middle',
        display: 'inline-block',
        ...style
      }}
    />
  );
};
