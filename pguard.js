window.addEventListener('error', function(e){
  try {
    if(document.getElementById('crash')) return;
    var d = document.createElement('div'); d.id = 'crash';
    d.style.cssText = 'position:fixed;inset:0;z-index:999;background:#0a0a0a;color:#fff;padding:24px;font:16px/1.5 system-ui,sans-serif;overflow:auto';
    d.innerHTML = '<h2 style="margin:0 0 8px">Something went wrong</h2><p>The site hit an error while loading. Clearing your saved progress on this device usually fixes it.</p><p style="color:#ff8a5c;word-break:break-word">' + String(e.message || e).replace(/</g,'&lt;') + '</p><button id="crashbtn" style="font:inherit;font-weight:800;padding:12px 20px;border-radius:12px;border:0;background:#ff2a2a;color:#000;cursor:pointer">Clear saved data and reload</button>';
    document.body.appendChild(d);
    document.getElementById('crashbtn').onclick = function(){ try { localStorage.clear(); } catch(x){} location.reload(); };
  } catch(x) {}
});
