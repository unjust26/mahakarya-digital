import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

function getSessionId(): string {
  const key = "mk_chat_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function formatMessage(content: string): string {
  // Simple markdown: **bold** → <strong>
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(getSessionId);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getOrCreateSession = useMutation(api.chat.getOrCreateSession);
  const saveUserMessage = useMutation(api.chat.saveUserMessage);
  const generateResponse = useAction(api.chat.generateResponse);
  const messages = useQuery(api.chat.getMessages, { sessionId });

  // Initialize session when chat opens
  useEffect(() => {
    if (isOpen && !initialized) {
      getOrCreateSession({ sessionId }).then(() => setInitialized(true));
    }
  }, [isOpen, initialized, sessionId, getOrCreateSession]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && initialized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialized]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isTyping) return;

    setInput("");
    setIsTyping(true);

    try {
      await saveUserMessage({ sessionId, content: msg });
      await generateResponse({ sessionId, userMessage: msg });
    } catch {
      // Error handled in action
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 size-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6 group-hover:hidden" />
          <Sparkles className="size-6 hidden group-hover:block animate-pulse" />

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-30" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(400px,calc(100vw-2.5rem))] h-[min(600px,calc(100vh-5rem))] rounded-2xl bg-card border border-border shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">MK Assistant</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Always online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {!initialized && (
              <div className="flex justify-center py-8">
                <Loader2 className="size-5 text-muted-foreground animate-spin" />
              </div>
            )}

            {messages?.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md"
                      : "bg-muted/60 border border-border/50 rounded-bl-md"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content),
                  }}
                />
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-card">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                disabled={isTyping}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="size-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Powered by AI · MahaKarya Digital
            </p>
          </div>
        </div>
      )}
    </>
  );
}
