import { ChatCompleteParams } from '../types/Chat';
import { fetchSSE, post } from '../utils/fetch';

/**
 * 处理AI聊天完成请求的异步生成器函数
 * 
 * 该函数使用Server-Sent Events (SSE)技术从服务器获取流式响应，
 * 允许实时接收AI生成的内容，而不必等待整个响应完成。
 * 
 * @param {ChatCompleteParams} params - 聊天请求参数，包含以下字段:
 *   - sessionId: 当前会话ID
 *   - parentId: 父消息ID (如果有的话)
 *   - text: 用户输入的文本内容
 *   - fileIds: 附加文件的ID数组
 *   - assistantMessageId: 助手消息的ID
 *   - functionCalls: 函数调用数组
 *   - networking: 是否启用网络搜索
 * 
 * @returns {AsyncIterableIterator<any>} 一个异步迭代器，每次迭代产生服务器返回的一个数据块
 *   数据块可能包含不同类型的内容:
 *   - 类型为'chat'的文本内容
 *   - 类型为'reasoning'的推理过程
 *   - 类型为'search'的搜索结果
 *   - 类型为'model_usage'的模型使用信息
 * 
 * @example
 * // 基本用法示例
 * const params = {
 *   sessionId: 123,
 *   parentId: null,
 *   text: "你好，请介绍一下自己",
 *   fileIds: [],
 *   assistantMessageId: 456,
 *   functionCalls: [],
 *   networking: false
 * };
 * 
 * // 使用for-await循环处理流式响应
 * for await (const chunk of chatComplete(params)) {
 *   // 处理每个数据块
 *   console.log(chunk);
 * }
 */
export async function* chatComplete(params: ChatCompleteParams): AsyncIterableIterator<any> {
  // API端点URL
  const url = '/api/Chat/ChatComplete';
  
  // 使用fetchSSE函数发送请求并获取流式响应
  // yield*将fetchSSE生成的所有值传递给调用者
  yield* fetchSSE(url, params);
}

export async function generateSessionName(sessionId: number): Promise<any> {
  const url = `/api/Chat/GenerateSessionName?sessionId=${sessionId}`;
  return await post(url);
}
