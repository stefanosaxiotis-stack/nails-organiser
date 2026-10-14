// Θέματα της σελίδας online κρατήσεων — κοινά για book.html (εμφάνιση) και index.html (ρυθμίσεις/προεπισκόπηση)
(function(){
  const T = {
    classic: { name: 'Κλασικό', note: 'Καθαρό, όπως η εφαρμογή',
      display: 'Comfortaa,"Varela Round",system-ui,sans-serif', body: '-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",system-ui,sans-serif',
      r: 22, rb: 18, rs: 14, italic: false,
      palettes: [
        { id: 'navy',   name: 'Navy & πετρόλ',  bg: '#F4F3F8', ink: '#1E1F4B', accent: '#0B7F74', soft: '#D6EFEB' },
        { id: 'noir',   name: 'Μαύρο & χρυσό',  bg: '#F5F4F2', ink: '#1C1C1E', accent: '#9A7442', soft: '#F1E8DA' },
        { id: 'forest', name: 'Δάσος',          bg: '#F2F5F3', ink: '#1F3A33', accent: '#2F7D5B', soft: '#DCEFE4' } ] },
    blush: { name: 'Blush', note: 'Ρόδινο, απαλό, ρομαντικό',
      display: 'Fraunces,Georgia,serif', body: '"Nunito Sans",system-ui,sans-serif', r: 20, rb: 999, rs: 16, italic: true,
      palettes: [
        { id: 'rose',   name: 'Ρόδινο',          bg: '#FBF2EF', ink: '#4A2A33', accent: '#B85C72', soft: '#F6DCE2' },
        { id: 'powder', name: 'Πούδρα & μπορντό', bg: '#F8F3F4', ink: '#3E2430', accent: '#8E3B57', soft: '#EED9E0' },
        { id: 'peach',  name: 'Ροδάκινο',        bg: '#FDF4EE', ink: '#4A2E25', accent: '#B9583D', soft: '#F8DDCF' } ] },
    atelier: { name: 'Atelier', note: 'Nude, κομψό, premium',
      display: '"Cormorant Garamond",Georgia,serif', body: '"DM Sans",system-ui,sans-serif', r: 6, rb: 4, rs: 4, italic: true,
      palettes: [
        { id: 'nude',  name: 'Nude & σοκολάτα', bg: '#F7F1EA', ink: '#33261F', accent: '#8C5A44', soft: '#EADFD2' },
        { id: 'ivory', name: 'Ivory & μαύρο',   bg: '#FAF8F4', ink: '#161616', accent: '#161616', soft: '#ECE7DE' },
        { id: 'sage',  name: 'Φασκόμηλο',       bg: '#F3F4EF', ink: '#2B3027', accent: '#5E6C53', soft: '#E1E6D8' } ] },
    glow: { name: 'Lilac Glow', note: 'Λιλά, παιχνιδιάρικο, νεανικό',
      display: 'Comfortaa,system-ui,sans-serif', body: 'Nunito,system-ui,sans-serif', r: 26, rb: 999, rs: 18, italic: false,
      palettes: [
        { id: 'lilac', name: 'Λιλά & ροδάκινο', bg: '#F2EEFB', ink: '#2C2350', accent: '#6B4BC4', soft: '#FFD9C7' },
        { id: 'mint',  name: 'Μέντα',           bg: '#EEF8F5', ink: '#1D3B35', accent: '#24806B', soft: '#FFE3B8' },
        { id: 'coral', name: 'Κοραλί',          bg: '#FFF1EE', ink: '#3D1F2B', accent: '#C9445A', soft: '#FFD7A8' } ] }
  };
  const FONTS = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Nunito+Sans:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;700&family=Nunito:wght@500;700;800&display=swap';
  const hex = h => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '').trim()); return m ? m[1] : null; };
  const rgb = h => { const x = hex(h) || '000000'; return [0, 2, 4].map(i => parseInt(x.substr(i, 2), 16)); };
  const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lum = h => { const c = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // Τα 4 βασικά χρώματα (φόντο, κείμενο, κύριο, απαλό) του καταστήματος
  function colorsOf(theme, cfg){
    const t = T[theme] || T.classic, c = cfg || {};
    if (c.palette === 'custom' && hex(c.bg) && hex(c.ink) && hex(c.accent) && hex(c.soft)) return { bg: '#' + hex(c.bg), ink: '#' + hex(c.ink), accent: '#' + hex(c.accent), soft: '#' + hex(c.soft), custom: true };
    const p = t.palettes.find(x => x.id === c.palette) || t.palettes[0];
    return { bg: p.bg, ink: p.ink, accent: p.accent, soft: p.soft, id: p.id };
  }
  // Όλες οι CSS μεταβλητές που χρησιμοποιεί η σελίδα
  function vars(theme, cfg){
    const t = T[theme] || T.classic, k = colorsOf(theme, cfg);
    const onAcc = contrast(k.accent, '#FFFFFF') >= 3 ? '#FFFFFF' : k.ink;
    return {
      '--bg': k.bg, '--surface': theme === 'atelier' ? mix(k.bg, '#FFFFFF', 0.55) : '#FFFFFF',
      '--chip': mix(k.bg, k.ink, 0.05), '--line': mix(k.bg, k.ink, 0.13), '--ink': k.ink, '--muted': mix(k.ink, k.bg, 0.38),
      '--head': k.ink, '--headmuted': mix(k.bg, k.ink, 0.3),
      '--teal': k.accent, '--onacc': onAcc, '--tealbg': k.soft, '--tealink': k.ink,
      '--font-display': t.display, '--font-body': t.body,
      '--r': t.r + 'px', '--rb': t.rb + 'px', '--rs': t.rs + 'px', '--pillr': theme === 'atelier' ? '4px' : '999px'
    };
  }
  window.BookThemes = { T, FONTS, colorsOf, vars, hex, contrast, mix };
})();
