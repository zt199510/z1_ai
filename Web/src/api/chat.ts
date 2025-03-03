import { Message } from 'ai';

// 模拟响应生成器
function* generateMockResponse(prompt: string): Generator<string> {
  const responses = [
    `感谢您的问题。关于"${prompt}"，我可以提供以下信息...\n\n根据最新研究，这个领域有很多新的发展。首先，我们需要理解基本概念，然后再深入探讨具体应用。`,
    `您询问的"${prompt}"是一个很好的问题。\n\n从技术角度来看，这涉及到多个方面的知识。让我为您详细解释一下核心原理和实际应用场景。`,
    `关于"${prompt}"，我想分享一些重要信息。\n\n这是一个复杂的话题，但我会尽量简明扼要地解释。首先，我们需要了解基本框架，然后再讨论具体实现细节。`,
    `您好！关于"${prompt}"，以下是一些专业建议：\n\n1. 理解基本原理\n2. 学习实际应用\n3. 掌握核心技能\n4. 持续学习和实践\n\n希望这些信息对您有所帮助。`
  ];
  
  // 随机选择一个响应
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  // 模拟流式响应，每次返回一个字符
  for (let i = 0; i < response.length; i++) {
    yield response[i];
    // 在实际应用中，这里可以添加延迟
  }
}

// 创建可读流
function createReadableStream(generator: Generator<string>): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      function push() {
        const { value, done } = generator.next();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(new TextEncoder().encode(value));
        setTimeout(push, 10); // 每10毫秒发送一个字符，模拟打字效果
      }
      push();
    },
  });
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只支持POST请求' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 从请求中提取消息
    const { messages } = await req.json();
    
    // 获取最后一条用户消息
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return new Response(JSON.stringify({ error: '未找到用户消息' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 创建模拟响应生成器
    const generator = generateMockResponse(lastUserMessage.content);
    
    // 创建可读流
    const stream = createReadableStream(generator);
    
    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('聊天API错误:', error);
    return new Response(JSON.stringify({ error: '处理请求时出错' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 