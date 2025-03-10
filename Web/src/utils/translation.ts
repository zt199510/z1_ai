// Simple translation utility
export const useTranslation = () => {
  // This is a simplified version without actual translation functionality
  // You can replace this with your actual translation implementation later
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'recentChat': '最近对话',
      'historyNotice': '暂无历史对话',
      'viewAll': '查看全部',
      'myBots': '我的机器人',
      'discoverBots': '发现机器人',
      'rename': '重命名',
      'delete': '删除',
      'pin': '置顶',
      'unpin': '取消置顶',
      '历史对话': '历史对话',
      'newChat': '新建对话'
    };
    
    return translations[key] || key;
  };
  
  return { t };
}; 