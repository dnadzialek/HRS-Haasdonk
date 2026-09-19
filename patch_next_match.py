import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Update Date and Time
code = code.replace("SEP 19", "SEP 26")
code = code.replace("11:00 AM", "9:30 AM")

# Update Teams
old_teams = '''            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                 <Image src="/images/meerdonk.png" alt="Home Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Ws Meerdonk<br/>(U8)</p>
            </div>
            
            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-red-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                <Image src="/icon.png" alt="Away Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Herleving Red Star<br/>Haasdonk (GU8A)</p>
            </div>'''

new_teams = '''            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-red-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                 <Image src="/icon.png" alt="Home Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Herleving Red Star<br/>Haasdonk (GU8A)</p>
            </div>
            
            <div className="flex flex-col items-center flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-100 shadow-md flex items-center justify-center mb-3 relative overflow-hidden p-2">
                <Image src="/images/vrasene.png" alt="Away Team" fill className="object-contain p-2" />
              </div>
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">Kfc Vrasene<br/>(U8)</p>
            </div>'''

code = code.replace(old_teams, new_teams)

# Update Practical info
old_info = '''          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4">
            <h4 className="font-black text-slate-800 mb-2 uppercase text-sm tracking-wider">Practical info</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Accommodation</p>
                <p className="text-slate-900 font-medium text-sm">Margrietstraat</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                <p className="text-slate-900 font-medium text-sm">Margrietstraat 14, 9170 Meerdonk</p>
              </div>
            </div>
          </div>'''

new_info = '''          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4">
            <h4 className="font-black text-slate-800 mb-2 uppercase text-sm tracking-wider">Practical info</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Accommodation</p>
                <p className="text-slate-900 font-medium text-sm">Herleving Red Star Haasdonk</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                <p className="text-slate-900 font-medium text-sm">Poerdam 7, 9120 Haasdonk, Belgium</p>
              </div>
            </div>
          </div>'''

code = code.replace(old_info, new_info)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
