"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SparklesIcon, XIcon, SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    text: "Halo! Saya Selaras.ai, asisten virtual seputar donor darah. Ada yang bisa saya bantu?",
  },
];

const CANNED_REPLY =
  "Terima kasih atas pertanyaannya. Fitur Selaras.ai masih dalam pengembangan, nantikan pembaruan selanjutnya!";

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: CANNED_REPLY },
    ]);
    setInput("");
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl sm:w-96">
          <div className="flex items-center justify-between gap-2 bg-rose-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <SparklesIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm leading-none font-semibold">Selaras.ai</p>
                <p className="text-xs text-rose-100">Asisten virtual donor darah</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-white hover:bg-white/20 hover:text-white"
              onClick={() => setOpen(false)}
              title="Tutup"
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "rounded-br-sm bg-rose-600 text-white"
                      : "rounded-bl-sm border bg-background",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="shrink-0" title="Kirim">
              <SendIcon className="size-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        className="h-12 gap-2 rounded-full bg-rose-600 px-5 shadow-lg hover:bg-rose-700"
      >
        {open ? <XIcon className="size-4" /> : <SparklesIcon className="size-4" />}
        <span className="font-medium">Selaras.ai</span>
      </Button>
    </div>
  );
}
