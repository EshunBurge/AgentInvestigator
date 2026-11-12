#!/bin/bash
# Rebuilds index.html from the parts in src/
cd "$(dirname "$0")/src"
{ cat p1.html; printf '<div id="app"><p style="color:#fff;padding:24px;font:700 18px system-ui">Loading Agent Investigator…</p></div>\n<div id="obby"></div>\n<div id="player"></div>\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n<script>\n'; cat pguard.js; printf '</script>\n<script>\n'; cat p2.js p3.js p4.js p5.js p9.js p6.js p6art.js p7a.js p7b.js p7s.js p10a.js p10b.js p10c.js p8a.js p8b.js; printf '</script>\n'; } > ../index.html
