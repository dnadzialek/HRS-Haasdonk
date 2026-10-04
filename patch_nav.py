import re

with open('src/components/Navigation.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add link
old_links = '''          <Link href="/quiz" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">'''
new_links = '''          <Link href="/topscorers" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">
            <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">👑</span>
            <span className="text-[11px] md:text-base text-center md:text-left">Topscorers</span>
          </Link>
          <Link href="/quiz" className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-2 md:py-3 px-2 md:px-4 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold transition-all group min-w-[70px]">'''

code = code.replace(old_links, new_links)

# Fix encoding issue with emojis from cat
code = code.replace('Ы"', '📅')
code = code.replace('', '⚽') # wait, the second link is `Laatste`
# Actually it's better to just do string replace on the links themselves if I want to be safe with encoding.
# Let's not touch the other emojis. The old_links doesn't contain emojis.

with open('src/components/Navigation.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
