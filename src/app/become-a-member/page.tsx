import { Metadata } from "next";
import { TrendingUp, Award, Users, DollarSign, CheckCircle2, ChevronRight, Globe2, HeartHandshake, Zap, Target } from "lucide-react";
import { BecomeMemberForm } from "@/components/forms/BecomeMemberForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Become a Member | BF Suma Kenya",
  description: "Join the BF Suma family as an independent distributor. Earn extra income, access premium health products, and transform lives.",
};

export default function BecomeMemberPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-24 relative overflow-hidden flex flex-col justify-center min-h-[70vh]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/90 to-primary-900/40"></div>
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800/50 backdrop-blur-sm text-primary-200 font-bold tracking-widest uppercase text-xs rounded-full mb-8 border border-primary-700/50">
            <Globe2 className="w-4 h-4" /> Global Business Opportunity
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Build Wealth While <br className="hidden md:block"/> Promoting Health
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the BF Suma family as an independent distributor in Kenya. Start your own business, earn multiple streams of income, and transform lives in your community with premium health products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#join-form" className="btn-secondary text-lg px-8 py-4 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group">
              Start Your Journey Today
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#compensation" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 text-center md:divide-x divide-slate-100">
            <div className="mb-4 md:mb-0">
              <div className="text-3xl font-extrabold text-slate-900 mb-1">10M+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Global Distributors</div>
            </div>
            <div className="mb-4 md:mb-0">
              <div className="text-3xl font-extrabold text-slate-900 mb-1">30+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">Premium</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Health Products</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">$$$</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Weekly Payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compensation Plan */}
      <section id="compensation" className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">The BF Suma Compensation Plan</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our proven network marketing business model rewards your hard work with unmatched incentives. We offer multiple avenues for you to earn and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-100 hover:border-primary-100 hover:shadow-xl transition-all group">
              <div className="bg-white w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-primary-50 transition-all">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Retail Profits</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                As a registered distributor, you purchase premium health products at wholesale prices (distributor rate) and sell them at the recommended retail price, earning immediate cash profit up to 20-30%.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-100 hover:border-primary-100 hover:shadow-xl transition-all group">
              <div className="bg-white w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-primary-50 transition-all">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Performance Bonus</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                Earn monthly cash bonuses based on the total Point Value (PV) of products sold by you and your entire team. As your volume grows, your bonus percentage increases dramatically.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-100 hover:border-primary-100 hover:shadow-xl transition-all group">
              <div className="bg-white w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-primary-50 transition-all">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Leadership Bonus</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                Recruit, train, and mentor others to become leaders. When your downline distributors achieve leadership ranks, you earn lucrative overriding bonuses on their entire organizational volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Incentives Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-400 via-slate-900 to-black"></div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">World-Class Incentives</h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Beyond cash bonuses, BF Suma rewards top performers with lifestyle incentives that truly change lives. Your hard work is recognized globally.
              </p>
              
              <ul className="space-y-8">
                <li className="flex gap-4 items-start">
                  <div className="bg-primary-600 p-3 rounded-xl flex-shrink-0 mt-1">
                    <Globe2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">International Travel Awards</h4>
                    <p className="text-slate-400">Qualify for all-expenses-paid luxury trips around the world. Experience new cultures and network with global top leaders.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-primary-600 p-3 rounded-xl flex-shrink-0 mt-1">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Car Fund & Villa Awards</h4>
                    <p className="text-slate-400">Reach higher executive ranks and receive massive cash funds dedicated to purchasing your dream car or building a luxury villa.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="h-64 bg-slate-800 rounded-3xl overflow-hidden relative group">
                 <img src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Car Award" />
                 <div className="absolute bottom-4 left-4 font-bold text-lg">Car Awards</div>
              </div>
              <div className="h-64 bg-slate-800 rounded-3xl overflow-hidden relative group mt-8">
                 <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Travel Award" />
                 <div className="absolute bottom-4 left-4 font-bold text-lg">Travel Fund</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="join-form" className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200 flex flex-col xl:flex-row">
            
            {/* Left Info Panel */}
            <div className="xl:w-5/12 bg-primary-900 p-8 sm:p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-primary-800 text-primary-200 text-sm font-bold rounded-full mb-6">Take Action</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">Ready to Start?</h3>
                <p className="text-primary-100 mb-10 text-lg leading-relaxed">
                  Registering as a BF Suma distributor is your first step towards financial freedom. Fill out this form and our leadership team will contact you to finalize your registration and provide your starter kit.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-lg mt-1">
                      <Target className="w-5 h-5 text-primary-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Access to Wholesale Prices</h4>
                      <p className="text-primary-200 text-sm">Instantly unlock distributor pricing on all products.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-lg mt-1">
                      <HeartHandshake className="w-5 h-5 text-primary-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Dedicated Mentorship</h4>
                      <p className="text-primary-200 text-sm">Join our team and get step-by-step guidance to build your network.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-lg mt-1">
                      <Award className="w-5 h-5 text-primary-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Free Business Training</h4>
                      <p className="text-primary-200 text-sm">Learn product knowledge and professional sales strategies.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="xl:w-7/12 p-8 sm:p-12 lg:p-16 bg-white relative">
              <div className="max-w-xl mx-auto">
                <BecomeMemberForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
