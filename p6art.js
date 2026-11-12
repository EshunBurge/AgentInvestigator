/* ---------- art ---------- */
function mascot(size){
  return `<svg width="${size||150}" height="${size||150}" viewBox="0 0 160 160" role="img" aria-label="Shade, your spy cat guide">
  <polygon points="36,64 40,22 74,46" fill="#222" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="124,64 120,22 86,46" fill="#222" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="44,52 46,32 62,44" fill="#ff2a2a"/><polygon points="116,52 114,32 98,44" fill="#ff2a2a"/>
  <circle cx="80" cy="92" r="50" fill="#222" stroke="#fff" stroke-width="4"/>
  <rect x="38" y="76" width="38" height="22" rx="9" fill="#000" stroke="#fff" stroke-width="3"/>
  <rect x="84" y="76" width="38" height="22" rx="9" fill="#000" stroke="#fff" stroke-width="3"/>
  <rect x="75" y="82" width="10" height="5" fill="#fff"/>
  <path d="M46 82l12 0 M92 82l12 0" stroke="#ff2a2a" stroke-width="3" stroke-linecap="round"/>
  <path d="M74 108l6 6 6-6z" fill="#ff2a2a"/>
  <path d="M68 118q12 8 24 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M30 100h-14 M30 108h-12 M130 100h14 M130 108h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="80,140 70,158 90,158" fill="#ff2a2a" stroke="#a30f0f" stroke-width="2"/>
  </svg>`;
}
const OUT = {'out-field':['#2f2f2f','#555'],'out-ops':['#111','#ff2a2a'],'out-trench':['#7f1d1d','#450a0a'],'out-tux':['#0d0d0d','#fff'],'out-hood':['#262626','#ff2a2a'],'out-vest':['#1b1b1b','#8a8a8a'],'out-ghost':['#8a8f98','#d4d4d4'],'out-gold':['#a37f00','#ffc800']};
function avatarSVG(e){
  const o = OUT[e.outfit] || OUT['out-field'];
  let hairBack = '', hairFront = '';
  const hc = e.hairColor;
  if(e.hair === 'long'){ hairBack = `<path d="M32 56 Q32 18 60 18 Q88 18 88 56 L92 104 L76 104 L74 62 L46 62 L44 104 L28 104 Z" fill="${hc}"/>`; hairFront = `<path d="M36 50 Q60 22 84 50 Q60 40 36 50z" fill="${hc}"/>`; }
  else if(e.hair === 'buzz'){ hairFront = `<path d="M36 44 Q60 20 84 44 L84 48 Q60 32 36 48z" fill="${hc}"/>`; }
  else if(e.hair === 'curly'){ hairFront = `<g fill="${hc}"><circle cx="40" cy="42" r="11"/><circle cx="54" cy="32" r="12"/><circle cx="70" cy="32" r="12"/><circle cx="82" cy="42" r="11"/><circle cx="60" cy="38" r="12"/></g>`; }
  else if(e.hair === 'bun'){ hairBack = `<circle cx="60" cy="14" r="10" fill="${hc}"/>`; hairFront = `<path d="M34 50 Q36 24 60 24 Q84 24 86 50 Q72 38 60 40 Q48 38 34 50z" fill="${hc}"/>`; }
  else { hairFront = `<path d="M34 50 Q36 22 60 22 Q84 22 86 50 Q72 38 60 40 Q48 38 34 50z" fill="${hc}"/>`; }
  const hood = e.outfit === 'out-hood' ? `<path d="M24 104 Q24 78 60 78 Q96 78 96 104z" fill="${o[0]}"/>` : '';
  const shirt = e.outfit === 'out-tux' ? `<path d="M50 104 L60 130 L70 104z" fill="#fff"/><path d="M54 106 l6 6 6 -6 -6 -3z" fill="#ff2a2a"/>` : `<rect x="56" y="104" width="8" height="46" fill="${o[1]}"/>`;
  let acc = '';
  if(e.acc === 'acc-visor') acc = `<rect x="38" y="52" width="44" height="11" rx="4" fill="#ff2a2a"/><rect x="42" y="55" width="36" height="3" fill="#ffd0d0"/>`;
  if(e.acc === 'acc-shades') acc = `<rect x="38" y="52" width="19" height="11" rx="4" fill="#000"/><rect x="63" y="52" width="19" height="11" rx="4" fill="#000"/><rect x="56" y="55" width="8" height="3" fill="#000"/>`;
  if(e.acc === 'acc-ear') acc = `<circle cx="34" cy="64" r="4" fill="#ff2a2a"/><path d="M34 68 Q32 82 44 88" stroke="#ff2a2a" stroke-width="2.5" fill="none"/>`;
  if(e.acc === 'acc-hat') acc = `<ellipse cx="60" cy="38" rx="38" ry="7" fill="#1a1a1a"/><path d="M38 38 Q38 16 60 16 Q82 16 82 38z" fill="#2a2a2a"/><rect x="38" y="30" width="44" height="6" fill="#ff2a2a"/>`;
  if(e.acc === 'acc-mask') acc = `<path d="M36 54 Q60 46 84 54 L82 66 Q70 60 60 64 Q50 60 38 66z" fill="#ff2a2a"/><circle cx="51" cy="60" r="3" fill="#fff"/><circle cx="69" cy="60" r="3" fill="#fff"/>`;
  if(e.acc === 'acc-mono') acc = `<circle cx="69" cy="60" r="8" fill="none" stroke="#ffc800" stroke-width="2.5"/><path d="M77 66 Q82 80 76 90" stroke="#ffc800" stroke-width="1.5" fill="none"/>`;
  const eyes = (e.acc === 'acc-visor' || e.acc === 'acc-shades' || e.acc === 'acc-mask') ? '' : `<circle cx="51" cy="60" r="2.8" fill="#0a0a0a"/><circle cx="69" cy="60" r="2.8" fill="#0a0a0a"/>`;
  return `<svg viewBox="0 0 120 150" role="img" aria-label="Your agent">
    ${hairBack}
    <rect x="18" y="104" width="84" height="46" rx="12" fill="${o[0]}"/>${hood}${shirt}
    <rect x="52" y="84" width="16" height="22" fill="${e.skin}"/>
    <circle cx="60" cy="60" r="26" fill="${e.skin}"/>
    ${hairFront}${eyes}
    <path d="M52 73 Q60 79 68 73" stroke="#0a0a0a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${acc}
  </svg>`;
}
function itemPreview(it){
  const base = JSON.parse(JSON.stringify(S.equip));
  if(it.kind === 'outfit') base.outfit = it.id; else base.acc = it.id;
  return avatarSVG(base);
}
