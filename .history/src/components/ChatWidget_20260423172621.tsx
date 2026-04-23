import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your SkyWay concierge. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🛑 تأكد من جلب المفتاح بشكل صحيح
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Gemini Initialization
  const ai = React.useMemo(() => {
    if (!apiKey) {
      console.error(
        "🚨 VITE_GEMINI_API_KEY is missing! Chatbot will not work.",
      );
    }
    return new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });
  }, [apiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm offline right now (API Key missing). Please check the environment variables.",
          sender: "bot",
        },
      ]);
      return;
    }

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setIsTyping(true);

    try {
      // Format history for Gemini
      const conversationHistory = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        // 🔄 تم تعديل الموديل للنسخة المدعومة والمستقرة
        model: "gemini-1.5-flash",
        contents: [
          ...conversationHistory,
          { role: "user", parts: [{ text: userMessage }] },
        ],
        config: {
          systemInstruction:
            "You are the SkyWay Travel Concierge, a premium, helpful, and professional travel assistant. You help users find flights, hotels, and travel inspiration. Be concise, polite, and use travel-related emojis occasionally. If asked about booking, suggest using the search bars on the site.",
          temperature: 0.7,
        },
      });

      const botReply =
        response.text ||
        "I'm sorry, I couldn't process that. How else can I help?";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, my connection to the travel network is unstable right now. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 h-96 flex flex-col shadow-2xl border-primary/20 bg-background overflow-hidden">
              <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-semibold tracking-wide">
                    SkyWay Assistant
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 rounded-full"
                >
                  <X size={18} />
                </Button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-border text-foreground rounded-tl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm flex gap-1 items-center shadow-sm">
                      <span
                        className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t bg-card flex gap-2">
                <Input
                  placeholder={t("chat_placeholder") || "Ask me anything..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border-border focus-visible:ring-primary"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform active:scale-95"
                >
                  <Send size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all hover:-translate-y-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </div>
  );
};
