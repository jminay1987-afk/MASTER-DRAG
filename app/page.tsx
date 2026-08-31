import { db } from "@/lib/supabase";

const categories = ["10.5", "10", "9.5", "9", "8.5", "8", "7.5", "7", "LIBRE"];

function formatDate(value?: string | null) {
  if (!value) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export default async function Home() {
  const s = await db();

  const { data: live } = await s
    .from("fechas")
    .select("fecha_id,nombre,numero_oficial,fecha_calendario_principal,autodromo,estado,tipo_evento")
    .eq("visible_publico", true)
    .in("estado", ["EN_COMPETENCIA", "CONTINUACION"])
    .order("fecha_calendario_principal", { ascending: false })
    .limit(1);

  const { data: next } = await s
    .from("fechas")
    .select("fecha_id,nombre,numero_oficial,fecha_calendario_principal,autodromo,estado,tipo_evento")
    .eq("visible_publico", true)
    .eq("tipo_evento", "MASTER_DRAG")
    .gte("fecha_calendario_principal", new Date().toISOString().slice(0, 10))
    .order("fecha_calendario_principal")
    .limit(3);

  const { data: publishedSnapshots } = await s
    .from("ranking_snapshots")
    .select("snapshot_id,categoria_id,version,generado_at,contenido_json")
    .order("generado_at", { ascending: false })
    .limit(100);

  const latestByCategory = new Map<string, any>();
  for (const snap of publishedSnapshots || []) {
    const content: any = snap.contenido_json || {};
    const year = Number(content?.temporada?.anio || 0);
    if (year && year !== 2026) continue;
    const key = String(snap.categoria_id);
    if (!latestByCategory.has(key)) latestByCategory.set(key, { ...snap, content });
  }
  const publicRankings = [...latestByCategory.values()].sort((a: any, b: any) => {
    const av = Number(String(a.content?.categoria?.codigo || "999").replace("LIBRE", "999"));
    const bv = Number(String(b.content?.categoria?.codigo || "999").replace("LIBRE", "999"));
    return bv - av;
  });

  const on = live?.[0];
  const upcoming = next?.[0];

  return (
    <main className="publicShell" id="inicio">
      <header className="publicHeader">
        <a className="logoHome" href="/" aria-label="Ir a página principal">
          <img src="/master-drag-logo.svg" alt="Master Drag Chile" />
        </a>

        <nav className="mainNav" aria-label="Navegación principal">
          <a className="active" href="/"><span>⌂</span>INICIO</a>
          <a href="#vivo"><span>◉</span>EN VIVO</a>
          <a href="#eventos"><span>▣</span>PRÓXIMOS EVENTOS</a>
          <a href="#ranking"><span>♛</span>RANKING</a>
          <a href="#galeria"><span>▧</span>GALERÍA</a>
          <a href="#videos"><span>▶</span>VIDEOS</a>
          <a href="#entrevistas"><span>◍</span>ENTREVISTAS</a>
          <a href="#talleres"><span>⌕</span>TALLERES</a>
          <a href="#contacto"><span>✉</span>CONTACTO</a>
          <a href="#buscar"><span>⌕</span>BÚSQUEDA</a>
        </nav>

        <a className="adminButton" href="/admin">▣ &nbsp; ADMINISTRACIÓN</a>
      </header>

      <section className="homeDashboard wrapWide">
        <div className="heroPublic" id="vivo">
          <div className="heroOverlay" />
          <div className="heroCopy">
            <div className={`livePill ${on ? "isLive" : ""}`}>● {on ? "EN VIVO" : "PRÓXIMAMENTE"}</div>
            <h1>RESULTADOS<br/>EN VIVO</h1>
            <p>{on?.nombre || upcoming?.nombre || "MASTER DRAG 2026"}</p>
            <strong>{on?.autodromo || upcoming?.autodromo || "Autódromo San Antonio"}</strong>
            <a className="heroButton" href="#live-panel">VER RESULTADOS EN VIVO →</a>
          </div>
          <div className="heroDots"><b/><i/><i/><i/></div>
        </div>

        <aside className="livePanel" id="live-panel">
          <div className="panelTitle"><h2>PIQUES EN VIVO</h2><span className={on ? "liveNow" : "offNow"}>● {on ? "EN VIVO" : "OFF"}</span></div>
          <div className="liveMeta"><span>CATEGORÍA: —</span><span>RONDA: —</span></div>
          {on ? (
            <div className="emptyRace">
              <strong>{on.nombre}</strong>
              <span>{String(on.estado).replaceAll("_", " ")}</span>
              <p>Los piques confirmados aparecerán aquí directamente desde Cronometraje y Juez.</p>
            </div>
          ) : (
            <div className="emptyRace">
              <strong>SIN PIQUES EN CURSO</strong>
              <span>La transmisión se activará cuando comience la competencia.</span>
            </div>
          )}
          <a className="panelFooterLink" href="#vivo">VER TODOS LOS PIQUES EN VIVO</a>
        </aside>
      </section>

      <section className="lowerGrid wrapWide">
        <section className="publicCard eventCard" id="eventos">
          <div className="cardHeading"><h2>▣ &nbsp; PRÓXIMOS EVENTOS</h2><a href="#eventos">VER CALENDARIO COMPLETO →</a></div>
          {upcoming ? (
            <div className="eventFeature">
              <div className="eventPosterMini">
                <img src="/master-drag-logo.svg" alt="Master Drag" />
                <b>{upcoming.numero_oficial ? `${upcoming.numero_oficial}ª FECHA` : "PRÓXIMA FECHA"}</b>
              </div>
              <div className="eventInfo">
                <div><h3>{upcoming.numero_oficial ? `${upcoming.numero_oficial}ª FECHA` : upcoming.nombre}</h3><span className="tagRace">MASTER DRAG</span></div>
                <p>▣ {formatDate(upcoming.fecha_calendario_principal)}</p>
                <p>⌖ {upcoming.autodromo || "Lugar por confirmar"}</p>
                <a className="outlineButton" href="#eventos">MÁS INFORMACIÓN →</a>
              </div>
            </div>
          ) : <div className="emptyBlock">No hay próximas fechas públicas cargadas todavía.</div>}
        </section>

        <section className="publicCard rankingCard" id="ranking">
          <div className="cardHeading"><h2>♛ &nbsp; RANKING CAMPEONATO MASTER DRAG 2026</h2><a href="#ranking">VER RANKING COMPLETO →</a></div>
          <div className="categoryTabs">{categories.map(c => <span key={c}>{c}</span>)}</div>
          {publicRankings.length ? (
            <div className="publicRankings">
              {publicRankings.map((snap: any) => {
                const content = snap.content || {};
                const rows = Array.isArray(content.ranking) ? content.ranking.slice(0, 5) : [];
                return <article className="publicRankingGroup" key={snap.snapshot_id}>
                  <div className="publicRankingTitle"><b>CATEGORÍA {content?.categoria?.codigo || content?.categoria?.nombre || "—"}</b><small>PUBLICADO · VERSIÓN {snap.version}</small></div>
                  <div className="publicRankingRows">{rows.map((r: any) => <div key={r.piloto_temporada_id}><strong>{r.posicion}°</strong><span>#{r.numero_competencia} · {r.piloto}</span><b>{r.total} pts</b></div>)}</div>
                </article>;
              })}
            </div>
          ) : (
            <div className="rankingEmpty">
              <b>SIN RANKING PUBLICADO</b>
              <span>El ranking aparecerá aquí únicamente cuando Juez o Administración publiquen una versión autorizada.</span>
            </div>
          )}
        </section>
      </section>

      <section className="contentStrip wrapWide">
        <a id="galeria" href="#galeria"><span>▧</span><b>GALERÍA</b><small>Fotos de fechas y pilotos</small></a>
        <a id="videos" href="#videos"><span>▶</span><b>VIDEOS</b><small>Pasadas y resúmenes</small></a>
        <a id="entrevistas" href="#entrevistas"><span>◍</span><b>ENTREVISTAS</b><small>Pilotos y protagonistas</small></a>
        <a id="talleres" href="#talleres"><span>⌕</span><b>TALLERES</b><small>Equipos y servicios</small></a>
        <a id="buscar" href="#buscar"><span>⌕</span><b>BÚSQUEDA</b><small>Pilotos, fechas y resultados</small></a>
      </section>

      <footer className="publicFooter" id="contacto">
        <span>MASTER DRAG CHILE © 2026</span>
        <b>AUTÓDROMO SAN ANTONIO</b>
        <div>● &nbsp; ◎ &nbsp; ▶</div>
      </footer>
    </main>
  );
}
