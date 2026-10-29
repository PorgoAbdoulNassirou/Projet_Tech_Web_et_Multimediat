"""
Recopie l'en-tête et le pied de page communs dans chaque page HTML.

Les pages restent des fichiers statiques (lisibles sans JavaScript et
indexables), mais la navigation n'est écrite qu'une fois, dans
tools/partials/. Le lien de la page courante reçoit aria-current="page".

Usage : python tools/sync_layout.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTS = ROOT / "tools" / "partials"
BLOCKS = {"en-tete": (PARTS / "en-tete.html").read_text(encoding="utf-8"),
          "pied": (PARTS / "pied.html").read_text(encoding="utf-8")}

for page in sorted(ROOT.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    for name, content in BLOCKS.items():
        if name == "en-tete":
            content = content.replace(f'<a href="{page.name}">', f'<a href="{page.name}" aria-current="page">', 1)
        pattern = re.compile(rf"<!-- {name} -->.*?<!-- /{name} -->", re.S)
        html, n = pattern.subn(lambda _: f"<!-- {name} -->\n{content.rstrip()}\n  <!-- /{name} -->", html)
        if not n and name == "en-tete":
            print(f"  {page.name} : marqueur {name} absent")
    page.write_text(html, encoding="utf-8")
    print(f"{page.name} synchronisé")
