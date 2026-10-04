import re
import os

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Extract MATCHES array
matches_match = re.search(r'(const MATCHES = \[.*?\];)', code, re.DOTALL)
if matches_match:
    matches_code = matches_match.group(1)
    # Fix the encoding issue on the dates
    matches_code = matches_code.replace('?"', '—')
    matches_code = "export " + matches_code

    os.makedirs('src/data', exist_ok=True)
    with open('src/data/matches.ts', 'w', encoding='utf-8') as f:
        f.write(matches_code)
    
    # Remove MATCHES array from page.tsx and add import
    new_code = code.replace(matches_match.group(1), "")
    
    import_statement = 'import { MATCHES } from "../../data/matches";\n'
    new_code = new_code.replace('import { useState, useEffect } from "react";\n', 'import { useState, useEffect } from "react";\n' + import_statement)
    
    with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_code)
