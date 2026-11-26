import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT, "content")

pattern = re.compile(r"```python\n(.*?)```(?:\n\n```output\n.*?```)?", re.DOTALL)

checked = 0
failed = 0

for dirpath, _, filenames in os.walk(CONTENT_DIR):
    for fname in sorted(filenames):
        if not fname.endswith(".md") or fname == "summary.md":
            continue
        fpath = os.path.join(dirpath, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            text = f.read()

        def repl(m):
            global checked, failed
            code = m.group(1)
            checked += 1
            proc = subprocess.run(
                [sys.executable, "-c", code],
                capture_output=True,
                text=True,
                timeout=20,
            )
            if proc.returncode != 0:
                failed += 1
                print(f"FAIL in {fname}:\n{proc.stderr}", file=sys.stderr)
                return m.group(0)
            out = proc.stdout.rstrip("\n")
            return f"```python\n{code}```\n\n```output\n{out}\n```"

        new_text = pattern.sub(repl, text)
        if new_text != text:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_text)

print(f"Verified {checked} Python blocks across lessons ({failed} failures).")
if failed:
    sys.exit(1)
