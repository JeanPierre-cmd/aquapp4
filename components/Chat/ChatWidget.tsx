import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
      const data = await response.json();
      const botResponse: Message = { id: Date.now() + 1, text: data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message to chat API:', error);
      const errorMessage: Message = { id: Date.now() + 1, text: 'Lo siento, no pude conectar con el asistente. Por favor, inténtalo de nuevo más tarde.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-[400px] bg-surface rounded-2xl shadow-xl flex flex-col border border-border animate-scale-in origin-bottom-right">
          <div className="flex items-center justify-between p-4 border-b border-border bg-blue-600 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-white" />
              <h3 className="text-lg font-semibold text-white">AquApp Asistente</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-textSecondary mt-10">
                <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
                <p className="text-sm mt-2">Pregunta sobre funcionalidades, precios o una demo.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.sender === 'bot' && <Bot className="h-4 w-4 text-blue-300" />}
                      {msg.sender === 'user' && <User className="h-4 w-4 text-blue-200" />}
                      <span className="font-semibold text-sm">
                        {msg.sender === 'user' ? 'Tú' : 'AquApp'}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border flex items-center bg-surface rounded-b-2xl">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-text placeholder-textSecondary focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Enviar mensaje"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
