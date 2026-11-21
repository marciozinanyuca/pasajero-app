import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Bus, CalendarDays,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Compass, CreditCard,
  Download, Ellipsis, FileText, Headphones, Home, MapPin, Menu, Moon, Navigation,
  Plus, Search, Settings, ShieldCheck, Sun, Ticket, UserRound, Users, WifiOff,
  X,
} from 'lucide-react'
import './styles.css'

const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'schedule', label: 'Reservar viaje', icon: CalendarDays },
  { id: 'pass', label: 'Mi pase', icon: Ticket },
  { id: 'route', label: 'Ruta en vivo', icon: Compass },
  { id: 'profile', label: 'Mi perfil', icon: UserRound },
]
const departures = [
  { time: '07:15', period: 'a. m.', title: 'Turno mañana', hint: 'Llegada estimada 08:05', seats: 8, route: 'Ruta A · Surco – San Isidro' },
  { time: '07:45', period: 'a. m.', title: 'Turno mañana', hint: 'Llegada estimada 08:40', seats: 3, route: 'Ruta B · Miraflores – San Isidro' },
  { time: '08:15', period: 'a. m.', title: 'Turno flexible', hint: 'Llegada estimada 09:00', seats: 12, route: 'Ruta C · Barranco – San Isidro' },
]
const seatRows = [
  ['01', '02', '', '03', '04'], ['05', '06', '', '07', '08'],
  ['09', '10', '', '11', '12'], ['13', '14', '', '15', '16'],
]
const takenSeats = ['02', '07', '10', '13']

function App() {
  const [page, setPage] = useState('home')
  const [theme, setTheme] = useState(() => localStorage.getItem('transcorp-theme') || 'light')
  const [selectedDeparture, setSelectedDeparture] = useState(0)
  const [selectedSeat, setSelectedSeat] = useState(() => localStorage.getItem('transcorp-seat') || '04')
  const [reservation, setReservation] = useState(() => localStorage.getItem('transcorp-reservation') === 'true')
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [modal, setModal] = useState('')
  const [profileName, setProfileName] = useState(() => localStorage.getItem('transcorp-name') || 'Valeria')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('transcorp-theme', theme)
  }, [theme])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const handler = (event) => { event.preventDefault(); setInstallPrompt(event) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const base = import.meta.env.BASE_URL
      window.addEventListener('load', () => navigator.serviceWorker.register(`${base}sw.js`).catch(() => {}), { once: true })
    }
  }, [])

  const chosenTrip = departures[selectedDeparture]
  const formattedDate = useMemo(() => new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(now), [now])
  const navigate = (id) => { setPage(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const saveReservation = () => {
    setReservation(true)
    localStorage.setItem('transcorp-reservation', 'true')
    localStorage.setItem('transcorp-seat', selectedSeat)
    setModal('')
    navigate('pass')
    setToast(`Asiento ${selectedSeat} reservado para ${chosenTrip.time} a. m.`)
  }
  const cancelReservation = () => {
    setReservation(false)
    localStorage.removeItem('transcorp-reservation')
    setModal('')
    setToast('Tu reserva fue cancelada.')
  }
  const saveProfile = () => {
    localStorage.setItem('transcorp-name', profileName)
    setToast('Tus datos se guardaron en este dispositivo.')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Bus size={22} strokeWidth={2.2} /></div><div><strong>TransCorp</strong><span>Movilidad corporativa</span></div><button className="icon-button sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X size={20} /></button></div>
        <div className="company-switch"><div className="company-avatar">N</div><div><b>NovaTech Perú</b><span>Cuenta corporativa</span></div><ChevronDown size={16} /></div>
        <p className="nav-heading">MENÚ PRINCIPAL</p>
        <nav className="side-nav" aria-label="Navegación principal">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`nav-item ${page === id ? 'active' : ''}`}><Icon size={19} /><span>{label}</span>{id === 'pass' && reservation && <span className="nav-dot" />}</button>)}</nav>
        <div className="sidebar-spacer" />
        <div className="help-card"><div className="help-icon"><Headphones size={18} /></div><div><b>¿Necesitas ayuda?</b><span>Estamos aquí para ti</span></div><button className="icon-button" onClick={() => setModal('help')} aria-label="Abrir ayuda"><ArrowUpRight size={16} /></button></div>
        <button className="nav-item settings-link" onClick={() => navigate('profile')}><Settings size={18} /><span>Configuración</span></button>
        <div className="user-mini"><div className="avatar">{profileName.slice(0, 1)}</div><div><b>{profileName} Rojas</b><span>Colaboradora</span></div><button className="icon-button" onClick={() => navigate('profile')} aria-label="Ver perfil"><Ellipsis size={18} /></button></div>
      </aside>
      {menuOpen && <button className="scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Portal del trabajador</span><span className="crumb-slash">/</span><b>{navItems.find((item) => item.id === page)?.label}</b></div>
          <div className="topbar-actions"><span className="date-label"><CalendarDays size={15} />{formattedDate}</span><button className="icon-button theme-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'} title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="icon-button notification-button" onClick={() => setToast('No tienes notificaciones nuevas.')} aria-label="Notificaciones"><Bell size={18} /><i /></button><button className="top-user" onClick={() => navigate('profile')} aria-label="Abrir perfil"><div className="avatar">{profileName.slice(0, 1)}</div><ChevronDown size={15} /></button></div>
        </header>
        <main className="content">
          {page === 'home' && <HomePage name={profileName} reservation={reservation} trip={chosenTrip} seat={selectedSeat} onNavigate={navigate} onToast={setToast} />}
          {page === 'schedule' && <SchedulePage selected={selectedDeparture} onSelect={setSelectedDeparture} onContinue={() => navigate('seat')} />}
          {page === 'seat' && <SeatPage selected={selectedSeat} onSelect={(seat) => { setSelectedSeat(seat); localStorage.setItem('transcorp-seat', seat) }} trip={chosenTrip} onBack={() => navigate('schedule')} onContinue={() => navigate('summary')} />}
          {page === 'summary' && <SummaryPage trip={chosenTrip} seat={selectedSeat} onBack={() => navigate('seat')} onConfirm={saveReservation} />}
          {page === 'pass' && <PassPage reservation={reservation} trip={chosenTrip} seat={selectedSeat} onBook={() => navigate('schedule')} onCancel={() => setModal('cancel')} onNavigate={navigate} onToast={setToast} />}
          {page === 'route' && <RoutePage reservation={reservation} trip={chosenTrip} onToast={setToast} />}
          {page === 'profile' && <ProfilePage name={profileName} setName={setProfileName} onSave={saveProfile} theme={theme} setTheme={setTheme} installPrompt={installPrompt} onToast={setToast} />}
          <footer className="footer"><span>© 2026 TransCorp Perú</span><span><button onClick={() => setModal('help')}>Centro de ayuda</button><i />Privacidad</span></footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navegación móvil">{navItems.filter((item) => ['home', 'schedule', 'pass', 'route', 'profile'].includes(item.id)).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={page === id ? 'active' : ''}><Icon size={19} /><span>{id === 'schedule' ? 'Reservar' : id === 'profile' ? 'Perfil' : label}</span></button>)}</nav>
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="Cerrar aviso"><X size={15} /></button></div>}
      {modal && <Modal kind={modal} onClose={() => setModal('')} onConfirm={cancelReservation} />}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function HomePage({ name, reservation, trip, seat, onNavigate, onToast }) {
  const stats = [{ label: 'Viajes este mes', value: reservation ? '13' : '12', note: '+2 respecto al mes pasado', icon: Bus, tone: 'blue' }, { label: 'Puntualidad', value: '98%', note: '¡Vas muy bien!', icon: Clock3, tone: 'green' }, { label: 'Tiempo ahorrado', value: '8.5 h', note: 'En tus trayectos', icon: Compass, tone: 'violet' }]
  return <>
    <div className="welcome-banner"><div className="welcome-copy"><div className="eyebrow eyebrow-light">{new Date().getHours() < 12 ? 'BUENOS DÍAS' : 'HOLA DE NUEVO'}</div><h1>¡Hola, {name}! <span>✦</span></h1><p>Tu viaje de hoy comienza a tiempo. Revisa tu ruta y prepárate para llegar con tranquilidad.</p><div className="welcome-actions"><button className="button button-white" onClick={() => onNavigate(reservation ? 'pass' : 'schedule')}>{reservation ? 'Ver mi pase' : 'Reservar viaje'}<ArrowRight size={16} /></button><button className="link-light" onClick={() => onNavigate('route')}>Explorar rutas <ArrowUpRight size={15} /></button></div></div><div className="welcome-art" aria-hidden="true"><div className="sun-disc" /><div className="art-road"><span /><Bus size={34} /></div><div className="art-building building-one" /><div className="art-building building-two" /><div className="art-building building-three" /></div><div className="banner-tag"><span className="live-dot" />Servicio activo</div></div>
    <div className="stats-grid">{stats.map(({ label, value, note, icon: Icon, tone }) => <div className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon size={18} /></div><span className="stat-label">{label}</span><b className="stat-value">{value}</b><span className="stat-note">{note}</span></div>)}</div>
    <div className="home-grid"><section className="section-card journey-card"><div className="section-top"><div><span className="section-kicker">TU PRÓXIMO VIAJE</span><h2>Tu trayecto de hoy</h2></div><button className="text-link" onClick={() => onNavigate('pass')}>{reservation ? 'Ver pase' : 'Ver itinerario'}<ArrowRight size={15} /></button></div>{reservation ? <div className="journey-body"><div className="journey-time"><strong>{trip.time}</strong><span>{trip.period}</span><small>Salida</small></div><div className="route-rail"><i /><span /><i /></div><div className="journey-stops"><div><strong>Av. Primavera 123</strong><small>Surco · Punto de embarque</small></div><div><strong>Torre Nova · San Isidro</strong><small>Llegada estimada 08:05 a. m.</small></div></div><div className="journey-meta"><span className="status-chip success"><span />Confirmado</span><span className="meta-separator" /><span>Asiento {seat}</span></div></div> : <div className="empty-journey"><div className="empty-icon"><CalendarDays size={22} /></div><div><b>Aún no tienes un viaje reservado</b><span>Elige tu turno y asegura tu asiento para hoy.</span></div><button className="button button-primary button-small" onClick={() => onNavigate('schedule')}>Reservar<ArrowRight size={15} /></button></div>}<div className="journey-footer"><span><MapPin size={15} /> Ruta corporativa · Surco — San Isidro</span><button onClick={() => onNavigate('route')}>Ver mapa</button></div></section>
      <section className="section-card side-panel"><div className="section-top"><div><span className="section-kicker">ACCESO RÁPIDO</span><h2>¿Qué necesitas?</h2></div><div className="soft-icon"><ArrowUpRight size={17} /></div></div><div className="quick-links"><button onClick={() => onNavigate('schedule')}><div className="quick-icon blue"><CalendarDays size={18} /></div><span><b>Reservar un viaje</b><small>Elige turno y asiento</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('route')}><div className="quick-icon green"><Navigation size={18} /></div><span><b>Explorar mis rutas</b><small>Paraderos y horarios</small></span><ArrowRight size={16} /></button><button onClick={() => onToast('No tienes comprobantes pendientes.')}><div className="quick-icon amber"><FileText size={18} /></div><span><b>Mis comprobantes</b><small>Consulta tus viajes</small></span><ArrowRight size={16} /></button></div></section></div>
    <section className="section-card schedule-strip"><div className="section-top"><div><span className="section-kicker">HORARIOS DE HOY</span><h2>Próximas salidas</h2></div><button className="text-link" onClick={() => onNavigate('schedule')}>Todos los horarios<ArrowRight size={15} /></button></div><div className="departures-list">{departures.map((item, index) => <div className="departure-row" key={item.time}><div className="departure-clock"><b>{item.time}</b><span>{item.period}</span></div><div className="departure-description"><b>{item.route}</b><span>{item.hint}</span></div><span className={`seats-pill ${item.seats <= 3 ? 'scarce' : ''}`}>{item.seats} asientos</span><button className="row-arrow" aria-label={`Ver salida ${item.time}`} onClick={() => { onNavigate('schedule') }}><ArrowRight size={17} /></button></div>)}</div></section>
    <div className="tip-banner"><div className="tip-spark">✦</div><div><b>Un consejo para tu viaje</b><span>Llega al paradero 5 minutos antes para abordar con calma.</span></div><button onClick={() => onToast('Consejo guardado para tu próximo viaje.')} aria-label="Guardar consejo"><Plus size={18} /></button></div>
  </>
}

function SchedulePage({ selected, onSelect, onContinue }) {
  return <><PageHeading eyebrow="PLANIFICA TU DÍA" title="Reserva tu viaje" description="Selecciona el turno que mejor se adapte a tu rutina." action={<div className="heading-date"><CalendarDays size={16} />Hoy, {new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(new Date())}<ChevronDown size={15} /></div>} />
    <div className="steps"><div className="step current"><span>1</span><div><b>Horario</b><small>Elige tu turno</small></div></div><div className="step-line" /><div className="step"><span>2</span><div><b>Asiento</b><small>Selecciona lugar</small></div></div><div className="step-line" /><div className="step"><span>3</span><div><b>Confirmación</b><small>Revisa tu reserva</small></div></div></div>
    <section className="section-card booking-section"><div className="section-top"><div><span className="section-kicker">MARTES · RUTA CORPORATIVA</span><h2>Turnos disponibles</h2><p>Surco → San Isidro <span className="inline-dot">·</span> Tiempo estimado 50 min</p></div><button className="icon-button bordered-icon" aria-label="Buscar horarios"><Search size={17} /></button></div><div className="departure-cards">{departures.map((item, index) => <button key={item.time} className={`departure-card ${selected === index ? 'selected' : ''}`} onClick={() => onSelect(index)}><div className="select-circle">{selected === index && <Check size={13} />}</div><div className="departure-card-main"><div className="card-title-row"><b>{item.title}</b><span className={`seats-pill ${item.seats <= 3 ? 'scarce' : ''}`}>{item.seats <= 3 ? 'Últimos asientos' : `${item.seats} disponibles`}</span></div><div className="large-time">{item.time}<small>{item.period}</small></div><div className="card-route-name"><Bus size={15} />{item.route}</div><div className="card-route-line"><span /><i /><span /></div><div className="card-route-labels"><span>Av. Primavera, Surco</span><span>Torre Nova, San Isidro</span></div><div className="trip-foot"><span><Clock3 size={14} />50 min</span><span><MapPin size={14} />2 paraderos</span></div></div></button>)}</div><div className="booking-foot"><span><ShieldCheck size={16} />Tu reserva es personal y segura</span><button className="button button-primary" onClick={onContinue}>Continuar <ArrowRight size={17} /></button></div></section><div className="info-note"><CircleHelp size={17} /><span><b>¿Necesitas cambiar tu turno?</b> Puedes modificarlo antes de las 6:00 a. m. del día de tu viaje.</span><button aria-label="Más información"><ArrowRight size={16} /></button></div></>
}

function SeatPage({ selected, onSelect, trip, onBack, onContinue }) {
  return <><PageHeading eyebrow="PASO 2 DE 3" title="Elige tu asiento" description="Selecciona el lugar donde viajarás hoy." action={<button className="back-link" onClick={onBack}><ArrowLeft size={16} />Cambiar horario</button>} /><div className="steps compact"><div className="step done"><span><Check size={13} /></span><div><b>Horario</b><small>{trip.time} {trip.period}</small></div></div><div className="step-line done" /><div className="step current"><span>2</span><div><b>Asiento</b><small>Selecciona lugar</small></div></div><div className="step-line" /><div className="step"><span>3</span><div><b>Confirmación</b><small>Revisa tu reserva</small></div></div></div><div className="seat-layout"><section className="section-card seat-selection"><div className="section-top"><div><span className="section-kicker">RUTA A · {trip.time}</span><h2>Elige tu asiento</h2><p>Vista superior del vehículo</p></div><div className="bus-capacity"><Users size={16} />16 asientos</div></div><div className="bus-shell"><div className="bus-front"><span /><span /><div><Bus size={17} /><b>CONDUCTOR</b></div></div><div className="seat-grid">{seatRows.flatMap((row) => row).map((seat, index) => seat ? <button key={seat} onClick={() => !takenSeats.includes(seat) && onSelect(seat)} disabled={takenSeats.includes(seat)} className={`seat ${takenSeats.includes(seat) ? 'occupied' : selected === seat ? 'chosen' : ''}`} aria-label={`Asiento ${seat}${takenSeats.includes(seat) ? ', ocupado' : selected === seat ? ', seleccionado' : ', disponible'}`}>{seat}</button> : <div className="aisle" key={`aisle-${index}`} />)}</div><div className="bus-rear">PARTE POSTERIOR</div></div><div className="seat-legend"><span><i className="legend-available" />Disponible</span><span><i className="legend-selected" />Seleccionado</span><span><i className="legend-occupied" />Ocupado</span></div><div className="seat-tip"><ShieldCheck size={17} /><span>Tu asiento queda reservado únicamente para ti.</span></div></section><aside className="section-card seat-summary"><span className="section-kicker">TU SELECCIÓN</span><h2>Resumen del viaje</h2><div className="mini-trip"><div><span>IDA</span><b>{trip.time} <small>{trip.period}</small></b></div><div className="mini-destination"><MapPin size={16} /><span>Surco →<br />San Isidro</span></div></div><div className="summary-line"><span>Ruta</span><b>{trip.route.split(' · ')[0]}</b></div><div className="summary-line"><span>Asiento</span><b className="seat-number">{selected}</b></div><div className="summary-line"><span>Duración estimada</span><b>50 min</b></div><button className="button button-primary button-wide" onClick={onContinue}>Continuar <ArrowRight size={17} /></button><p className="secure-caption"><ShieldCheck size={14} />Sin costo adicional para ti</p></aside></div></>
}

function SummaryPage({ trip, seat, onBack, onConfirm }) {
  return <><PageHeading eyebrow="PASO 3 DE 3" title="Confirma tu reserva" description="Revisa los detalles antes de confirmar tu viaje." action={<button className="back-link" onClick={onBack}><ArrowLeft size={16} />Editar reserva</button>} /><div className="steps compact"><div className="step done"><span><Check size={13} /></span><div><b>Horario</b><small>{trip.time} {trip.period}</small></div></div><div className="step-line done" /><div className="step done"><span><Check size={13} /></span><div><b>Asiento</b><small>{seat} seleccionado</small></div></div><div className="step-line done" /><div className="step current"><span>3</span><div><b>Confirmación</b><small>Revisa tu reserva</small></div></div></div><div className="confirmation-grid"><section className="section-card confirm-card"><div className="confirm-icon"><CheckCircle2 size={25} /></div><span className="section-kicker">TODO LISTO PARA TU VIAJE</span><h2>Tu viaje, a un paso</h2><p>Confirma los datos de tu reserva. Tu pase estará disponible en la app.</p><div className="confirm-route"><div className="confirm-stop"><span className="stop-dot start" /><div><small>ORIGEN · 07:00 A. M.</small><b>Av. Primavera 123, Surco</b><span>Paradero frente al parque</span></div></div><div className="confirm-stop"><span className="stop-dot end" /><div><small>DESTINO · 08:05 A. M.</small><b>Torre Nova, San Isidro</b><span>Av. Víctor Andrés Belaúnde 147</span></div></div></div><div className="confirm-ticket"><div><span>HORA DE SALIDA</span><b>{trip.time} <small>{trip.period}</small></b></div><div><span>ASIENTO</span><b>{seat}</b></div><div><span>RUTA</span><b>{trip.route.split(' · ')[0]}</b></div></div><div className="confirm-notice"><ShieldCheck size={17} /><span>Recuerda llegar al paradero 5 minutos antes de la salida.</span></div></section><aside className="section-card confirm-side"><span className="section-kicker">RESUMEN</span><h2>Tu reserva</h2><div className="summary-line"><span>Fecha</span><b>{new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long' }).format(new Date())}</b></div><div className="summary-line"><span>Turno</span><b>{trip.title}</b></div><div className="summary-line"><span>Hora</span><b>{trip.time} {trip.period}</b></div><div className="summary-line"><span>Asiento</span><b className="seat-number">{seat}</b></div><div className="summary-total"><span>Total a pagar</span><b>S/ 0.00</b><small>Incluido en tu beneficio corporativo</small></div><button className="button button-primary button-wide" onClick={onConfirm}>Confirmar reserva <ArrowRight size={17} /></button><p className="secure-caption"><ShieldCheck size={14} />Reserva segura y sin costo</p></aside></div></>
}

function PassPage({ reservation, trip, seat, onBook, onCancel, onNavigate, onToast }) {
  if (!reservation) return <><PageHeading eyebrow="TU MOVILIDAD CORPORATIVA" title="Mi pase de abordaje" description="Tu viaje de hoy en un solo lugar." /><section className="section-card empty-pass"><div className="empty-icon large"><Ticket size={28} /></div><h2>Aún no tienes un pase</h2><p>Cuando reserves un turno, aquí encontrarás tu pase de abordaje y toda la información de tu viaje.</p><button className="button button-primary" onClick={onBook}>Reservar un viaje <ArrowRight size={17} /></button></section></>
  return <><PageHeading eyebrow="VIAJE DE HOY · RUTA A" title="Tu pase de abordaje" description="Ten tu pase listo al momento de subir al transporte." action={<button className="outline-button" onClick={() => onToast('Pase listo para guardar cuando estés en línea.')}><Download size={16} />Descargar pase</button>} /><div className="pass-layout"><section className="section-card boarding-pass"><div className="pass-status"><span className="status-chip success"><span />Reserva confirmada</span><span className="pass-code">TC-2408-019</span></div><div className="pass-destinations"><div className="pass-place"><small>ORIGEN</small><b>Surco</b><span>Av. Primavera 123</span><strong>07:00 <small>a. m.</small></strong></div><div className="pass-line"><Bus size={17} /><i /></div><div className="pass-place destination"><small>DESTINO</small><b>San Isidro</b><span>Torre Nova · Av. Belaúnde</span><strong>08:05 <small>a. m.</small></strong></div></div><div className="pass-perforation"><i /><span>✦</span><i /></div><div className="pass-details"><div><span>FECHA</span><b>{new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}</b></div><div><span>HORA DE SALIDA</span><b>{trip.time} {trip.period}</b></div><div><span>ASIENTO</span><b className="pass-seat">{seat}</b></div></div><div className="qr-area"><QRCode /><div><b>Tu pase está listo</b><span>Muéstralo al conductor al abordar.</span><small><ShieldCheck size={13} />Pase personal e intransferible</small></div></div></section><aside className="pass-side"><section className="section-card driver-card"><div className="section-top"><div><span className="section-kicker">TU TRANSPORTE</span><h2>Datos del servicio</h2></div><div className="quick-icon green"><Bus size={18} /></div></div><div className="driver-row"><div className="driver-avatar">JM</div><div><b>José Mendoza</b><span>Conductor asignado</span></div><span className="status-chip success small-chip"><span />Activo</span></div><div className="summary-line"><span>Vehículo</span><b>Minibús ejecutivo</b></div><div className="summary-line"><span>Placa</span><b className="plate">ABC-123</b></div><button className="map-preview" onClick={() => onNavigate('route')}><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-route"><i /><i /></div><span className="map-pin"><Bus size={15} /></span><span className="map-caption"><Navigation size={14} />Ver recorrido en vivo<ArrowRight size={15} /></span></button></section><button className="cancel-link" onClick={onCancel}>Cancelar reserva</button></aside></div><section className="section-card boarding-timeline"><div className="section-top"><div><span className="section-kicker">TU VIAJE</span><h2>Paraderos del recorrido</h2></div><button className="text-link" onClick={() => onNavigate('route')}>Ver ruta completa<ArrowRight size={15} /></button></div><div className="stop-list"><div className="stop-row"><span className="timeline-dot start" /><div><b>Av. Primavera 123, Surco</b><span>Paradero frente al parque</span></div><strong>07:00 <small>a. m.</small></strong></div><div className="stop-row"><span className="timeline-dot middle" /><div><b>Av. Caminos del Inca, Surco</b><span>Paradero esquina con Benavides</span></div><strong>07:22 <small>a. m.</small></strong></div><div className="stop-row"><span className="timeline-dot end" /><div><b>Torre Nova, San Isidro</b><span>Av. Víctor Andrés Belaúnde 147</span></div><strong>08:05 <small>a. m.</small></strong></div></div></section></>
}

function QRCode() {
  const cells = Array.from({ length: 225 }, (_, i) => {
    const x = i % 15; const y = Math.floor(i / 15)
    const finder = (x < 5 && y < 5) || (x > 9 && y < 5) || (x < 5 && y > 9)
    if (finder) { const lx = x > 9 ? x - 10 : x; const ly = y > 9 ? y - 10 : y; return (lx === 0 || lx === 4 || ly === 0 || ly === 4 || (lx >= 2 && lx <= 2 && ly >= 2 && ly <= 2)) }
    return ((x * 7 + y * 11 + x * y) % 5) < 2
  })
  return <div className="qr-code" aria-label="Código de validación de demostración">{cells.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}</div>
}

function RoutePage({ reservation, trip, onToast }) {
  return <><PageHeading eyebrow="INFORMACIÓN DE SERVICIO" title="Ruta en vivo" description="Consulta paraderos, horarios y detalles de tu recorrido." action={<div className="status-chip success"><span />Servicio activo</div>} />{reservation && <div className="route-live-banner"><div className="live-indicator"><span /><Navigation size={17} /></div><div><b>Tu unidad está en servicio</b><span>Bus ejecutivo · Placa ABC-123 · Conductor José Mendoza</span></div><div className="live-eta"><small>LLEGADA ESTIMADA</small><b>08:05 <small>a. m.</small></b></div></div>}<div className="route-layout"><section className="section-card route-map-card"><div className="section-top"><div><span className="section-kicker">RUTA A · LIMA</span><h2>Surco → San Isidro</h2></div><button className="outline-button compact-button" onClick={() => onToast('La ruta está guardada en tus favoritos.')}><Plus size={15} />Guardar</button></div><div className="large-map"><div className="map-grid" /><div className="map-neighborhood n1">SANTIAGO DE SURCO</div><div className="map-neighborhood n2">MIRAFLORES</div><div className="map-neighborhood n3">SAN ISIDRO</div><div className="map-river" /><svg className="route-svg" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true"><path d="M110 330 C190 285 174 245 292 252 S405 184 478 197 S558 169 642 82" fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 0" /></svg><div className="map-stop map-stop-one"><i /><span>Surco</span></div><div className="map-stop map-stop-two"><i /><span>San Isidro</span></div><div className="map-bus-pin"><Bus size={16} /></div><div className="map-scale">Mapa esquemático</div><button className="map-locate" onClick={() => onToast('Ubicación de demostración: Av. Caminos del Inca.')} aria-label="Centrar ubicación"><Navigation size={17} /></button></div><div className="map-legend"><span><i className="legend-route" />Recorrido</span><span><i className="legend-current" />Unidad</span><span><i className="legend-stop" />Paraderos</span></div></section><section className="section-card route-stops"><div className="section-top"><div><span className="section-kicker">50 MIN · 3 PARADEROS</span><h2>Itinerario</h2></div><div className="soft-icon"><Clock3 size={17} /></div></div><div className="route-stop-list"><div className="route-stop"><span className="route-stop-icon start"><MapPin size={16} /></span><div><b>Av. Primavera 123</b><span>Surco · Frente al parque</span></div><strong>07:00<small>a. m.</small></strong></div><div className="route-stop"><span className="route-stop-icon"><MapPin size={16} /></span><div><b>Av. Caminos del Inca</b><span>Surco · Esquina con Benavides</span></div><strong>07:22<small>a. m.</small></strong></div><div className="route-stop"><span className="route-stop-icon end"><MapPin size={16} /></span><div><b>Torre Nova</b><span>San Isidro · Av. Belaúnde 147</span></div><strong>08:05<small>a. m.</small></strong></div></div><div className="route-stops-footer"><ShieldCheck size={16} />Información de ruta actualizada para hoy.</div></section></div><div className="info-note"><WifiOff size={17} /><span>El seguimiento de ubicación en tiempo real requiere que el sistema de transporte esté conectado.</span><button onClick={() => onToast('El seguimiento se actualizará cuando el vehículo se conecte.')} aria-label="Más información"><ArrowRight size={16} /></button></div></>
}

function ProfilePage({ name, setName, onSave, theme, setTheme, installPrompt, onToast }) {
  return <><PageHeading eyebrow="TU CUENTA" title="Mi perfil" description="Administra tus datos y preferencias de movilidad." action={<button className="button button-primary" onClick={onSave}><Check size={16} />Guardar cambios</button>} /><div className="profile-layout"><section className="section-card profile-main"><div className="profile-hero"><div className="profile-avatar">{name.slice(0, 1)}</div><div><h2>{name} Rojas</h2><span>Colaboradora · NovaTech Perú</span><small><CheckCircle2 size={14} />Cuenta verificada</small></div><button className="outline-button compact-button" onClick={() => onToast('La foto de perfil no está disponible en esta demostración.')}><UserRound size={15} />Editar foto</button></div><div className="profile-form"><div className="form-section-heading"><div><b>Información personal</b><span>Estos datos identifican tu cuenta corporativa.</span></div><ShieldCheck size={18} /></div><label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} /></label><div className="form-row"><label>Apellido<input defaultValue="Rojas" /></label><label>Correo corporativo<input defaultValue="valeria.rojas@novatech.pe" type="email" /></label></div><div className="form-row"><label>Teléfono<input defaultValue="+51 987 654 321" /></label><label>Empresa<input defaultValue="NovaTech Perú" readOnly /></label></div><div className="profile-divider" /><div className="form-section-heading"><div><b>Preferencias</b><span>Personaliza cómo usas TransCorp.</span></div><Settings size={18} /></div><div className="preference-row"><div className="preference-icon">{theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}</div><div><b>Apariencia</b><span>Elige el tema de tu aplicación</span></div><div className="theme-switch"><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}><Sun size={14} />Claro</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}><Moon size={14} />Oscuro</button></div></div><div className="preference-row"><div className="preference-icon"><Bell size={17} /></div><div><b>Recordatorios de viaje</b><span>Recibe avisos antes de tu salida</span></div><button className="toggle on" onClick={(e) => { e.currentTarget.classList.toggle('on'); onToast('Preferencia de recordatorios actualizada.') }} aria-label="Activar o desactivar recordatorios"><i /></button></div><div className="preference-row"><div className="preference-icon"><Bus size={17} /></div><div><b>Instalar TransCorp</b><span>Accede más rápido desde tu dispositivo</span></div><button className="outline-button compact-button" onClick={async () => { if (installPrompt) await installPrompt.prompt(); else onToast('Desde el menú del navegador puedes instalar esta aplicación.')}}><Download size={15} />Instalar</button></div></div></section><aside className="profile-side"><div className="section-card corporate-card"><div className="corporate-logo">N</div><span className="section-kicker">CUENTA CORPORATIVA</span><h3>NovaTech Perú</h3><p>Tu empresa cubre el costo de tus viajes en rutas corporativas.</p><div className="corporate-rule" /><div><span>Plan de movilidad</span><b>Corporativo Plus</b></div><div><span>Vigencia</span><b>Hasta 31 dic. 2026</b></div><div><span>Estado</span><b className="status-inline"><i />Activo</b></div></div><div className="support-card"><div className="help-icon"><Headphones size={19} /></div><div><b>¿Tienes alguna consulta?</b><span>Contacta a nuestro equipo de soporte.</span></div><button className="text-link" onClick={() => onToast('Escríbenos a soporte@transcorp.pe')}>Contactar<ArrowRight size={14} /></button></div></aside></div></>
}

function Modal({ kind, onClose, onConfirm }) {
  const cancel = kind === 'cancel'
  return <div className="modal-backdrop" onClick={onClose}><section className="modal-card" onClick={(e) => e.stopPropagation()}><button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button><div className={`modal-symbol ${cancel ? 'warning' : ''}`}>{cancel ? <X size={22} /> : <Headphones size={23} />}</div><h2>{cancel ? '¿Cancelar tu reserva?' : 'Estamos para ayudarte'}</h2><p>{cancel ? 'Tu asiento quedará disponible para otra persona. Esta acción no se puede deshacer.' : 'Nuestro equipo de movilidad está disponible para ayudarte con tus rutas, horarios y reservas.'}</p>{cancel ? <div className="modal-actions"><button className="outline-button" onClick={onClose}>Conservar reserva</button><button className="button button-danger" onClick={onConfirm}>Sí, cancelar</button></div> : <><div className="help-contact"><Headphones size={17} /><span><b>Soporte TransCorp</b><small>soporte@transcorp.pe · Lun–Vie, 6 a. m.–7 p. m.</small></span></div><button className="button button-primary button-wide" onClick={onClose}>Entendido</button></>}</section></div>
}

createRoot(document.getElementById('root')).render(<App />)
