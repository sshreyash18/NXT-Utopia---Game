import { useState, useEffect, useRef } from "react";
import { Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentMessage {
  agent: 'adapto' | 'cipher';
  message: string;
  timestamp: number;
}

interface AgentTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AgentMessage[];
}

export default function AgentTerminal({ isOpen, onClose, messages }: AgentTerminalProps) {
  const [displayedMessages, setDisplayedMessages] = useState<AgentMessage[]>([]);
  const [currentTyping, setCurrentTyping] = useState<{ index: number; charIndex: number } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const newMessage = messages[displayedMessages.length];
      setCurrentTyping({ index: displayedMessages.length, charIndex: 0 });
      
      const typeMessage = () => {
        setCurrentTyping(prev => {
          if (!prev) return null;
          
          const nextCharIndex = prev.charIndex + 1;
          
          if (nextCharIndex >= newMessage.message.length) {
            setDisplayedMessages(prev => [...prev, newMessage]);
            return null;
          }
          
          return { ...prev, charIndex: nextCharIndex };
        });
      };

      const interval = setInterval(typeMessage, 30);
      return () => clearInterval(interval);
    }
  }, [messages, displayedMessages]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedMessages, currentTyping]);

  const getCurrentDisplayText = (messageIndex: number, message: string) => {
    if (currentTyping && currentTyping.index === messageIndex) {
      return message.substring(0, currentTyping.charIndex);
    }
    return message;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-cyan-500/30 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-cyan-400 text-sm">NEURAL_NETWORK_CHAT.exe</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-3"
        >
          <div className="text-green-400 mb-4">
            <div>NEURAL NETWORK INTERFACE INITIALIZED</div>
            <div>ESTABLISHING SECURE CONNECTION...</div>
            <div>CONNECTION ESTABLISHED</div>
            <div className="border-b border-gray-700 my-2"></div>
          </div>

          {displayedMessages.map((msg, index) => (
            <div key={index} className="space-y-1">
              <div className={`text-xs ${msg.agent === 'adapto' ? 'text-cyan-300' : 'text-red-300'}`}>
                [{new Date(msg.timestamp).toLocaleTimeString()}] {msg.agent.toUpperCase()}:
              </div>
              <div className={`pl-4 ${msg.agent === 'adapto' ? 'text-cyan-100' : 'text-red-100'}`}>
                {getCurrentDisplayText(index, msg.message)}
                {currentTyping && currentTyping.index === index && (
                  <span className="animate-pulse">▋</span>
                )}
              </div>
            </div>
          ))}

          {currentTyping && (
            <div className="space-y-1">
              <div className={`text-xs ${messages[currentTyping.index].agent === 'adapto' ? 'text-cyan-300' : 'text-red-300'}`}>
                [{new Date(messages[currentTyping.index].timestamp).toLocaleTimeString()}] {messages[currentTyping.index].agent.toUpperCase()}:
              </div>
              <div className={`pl-4 ${messages[currentTyping.index].agent === 'adapto' ? 'text-cyan-100' : 'text-red-100'}`}>
                {getCurrentDisplayText(currentTyping.index, messages[currentTyping.index].message)}
                <span className="animate-pulse">▋</span>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="p-4 border-t border-cyan-500/30">
          <div className="text-xs text-gray-500 font-mono">
            Press ESC to close | {displayedMessages.length} messages logged
          </div>
        </div>
      </div>
    </div>
  );
}

export type { AgentMessage };