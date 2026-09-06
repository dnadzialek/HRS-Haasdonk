import Image from "next/image";

export default function NextMatchPage() {
  return (
    <div className="p-4 md:p-12 overflow-y-auto w-full h-full relative z-10 bg-slate-50">
      
      <div className="flex flex-col items-center justify-center mb-10 mt-6">
        <Image src="/icon.png" alt="HRS Haasdonk Logo" width={120} height={120} className="mb-4 drop-shadow-lg" />
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800 drop-shadow-sm text-center">
          U8 HAASDONK
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">Officiële Teampagina</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-4 text-center">
          <h2 className="text-white font-black text-xl tracking-widest uppercase">Volgende Wedstrijd</h2>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-1">COMPETITION</h3>
            <p className="text-2xl font-black text-slate-800">SEP 12</p>
            <p className="text-5xl font-black text-red-600 drop-shadow-sm mt-1">9:30 AM</p>
          </div>

          <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl italic">VS</div>
            
            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-red-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                 <Image src="/icon.png" alt="Home Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Herleving Red Star<br/>Haasdonk (GU8A)</p>
            </div>
            
            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                <Image src="/images/zwijndrecht.png" alt="Away Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Verbroedering<br/>Zwijndrecht (U8)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Game length</p>
              <p className="text-slate-800 font-bold">60'</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Playing style</p>
              <p className="text-slate-800 font-bold">5x5</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Periods</p>
              <p className="text-slate-800 font-bold">4 (4x15')</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Staff</p>
              <p className="text-slate-800 font-bold text-sm">Ben Amar Mehdi (T)</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
            <h4 className="font-black text-red-800 mb-2 uppercase text-sm tracking-wider">Dressing room</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-red-400 font-bold uppercase">Home</p>
                <p className="text-red-900 font-medium text-sm">Herleving Red Star Haasdonk - Kleedkamer 1 (groot) (Ploegje 1) (14p, 09:30-10:45)</p>
              </div>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase">Away</p>
                <p className="text-red-900 font-medium text-sm">Herleving Red Star Haasdonk - Kleedkamer 2 (groot) (Ploegje 2) (14p, 09:30-10:45)</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 mb-20 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-widest text-center mb-6">Regels 5v5</h2>
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner border border-slate-100">
          <Image src="/images/rules_5v5.png" alt="5v5 Rules" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
