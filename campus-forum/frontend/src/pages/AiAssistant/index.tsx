import { useState, useRef, useEffect } from 'react';
import { aiApi } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
  timestamp: Date;
}

const modes = [
  { key: 'chat', label: '对话', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', placeholder: '输入你的问题，按 Enter 发送...' },
  { key: 'write', label: '写作', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', placeholder: '输入文章主题，AI 帮你生成技术文章...' },
  { key: 'image', label: '生图', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', placeholder: '描述你想生成的图片内容...' },
] as const;

type ModeKey = (typeof modes)[number]['key'];

const modeTips: Record<ModeKey, string> = {
  chat: '对话模式：可以直接询问技术问题，AI 会给出详细的解答。支持编程、算法、系统设计等各类技术话题。',
  write: '写作模式：输入文章主题，AI 会生成 Markdown 格式的技术文章。生成后可以直接复制到发布页面使用。',
  image: '生图模式：输入图片描述，AI 会根据描述生成图片。描述越详细，生成的图片越符合预期。',
};

export default function AiAssistant() {
  const { isLogin, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是 Campus Forum AI 助手\n\n我可以帮你：\n- 解答技术问题\n- 辅助写作文章\n- 生成创意图片\n\n有什么可以帮你的吗？',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ModeKey>('chat');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!isLogin) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '请先登录后再使用 AI 功能。',
        timestamp: new Date(),
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);
    setLoading(true);

    try {
      let response = '';
      if (mode === 'chat') {
        response = await aiApi.chat(userMessage);
      } else if (mode === 'write') {
        response = await aiApi.helpWrite(userMessage, '技术分享');
      } else if (mode === 'image') {
        response = await aiApi.generateImage(userMessage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          type: 'image',
          timestamp: new Date(),
        }]);
        setLoading(false);
        return;
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，请求失败：' + (e.message || '未知错误'),
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearMessages = () => {
    setMessages([{
      role: 'assistant',
      content: '对话已清空，有什么可以帮你的吗？',
      timestamp: new Date(),
    }]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const currentMode = modes.find(m => m.key === mode)!;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="surface rounded-2xl p-4 mb-3 noise">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/15 animate-glow-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight">AI 助手</h1>
                <p className="text-[11px] text-base-content/30 font-medium">Powered by DeepSeek</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 p-1 surface-soft rounded-lg">
                {modes.map((m) => (
                  <button
                    key={m.key}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                      mode === m.key
                        ? 'bg-primary text-primary-content shadow-sm shadow-primary/20'
                        : 'text-base-content/40 hover:text-base-content/60 hover:bg-base-200/60'
                    }`}
                    onClick={() => setMode(m.key)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                    </svg>
                    {m.label}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-ghost btn-sm btn-circle text-base-content/25 hover:text-base-content/55 transition-colors"
                onClick={clearMessages}
                title="清空对话"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="surface rounded-2xl flex-1 flex flex-col overflow-hidden noise">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                <div className="flex-shrink-0">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary text-primary-content flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.nickname?.[0] || '我'}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary text-primary-content flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-base-content/35">
                      {msg.role === 'user' ? (user?.nickname || '我') : 'AI 助手'}
                    </span>
                    <span className="text-[10px] text-base-content/20">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className={`rounded-2xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-content rounded-tr-md shadow-sm shadow-primary/15'
                      : 'surface-soft rounded-tl-md'
                  }`}>
                    {msg.type === 'image' ? (
                      <div className="space-y-2">
                        <img
                          src={msg.content}
                          alt="AI generated"
                          className="max-w-sm rounded-lg shadow-md hover:shadow-xl transition-shadow"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <a
                          href={msg.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] underline opacity-50 hover:opacity-80 inline-flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          查看原图
                        </a>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                        {msg.content}
                      </div>
                    )}
                  </div>
                  {msg.role === 'assistant' && msg.type !== 'image' && (
                    <button
                      className="btn btn-ghost btn-xs text-base-content/20 hover:text-base-content/50 mt-0.5 gap-1 transition-colors"
                      onClick={() => copyToClipboard(msg.content)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      复制
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary text-primary-content flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="surface-soft rounded-2xl rounded-tl-md px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="loading loading-dots loading-sm text-primary"></span>
                    <span className="text-[11px] text-base-content/30">AI 思考中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showScrollBtn && (
            <button
              className="absolute bottom-28 right-8 btn btn-circle btn-sm btn-primary shadow-lg shadow-primary/20 animate-fade-in"
              onClick={scrollToBottom}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}

          <div className="border-t border-base-200/30 p-4">
            <div className="flex gap-2.5 items-end">
              <div className="flex-1 relative">
                <textarea
                  className="textarea textarea-bordered w-full pr-10 resize-none rounded-xl focus:border-primary/30 focus:outline-none text-[13px] bg-base-200/15 border-base-200/40 placeholder:text-base-content/20"
                  placeholder={currentMode.placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] text-base-content/15">
                  {input.length}
                </div>
              </div>
              <button
                className={`btn btn-primary btn-circle shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 ${
                  loading || !input.trim() ? 'btn-disabled opacity-40' : 'hover:scale-105'
                }`}
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-base-content/20">
              <span><kbd className="kbd kbd-xs">Enter</kbd> 发送</span>
              <span><kbd className="kbd kbd-xs">Shift + Enter</kbd> 换行</span>
              <span className="text-primary/40 font-medium">{currentMode.label}模式</span>
            </div>
          </div>
        </div>

        <div className="surface rounded-xl p-3.5 mt-3 noise">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-base-content/35 leading-relaxed">
                {modeTips[mode]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
