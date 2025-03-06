/**
 * 辅助工具函数集合
 */

/**
 * 将日期格式化为可读字符串
 * @param date - 要格式化的日期
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * 将字符串截断到指定长度
 * @param str - 要截断的字符串
 * @param length - 最大长度
 * @returns 截断后的字符串
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * 函数防抖
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖处理后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 