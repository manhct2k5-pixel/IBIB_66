import React, { useState } from 'react';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  X, 
  MapPin, 
  Loader2
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestinationNode: (node: MapNode) => void;
  currentBuilding: string;
  currentFloor: string;
  language: 'vi' | 'en';
}

interface TriageResult {
  reply: string;
  suggestedDepartmentId?: string;
  departmentName?: string;
  building?: string;
  floor?: string;
  roomCode?: string;
  urgency?: 'emergency' | 'urgent' | 'normal';
  instructions?: string[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectDestinationNode,
  currentBuilding,
  currentFloor,
}) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; triage?: TriageResult }[]>([
    {
      role: 'assistant',
      text: 'Xin chào! Tôi là Trợ Lý AI Hướng Dẫn Bệnh Viện MedNav. Bạn đang gặp phải triệu chứng gì hoặc cần tìm khoa/dịch vụ nào, hãy mô tả tôi sẽ chỉ đường chính xác nhất cho bạn!'
    }
  ]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Tôi bị đau tức ngực trái và hồi hộp',
    'Tôi cần làm xét nghiệm máu và nước tiểu',
    'Bé nhà tôi 3 tuổi bị sốt và ho khan',
    'Tôi muốn nhổ răng khôn số 8',
    'Tôi bị đau nhức khớp gối và cột sống',
    'Căn tin và cây ATM ở đâu?'
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || query).trim();
    if (!promptText || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: promptText }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentLocation: { building: currentBuilding, floor: currentFloor }
        })
      });

      if (!response.ok) {
        throw new Error('AI service error');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Dưới đây là phòng khám phù hợp với nhu cầu của bạn:',
          triage: data.triage
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Xin lỗi, không thể kết nối tới máy chủ AI lúc này. Bạn có thể sử dụng thanh tìm kiếm trực tiếp để tra cứu phòng khám.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToDepartment = (departmentId?: string) => {
    if (!departmentId) return;
    const node = MAP_NODES_DATA.find(n => n.roomId === departmentId || n.id === departmentId);
    if (node) {
      onSelectDestinationNode(node);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-xs text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Trợ Lý AI Phân Luồng & Chỉ Đường</span>
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full border border-cyan-200">
                  Gemini 3.7
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Tự động gợi ý phòng khám chính xác theo triệu chứng & chỉ đường tức thì
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50/70 border-b border-slate-200 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          <span className="text-slate-500 font-semibold shrink-0 text-[11px]">Câu hỏi mẫu:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg whitespace-nowrap text-[11px] border border-slate-200 transition cursor-pointer shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 text-xs sm:text-sm ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Structured Triage Card */}
                {msg.triage && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {msg.triage.roomCode && (
                          <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 font-bold rounded-md border border-cyan-200">
                            {msg.triage.roomCode}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 text-sm">
                          {msg.triage.departmentName}
                        </span>
                      </div>

                      {msg.triage.urgency === 'emergency' && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-[10px] animate-pulse">
                          CẤP CỨU KHẨN CẤP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                      <span className="flex items-center gap-1 text-cyan-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        {msg.triage.building} - {msg.triage.floor}
                      </span>
                    </div>

                    {msg.triage.instructions && msg.triage.instructions.length > 0 && (
                      <div className="bg-white p-2.5 rounded-lg space-y-1 text-[11px] text-slate-600 border border-slate-200">
                        <span className="font-bold text-slate-800 block">Lưu ý & Hướng dẫn:</span>
                        {msg.triage.instructions.map((ins, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-1.5">
                            <span className="text-cyan-600">•</span>
                            <span>{ins}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action button: Direct Navigation */}
                    <button
                      id={`btn-navigate-triage-${msg.triage.suggestedDepartmentId}`}
                      onClick={() => handleNavigateToDepartment(msg.triage?.suggestedDepartmentId)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>CHỈ ĐƯỜNG NGAY ĐẾN ĐÂY</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                <span>AI đang phân tích triệu chứng & tìm phòng khám...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="input-ai-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập triệu chứng hoặc phòng khám bạn cần đến..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!query.trim() || loading}
              id="btn-send-ai-query"
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-2xl transition shadow-xs flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Hỏi AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
