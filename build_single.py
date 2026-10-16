"""Membuat satu file HTML mandiri (computer-adventure-single.html) dari folder ini.
Jalankan: python build_single.py"""
import re, os
d = os.path.dirname(os.path.abspath(__file__))
html = open(os.path.join(d, 'index.html'), encoding='utf8').read()
def css(m):
    return '<style>\n' + open(os.path.join(d, m.group(1)), encoding='utf8').read() + '</style>'
def js(m):
    return '<script>\n' + open(os.path.join(d, m.group(1)), encoding='utf8').read() + '</script>'
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', css, html)
html = re.sub(r'<script src="(js/[^"]+)"></script>', js, html)
open(os.path.join(d, 'computer-adventure-single.html'), 'w', encoding='utf8').write(html)
print('OK: computer-adventure-single.html')
