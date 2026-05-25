/**
 * Visuel sagsmappe — kan være "lukket", "åbner", eller "åben"
 * Bruges på startskærmen og som scene-element.
 */
export default function CaseFolder({
  state = 'closed', // 'closed' | 'opening' | 'open'
  caseName = 'Skyggesagen',
  caseNo = '001',
  status = 'Fortrolig',
  children,
  className = '',
}) {
  const cls = `case-folder is-${state} ${className}`
  return (
    <div className={cls} aria-hidden="true">
      <div className="case-folder-shadow" />
      <div className="case-folder-tab" />
      <div className="case-folder-body">
        <div className="case-folder-label">
          <span>Sag #{caseNo}</span>
          <span className="case-folder-stamp">{status}</span>
        </div>
        <div className="case-folder-content">
          {children || <DefaultFolderContent caseName={caseName} />}
        </div>
      </div>
    </div>
  )
}

function DefaultFolderContent({ caseName }) {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className="polaroid" style={{ width: '52%', position: 'absolute', top: 6, left: 4, transform: 'rotate(-6deg)', padding: '6px 6px 28px' }}>
        <div className="polaroid-frame" style={{ aspectRatio: '4 / 3' }}>
          <FauxPicture />
        </div>
        <span className="polaroid-caption">Skolegården, kl. 11:42</span>
        <span className="tape" style={{ top: -8, left: '30%', width: 56, height: 16 }} />
      </div>
      <div style={{ position: 'absolute', right: 8, top: 22, transform: 'rotate(4deg)', background: '#fff7d6', padding: '8px 10px', borderRadius: 4, boxShadow: '0 6px 12px rgba(31,41,51,0.18)', fontWeight: 700, fontSize: 12, color: '#6f5113', maxWidth: 110 }}>
        Vidne: 3<br />Vinkler: ?
        <span className="pin" style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 14, transform: 'rotate(-2deg)', background: '#ffe6e6', padding: '6px 10px', borderRadius: 4, fontSize: 11, color: '#7a3838', fontWeight: 700, boxShadow: '0 4px 8px rgba(31,41,51,0.18)' }}>
        STATUS: Uafklaret
      </div>
      <span className="stamp stamp-blue" style={{ right: 6, bottom: 6, fontSize: 10, transform: 'rotate(8deg)' }}>{caseName}</span>
    </div>
  )
}

function FauxPicture() {
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a9c4e2" />
          <stop offset="100%" stopColor="#dbe7f4" />
        </linearGradient>
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c2a378" />
          <stop offset="100%" stopColor="#8a6a45" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="62" fill="url(#sky)" />
      <rect x="0" y="62" width="120" height="28" fill="url(#ground)" />
      <circle cx="92" cy="22" r="10" fill="#f7c948" opacity="0.85" />
      <ellipse cx="44" cy="78" rx="16" ry="3" fill="#3a3a3a" opacity="0.4" />
      <rect x="38" y="48" width="14" height="30" fill="#3a4860" rx="6" />
      <circle cx="45" cy="44" r="6" fill="#3a4860" />
      <ellipse cx="76" cy="80" rx="9" ry="2" fill="#3a3a3a" opacity="0.35" />
      <rect x="72" y="58" width="10" height="22" fill="#4d5b7a" rx="5" />
      <circle cx="77" cy="54" r="4.5" fill="#4d5b7a" />
    </svg>
  )
}
