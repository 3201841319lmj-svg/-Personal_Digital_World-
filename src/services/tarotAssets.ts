/**
 * ⚡ Vite 动态资源模块加载器
 * 批量载入 src/assets/tarot/*.png 资源，确保无论 build 还是 dev 环境 100% 映射出 Vite 资源 URL
 */

const tarotImagesSrcGlob = import.meta.glob('../assets/tarot/*.png', { eager: true, import: 'default' });

export function getTarotImageUrl(fileName: string): string {
  // Key format in Vite glob import relative to this file: ../assets/tarot/tarot_00.png
  const globKey = `../assets/tarot/${fileName}`;
  if (tarotImagesSrcGlob[globKey]) {
    return tarotImagesSrcGlob[globKey] as string;
  }
  
  // Public fallback
  return `/assets/tarot/${fileName}`;
}
