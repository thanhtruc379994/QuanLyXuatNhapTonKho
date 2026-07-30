const paths = {
  box: <><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5v9l-9 5-9-5Z"/><path d="M12 13v9"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-7h6v7"/></>,
  download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v4h16v-4"/></>,
  upload: <><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 16v5h16v-5"/></>,
  archive: <><path d="M4 7v14h16V7"/><path d="M3 3h18v4H3Z"/><path d="M9 11h6"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  refresh: <><path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8m16 8-2.2 1.8A7 7 0 0 1 5.5 15"/></>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></>,
  logout: <><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4M18 12H9"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  fileSpreadsheet: <><path d="M6 2h9l5 5v15H6Z"/><path d="M14 2v6h6M9 13h8M9 17h8M12 10v10"/></>,
  file: <><path d="M6 2h9l5 5v15H6Z"/><path d="M14 2v6h6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  print: <><path d="M7 9V3h10v6M7 18H4V9h16v9h-3"/><path d="M7 14h10v8H7Z"/></>,
  eye: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  edit: <><path d="m4 20 4-.8L19 8.2 15.8 5 4.8 16Z"/><path d="m14.5 6.3 3.2 3.2"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  chevronLeft: <path d="m15 18-6-6 6-6"/>,
  chevronRight: <path d="m9 18 6-6-6-6"/>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  trend: <><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>,
  dollar: <><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></>,
  shoppingBag: <><path d="M5 8h14l-1 13H6Z"/><path d="M9 8a3 3 0 0 1 6 0M9 12c1 2 5 2 6 0"/></>,
}

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
