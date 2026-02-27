/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { 
  Droplets, 
  Sprout, 
  Leaf, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Globe,
  Waves,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Target,
  ZapOff,
  Calculator,
  MessageSquare,
  Send,
  User,
  Bot,
  Loader2,
  X
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const leafAnimation = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const LeafDecoration = ({ className }: { className?: string }) => (
  <motion.div 
    {...leafAnimation}
    className={`leaf-float ${className}`}
  >
    <Leaf className="w-12 h-12 text-brand-green/30" />
  </motion.div>
);

const WaterCalculator = () => {
  const [area, setArea] = useState<number>(1);
  const [crop, setCrop] = useState("Cereals");

  const savings = area * 1500000; // Estimated 1.5M liters per acre
  const yieldIncrease = 35;

  return (
    <div className="glass-card p-8 md:p-12 border-brand-green/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Calculator className="w-24 h-24 text-brand-green" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold mb-8">Water Savings Calculator</h3>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest">Land Area (Acres)</label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={area} 
              onChange={(e) => setArea(parseInt(e.target.value))}
              className="w-full h-2 bg-brand-light-green rounded-lg appearance-none cursor-pointer accent-brand-green"
            />
            <div className="flex justify-between text-xl font-bold text-brand-green">
              <span>{area} Acre{area > 1 ? 's' : ''}</span>
              <span>100 Acres</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest">Crop Type</label>
            <select 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-brand-light-green border-none rounded-2xl px-6 py-4 font-bold text-zinc-700 focus:ring-2 focus:ring-brand-green outline-none"
            >
              <option>Cereals</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Fodder</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            key={savings}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-green text-white p-8 rounded-[32px] text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Estimated Water Saved</p>
            <p className="text-4xl md:text-5xl font-bold">{(savings / 1000000).toFixed(1)}M Liters</p>
            <p className="text-xs mt-2 opacity-60">Per Year with MOKSH Solid Water</p>
          </motion.div>
          
          <motion.div 
            key={yieldIncrease}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 text-white p-8 rounded-[32px] text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Potential Yield Increase</p>
            <p className="text-4xl md:text-5xl font-bold">{yieldIncrease}%</p>
            <p className="text-xs mt-2 opacity-60">Based on field trial data</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const AgriAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Namaste! I'm your MOKSH Agri-Assistant. How can I help you save water today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are an expert agricultural assistant for MOKSH Solid Water. Your goal is to help Indian farmers and urban gardeners understand water conservation, crop management, and how MOKSH products (water retention granules) can help them. Be helpful, professional, and encouraging. Keep responses concise and focused on sustainable farming.",
        }
      });

      const result = await model;
      const botResponse = result.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please check your internet and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-green text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[100] group"
      >
        <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-accent rounded-full border-2 border-white animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[40px] shadow-2xl z-[100] flex flex-col overflow-hidden border border-brand-green/10"
          >
            {/* Header */}
            <div className="bg-brand-green p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Agri-Assistant</p>
                  <p className="text-xs opacity-80">Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-light-green/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-green text-white rounded-tr-none' 
                      : 'bg-white text-zinc-700 shadow-sm rounded-tl-none border border-brand-green/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-brand-green/5">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-green" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-zinc-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about water saving..."
                  className="w-full bg-brand-light-green/50 border-none rounded-2xl px-6 py-4 pr-16 outline-none focus:ring-2 focus:ring-brand-green transition-all text-zinc-900 placeholder:text-zinc-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-green text-white rounded-xl flex items-center justify-center hover:bg-zinc-900 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-green/20">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="organic-blob bg-brand-green w-[600px] h-[600px] -top-[300px] -left-[300px]" />
        <div className="organic-blob bg-brand-accent w-[400px] h-[400px] top-[20%] -right-[200px]" />
        <div className="organic-blob bg-brand-green w-[500px] h-[500px] bottom-[10%] -left-[200px]" />
        
        <LeafDecoration className="top-[15%] left-[5%]" />
        <LeafDecoration className="top-[45%] right-[8%] scale-150" />
        <LeafDecoration className="bottom-[20%] left-[12%] scale-75" />
        <LeafDecoration className="bottom-[5%] right-[15%]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="container-max flex justify-between items-center glass-card px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shadow-lg shadow-brand-green/20">
              <Droplets className="text-white w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-green">MOKSH</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600">
            <a href="#problem" className="hover:text-brand-green transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-brand-green transition-colors">Our Solution</a>
            <a href="#impact" className="hover:text-brand-green transition-colors">Impact</a>
            <a href="#visionaries" className="hover:text-brand-green transition-colors">Visionaries</a>
          </div>
          <a href="#solution" className="pill-button bg-brand-green text-white hover:bg-zinc-800 hover:shadow-lg transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Decorative Greenery Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-green/5 -skew-x-12 translate-x-1/4 z-0" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl z-0" />
        
        {/* Extra Greenery Images */}
        <div className="absolute top-1/2 -right-20 w-64 h-64 opacity-20 rotate-12 pointer-events-none">
          <img src="https://picsum.photos/seed/leaf-detail/400/400" alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
        </div>
        
        <div className="container-max grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green text-sm font-bold mb-6">
              <Sprout className="w-4 h-4" />
              <span>Transforming Water Conservation in India</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8 text-zinc-900">
              Sustainable <br />
              <span className="text-brand-green italic">Solutions</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-lg mb-10 leading-relaxed font-medium">
              Innovative water retention products derived from nature. Non-toxic, eco-friendly, and designed to address India's critical water scarcity.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#solution" className="pill-button bg-brand-green text-white flex items-center gap-2 group">
                Explore Solution <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#impact" className="pill-button border-2 border-brand-green/20 text-brand-green hover:bg-white">
                View Impact
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-white relative">
              <img 
                src="https://picsum.photos/seed/agriculture-hero/1200/1200" 
                alt="Healthy plant growth" 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-green/10 mix-blend-multiply" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 glass-card p-6 flex items-center gap-4 shadow-xl border-brand-green/20">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center">
                <Waves className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-green">120L</p>
                <p className="text-xs font-bold text-zinc-500 uppercase">Water / kg</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Identified */}
      <section id="problem" className="section-padding bg-zinc-900 text-white relative overflow-hidden">
        {/* Problem Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <img src="https://img.freepik.com/premium-photo/sad-indian-farmer-sitting-dry-soil-patiently-waiting-rain_846334-2675.jpg?w=360" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn}>
              <span className="text-brand-accent font-bold uppercase tracking-widest text-sm">The Challenge</span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-8 italic">The Problem Identified</h2>
              <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
                The critical challenges we face today in water management are threatening our food security and urban sustainability.
              </p>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-brand-accent w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Water Scarcity in Agriculture</h3>
                    <p className="text-zinc-400 mb-4">Agriculture consumes over 70% of the world's freshwater, yet much is wasted due to inefficient irrigation.</p>
                    <ul className="space-y-2 text-sm text-zinc-500">
                      <li className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Critical in Rajasthan, Maharashtra, Karnataka, Tamil Nadu, and Gujarat.
                      </li>
                      <li className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                        Unpredictable rainfall and depleting groundwater threaten livelihoods.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0">
                    <Droplets className="text-brand-accent w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Urban Gardening Challenges</h3>
                    <p className="text-zinc-400">Urban households struggle with inconsistent watering schedules and limited availability. Dry regions make it hard to sustain home gardens without constant attention.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div {...fadeIn} className="relative">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://www.shutterstock.com/shutterstock/videos/3418857087/thumb/1.jpg?ip=x480" 
                    alt="Nature conservation" 
                    className="rounded-3xl shadow-xl opacity-90 object-cover w-full h-64"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2sK2i4Acp1WJFrNgN9df2sfCtGQJmTXAvQ&s" 
                    alt="Clean water" 
                    className="rounded-3xl shadow-xl opacity-80 object-cover w-full h-64"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The MOKSH Solution */}
      <section id="solution" className="section-padding relative overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
        
        <LeafDecoration className="top-[10%] left-[2%] opacity-20" />
        <LeafDecoration className="bottom-[15%] right-[5%] opacity-20 scale-125" />
        
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <motion.span {...fadeIn} className="text-brand-green font-bold uppercase tracking-widest text-sm">Our Innovation</motion.span>
            <motion.h2 {...fadeIn} className="text-5xl md:text-6xl font-bold mt-4">The MOKSH Solution</motion.h2>
            <motion.p {...fadeIn} className="text-zinc-600 mt-6 max-w-2xl mx-auto text-lg">
              MOKSH Solid Water is an innovative water retention product designed for efficiency and environmental harmony.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Waves, title: "High Absorption", desc: "Absorbs 100-120 liters of water per kilogram of its weight." },
              { icon: Leaf, title: "Eco-Friendly", desc: "Derived from nature, non-toxic, and extracted from vegetation." },
              { icon: Sprout, title: "Root Moisture", desc: "Provides consistent moisture directly to roots for optimal growth." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 hover:bg-white hover:shadow-xl transition-all group border-brand-green/5"
              >
                <div className="w-16 h-16 bg-brand-light-green rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-green transition-colors">
                  <item.icon className="w-8 h-8 text-brand-green group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Calculator Section */}
          <motion.div {...fadeIn} className="mb-20">
            <WaterCalculator />
          </motion.div>

          {/* Product Types */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="bg-brand-green rounded-[40px] p-12 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-brand-accent font-bold text-sm uppercase tracking-widest">For Farmers</span>
                <h3 className="text-4xl font-bold mt-4 mb-6">Biodegradable Solid Water</h3>
                <p className="text-brand-light-green/80 mb-8 text-lg">Specifically designed for farmers. Absorbs and stores water, gradually releasing it to plant roots.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-accent w-6 h-6" />
                    <span className="font-bold">Reduces irrigation needs by 40-60%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-accent w-6 h-6" />
                    <span className="font-bold">Boosts crop yields by 30-40%</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>

            <motion.div {...fadeIn} className="bg-white border-4 border-brand-green/10 rounded-[40px] p-12 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-brand-green font-bold text-sm uppercase tracking-widest">For Urban Users</span>
                <h3 className="text-4xl font-bold mt-4 mb-6 text-zinc-900">Compound Solid Water</h3>
                <p className="text-zinc-500 mb-8 text-lg">A long-lasting polymer-based solution for urban gardening. Keep plants hydrated for weeks with minimal effort.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-green w-6 h-6" />
                    <span className="font-bold text-zinc-900">Ideal for balcony & terrace gardens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-green w-6 h-6" />
                    <span className="font-bold text-zinc-900">Low maintenance solution</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Usage & Process */}
      <section className="section-padding bg-brand-light-green relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
          <img src="https://picsum.photos/seed/greenery-bg/1920/1080" alt="background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold">Product Usage & Process</h2>
            <p className="text-zinc-500 mt-4 text-lg italic">A simple 5-step process to revolutionize your yields.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-green/10 -translate-y-1/2 z-0" />
            
            {[
              { step: "Step 1", title: "Application", desc: "MOKSH granules are applied to the soil.", img: "https://media.istockphoto.com/id/469538141/photo/plant-sprouting-from-the-dirt-with-a-blurred-background.jpg?s=612x612&w=0&k=20&c=uc-WaLHzRlsrBsHrTVO4fEqRqPjkh-MHtlGLj-QWI64=" },
              { step: "Step 2", title: "Absorption", desc: "Granules absorb water and form a gel.", img: "https://plantlet.org/wp-content/uploads/2020/04/waterstep2.jpg" },
              { step: "Step 3", title: "Retention", desc: "The gel retains moisture in the root zone.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyB37knUp98_AOUrslRWlXoiHh39GubxmVjQ&s" },
              { step: "Step 4", title: "Release", desc: "Gradual moisture release to plant roots.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDixD_ut0jONjxlYRY7I3TyB2bCeTNURScw&s" },
              { step: "Step 5", title: "Boost", desc: "Increased yields and nutrient availability.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2k1W7_wYOWCuy4LxvkW30Yk-_QBucq6uFng&s" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                {...fadeIn} 
                transition={{ delay: i * 0.1 }}
                className="relative z-10 bg-white p-6 rounded-3xl border border-brand-green/10 shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-brand-green/10 group-hover:border-brand-green transition-colors">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                  {i + 1}
                </div>
                <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">{item.step}</span>
                <h4 className="font-bold text-base mt-1 mb-2">{item.title}</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quantifiable Impact */}
      <section id="impact" className="section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-green/5 -skew-x-12 translate-x-1/2" />
        
        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-5xl font-bold mb-8">Quantifiable Impact</h2>
              <p className="text-zinc-600 text-lg mb-12">Quantifiable positive change for India's sustainable future.</p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: "1.5B Liters", label: "Water Savings", sub: "Annually by Year 3" },
                  { value: "1.5M+", label: "Farmer Impact", sub: "Farmers in Year 1" },
                  { value: "500K+", label: "Urban Impact", sub: "Households in Year 1" },
                  { value: "30-40%", label: "Yield Boost", sub: "Increase in crop production" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-brand-light-green border border-brand-green/5">
                    <p className="text-3xl font-bold text-brand-green mb-1">{stat.value}</p>
                    <p className="font-bold text-zinc-900">{stat.label}</p>
                    <p className="text-xs text-zinc-500 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div className="glass-card p-10 border-brand-green/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <Globe className="text-brand-green w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold italic">Dairy Farm Impact</h3>
                </div>
                <p className="text-zinc-600 leading-relaxed mb-6">
                  Promoting sustainable agriculture and optimizing water use in dairy farms. Partnering with cooperatives like Amul, Nandini, and Mother Dairy to improve fodder yields.
                </p>
                <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optimized Fodder Production</span>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-[40px] p-10 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-brand-accent w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold italic">Government Support</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Aligned with PM Krishi Sinchayee Yojana and National Mission on Sustainable Agriculture. Eligible for grants and support under national schemes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SWOT Analysis */}
      <section className="section-padding bg-brand-light-green relative overflow-hidden">
        <LeafDecoration className="top-[5%] right-[10%] opacity-10" />
        <LeafDecoration className="bottom-[10%] left-[5%] opacity-10 scale-150" />
        
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold italic">SWOT Analysis</h2>
            <p className="text-zinc-500 mt-4">A strategic overview of our position in the market.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                type: "Strengths", 
                icon: TrendingUp, 
                color: "bg-emerald-500",
                items: ["First-of-its-kind biodegradable product", "Drastically reduces water usage", "Versatile application across sectors"]
              },
              { 
                type: "Weaknesses", 
                icon: ZapOff, 
                color: "bg-amber-500",
                items: ["Initial awareness campaigns required", "Higher upfront cost vs traditional"]
              },
              { 
                type: "Opportunities", 
                icon: Target, 
                color: "bg-blue-500",
                items: ["Expanding government initiatives", "Increasing awareness of sustainability", "Global market potential"]
              },
              { 
                type: "Threats", 
                icon: AlertTriangle, 
                color: "bg-rose-500",
                items: ["Dependence on market acceptance", "Resistance to new technology in farming"]
              }
            ].map((swot, i) => (
              <motion.div key={i} {...fadeIn} className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
                <div className={`w-12 h-12 ${swot.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${swot.color.split('-')[1]}-500/20`}>
                  <swot.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-6">{swot.type}</h3>
                <ul className="space-y-4">
                  {swot.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-brand-light-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
          <img src="https://picsum.photos/seed/leaves-top/400/400" alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
          <img src="https://picsum.photos/seed/leaves-bottom/400/400" alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
        </div>
        
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold italic">Who We Serve</h2>
            <p className="text-zinc-500 mt-4 text-lg">Empowering every sector with sustainable water solutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Farmers", 
                img: "https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=612x612&w=0&k=20&c=uJDy7MECNZeHDKfUrLNeQuT7A1IqQe89lmLREhjIJYU=",
                desc: "Partnering with agri-cooperatives and government schemes to empower rural agriculture."
              },
              { 
                title: "Urban Gardeners", 
                img: "https://www.shutterstock.com/shutterstock/photos/1413147830/display_1500/stock-photo-amritser-punjab-india-may-jallianwala-bagh-is-a-public-garden-in-amritsar-and-houses-1413147830.jpg",
                desc: "Bringing professional-grade water conservation to home gardens and balconies."
              },
              { 
                title: "Dairy Farms", 
                img: "https://img.freepik.com/free-photo/cows-green-field_335224-509.jpg",
                desc: "Improving fodder yield and optimizing water use in large-scale dairy operations."
              }
            ].map((item, i) => (
              <motion.div key={i} {...fadeIn} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[32px] aspect-[4/3] mb-6 shadow-md">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-zinc-600 px-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Visionaries */}
      <section id="visionaries" className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl" />
        
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold italic">The Visionaries</h2>
            <p className="text-zinc-500 mt-4">Dr. Ambedkar Institute of Technology, Bengaluru</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { name: "Jayakirti Savant", role: "Founder", img: "https://lh3.googleusercontent.com/d/1kQOry6H4g0TskhD-o6cI7Uk4_c9uoiY8" },
              { name: "M. Balasubramanya", role: "Co-Founder", img: "https://lh3.googleusercontent.com/d/1irInvK6uxHvsqNGpeomjcckRhiRd-suv" }
            ].map((person, i) => (
              <motion.div key={i} {...fadeIn} className="text-center group">
                <div className="w-64 h-64 rounded-[40px] overflow-hidden mb-6 border-8 border-brand-light-green group-hover:border-brand-green transition-colors duration-500">
                  <img 
                    src={person.img} 
                    alt={person.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-bold">{person.name}</h3>
                <p className="text-brand-green font-bold uppercase tracking-widest text-xs mt-2">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="section-padding bg-zinc-900 text-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div {...fadeIn}>
              <h2 className="text-5xl font-bold mb-8 italic">Get in Touch</h2>
              <p className="text-zinc-400 text-lg mb-12">We're here to answer your questions and help you transition to sustainable water management.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center">
                    <Phone className="text-brand-accent w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest">Call Us</p>
                    <p className="text-xl font-bold">+91 81057 58592</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center">
                    <Mail className="text-brand-accent w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest">Email Us</p>
                    <p className="text-xl font-bold">contact@mokshsolidwater.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="text-brand-accent w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest">Location</p>
                    <p className="text-xl font-bold">Bengaluru, Karnataka, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="glass-card p-10 border-white/10 bg-white/5">
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Your Name" className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-brand-accent outline-none text-zinc-900 font-bold placeholder:text-zinc-400" />
                  <input type="email" placeholder="Your Email" className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-brand-accent outline-none text-zinc-900 font-bold placeholder:text-zinc-400" />
                </div>
                <input type="text" placeholder="Subject" className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-brand-accent outline-none text-zinc-900 font-bold placeholder:text-zinc-400" />
                <textarea placeholder="Your Message" rows={4} className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-brand-accent outline-none resize-none text-zinc-900 font-bold placeholder:text-zinc-400"></textarea>
                <button className="pill-button bg-zinc-950 text-white w-full hover:bg-brand-green transition-colors">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black text-white">
        <div className="container-max flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Droplets className="text-white w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">MOKSH Solid Water</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 MOKSH Solid Water. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <AgriAssistant />
    </div>
  );
}
