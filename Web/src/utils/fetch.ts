import { message } from "antd";

export async function fetch(url: string, options: any) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await window.fetch(url, { ...options, headers });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.text();
      if (data === "" || data === null) {
        return null;
      }
      return JSON.parse(data);
    }

    if (response.status === 204) {
      return null;
    }

    // 如果是401，跳转到登录页，并带上当前页面的URL
    if (response.status === 401) {
      // 检查当前是否已经在登录页面
      if (!window.location.pathname.includes('/auth/login')) {
        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/auth/login?redirect=${currentPath}`;
      }
    }

    if (response.status === 400) {
      // 读取body内容
      const data = await response.json();
      throw new Error(data);
    } else if (response.status === 404) {
      const data = await response.json();
      throw new Error(data);
    } else if (response.status === 500) {
      const data = await response.json();
      throw new Error(data);
    }

    const error = new Error();
    throw error;
  } catch (error: any) {
    throw error;
  }
}

export async function fetchRaw(url: string, data: any) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await window.fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok === false) {
      const reader = await response.text();
      throw new Error(reader);
    }

    const reader = response.body!.getReader();
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const { done, value } = await reader.read();
            if (done) {
              return { done: true, value: null };
            }
            return {
              done: false,
              value: new TextDecoder("utf-8").decode(value),
            };
          },
        };
      },
    };
  } catch (error: any) {
    throw error;
  }
}

export const get = (url: string, options?: any) => {
  return fetch(url, {
    method: "GET",
    ...options,
  });
};

export const post = (url: string, options?: any) => {
  return fetch(url, {
    method: "POST",
    ...options,
  });
};

export const postJson = (url: string, data: any) => {
  return post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const put = (url: string, options?: any) => {
  return fetch(url, {
    method: "PUT",
    ...options,
  });
};

export const putJson = (url: string, data: any) => {
  return put(url, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const del = (url: string, options?: any) => {
  return fetch(url, {
    method: "DELETE",
    ...options,
  });
};

/**
 * 使用Server-Sent Events (SSE)技术从服务器获取流式响应的异步生成器函数
 * 
 * 该函数建立与服务器的连接，并以流的形式接收数据，每当接收到新的数据块时，
 * 会将其解析并通过yield返回给调用者，实现实时数据处理。
 * 
 * @param {string} url - API端点URL
 * @param {any} data - 要发送的请求数据
 * @returns {AsyncIterableIterator<any>} 一个异步迭代器，每次迭代产生服务器返回的一个解析后的数据块
 */
export async function* fetchSSE(url: string, data: any): AsyncIterableIterator<any> {
  // 从本地存储获取认证令牌
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 发送POST请求到服务器
  const response = await window.fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });

  // 检查响应状态
  if (!response.ok) {
    const errorText = await response.text();
    const json = JSON.parse(errorText);
    if (!json.success) {
      // 显示错误消息
      message.error(json.message, 5);
    }
    throw new Error(json);
  }

  // 获取响应体的读取器和文本解码器
  const reader = response.body!.getReader();
  const decoder = new TextDecoder("utf-8");

  try {
    // 持续读取数据流
    while (true) {
      // 读取一个数据块
      const { done, value } = await reader.read();
      // 如果数据流结束，退出循环
      if (done) break;

      // 解码二进制数据为文本
      const chunk = decoder.decode(value, { stream: true });
      // 按SSE协议分割事件（每个事件由两个换行符分隔）
      const events = chunk.split("\n\n");

      // 处理每个事件
      for (const event of events) {
        if (event.trim()) {
          // 查找以"data:"开头的行
          const dataLine = event.split("\n").find(line => line.startsWith("data:"));
          if (dataLine) {
            // 提取JSON数据
            const jsonData = dataLine.replace("data:", "").trim();
            // 检查是否是结束标记
            if (jsonData === "[done]") {
              break;
            }
            // 解析JSON并返回给调用者
            yield JSON.parse(jsonData);
          }
        }
      }
    }
  } finally {
    // 确保在任何情况下都取消读取器
    reader.cancel();
  }
}