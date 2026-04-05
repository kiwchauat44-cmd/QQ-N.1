import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Brain, 
  Activity, 
  ShieldCheck, 
  History, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  Database, 
  MessageSquare, 
  Lock, 
  Eye, 
  Scale, 
  User, 
  Globe, 
  Search, 
  Terminal, 
  Radio, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  MoreVertical, 
  Play, 
  Pause, 
  RefreshCw, 
  Command, 
  Workflow, 
  Gavel, 
  Rocket, 
  Wind, 
  ShieldAlert,
  Send,
  Sparkles,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { format } from "date-fns";
import { GoogleGenAI } from "@google/genai";
import { 
  SystemMode, 
  Signal, 
  DecisionLog, 
  SystemState, 
  CONSTITUTION_PRINCIPLES 
} from "./types";

// --- Components ---

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  key?: React.Key;
}

const GlassCard = ({ children, className, glow = false }: GlassCardProps) => (
  <div className={cn(
    "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl",
    glow && "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    className
  )}>
    {children}
  </div>
);

const ProgressBar = ({ value, color = "blue" }: { value: number, color?: "blue" | "red" | "green" | "amber" }) => {
  const colors = {
    blue: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    red: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    green: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
    amber: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={cn("h-full transition-all duration-500", colors[color])}
      />
    </div>
  );
};

const ModeIcon = ({ mode, size = 20 }: { mode: SystemMode, size?: number }) => {
  switch (mode) {
    case "Analysis": return <Search size={size} className="text-blue-400" />;
    case "Legal Assistant": return <Gavel size={size} className="text-purple-400" />;
    case "Mission Control": return <Rocket size={size} className="text-amber-400" />;
    case "Cosmic Flow": return <Wind size={size} className="text-cyan-400" />;
    case "Safe Mode": return <ShieldAlert size={size} className="text-red-400" />;
    default: return <Brain size={size} className="text-white" />;
  }
};

// --- Main Application ---

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function App() {
  const [view, setView] = useState<"Core Brain" | "Thinking Flow" | "Signals" | "Constitution" | "Logs" | "Settings" | "Chat">("Core Brain");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SystemState>({
    currentMode: "Analysis",
    confidence: 94,
    risk: 12,
    activeSignals: [],
    logs: [],
    constitutionStatus: "Active",
    isProcessing: false,
    currentStep: null,
  });

  // Simulation: Generate random signals
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isProcessing) return;

      const types: Signal["type"][] = ["User Command", "Telemetry", "Alert", "System Log", "Mode Switch"];
      const severities: Signal["severity"][] = ["Low", "Medium", "High", "Critical"];
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      let content = "";
      switch (type) {
        case "User Command": content = "Execute system diagnostic"; break;
        case "Telemetry": content = "Core temperature: 42°C"; break;
        case "Alert": content = "Anomalous data pattern detected in sector 7"; break;
        case "System Log": content = "Database sync completed"; break;
        case "Mode Switch": content = "Requesting transition to Mission Control"; break;
      }

      const newSignal: Signal = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date(),
        severity,
      };

      setState(prev => ({
        ...prev,
        activeSignals: [newSignal, ...prev.activeSignals].slice(0, 50),
      }));

      // Trigger thinking flow for high severity or commands
      if (severity === "High" || severity === "Critical" || type === "User Command" || type === "Mode Switch") {
        processSignal(newSignal);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state.isProcessing]);

  const processSignal = async (signal: Signal) => {
    setState(prev => ({ ...prev, isProcessing: true, currentStep: "Input" }));
    
    const steps: SystemState["currentStep"][] = ["Input", "Translate", "Categorize", "Reason", "Decide", "Output", "Log"];
    
    for (const step of steps) {
      setState(prev => ({ ...prev, currentStep: step }));
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Decision Logic
    let newMode = state.currentMode;
    let reasoning = "Standard operational procedure applied.";
    let decision = "Monitoring continued.";
    let confidence = 90 + Math.random() * 10;
    let risk = 5 + Math.random() * 15;

    if (signal.type === "Mode Switch") {
      newMode = "Mission Control";
      reasoning = "User requested mode transition. Validating environment safety.";
      decision = "Transitioning to Mission Control.";
    } else if (signal.severity === "Critical") {
      newMode = "Safe Mode";
      reasoning = "Critical anomaly detected. Initiating protective protocols.";
      decision = "Locked down non-essential sectors.";
      risk = 60 + Math.random() * 20;
    }

    const newLog: DecisionLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      input: signal.content,
      reasoning,
      decision,
      confidence,
      risk,
      mode: newMode,
    };

    setState(prev => ({
      ...prev,
      isProcessing: false,
      currentStep: null,
      currentMode: newMode,
      confidence,
      risk,
      logs: [newLog, ...prev.logs].slice(0, 100),
    }));
  };

  const navItems = [
    { name: "Core Brain", thai: "สมองกลาง", icon: Brain },
    { name: "Thinking Flow", thai: "กระบวนการคิด", icon: Workflow },
    { name: "Chat", thai: "แชทอัจฉริยะ", icon: MessageSquare },
    { name: "Signals", thai: "สัญญาณระบบ", icon: Radio },
    { name: "Constitution", thai: "รัฐธรรมนูญ AI", icon: ShieldCheck },
    { name: "Logs", thai: "บันทึกระบบ", icon: History },
    { name: "Settings", thai: "ตั้งค่า", icon: Settings },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatInput,
        config: {
          systemInstruction: "You are Q Core Brain, a human-centric AI orchestration platform. Respond in a helpful, technical yet cosmic tone. Use emojis frequently. If the user speaks Thai, respond in Thai. Always maintain constitutional principles.",
        }
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text || "I am processing your request... (กำลังประมวลผลคำขอของคุณ...)",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "System Error: Unable to connect to the neural network. (ข้อผิดพลาดของระบบ: ไม่สามารถเชื่อมต่อกับเครือข่ายประสาทได้)",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-black/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-white/5 active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain size={24} className="text-blue-500" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm"
              />
            </div>
            <span className="text-lg font-bold tracking-tight">Q CORE <span className="text-blue-500">BRAIN (สมองกลาง)</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 md:flex">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-widest">System Online</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-72 border-r border-white/10 bg-black p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={24} className="text-blue-500" />
                  <span className="text-xl font-bold">Menu</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-2 hover:bg-white/5">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setView(item.name as any);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200",
                      view === item.name 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name} ({item.thai})</span>
                    {view === item.name && <motion.div layoutId="activeNav" className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-8 left-6 right-6">
                <GlassCard className="p-4 border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Constitution</p>
                      <p className="text-[10px] text-white/40">Verified & Active</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          {view === "Core Brain" && (
            <motion.div 
              key="core"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <GlassCard className="p-4" glow>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Current Mode (โหมดปัจจุบัน) 🚀</p>
                  <div className="flex items-center gap-2">
                    <ModeIcon mode={state.currentMode} />
                    <span className="font-bold text-lg">{state.currentMode}</span>
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Confidence (ความเชื่อมั่น) 💎</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-blue-400">{Math.round(state.confidence)}%</span>
                    <div className="mb-1.5 flex-1">
                      <ProgressBar value={state.confidence} color="blue" />
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Risk Level (ระดับความเสี่ยง) ⚠️</p>
                  <div className="flex items-end gap-2">
                    <span className={cn(
                      "text-2xl font-black",
                      state.risk < 20 ? "text-green-400" : state.risk < 50 ? "text-amber-400" : "text-red-400"
                    )}>{Math.round(state.risk)}%</span>
                    <div className="mb-1.5 flex-1">
                      <ProgressBar value={state.risk} color={state.risk < 20 ? "green" : state.risk < 50 ? "amber" : "red"} />
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Constitution (รัฐธรรมนูญ) 📜</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-green-400" />
                    <span className="font-bold text-green-400">ACTIVE (เปิดใช้งาน)</span>
                  </div>
                </GlassCard>
              </div>

              {/* Main Visualization */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard className="relative aspect-video flex items-center justify-center overflow-hidden border-blue-500/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
                    
                    {/* Animated Brain Core */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        animate={{ 
                          scale: state.isProcessing ? [1, 1.1, 1] : [1, 1.05, 1],
                          rotate: state.isProcessing ? 360 : 0
                        }}
                        transition={{ 
                          scale: { repeat: Infinity, duration: state.isProcessing ? 1 : 4 },
                          rotate: { repeat: Infinity, duration: 20, ease: "linear" }
                        }}
                        className="relative"
                      >
                        <Brain size={120} className={cn(
                          "transition-colors duration-500",
                          state.isProcessing ? "text-blue-400" : "text-white/20"
                        )} />
                        <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full" />
                      </motion.div>
                      
                      <div className="mt-8 text-center">
                        <h2 className="text-xl font-bold tracking-tight">
                          {state.isProcessing ? "ORCHESTRATING..." : "SYSTEM IDLE"}
                        </h2>
                        <p className="text-sm text-white/40">
                          {state.isProcessing ? `Processing step: ${state.currentStep}` : "Awaiting next signal input"}
                        </p>
                      </div>
                    </div>

                    {/* Background Elements */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full" />
                    </div>
                  </GlassCard>

                  {/* Thinking Flow Preview */}
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold flex items-center gap-2">
                        <Workflow size={18} className="text-blue-400" />
                        Thinking Flow
                      </h3>
                      <button onClick={() => setView("Thinking Flow")} className="text-xs text-blue-400 hover:underline">View Full Flow</button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {["Input", "Translate", "Categorize", "Reason", "Decide", "Output", "Log"].map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-2 flex-1">
                          <div className={cn(
                            "h-1.5 w-full rounded-full transition-all duration-300",
                            state.currentStep === step ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : 
                            (state.isProcessing && ["Input", "Translate", "Categorize", "Reason", "Decide", "Output", "Log"].indexOf(state.currentStep!) > i) ? "bg-blue-500/40" : "bg-white/5"
                          )} />
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-tighter",
                            state.currentStep === step ? "text-blue-400" : "text-white/20"
                          )}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Sidebar Metrics */}
                <div className="space-y-6">
                  {/* Active Signals */}
                  <GlassCard className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Radio size={18} className="text-blue-400" />
                        Live Signals
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/40 uppercase">Live</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-[400px]">
                      {state.activeSignals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-white/20">
                          <Activity size={32} className="mb-2 opacity-20" />
                          <p className="text-xs">No signals detected</p>
                        </div>
                      ) : (
                        state.activeSignals.map((signal) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={signal.id} 
                            className="group relative rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                signal.severity === "Critical" ? "text-red-400" : 
                                signal.severity === "High" ? "text-amber-400" : "text-blue-400"
                              )}>
                                {signal.type}
                              </span>
                              <span className="text-[10px] text-white/20">{format(signal.timestamp, "HH:mm:ss")}</span>
                            </div>
                            <p className="text-xs text-white/80 line-clamp-2">{signal.content}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                    <button 
                      onClick={() => setView("Signals")}
                      className="mt-4 w-full rounded-xl border border-white/10 py-2 text-xs font-bold hover:bg-white/5 transition-all"
                    >
                      View All Signals
                    </button>
                  </GlassCard>
                </div>
              </div>

              {/* Recommendations */}
              <GlassCard className="p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Info size={18} className="text-blue-400" />
                  System Recommendations
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                    <p className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">Optimization</p>
                    <p className="text-sm text-white/70">Consider switching to Cosmic Flow for current low-latency tasks.</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                    <p className="text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">Security</p>
                    <p className="text-sm text-white/70">Anomalous pattern in sector 7 requires manual verification.</p>
                  </div>
                  <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4">
                    <p className="text-xs font-bold text-green-400 mb-1 uppercase tracking-wider">Performance</p>
                    <p className="text-sm text-white/70">Core systems operating at peak efficiency. No action required.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {view === "Chat" && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col h-full max-h-[calc(100vh-180px)]"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  Neural Chat (แชทประสาทเทียม) 🧠✨
                </h2>
                <p className="text-sm text-white/40 italic">Powered by Gemini AI - Connected to the Cosmic Network 🌌</p>
              </div>

              <GlassCard className="flex-1 flex flex-col p-4 mb-4 overflow-hidden border-blue-500/10">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                      <Bot size={48} className="mb-4 opacity-20" />
                      <p className="text-sm">Initiate neural link... (เริ่มการเชื่อมต่อประสาทเทียม...)</p>
                      <p className="text-[10px] mt-2 uppercase tracking-widest">Awaiting user input 📡</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={msg.id} 
                      className={cn(
                        "flex flex-col max-w-[85%] rounded-2xl p-4",
                        msg.role === "user" 
                          ? "ml-auto bg-blue-600/20 border border-blue-500/30 rounded-tr-none" 
                          : "mr-auto bg-white/5 border border-white/10 rounded-tl-none"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === "assistant" ? <Bot size={14} className="text-blue-400" /> : <User size={14} className="text-white/40" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {msg.role === "assistant" ? "Q Core Brain" : "User (ผู้ใช้)"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[8px] text-white/20 mt-2 text-right">{format(msg.timestamp, "HH:mm:ss")}</span>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-blue-400/60"
                    >
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-1 w-1 rounded-full bg-current" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-1 w-1 rounded-full bg-current" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-1 w-1 rounded-full bg-current" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Thinking (กำลังคิด)... ⚡</span>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </GlassCard>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Enter neural command... (ป้อนคำสั่งประสาทเทียม...)"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-blue-500/50 focus:outline-none transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}
          {view === "Thinking Flow" && (
            <motion.div 
              key="flow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Thinking Flow (กระบวนการคิด) ⚙️</h2>
                  <p className="text-sm text-white/40">Real-time orchestration visualization (การแสดงผลการประสานงานแบบเรียลไทม์)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", state.isProcessing ? "bg-blue-500 animate-pulse" : "bg-white/20")} />
                  <span className="text-xs font-bold uppercase tracking-widest">{state.isProcessing ? "Processing (กำลังประมวลผล)" : "Idle (ว่าง)"}</span>
                </div>
              </div>

              <div className="grid gap-8 py-8">
                {[
                  { step: "Input", thai: "นำเข้า", icon: Database, desc: "Receiving raw data from multiple channels (รับข้อมูลดิบจากหลายช่องทาง)" },
                  { step: "Translate", thai: "แปลผล", icon: MessageSquare, desc: "Normalizing data into system-readable format (ปรับข้อมูลให้เป็นรูปแบบที่ระบบอ่านได้)" },
                  { step: "Categorize", thai: "จัดหมวดหมู่", icon: Layers, desc: "Assigning priority and domain classification (กำหนดลำดับความสำคัญและการจัดประเภทโดเมน)" },
                  { step: "Reason", thai: "ใช้เหตุผล", icon: Brain, desc: "Evaluating against logic models and history (ประเมินเทียบกับแบบจำลองตรรกะและประวัติ)" },
                  { step: "Decide", thai: "ตัดสินใจ", icon: Scale, desc: "Applying constitutional constraints and choosing action (ใช้ข้อจำกัดทางรัฐธรรมนูญและเลือกการดำเนินการ)" },
                  { step: "Output", thai: "ส่งออก", icon: ArrowRight, desc: "Executing decision and routing to modules (ดำเนินการตามการตัดสินใจและส่งไปยังโมดูล)" },
                  { step: "Log", thai: "บันทึก", icon: History, desc: "Recording runtime trace for accountability (บันทึกร่องรอยการทำงานเพื่อความรับผิดชอบ)" },
                ].map((item, i) => (
                  <div key={item.step} className="relative flex items-center gap-6">
                    {i < 6 && (
                      <div className="absolute left-6 top-12 bottom-[-32px] w-[2px] bg-gradient-to-b from-blue-500/20 to-transparent" />
                    )}
                    <div className={cn(
                      "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500",
                      state.currentStep === item.step 
                        ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                        : "bg-white/5 border-white/10 text-white/40"
                    )}>
                      <item.icon size={20} />
                    </div>
                    <GlassCard className={cn(
                      "flex-1 p-4 transition-all duration-500",
                      state.currentStep === item.step ? "border-blue-500/50 bg-blue-500/10" : "opacity-40"
                    )}>
                      <h4 className="font-bold">{item.step} ({item.thai})</h4>
                      <p className="text-xs text-white/60">{item.desc}</p>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "Constitution" && (
            <motion.div 
              key="constitution"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="rounded-2xl bg-blue-500/20 p-4 text-blue-400">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Constitution (รัฐธรรมนูญ AI) ⚖️🛡️</h2>
                  <p className="text-sm text-white/40">Core principles governing all system decisions (หลักการพื้นฐานที่ควบคุมการตัดสินใจของระบบทั้งหมด)</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {CONSTITUTION_PRINCIPLES.map((principle) => (
                  <GlassCard key={principle.id} className="p-6 border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/40 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                        <span className="text-xs font-bold">{principle.id}</span>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1 group-hover:text-blue-400 transition-all">{principle.title}</h4>
                        <p className="text-sm text-white/60 leading-relaxed">{principle.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              <GlassCard className="p-6 border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-green-400" size={24} />
                  <div>
                    <h4 className="font-bold text-green-400">Compliance Verified (ตรวจสอบความสอดคล้องแล้ว) ✅</h4>
                    <p className="text-sm text-white/60">The system is currently operating in full compliance with all 7 constitutional principles. (ระบบกำลังทำงานอย่างสอดคล้องกับหลักการรัฐธรรมนูญทั้ง 7 ประการ)</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {view === "Logs" && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Decision Logs (บันทึกการตัดสินใจ) 📜</h2>
                  <p className="text-sm text-white/40">Traceable history of system reasoning (ประวัติการใช้เหตุผลของระบบที่ตรวจสอบย้อนหลังได้)</p>
                </div>
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold hover:bg-white/10 transition-all">
                  Export Audit Trail (ส่งออกประวัติการตรวจสอบ) 📤
                </button>
              </div>

              <div className="space-y-4">
                {state.logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-white/20">
                    <History size={48} className="mb-4 opacity-10" />
                    <p>No decision logs available yet.</p>
                  </div>
                ) : (
                  state.logs.map((log) => (
                    <GlassCard key={log.id} className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-white/5 p-2">
                            <ModeIcon mode={log.mode} size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40">{format(log.timestamp, "MMM dd, HH:mm:ss")}</p>
                            <h4 className="font-bold">{log.input}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-white/40 uppercase">Confidence</p>
                            <p className="text-sm font-bold text-blue-400">{Math.round(log.confidence)}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-white/40 uppercase">Risk</p>
                            <p className={cn(
                              "text-sm font-bold",
                              log.risk < 20 ? "text-green-400" : log.risk < 50 ? "text-amber-400" : "text-red-400"
                            )}>{Math.round(log.risk)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                          <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Reasoning</p>
                          <p className="text-sm text-white/80 italic">"{log.reasoning}"</p>
                        </div>
                        <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
                          <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Decision</p>
                          <p className="text-sm font-bold text-white">{log.decision}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === "Signals" && (
            <motion.div 
              key="signals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Signal Feed (ฟีดสัญญาณ) 📡</h2>
                  <p className="text-sm text-white/40">Raw telemetry and system events (ข้อมูลเทเลเมทรีดิบและเหตุการณ์ของระบบ)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Search size={18} className="text-white/40" />
                  </div>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Radio size={18} className="text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {state.activeSignals.map((signal) => (
                  <GlassCard key={signal.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-all">
                    <div className={cn(
                      "h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border",
                      signal.severity === "Critical" ? "bg-red-500/10 border-red-500/20 text-red-400" : 
                      signal.severity === "High" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : 
                      "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                      {signal.type === "User Command" ? <Command size={18} /> : 
                       signal.type === "Alert" ? <AlertTriangle size={18} /> : 
                       signal.type === "Telemetry" ? <Activity size={18} /> : 
                       signal.type === "Mode Switch" ? <RefreshCw size={18} /> : <Terminal size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{signal.type}</span>
                        <span className="text-[10px] text-white/20">{format(signal.timestamp, "HH:mm:ss.SSS")}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{signal.content}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      signal.severity === "Critical" ? "bg-red-500 text-white" : 
                      signal.severity === "High" ? "bg-amber-500/20 text-amber-400" : 
                      "bg-white/10 text-white/40"
                    )}>
                      {signal.severity}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {view === "Settings" && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-8">System Settings</h2>
              
              <div className="space-y-4">
                <GlassCard className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Cpu size={18} className="text-blue-400" />
                    Core Configuration
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autonomous Reasoning</p>
                        <p className="text-xs text-white/40">Allow system to initiate thinking flows without user trigger.</p>
                      </div>
                      <div className="h-6 w-12 rounded-full bg-blue-500 p-1">
                        <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">High-Impact Decision Lock</p>
                        <p className="text-xs text-white/40">Require manual override for any decision with risk {'>'} 50%.</p>
                      </div>
                      <div className="h-6 w-12 rounded-full bg-blue-500 p-1">
                        <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cosmic Sync</p>
                        <p className="text-xs text-white/40">Synchronize with external AI nodes for distributed processing.</p>
                      </div>
                      <div className="h-6 w-12 rounded-full bg-white/10 p-1">
                        <div className="h-4 w-4 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-red-400" />
                    Security & Privacy
                  </h4>
                  <div className="space-y-4">
                    <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition-all flex items-center justify-between">
                      <span className="text-sm font-medium">Encryption Keys</span>
                      <ChevronRight size={16} className="text-white/20" />
                    </button>
                    <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition-all flex items-center justify-between">
                      <span className="text-sm font-medium">Audit History Retention</span>
                      <span className="text-xs text-white/40">90 Days</span>
                    </button>
                    <button className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-left hover:bg-red-500/10 transition-all flex items-center justify-between text-red-400">
                      <span className="text-sm font-bold">Emergency System Purge</span>
                      <ShieldAlert size={16} />
                    </button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 border-t border-white/5 bg-black/80 px-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>CPU: 12%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span>MEM: 4.2GB</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 24MS</span>
          <span>v1.0.4-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
