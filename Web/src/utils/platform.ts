/**
 * 平台和浏览器检测工具
 * 提供各种函数用于检测用户的操作系统、浏览器类型和设备信息
 */
import { UAParser } from 'ua-parser-js';

/**
 * 获取UA解析器实例
 * @returns {UAParser} 返回初始化的UA解析器实例
 */
export const getParser = () => {
    let ua = navigator.userAgent;
    return new UAParser(ua);
};

/**
 * 获取用户当前操作系统名称
 * @returns {string} 操作系统名称
 */
export const getPlatform = () => {
    return getParser().getOS().name;
};

/**
 * 获取用户当前浏览器名称
 * @returns {string} 浏览器名称
 */
export const getBrowser = () => {
    return getParser().getResult().browser.name;
};

/**
 * 浏览器信息对象
 * 包含浏览器名称、是否移动设备和操作系统信息
 */
export const browserInfo = {
    browser: getBrowser(),
    isMobile: getParser().getDevice().type === 'mobile',
    os: getParser().getOS().name,
};

/**
 * 检查用户是否使用MacOS系统
 * @returns {boolean} 如果是MacOS则返回true，否则返回false
 */
export const isMacOS = () => getPlatform() === 'Mac OS';

/**
 * 检查用户是否使用Arc浏览器
 * 通过多种方式检测Arc浏览器特有的特性
 * @returns {boolean} 如果是Arc浏览器则返回true，否则返回false
 */
export const isArc = () => {
    return (
        window.matchMedia('(--arc-palette-focus: var(--arc-background-simple-color))').matches ||
        Boolean('arc' in window || 'ArcControl' in window || 'ARCControl' in window) ||
        Boolean(getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title'))
    );
};

/**
 * 检查应用是否在独立模式下运行（PWA模式）
 * @returns {boolean} 如果在独立模式下运行则返回true，否则返回false
 */
export const isInStandaloneMode = () => {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in navigator && (navigator as any).standalone === true)
    );
};

/**
 * 检查是否为macOS Sonoma或更高版本上的Safari浏览器
 * 这对于检测某些特定于Sonoma+Safari的功能支持很有用
 * @returns {boolean} 如果是Sonoma或更高版本的Safari则返回true，否则返回false
 */
export const isSonomaOrLaterSafari = () => {
    // 参考: https://github.com/khmyznikov/pwa-install/blob/0904788b9d0e34399846f6cb7dbb5efeabb62c20/src/utils.ts#L24
    const userAgent = navigator.userAgent.toLowerCase();
    if (navigator.maxTouchPoints || !/macintosh/.test(userAgent)) return false;

    // 检查Safari版本是否 >= 17
    const version = /version\/(\d{2})\./.exec(userAgent);
    if (!version || !version[1] || !(parseInt(version[1]) >= 17)) return false;

    try {
        // 通过特定功能检测来判断是否为Sonoma
        const audioCheck = document.createElement('audio').canPlayType('audio/wav; codecs="1"');
        const webGLCheck = new OffscreenCanvas(1, 1).getContext('webgl');
        return Boolean(audioCheck) && Boolean(webGLCheck);
    } catch {
        return false;
    }
};

/**
 * 检查用户是否使用移动设备
 * @returns {boolean} 如果是移动设备则返回true，否则返回false
 */
export const getIsMobile = () => {
    return getParser().getDevice().type === 'mobile';
};

