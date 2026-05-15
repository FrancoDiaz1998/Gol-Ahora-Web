// =====================================================
//  MÓDULO: TORNEOS (Ligas, Equipos, Fixtures, Partidos)
//  RF27-RF34: Gestión completa de competencias
// =====================================================

const STORAGE_KEY_COMPETENCIAS = 'gol_competencias';
const STORAGE_KEY_EQUIPOS      = 'gol_equipos';

let activeTab            = 'competencias';
let selectedCompetencia  = null;
let selectedFechaIndex   = 0;
let partidosFilter       = 'todos';
let currentResultadoCtx  = null; // { competenciaId, rondaNumero, partidoId }

// =====================================================
//  HELPERS: STORAGE
// =====================================================

function getCompetencias() {
    const data = localStorage.getItem(STORAGE_KEY_COMPETENCIAS);
    return data ? JSON.parse(data) : getMockCompetencias();
}

function saveCompetencias(competencias) {
    localStorage.setItem(STORAGE_KEY_COMPETENCIAS, JSON.stringify(competencias));
}

function getEquipos() {
    const data = localStorage.getItem(STORAGE_KEY_EQUIPOS);
    return data ? JSON.parse(data) : getMockEquipos();
}

function saveEquipos(equipos) {
    localStorage.setItem(STORAGE_KEY_EQUIPOS, JSON.stringify(equipos));
}

// =====================================================
//  MOCK DATA
// =====================================================

function getMockCompetencias() {
    return [
        {
            id: 1,
            nombre: 'Liga Apertura 2025',
            tipo: 'liga',
            formato: 'round-robin',
            fechaInicio: '2025-03-01',
            fechaFin: '2025-06-30',
            estado: 'activo',
            equiposInscritos: [1, 2, 3, 4],
            fixture: null,
            tablaPosiciones: {
                1: { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
                2: { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
                3: { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
                4: { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
            }
        },
        {
            id: 2,
            nombre: 'Copa Verano',
            tipo: 'torneo',
            formato: 'eliminacion-directa',
            fechaInicio: '2025-01-15',
            fechaFin: '2025-02-28',
            estado: 'activo',
            equiposInscritos: [1, 2, 3, 4, 5, 6, 7, 8],
            fixture: null,
            tablaPosiciones: null
        },
        {
            id: 3,
            nombre: 'Liga Clausura 2024',
            tipo: 'liga',
            formato: 'round-robin',
            fechaInicio: '2024-09-01',
            fechaFin: '2024-12-15',
            estado: 'finalizado',
            equiposInscritos: [1, 2],
            fixture: null,
            tablaPosiciones: {}
        }
    ];
}

function getMockEquipos() {
    return [
        {
            id: 1,
            nombre: 'Los Tigres FC',
            capitan: 'Juan Pérez',
            capitanId: 1,
            integrantes: [
                { id: 1, nombre: 'Juan Pérez',    posicion: 'Delantero' },
                { id: 2, nombre: 'Carlos Gómez',  posicion: 'Mediocampista' },
                { id: 3, nombre: 'Luis Martínez', posicion: 'Defensor' },
                { id: 4, nombre: 'Pedro Sánchez', posicion: 'Arquero' }
            ],
            fechaCreacion: '2024-01-15',
            estado: 'activo'
        },
        {
            id: 2,
            nombre: 'Águilas Doradas',
            capitan: 'Martín López',
            capitanId: 2,
            integrantes: [
                { id: 5, nombre: 'Martín López',     posicion: 'Delantero' },
                { id: 6, nombre: 'Diego Fernández', posicion: 'Mediocampista' }
            ],
            fechaCreacion: '2024-02-10',
            estado: 'activo'
        },
        {
            id: 3,
            nombre: 'Leones Unidos',
            capitan: 'Lucas Díaz',
            capitanId: 3,
            integrantes: [
                { id: 7, nombre: 'Lucas Díaz', posicion: 'Delantero' }
            ],
            fechaCreacion: '2024-03-05',
            estado: 'activo'
        },
        {
            id: 4,
            nombre: 'Pumas FC',
            capitan: 'Franco Silva',
            capitanId: 4,
            integrantes: [],
            fechaCreacion: '2024-03-20',
            estado: 'activo'
        },
        {
            id: 5,
            nombre: 'Halcones',
            capitan: 'Roberto Cruz',
            capitanId: 5,
            integrantes: [],
            fechaCreacion: '2024-04-01',
            estado: 'activo'
        },
        {
            id: 6,
            nombre: 'Cóndores',
            capitan: 'Matías Rojas',
            capitanId: 6,
            integrantes: [],
            fechaCreacion: '2024-04-15',
            estado: 'activo'
        },
        {
            id: 7,
            nombre: 'Jaguares',
            capitan: 'Sebastián Vega',
            capitanId: 7,
            integrantes: [],
            fechaCreacion: '2024-05-01',
            estado: 'activo'
        },
        {
            id: 8,
            nombre: 'Zorros FC',
            capitan: 'Nicolás Morales',
            capitanId: 8,
            integrantes: [],
            fechaCreacion: '2024-05-10',
            estado: 'inactivo'
        }
    ];
}

// =====================================================
//  HELPER: TODOS LOS PARTIDOS DESDE FIXTURES
// =====================================================

function getAllPartidosFromFixtures() {
    const competencias = getCompetencias();
    const equipos      = getEquipos();
    const result       = [];

    competencias.forEach(comp => {
        if (!comp.fixture || !comp.fixture.rondas) return;
        comp.fixture.rondas.forEach(ronda => {
            ronda.partidos.forEach(partido => {
                const local     = equipos.find(e => e.id === partido.equipoLocal);
                const visitante = equipos.find(e => e.id === partido.equipoVisitante);
                result.push({
                    ...partido,
                    competenciaId:           comp.id,
                    competenciaNombre:        comp.nombre,
                    competenciaTipo:          comp.tipo,
                    rondaNombre:              ronda.nombre,
                    equipoLocalNombre:        local?.nombre    || 'TBD',
                    equipoVisitanteNombre:    visitante?.nombre || 'TBD'
                });
            });
        });
    });

    return result.sort((a, b) => {
        if (!a.fechaHora && !b.fechaHora) return 0;
        if (!a.fechaHora) return 1;
        if (!b.fechaHora) return -1;
        return new Date(a.fechaHora) - new Date(b.fechaHora);
    });
}

// =====================================================
//  RENDER & INIT
// =====================================================

function render() {
    return `
        <!-- TABS -->
        <div class="module-tabs">
            <button class="module-tab ${activeTab === 'competencias' ? 'active' : ''}" data-tab="competencias">
                <i data-lucide="trophy"></i>
                Competencias
            </button>
            <button class="module-tab ${activeTab === 'equipos' ? 'active' : ''}" data-tab="equipos">
                <i data-lucide="users"></i>
                Equipos
            </button>
            <button class="module-tab ${activeTab === 'fixtures' ? 'active' : ''}" data-tab="fixtures">
                <i data-lucide="calendar-range"></i>
                Fixtures
            </button>
            <button class="module-tab ${activeTab === 'partidos' ? 'active' : ''}" data-tab="partidos">
                <i data-lucide="goal"></i>
                Partidos
            </button>
        </div>

        <!-- TAB CONTENT -->
        <div id="torneos-tab-content">
            ${renderTabContent()}
        </div>

        <!-- MODALES -->
        ${renderModales()}
    `;
}

function init() {
    attachTabListeners();
    attachEventListeners();
}

function renderTabContent() {
    switch (activeTab) {
        case 'competencias': return renderCompetenciasTab();
        case 'equipos':      return renderEquiposTab();
        case 'fixtures':     return renderFixturesTab();
        case 'partidos':     return renderPartidosTab();
        default:             return '';
    }
}

// =====================================================
//  TAB 1: COMPETENCIAS
// =====================================================

function renderCompetenciasTab() {
    const competencias = getCompetencias();
    const activas      = competencias.filter(c => c.estado === 'activo');
    const finalizadas  = competencias.filter(c => c.estado === 'finalizado');

    return `
        <div class="crud-toolbar">
            <div class="crud-toolbar-left">
                <h2 class="crud-title">Competencias</h2>
                <span class="crud-count">${competencias.length}</span>
            </div>
            <div class="crud-toolbar-right">
                <div class="crud-mini-stats">
                    <div class="mini-stat green">
                        <span class="mini-stat-num">${activas.length}</span>
                        <span class="mini-stat-label">Activas</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-num">${finalizadas.length}</span>
                        <span class="mini-stat-label">Finalizadas</span>
                    </div>
                </div>
                <button class="btn-primary-action" id="btn-nueva-competencia">
                    <i data-lucide="plus"></i>
                    Nueva Competencia
                </button>
            </div>
        </div>

        <div class="panel-card tabla-panel">
            ${competencias.length === 0 ? `
                <div class="tabla-empty">
                    <i data-lucide="trophy"></i>
                    <p>No hay competencias registradas.</p>
                    <button class="link-btn" id="btn-nueva-competencia-2">Crear primera competencia</button>
                </div>
            ` : `
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Competencia</th>
                                <th>Tipo</th>
                                <th>Período</th>
                                <th>Equipos</th>
                                <th>Fixture</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${competencias.map(comp => `
                                <tr>
                                    <td>
                                        <div class="user-cell">
                                            <div class="user-avatar-sm">${comp.nombre[0]}</div>
                                            <div class="user-cell-info">
                                                <strong>${comp.nombre}</strong>
                                                <span>${comp.formato === 'round-robin' ? 'Todos contra todos' : 'Eliminación directa'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge ${comp.tipo === 'liga' ? 'success' : 'warning'}">
                                            ${comp.tipo === 'liga' ? 'Liga' : 'Torneo'}
                                        </span>
                                    </td>
                                    <td style="font-size: 0.88rem;">
                                        ${formatDate(comp.fechaInicio)} – ${formatDate(comp.fechaFin)}
                                    </td>
                                    <td>${comp.equiposInscritos.length} equipos</td>
                                    <td>
                                        <span class="badge ${comp.fixture ? 'success' : 'danger'}">
                                            ${comp.fixture ? 'Generado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${comp.estado === 'activo' ? 'success' : comp.estado === 'finalizado' ? 'danger' : 'warning'}">
                                            ${comp.estado === 'activo' ? 'Activo' : comp.estado === 'finalizado' ? 'Finalizado' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-btns">
                                            <button class="action-btn view" title="Ver detalles" data-action="ver-comp" data-id="${comp.id}">
                                                <i data-lucide="eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Editar" data-action="editar-comp" data-id="${comp.id}">
                                                <i data-lucide="pencil"></i>
                                            </button>
                                            <button class="action-btn toggle" title="Eliminar" data-action="eliminar-comp" data-id="${comp.id}">
                                                <i data-lucide="trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}

// =====================================================
//  TAB 2: EQUIPOS
// =====================================================

function renderEquiposTab() {
    const equipos = getEquipos();
    const activos  = equipos.filter(e => e.estado === 'activo');

    return `
        <div class="crud-toolbar">
            <div class="crud-toolbar-left">
                <h2 class="crud-title">Equipos</h2>
                <span class="crud-count">${equipos.length}</span>
            </div>
            <div class="crud-toolbar-right">
                <div class="crud-mini-stats">
                    <div class="mini-stat green">
                        <span class="mini-stat-num">${activos.length}</span>
                        <span class="mini-stat-label">Activos</span>
                    </div>
                </div>
                <button class="btn-primary-action" id="btn-nuevo-equipo">
                    <i data-lucide="plus"></i>
                    Nuevo Equipo
                </button>
            </div>
        </div>

        <div class="panel-card tabla-panel">
            ${equipos.length === 0 ? `
                <div class="tabla-empty">
                    <i data-lucide="users"></i>
                    <p>No hay equipos registrados.</p>
                    <button class="link-btn" id="btn-nuevo-equipo-2">Crear primer equipo</button>
                </div>
            ` : `
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Equipo</th>
                                <th>Capitán</th>
                                <th>Integrantes</th>
                                <th>Fecha Creación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${equipos.map(equipo => `
                                <tr>
                                    <td>
                                        <div class="user-cell">
                                            <div class="user-avatar-sm">${equipo.nombre[0]}</div>
                                            <div class="user-cell-info">
                                                <strong>${equipo.nombre}</strong>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${equipo.capitan}</td>
                                    <td>${equipo.integrantes.length} jugadores</td>
                                    <td>${formatDate(equipo.fechaCreacion)}</td>
                                    <td>
                                        <span class="badge ${equipo.estado === 'activo' ? 'success' : 'danger'}">
                                            ${equipo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-btns">
                                            <button class="action-btn view" title="Ver detalles" data-action="ver-equipo" data-id="${equipo.id}">
                                                <i data-lucide="eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Editar" data-action="editar-equipo" data-id="${equipo.id}">
                                                <i data-lucide="pencil"></i>
                                            </button>
                                            <button class="action-btn toggle" title="Eliminar" data-action="eliminar-equipo" data-id="${equipo.id}">
                                                <i data-lucide="trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}

// =====================================================
//  TAB 3: FIXTURES
// =====================================================

function renderFixturesTab() {
    const competencias = getCompetencias().filter(c => c.estado === 'activo');

    if (competencias.length === 0) {
        return `
            <div class="coming-soon-view">
                <i data-lucide="calendar-range"></i>
                <h3>No hay competencias activas</h3>
                <p>Creá una competencia primero para generar fixtures.</p>
                <button class="btn-primary-action" onclick="switchToTab('competencias')">
                    <i data-lucide="trophy"></i>
                    Ir a Competencias
                </button>
            </div>
        `;
    }

    const selected = selectedCompetencia || competencias[0];
    const equipos  = getEquipos().filter(e => selected.equiposInscritos.includes(e.id));

    return `
        <!-- SELECTOR DE COMPETENCIA -->
        <div class="panel-card" style="margin-bottom: 20px;">
            <div class="panel-header">
                <div>
                    <h3>Seleccionar Competencia</h3>
                    <p>Elegí una competencia para ver o generar su fixture</p>
                </div>
            </div>
            <div class="form-group">
                <select id="selector-competencia-fixture" style="width: 100%; max-width: 400px;">
                    ${competencias.map(c => `
                        <option value="${c.id}" ${selected.id === c.id ? 'selected' : ''}>
                            ${c.nombre} (${c.tipo === 'liga' ? 'Liga' : 'Torneo'})
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>

        <!-- INFO Y ACCIONES -->
        <div class="panel-card" style="margin-bottom: 20px;">
            <div class="panel-header">
                <div>
                    <h3>${selected.nombre}</h3>
                    <p>${selected.tipo === 'liga' ? 'Liga · Round Robin' : 'Torneo · Eliminación Directa'} &bull; ${equipos.length} equipos inscriptos</p>
                </div>
                <button class="btn-primary-action" id="btn-generar-fixture">
                    <i data-lucide="${selected.fixture ? 'refresh-cw' : 'zap'}"></i>
                    ${selected.fixture ? 'Regenerar Fixture' : 'Generar Fixture'}
                </button>
            </div>
        </div>

        <!-- FIXTURE -->
        <div id="fixture-display">
            ${selected.fixture ? renderFixture(selected) : `
                <div class="coming-soon-view">
                    <i data-lucide="calendar-x"></i>
                    <h3>Fixture no generado</h3>
                    <p>Hacé clic en "Generar Fixture" para crear el calendario de partidos.</p>
                </div>
            `}
        </div>
    `;
}

function renderFixture(competencia) {
    return competencia.tipo === 'liga'
        ? renderFixtureLiga(competencia)
        : renderFixtureTorneo(competencia);
}

// ── LIGA: fixture por fechas con navegador ────────────────────────────────────

function renderFixtureLiga(competencia) {
    if (!competencia.fixture || !competencia.fixture.rondas) return '';

    const rondas  = competencia.fixture.rondas;
    const equipos = getEquipos();
    const today   = new Date(); today.setHours(0, 0, 0, 0);

    // Fijar índice válido
    const fechaIdx   = Math.max(0, Math.min(selectedFechaIndex, rondas.length - 1));
    const rondaActual = rondas[fechaIdx];

    // Próximas fechas (hasta 2 después de la actual)
    const proximas = rondas.filter((_, i) => i > fechaIdx).slice(0, 2);
    // Últimas fechas jugadas (hasta 2 antes de la actual)
    const pasadas  = rondas.filter((_, i) => i < fechaIdx).slice(-2).reverse();

    const totalJugados = rondas.reduce((acc, r) =>
        acc + r.partidos.filter(p => p.estado === 'finalizado').length, 0);
    const totalPartidos = rondas.reduce((acc, r) => acc + r.partidos.length, 0);

    return `
        <div class="panel-card" style="margin-bottom: 20px;">
            <!-- PROGRESS BAR -->
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                <div style="flex:1;height:6px;background:#e8edf2;border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${totalPartidos ? Math.round((totalJugados/totalPartidos)*100) : 0}%;background:var(--purple);border-radius:999px;transition:width .4s;"></div>
                </div>
                <span style="font-size:0.82rem;color:var(--text-light);white-space:nowrap;">${totalJugados}/${totalPartidos} jugados</span>
            </div>

            <!-- PILLS DE FECHAS -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;">
                ${rondas.map((r, i) => {
                    const jugada = r.partidos.length > 0 && r.partidos.every(p => p.estado === 'finalizado');
                    const actual = i === fechaIdx;
                    return `
                        <button data-action="ir-fecha" data-index="${i}"
                            style="padding:5px 13px;border-radius:999px;border:2px solid ${actual ? 'var(--purple)' : '#e0e0e0'};
                                   background:${actual ? 'var(--purple)' : jugada ? '#f0f7f0' : 'white'};
                                   color:${actual ? 'white' : jugada ? '#2d8a4e' : 'var(--text)'};
                                   font-size:0.82rem;font-weight:${actual ? 700 : 500};cursor:pointer;
                                   display:flex;align-items:center;gap:4px;transition:all .15s;">
                            ${jugada && !actual ? '<span style="font-size:0.7rem;">✓</span>' : ''}
                            F${r.numero}
                        </button>
                    `;
                }).join('')}
            </div>

            <!-- NAVEGADOR DE FECHA ACTUAL -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding:14px 18px;background:#f8fafc;border-radius:12px;border:1px solid var(--border);">
                <button data-action="fecha-anterior" ${fechaIdx === 0 ? 'disabled' : ''}
                        style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:${fechaIdx === 0 ? 'not-allowed' : 'pointer'};opacity:${fechaIdx === 0 ? .4 : 1};">
                    <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
                </button>
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:700;color:var(--purple);">${rondaActual.nombre}</div>
                    <div style="font-size:0.85rem;color:var(--text-light);margin-top:2px;">
                        <i data-lucide="calendar" style="width:13px;height:13px;vertical-align:middle;"></i>
                        ${formatDate(rondaActual.fechaPartidos)}
                    </div>
                </div>
                <button data-action="fecha-siguiente" ${fechaIdx === rondas.length - 1 ? 'disabled' : ''}
                        style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:${fechaIdx === rondas.length - 1 ? 'not-allowed' : 'pointer'};opacity:${fechaIdx === rondas.length - 1 ? .4 : 1};">
                    <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
                </button>
            </div>

            <!-- PARTIDOS DE ESTA FECHA -->
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${rondaActual.partidos.map(partido => {
                    const local     = equipos.find(e => e.id === partido.equipoLocal);
                    const visitante = equipos.find(e => e.id === partido.equipoVisitante);
                    const fin       = partido.estado === 'finalizado';
                    const res       = partido.resultado;

                    // Determinar ganador para resaltar
                    const gLocal = fin ? res.golesLocal     : null;
                    const gVis   = fin ? res.golesVisitante : null;
                    const winL   = fin && gLocal > gVis;
                    const winV   = fin && gVis  > gLocal;

                    return `
                        <div style="background:${fin ? '#f8fffb' : 'white'};border:1px solid ${fin ? '#c3e6cb' : 'var(--border)'};border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:8px;transition:box-shadow .15s;" >
                            <!-- EQUIPO LOCAL -->
                            <div style="flex:1;display:flex;align-items:center;gap:10px;justify-content:flex-end;flex-direction:row-reverse;">
                                <div class="user-avatar-sm" style="${winL ? 'border:2px solid #2d8a4e;' : ''}">${local?.nombre[0] || '?'}</div>
                                <strong style="font-size:0.92rem;color:${winL ? '#2d8a4e' : 'var(--text)'};">${local?.nombre || 'TBD'}</strong>
                            </div>

                            <!-- MARCADOR / VS -->
                            <div style="min-width:110px;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                ${fin ? `
                                    <div style="background:var(--purple);color:white;border-radius:10px;padding:6px 18px;font-size:1.15rem;font-weight:800;letter-spacing:2px;">
                                        ${gLocal} – ${gVis}
                                    </div>
                                    ${res.observaciones ? `<div style="font-size:0.72rem;color:var(--text-light);text-align:center;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${res.observaciones}">${res.observaciones}</div>` : ''}
                                    <button data-action="registrar-resultado" data-id="${partido.id}" data-competencia-id="${competencia.id}"
                                            style="background:none;border:none;color:var(--text-light);font-size:0.75rem;cursor:pointer;text-decoration:underline;padding:0;">
                                        Editar
                                    </button>
                                ` : `
                                    <div style="background:#f1f3f5;color:var(--text-light);border-radius:10px;padding:6px 18px;font-size:0.9rem;font-weight:700;letter-spacing:1px;">VS</div>
                                    <button data-action="registrar-resultado" data-id="${partido.id}" data-competencia-id="${competencia.id}"
                                            style="display:flex;align-items:center;gap:4px;background:var(--purple);color:white;border:none;border-radius:8px;padding:5px 12px;font-size:0.78rem;font-weight:600;cursor:pointer;">
                                        <i data-lucide="clipboard-check" style="width:13px;height:13px;"></i>
                                        Cargar
                                    </button>
                                `}
                            </div>

                            <!-- EQUIPO VISITANTE -->
                            <div style="flex:1;display:flex;align-items:center;gap:10px;">
                                <div class="user-avatar-sm" style="${winV ? 'border:2px solid #2d8a4e;' : ''}">${visitante?.nombre[0] || '?'}</div>
                                <strong style="font-size:0.92rem;color:${winV ? '#2d8a4e' : 'var(--text)'};">${visitante?.nombre || 'TBD'}</strong>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- PRÓXIMAS / PASADAS -->
            ${proximas.length > 0 || pasadas.length > 0 ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px;">
                ${pasadas.length > 0 ? `
                <div>
                    <div style="font-size:0.78rem;font-weight:700;color:var(--text-light);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Resultados anteriores</div>
                    ${pasadas.map(r => `
                        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f8fafc;border-radius:8px;margin-bottom:6px;font-size:0.82rem;cursor:pointer;"
                             data-action="ir-fecha" data-index="${rondas.indexOf(r)}">
                            <span style="color:var(--text-light);">${r.nombre}</span>
                            <span style="flex:1;text-align:right;color:var(--text-light);">${formatDate(r.fechaPartidos)}</span>
                            <span style="color:#2d8a4e;font-size:0.75rem;">✓ Jugada</span>
                        </div>
                    `).join('')}
                </div>
                ` : '<div></div>'}

                ${proximas.length > 0 ? `
                <div>
                    <div style="font-size:0.78rem;font-weight:700;color:var(--text-light);letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;">Próximas fechas</div>
                    ${proximas.map(r => `
                        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f8fafc;border-radius:8px;margin-bottom:6px;font-size:0.82rem;cursor:pointer;"
                             data-action="ir-fecha" data-index="${rondas.indexOf(r)}">
                            <span style="color:var(--text-light);">${r.nombre}</span>
                            <span style="flex:1;text-align:right;color:var(--text-light);">${formatDate(r.fechaPartidos)}</span>
                            <span style="color:var(--purple);font-size:0.75rem;">${r.partidos.length}p</span>
                        </div>
                    `).join('')}
                </div>
                ` : '<div></div>'}
            </div>
            ` : ''}
        </div>

        ${renderTablaPosiciones(competencia)}
    `;
}

// ── TABLA DE POSICIONES ───────────────────────────────────────────────────────

function renderTablaPosiciones(competencia) {
    if (!competencia.tablaPosiciones) return '';

    const equipos = getEquipos();
    const tabla   = Object.entries(competencia.tablaPosiciones)
        .map(([equipoId, stats]) => ({
            equipo: equipos.find(e => e.id === parseInt(equipoId)),
            ...stats
        }))
        .sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));

    return `
        <div class="panel-card" style="margin-top: 20px;">
            <div class="panel-header">
                <h3>Tabla de Posiciones</h3>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Equipo</th>
                            <th title="Partidos Jugados">PJ</th>
                            <th title="Partidos Ganados">PG</th>
                            <th title="Partidos Empatados">PE</th>
                            <th title="Partidos Perdidos">PP</th>
                            <th title="Goles a Favor">GF</th>
                            <th title="Goles en Contra">GC</th>
                            <th title="Diferencia de Goles">DG</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tabla.map((row, index) => `
                            <tr style="${index === 0 ? 'background:#f6f3ff;' : ''}">
                                <td>
                                    <strong style="color:${index === 0 ? 'var(--purple)' : 'var(--text)'};">${index + 1}</strong>
                                </td>
                                <td>
                                    <div class="user-cell">
                                        <div class="user-avatar-sm">${row.equipo?.nombre[0] || '?'}</div>
                                        <strong>${row.equipo?.nombre || 'Desconocido'}</strong>
                                    </div>
                                </td>
                                <td>${row.pj}</td>
                                <td>${row.pg}</td>
                                <td>${row.pe}</td>
                                <td>${row.pp}</td>
                                <td>${row.gf}</td>
                                <td>${row.gc}</td>
                                <td style="color:${row.gf-row.gc > 0 ? '#2d8a4e' : row.gf-row.gc < 0 ? '#c0392b' : 'inherit'};">
                                    ${row.gf - row.gc > 0 ? '+' : ''}${row.gf - row.gc}
                                </td>
                                <td><strong style="color:var(--purple);font-size:1rem;">${row.pts}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ── TORNEO: bracket de eliminación ───────────────────────────────────────────

function renderFixtureTorneo(competencia) {
    if (!competencia.fixture || !competencia.fixture.rondas) return '';

    const equipos = getEquipos();

    return `
        <div class="panel-card">
            <div class="panel-header">
                <h3>Llave del Torneo</h3>
            </div>
            <div style="overflow-x: auto; padding: 20px 0;">
                <div style="display: flex; gap: 30px; min-width: min-content;">
                    ${competencia.fixture.rondas.map(ronda => `
                        <div style="min-width: 230px;">
                            <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 16px; text-align: center; color: var(--purple);">
                                ${ronda.nombre}
                            </h4>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${ronda.partidos.map(partido => {
                                    const local     = equipos.find(e => e.id === partido.equipoLocal);
                                    const visitante = equipos.find(e => e.id === partido.equipoVisitante);
                                    const fin       = partido.estado === 'finalizado';
                                    const res       = partido.resultado;
                                    const winL      = fin && res.golesLocal > res.golesVisitante;
                                    const winV      = fin && res.golesVisitante > res.golesLocal;

                                    return `
                                        <div style="background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);">
                                            ${[
                                                { eq: local,     goles: fin ? res.golesLocal     : null, win: winL },
                                                { eq: visitante, goles: fin ? res.golesVisitante : null, win: winV }
                                            ].map((side, idx) => `
                                                <div style="padding:10px 14px;display:flex;align-items:center;gap:8px;
                                                            ${idx === 0 ? 'border-bottom:1px solid var(--border);' : ''}
                                                            background:${side.win ? '#f0fff4' : 'white'};">
                                                    <div class="user-avatar-sm" style="width:26px;height:26px;font-size:0.68rem;">${side.eq?.nombre[0] || '?'}</div>
                                                    <span style="flex:1;font-size:0.84rem;font-weight:${side.win ? 700 : 500};color:${side.win ? '#2d8a4e' : 'var(--text)'};">
                                                        ${side.eq?.nombre || 'TBD'}
                                                    </span>
                                                    ${fin ? `<strong style="font-size:1rem;color:${side.win ? '#2d8a4e' : 'var(--text-light)'};">${side.goles}</strong>` : ''}
                                                </div>
                                            `).join('')}
                                            ${!fin ? `
                                                <div style="padding:6px 14px;background:#fafafa;text-align:center;">
                                                    <button data-action="registrar-resultado" data-id="${partido.id}" data-competencia-id="${competencia.id}"
                                                            style="background:none;border:none;color:var(--purple);font-size:0.78rem;font-weight:600;cursor:pointer;">
                                                        <i data-lucide="clipboard-check" style="width:12px;height:12px;vertical-align:middle;"></i> Cargar resultado
                                                    </button>
                                                </div>
                                            ` : `
                                                <div style="padding:4px 14px;background:#f0fff4;text-align:center;">
                                                    <button data-action="registrar-resultado" data-id="${partido.id}" data-competencia-id="${competencia.id}"
                                                            style="background:none;border:none;color:#2d8a4e;font-size:0.75rem;cursor:pointer;text-decoration:underline;">
                                                        Editar resultado
                                                    </button>
                                                </div>
                                            `}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// =====================================================
//  TAB 4: PARTIDOS
// =====================================================

function renderPartidosTab() {
    const todos     = getAllPartidosFromFixtures();
    const filtered  = partidosFilter === 'todos'
        ? todos
        : todos.filter(p => p.estado === partidosFilter);

    const jugados   = todos.filter(p => p.estado === 'finalizado').length;
    const pendientes = todos.filter(p => p.estado === 'programado').length;

    return `
        <div class="crud-toolbar">
            <div class="crud-toolbar-left">
                <h2 class="crud-title">Partidos</h2>
                <span class="crud-count">${todos.length}</span>
            </div>
            <div class="crud-toolbar-right">
                <div class="crud-mini-stats">
                    <div class="mini-stat green">
                        <span class="mini-stat-num">${jugados}</span>
                        <span class="mini-stat-label">Jugados</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-num">${pendientes}</span>
                        <span class="mini-stat-label">Pendientes</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- FILTROS -->
        <div style="display:flex;gap:8px;margin-bottom:16px;">
            ${[
                { key: 'todos',      label: 'Todos' },
                { key: 'programado', label: 'Pendientes' },
                { key: 'finalizado', label: 'Jugados' }
            ].map(f => `
                <button data-action="filter-partidos" data-filter="${f.key}"
                        style="padding:6px 16px;border-radius:999px;border:2px solid ${partidosFilter === f.key ? 'var(--purple)' : '#e0e0e0'};
                               background:${partidosFilter === f.key ? 'var(--purple)' : 'white'};
                               color:${partidosFilter === f.key ? 'white' : 'var(--text)'};
                               font-size:0.83rem;font-weight:${partidosFilter === f.key ? 700 : 500};cursor:pointer;transition:all .15s;">
                    ${f.label}
                </button>
            `).join('')}
        </div>

        <div class="panel-card tabla-panel">
            ${filtered.length === 0 ? `
                <div class="tabla-empty">
                    <i data-lucide="calendar-x"></i>
                    <p>${todos.length === 0
                        ? 'No hay partidos generados. Generá un fixture primero.'
                        : 'No hay partidos con este filtro.'
                    }</p>
                    ${todos.length === 0 ? `<button class="link-btn" onclick="switchToTab('fixtures')">Ir a Fixtures</button>` : ''}
                </div>
            ` : `
                <div style="display:flex;flex-direction:column;gap:0;">
                    ${filtered.map((partido, idx) => {
                        const fin = partido.estado === 'finalizado';
                        const res = partido.resultado;
                        const gL  = fin ? res.golesLocal     : null;
                        const gV  = fin ? res.golesVisitante : null;
                        const wL  = fin && gL > gV;
                        const wV  = fin && gV > gL;

                        return `
                            <div style="display:flex;flex-direction:column;gap:6px;padding:14px 18px;
                                        border-bottom:1px solid var(--border);
                                        background:${fin ? '#fafffe' : 'white'};
                                        transition:background .1s;">
                                <!-- META -->
                                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                    <span class="badge ${partido.competenciaTipo === 'liga' ? 'success' : 'warning'}" style="font-size:0.74rem;">${partido.competenciaNombre}</span>
                                    <span style="font-size:0.78rem;color:var(--text-light);">${partido.rondaNombre}</span>
                                    ${partido.fechaHora ? `<span style="font-size:0.78rem;color:var(--text-light);margin-left:auto;"><i data-lucide="clock" style="width:12px;height:12px;vertical-align:middle;"></i> ${formatDateTime(partido.fechaHora)}</span>` : ''}
                                </div>
                                <!-- MARCADOR -->
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <div style="flex:1;display:flex;align-items:center;gap:8px;justify-content:flex-end;flex-direction:row-reverse;">
                                        <div class="user-avatar-sm">${partido.equipoLocalNombre[0]}</div>
                                        <strong style="color:${wL ? '#2d8a4e' : 'var(--text)'};">${partido.equipoLocalNombre}</strong>
                                    </div>
                                    <div style="min-width:90px;text-align:center;">
                                        ${fin
                                            ? `<div style="background:var(--purple);color:white;border-radius:8px;padding:4px 14px;font-size:1rem;font-weight:800;letter-spacing:2px;">${gL} – ${gV}</div>`
                                            : `<div style="background:#f1f3f5;color:var(--text-light);border-radius:8px;padding:4px 14px;font-size:0.85rem;font-weight:700;">VS</div>`
                                        }
                                    </div>
                                    <div style="flex:1;display:flex;align-items:center;gap:8px;">
                                        <div class="user-avatar-sm">${partido.equipoVisitanteNombre[0]}</div>
                                        <strong style="color:${wV ? '#2d8a4e' : 'var(--text)'};">${partido.equipoVisitanteNombre}</strong>
                                    </div>
                                    <!-- ACCIONES -->
                                    <div style="display:flex;align-items:center;gap:8px;margin-left:12px;">
                                        <span class="badge ${fin ? 'success' : 'warning'}" style="font-size:0.72rem;">${fin ? 'Finalizado' : 'Pendiente'}</span>
                                        <button class="action-btn edit" title="${fin ? 'Editar resultado' : 'Cargar resultado'}"
                                                data-action="registrar-resultado"
                                                data-id="${partido.id}"
                                                data-competencia-id="${partido.competenciaId}">
                                            <i data-lucide="clipboard-check"></i>
                                        </button>
                                    </div>
                                </div>
                                ${fin && res.observaciones ? `<div style="font-size:0.78rem;color:var(--text-light);padding-left:4px;font-style:italic;">${res.observaciones}</div>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

// =====================================================
//  MODALES
// =====================================================

function renderModales() {
    return `
        <!-- MODAL: NUEVA/EDITAR COMPETENCIA -->
        <div class="dash-modal-overlay" id="modal-competencia">
            <div class="dash-modal">
                <div class="dash-modal-header">
                    <h3 id="modal-competencia-title">Nueva Competencia</h3>
                    <button class="dash-modal-close" data-close="modal-competencia">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dash-modal-body">
                    <form id="form-competencia">
                        <input type="hidden" id="comp-id">
                        <div class="form-group">
                            <label>Nombre <span class="req">*</span></label>
                            <input type="text" id="comp-nombre" placeholder="Ej: Liga Apertura 2025" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tipo <span class="req">*</span></label>
                                <select id="comp-tipo" required>
                                    <option value="liga">Liga (Round Robin)</option>
                                    <option value="torneo">Torneo (Eliminación)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Estado</label>
                                <select id="comp-estado">
                                    <option value="activo">Activo</option>
                                    <option value="finalizado">Finalizado</option>
                                    <option value="suspendido">Suspendido</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha Inicio <span class="req">*</span></label>
                                <input type="date" id="comp-fecha-inicio" required>
                            </div>
                            <div class="form-group">
                                <label>Fecha Fin <span class="req">*</span></label>
                                <input type="date" id="comp-fecha-fin" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Equipos Inscritos</label>
                            <select id="comp-equipos" multiple style="height: 120px;">
                                ${getEquipos().filter(e => e.estado === 'activo').map(e => `
                                    <option value="${e.id}">${e.nombre}</option>
                                `).join('')}
                            </select>
                            <small style="color: var(--text-light); font-size: 0.8rem;">Mantené Ctrl/Cmd para seleccionar múltiples</small>
                        </div>
                    </form>
                </div>
                <div class="dash-modal-footer">
                    <button class="btn-modal-cancel" data-close="modal-competencia">Cancelar</button>
                    <button class="btn-modal-save" id="btn-guardar-competencia">
                        <i data-lucide="save"></i>
                        Guardar
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL: VER COMPETENCIA -->
        <div class="dash-modal-overlay" id="modal-ver-competencia">
            <div class="dash-modal">
                <div class="dash-modal-header">
                    <h3>Detalles de la Competencia</h3>
                    <button class="dash-modal-close" data-close="modal-ver-competencia">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dash-modal-body" id="ver-comp-content">
                    <!-- Se llena dinámicamente -->
                </div>
                <div class="dash-modal-footer">
                    <button class="btn-modal-cancel" data-close="modal-ver-competencia">Cerrar</button>
                </div>
            </div>
        </div>

        <!-- MODAL: NUEVO/EDITAR EQUIPO -->
        <div class="dash-modal-overlay" id="modal-equipo">
            <div class="dash-modal">
                <div class="dash-modal-header">
                    <h3 id="modal-equipo-title">Nuevo Equipo</h3>
                    <button class="dash-modal-close" data-close="modal-equipo">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dash-modal-body">
                    <form id="form-equipo">
                        <input type="hidden" id="equipo-id">
                        <div class="form-group">
                            <label>Nombre del Equipo <span class="req">*</span></label>
                            <input type="text" id="equipo-nombre" placeholder="Ej: Los Tigres FC" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Capitán <span class="req">*</span></label>
                                <input type="text" id="equipo-capitan" placeholder="Nombre del capitán" required>
                            </div>
                            <div class="form-group">
                                <label>Estado</label>
                                <select id="equipo-estado">
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Integrantes (opcional)</label>
                            <textarea id="equipo-integrantes" rows="4"
                                placeholder="Uno por línea, ej:&#10;Juan Pérez - Delantero&#10;Carlos Gómez - Mediocampista"
                                style="padding: 9px 12px; border: 1px solid var(--border); border-radius: 10px; font-family: 'Inter', sans-serif; width: 100%; resize: vertical;"></textarea>
                            <small style="color: var(--text-light); font-size: 0.8rem;">Formato: Nombre - Posición</small>
                        </div>
                    </form>
                </div>
                <div class="dash-modal-footer">
                    <button class="btn-modal-cancel" data-close="modal-equipo">Cancelar</button>
                    <button class="btn-modal-save" id="btn-guardar-equipo">
                        <i data-lucide="save"></i>
                        Guardar
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL: VER EQUIPO -->
        <div class="dash-modal-overlay" id="modal-ver-equipo">
            <div class="dash-modal">
                <div class="dash-modal-header">
                    <h3>Detalles del Equipo</h3>
                    <button class="dash-modal-close" data-close="modal-ver-equipo">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dash-modal-body" id="ver-equipo-content">
                    <!-- Se llena dinámicamente -->
                </div>
                <div class="dash-modal-footer">
                    <button class="btn-modal-cancel" data-close="modal-ver-equipo">Cerrar</button>
                </div>
            </div>
        </div>

        <!-- MODAL: REGISTRAR RESULTADO -->
        <div class="dash-modal-overlay" id="modal-resultado">
            <div class="dash-modal dash-modal--sm">
                <div class="dash-modal-header">
                    <h3 id="modal-resultado-title">Registrar Resultado</h3>
                    <button class="dash-modal-close" data-close="modal-resultado">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dash-modal-body">
                    <form id="form-resultado">
                        <input type="hidden" id="resultado-partido-id">
                        <input type="hidden" id="resultado-competencia-id">

                        <!-- Marcador visual -->
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:#f8fafc;border-radius:12px;">
                            <div style="flex:1;text-align:center;">
                                <div id="resultado-nombre-local" style="font-weight:700;font-size:0.95rem;margin-bottom:8px;">Local</div>
                                <input type="number" id="resultado-goles-local" min="0" value="0" required
                                       style="width:70px;text-align:center;font-size:1.8rem;font-weight:800;border:2px solid var(--border);border-radius:10px;padding:8px 4px;color:var(--purple);">
                            </div>
                            <div style="font-size:1.4rem;font-weight:800;color:var(--text-light);">–</div>
                            <div style="flex:1;text-align:center;">
                                <div id="resultado-nombre-visitante" style="font-weight:700;font-size:0.95rem;margin-bottom:8px;">Visitante</div>
                                <input type="number" id="resultado-goles-visitante" min="0" value="0" required
                                       style="width:70px;text-align:center;font-size:1.8rem;font-weight:800;border:2px solid var(--border);border-radius:10px;padding:8px 4px;color:var(--purple);">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Observaciones (opcional)</label>
                            <textarea id="resultado-observaciones" rows="2"
                                placeholder="Ej: Partido suspendido en el min 80, victoria por penales..."
                                style="padding: 9px 12px; border: 1px solid var(--border); border-radius: 10px; font-family: 'Inter', sans-serif; width: 100%; resize: vertical;"></textarea>
                        </div>
                    </form>
                </div>
                <div class="dash-modal-footer">
                    <button class="btn-modal-cancel" data-close="modal-resultado">Cancelar</button>
                    <button class="btn-modal-save" id="btn-guardar-resultado">
                        <i data-lucide="check-circle"></i>
                        Guardar Resultado
                    </button>
                </div>
            </div>
        </div>
    `;
}

// =====================================================
//  EVENT LISTENERS
// =====================================================

function attachTabListeners() {
    document.querySelectorAll('.module-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeTab            = tab.dataset.tab;
            selectedCompetencia  = null;
            selectedFechaIndex   = 0;
            partidosFilter       = 'todos';
            refreshTabContent();
        });
    });
}

function attachEventListeners() {
    // Nueva competencia
    const btnNuevaComp  = document.getElementById('btn-nueva-competencia');
    const btnNuevaComp2 = document.getElementById('btn-nueva-competencia-2');
    if (btnNuevaComp)  btnNuevaComp.onclick  = () => openModalCompetencia();
    if (btnNuevaComp2) btnNuevaComp2.onclick = () => openModalCompetencia();

    // Nuevo equipo
    const btnNuevoEquipo  = document.getElementById('btn-nuevo-equipo');
    const btnNuevoEquipo2 = document.getElementById('btn-nuevo-equipo-2');
    if (btnNuevoEquipo)  btnNuevoEquipo.onclick  = () => openModalEquipo();
    if (btnNuevoEquipo2) btnNuevoEquipo2.onclick = () => openModalEquipo();

    // Guardar competencia
    const btnGuardarComp = document.getElementById('btn-guardar-competencia');
    if (btnGuardarComp) btnGuardarComp.onclick = e => { e.preventDefault(); guardarCompetencia(); };

    // Guardar equipo
    const btnGuardarEquipo = document.getElementById('btn-guardar-equipo');
    if (btnGuardarEquipo) btnGuardarEquipo.onclick = e => { e.preventDefault(); guardarEquipo(); };

    // Guardar resultado
    const btnGuardarResultado = document.getElementById('btn-guardar-resultado');
    if (btnGuardarResultado) btnGuardarResultado.onclick = e => { e.preventDefault(); guardarResultado(); };

    // Selector de competencia en fixtures
    const selectorComp = document.getElementById('selector-competencia-fixture');
    if (selectorComp) {
        selectorComp.onchange = e => {
            const competencias  = getCompetencias();
            selectedCompetencia = competencias.find(c => c.id === parseInt(e.target.value));
            selectedFechaIndex  = getDefaultFechaIndex(selectedCompetencia);
            refreshTabContent();
        };
    }

    // Generar fixture
    const btnGenerarFixture = document.getElementById('btn-generar-fixture');
    if (btnGenerarFixture) btnGenerarFixture.onclick = () => generarFixture();

    // Delegación de data-action
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.onclick = e => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id     = parseInt(btn.dataset.id);

            switch (action) {
                case 'ver-comp':
                    verCompetencia(id);
                    break;
                case 'editar-comp':
                    editarCompetencia(id);
                    break;
                case 'eliminar-comp':
                    eliminarCompetencia(id);
                    break;
                case 'ver-equipo':
                    verEquipo(id);
                    break;
                case 'editar-equipo':
                    editarEquipo(id);
                    break;
                case 'eliminar-equipo':
                    eliminarEquipo(id);
                    break;
                case 'registrar-resultado':
                    registrarResultado(btn.dataset.id, parseInt(btn.dataset.competenciaId));
                    break;
                case 'fecha-anterior':
                    selectedFechaIndex = Math.max(0, selectedFechaIndex - 1);
                    refreshTabContent();
                    break;
                case 'fecha-siguiente': {
                    const comp = selectedCompetencia || getCompetencias().filter(c => c.estado === 'activo')[0];
                    const max  = comp?.fixture?.rondas?.length - 1 || 0;
                    selectedFechaIndex = Math.min(max, selectedFechaIndex + 1);
                    refreshTabContent();
                    break;
                }
                case 'ir-fecha':
                    selectedFechaIndex = parseInt(btn.dataset.index);
                    refreshTabContent();
                    break;
                case 'filter-partidos':
                    partidosFilter = btn.dataset.filter;
                    refreshTabContent();
                    break;
            }
        };
    });

    // Cerrar modales
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.onclick = () => closeModal(btn.dataset.close);
    });

    // Cerrar modal al hacer click fuera
    document.querySelectorAll('.dash-modal-overlay').forEach(overlay => {
        overlay.onclick = e => {
            if (e.target === overlay) closeModal(overlay.id);
        };
    });
}

// =====================================================
//  HELPERS: FECHA DEFAULT
// =====================================================

function getDefaultFechaIndex(competencia) {
    if (!competencia?.fixture?.rondas) return 0;
    const rondas = competencia.fixture.rondas;
    const today  = new Date(); today.setHours(0,0,0,0);
    const idx    = rondas.findIndex(r => new Date(r.fechaPartidos + 'T00:00:00') >= today);
    return idx === -1 ? rondas.length - 1 : idx;
}

// =====================================================
//  ACCIONES: COMPETENCIAS
// =====================================================

function openModalCompetencia(competencia = null) {
    const modal = document.getElementById('modal-competencia');
    const title = document.getElementById('modal-competencia-title');

    if (competencia) {
        title.textContent = 'Editar Competencia';
        document.getElementById('comp-id').value           = competencia.id;
        document.getElementById('comp-nombre').value       = competencia.nombre;
        document.getElementById('comp-tipo').value         = competencia.tipo;
        document.getElementById('comp-estado').value       = competencia.estado;
        document.getElementById('comp-fecha-inicio').value = competencia.fechaInicio;
        document.getElementById('comp-fecha-fin').value    = competencia.fechaFin;

        const select = document.getElementById('comp-equipos');
        Array.from(select.options).forEach(opt => {
            opt.selected = competencia.equiposInscritos.includes(parseInt(opt.value));
        });
    } else {
        title.textContent = 'Nueva Competencia';
        document.getElementById('form-competencia').reset();
    }

    modal.classList.add('activo');
    setTimeout(() => reinitLucide(), 50);
}

function guardarCompetencia() {
    const id            = document.getElementById('comp-id').value;
    const nombre        = document.getElementById('comp-nombre').value.trim();
    const tipo          = document.getElementById('comp-tipo').value;
    const estado        = document.getElementById('comp-estado').value;
    const fechaInicio   = document.getElementById('comp-fecha-inicio').value;
    const fechaFin      = document.getElementById('comp-fecha-fin').value;
    const selectEquipos = document.getElementById('comp-equipos');
    const equiposInscritos = Array.from(selectEquipos.selectedOptions).map(opt => parseInt(opt.value));

    if (!nombre || !fechaInicio || !fechaFin) {
        showToast('Completá todos los campos obligatorios', 'error');
        return;
    }

    const competencias = getCompetencias();

    if (id) {
        const index = competencias.findIndex(c => c.id === parseInt(id));
        competencias[index] = {
            ...competencias[index],
            nombre,
            tipo,
            estado,
            fechaInicio,
            fechaFin,
            equiposInscritos,
            formato: tipo === 'liga' ? 'round-robin' : 'eliminacion-directa'
        };
        showToast('Competencia actualizada correctamente', 'success');
    } else {
        const newId    = competencias.length > 0 ? Math.max(...competencias.map(c => c.id)) + 1 : 1;
        competencias.push({
            id: newId,
            nombre,
            tipo,
            formato:   tipo === 'liga' ? 'round-robin' : 'eliminacion-directa',
            fechaInicio,
            fechaFin,
            estado,
            equiposInscritos,
            fixture:   null,
            tablaPosiciones: tipo === 'liga'
                ? equiposInscritos.reduce((acc, eqId) => {
                    acc[eqId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 };
                    return acc;
                }, {})
                : null
        });
        showToast('Competencia creada correctamente', 'success');
    }

    saveCompetencias(competencias);
    closeModal('modal-competencia');
    refreshTabContent();
}

function verCompetencia(id) {
    const competencias = getCompetencias();
    const comp         = competencias.find(c => c.id === id);
    if (!comp) return;

    const equipos         = getEquipos();
    const equiposInscritos = equipos.filter(e => comp.equiposInscritos.includes(e.id));

    // Mini tabla de posiciones
    let miniTabla = '';
    if (comp.tipo === 'liga' && comp.tablaPosiciones && Object.keys(comp.tablaPosiciones).length > 0) {
        const rows = Object.entries(comp.tablaPosiciones)
            .map(([eqId, stats]) => ({ equipo: equipos.find(e => e.id === parseInt(eqId)), ...stats }))
            .sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));

        miniTabla = `
            <div class="detalle-campo detalle-full" style="margin-top:4px;">
                <span class="detalle-label">Posiciones actuales</span>
                <div style="margin-top:8px;display:flex;flex-direction:column;gap:5px;">
                    ${rows.map((row, i) => `
                        <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:${i===0?'#f6f3ff':'white'};border:1px solid var(--border);border-radius:8px;font-size:0.83rem;">
                            <strong style="color:var(--purple);min-width:20px;">${i + 1}</strong>
                            <div class="user-avatar-sm" style="width:22px;height:22px;font-size:0.65rem;">${row.equipo?.nombre[0] || '?'}</div>
                            <span style="flex:1;">${row.equipo?.nombre || 'Desconocido'}</span>
                            <span style="color:var(--text-light);">${row.pj} PJ</span>
                            <span style="color:var(--text-light);">${row.gf}-${row.gc}</span>
                            <strong style="color:var(--purple);min-width:28px;text-align:right;">${row.pts} pts</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Estadísticas de fixture
    let fixtureStats = '';
    if (comp.fixture) {
        const totalP = comp.fixture.rondas.reduce((a, r) => a + r.partidos.length, 0);
        const jugados = comp.fixture.rondas.reduce((a, r) => a + r.partidos.filter(p => p.estado === 'finalizado').length, 0);
        fixtureStats = `${jugados} / ${totalP} partidos jugados`;
    }

    const content = `
        <div class="detalle-avatar">${comp.nombre[0]}</div>
        <div class="detalle-nombre">${comp.nombre}</div>
        <div class="detalle-username">
            <i data-lucide="${comp.tipo === 'liga' ? 'trophy' : 'swords'}"></i>
            <span>${comp.tipo === 'liga' ? 'Liga' : 'Torneo'} · ${comp.formato === 'round-robin' ? 'Todos contra todos' : 'Eliminación directa'}</span>
        </div>

        <div class="detalle-grid">
            <div class="detalle-campo">
                <span class="detalle-label">Fecha Inicio</span>
                <span class="detalle-valor">${formatDate(comp.fechaInicio)}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Fecha Fin</span>
                <span class="detalle-valor">${formatDate(comp.fechaFin)}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Estado</span>
                <span class="badge ${comp.estado === 'activo' ? 'success' : comp.estado === 'finalizado' ? 'danger' : 'warning'}">${comp.estado}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Fixture</span>
                <span class="badge ${comp.fixture ? 'success' : 'warning'}">${comp.fixture ? 'Generado' : 'Pendiente'}</span>
            </div>
            ${fixtureStats ? `
            <div class="detalle-campo detalle-full">
                <span class="detalle-label">Progreso</span>
                <span class="detalle-valor">${fixtureStats}</span>
            </div>
            ` : ''}
            <div class="detalle-campo detalle-full">
                <span class="detalle-label">Equipos inscriptos (${equiposInscritos.length})</span>
                <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;">
                    ${equiposInscritos.length > 0
                        ? equiposInscritos.map(e => `
                            <div style="display:flex;align-items:center;gap:6px;padding:4px 12px;background:white;border:1px solid var(--border);border-radius:20px;font-size:0.83rem;">
                                <div class="user-avatar-sm" style="width:20px;height:20px;font-size:0.62rem;">${e.nombre[0]}</div>
                                ${e.nombre}
                            </div>
                          `).join('')
                        : '<span class="detalle-valor">Sin equipos inscriptos</span>'
                    }
                </div>
            </div>
            ${miniTabla}
        </div>
    `;

    document.getElementById('ver-comp-content').innerHTML = content;
    document.getElementById('modal-ver-competencia').classList.add('activo');
    setTimeout(() => reinitLucide(), 50);
}

function editarCompetencia(id) {
    const comp = getCompetencias().find(c => c.id === id);
    if (comp) openModalCompetencia(comp);
}

function eliminarCompetencia(id) {
    if (!confirm('¿Eliminar esta competencia? Esta acción no se puede deshacer.')) return;
    const competencias = getCompetencias().filter(c => c.id !== id);
    saveCompetencias(competencias);
    showToast('Competencia eliminada', 'success');
    refreshTabContent();
}

// =====================================================
//  ACCIONES: EQUIPOS
// =====================================================

function openModalEquipo(equipo = null) {
    const modal = document.getElementById('modal-equipo');
    const title = document.getElementById('modal-equipo-title');

    if (equipo) {
        title.textContent = 'Editar Equipo';
        document.getElementById('equipo-id').value      = equipo.id;
        document.getElementById('equipo-nombre').value  = equipo.nombre;
        document.getElementById('equipo-capitan').value = equipo.capitan;
        document.getElementById('equipo-estado').value  = equipo.estado;
        document.getElementById('equipo-integrantes').value =
            equipo.integrantes.map(i => `${i.nombre} - ${i.posicion}`).join('\n');
    } else {
        title.textContent = 'Nuevo Equipo';
        document.getElementById('form-equipo').reset();
    }

    modal.classList.add('activo');
    setTimeout(() => reinitLucide(), 50);
}

function guardarEquipo() {
    const id              = document.getElementById('equipo-id').value;
    const nombre          = document.getElementById('equipo-nombre').value.trim();
    const capitan         = document.getElementById('equipo-capitan').value.trim();
    const estado          = document.getElementById('equipo-estado').value;
    const integrantesText = document.getElementById('equipo-integrantes').value.trim();

    if (!nombre || !capitan) {
        showToast('Completá todos los campos obligatorios', 'error');
        return;
    }

    const integrantes = integrantesText
        .split('\n')
        .filter(line => line.trim())
        .map((line, index) => {
            const parts = line.split('-').map(p => p.trim());
            return { id: index + 1, nombre: parts[0] || '', posicion: parts[1] || 'Sin posición' };
        });

    const equipos = getEquipos();

    if (id) {
        const index = equipos.findIndex(e => e.id === parseInt(id));
        equipos[index] = { ...equipos[index], nombre, capitan, estado, integrantes };
        showToast('Equipo actualizado correctamente', 'success');
    } else {
        const newId = equipos.length > 0 ? Math.max(...equipos.map(e => e.id)) + 1 : 1;
        equipos.push({
            id: newId,
            nombre,
            capitan,
            capitanId:     newId,
            integrantes,
            fechaCreacion: new Date().toISOString().split('T')[0],
            estado
        });
        showToast('Equipo creado correctamente', 'success');
    }

    saveEquipos(equipos);
    closeModal('modal-equipo');
    refreshTabContent();
}

function verEquipo(id) {
    const equipo = getEquipos().find(e => e.id === id);
    if (!equipo) return;

    const content = `
        <div class="detalle-avatar">${equipo.nombre[0]}</div>
        <div class="detalle-nombre">${equipo.nombre}</div>
        <div class="detalle-username">
            <i data-lucide="shield"></i>
            <span>Capitán: ${equipo.capitan}</span>
        </div>
        <div class="detalle-grid">
            <div class="detalle-campo">
                <span class="detalle-label">Fecha Creación</span>
                <span class="detalle-valor">${formatDate(equipo.fechaCreacion)}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Estado</span>
                <span class="badge ${equipo.estado === 'activo' ? 'success' : 'danger'}">${equipo.estado}</span>
            </div>
            <div class="detalle-campo detalle-full">
                <span class="detalle-label">Integrantes (${equipo.integrantes.length})</span>
                <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                    ${equipo.integrantes.length > 0
                        ? equipo.integrantes.map(i => `
                            <div style="font-size: 0.85rem; padding: 8px 12px; background: white; border: 1px solid var(--border); border-radius: 8px; display:flex; align-items:center; gap:8px;">
                                <div class="user-avatar-sm" style="width:24px;height:24px;font-size:0.68rem;">${i.nombre[0]}</div>
                                <strong>${i.nombre}</strong>
                                <span style="color:var(--text-light);font-size:0.8rem;">— ${i.posicion}</span>
                            </div>
                          `).join('')
                        : '<span class="detalle-valor">Sin integrantes registrados</span>'
                    }
                </div>
            </div>
        </div>
    `;

    document.getElementById('ver-equipo-content').innerHTML = content;
    document.getElementById('modal-ver-equipo').classList.add('activo');
    setTimeout(() => reinitLucide(), 50);
}

function editarEquipo(id) {
    const equipo = getEquipos().find(e => e.id === id);
    if (equipo) openModalEquipo(equipo);
}

function eliminarEquipo(id) {
    if (!confirm('¿Eliminar este equipo? Esta acción no se puede deshacer.')) return;
    saveEquipos(getEquipos().filter(e => e.id !== id));
    showToast('Equipo eliminado', 'success');
    refreshTabContent();
}

// =====================================================
//  GENERAR FIXTURE
// =====================================================

function generarFixture() {
    const competencias = getCompetencias();
    const selected     = selectedCompetencia || competencias.filter(c => c.estado === 'activo')[0];

    if (!selected) { showToast('No hay competencia seleccionada', 'error'); return; }

    if (selected.equiposInscritos.length < 2) {
        showToast('Se necesitan al menos 2 equipos', 'error');
        return;
    }

    // Advertir si ya hay resultados cargados
    if (selected.fixture) {
        const tieneResultados = selected.fixture.rondas.some(r =>
            r.partidos.some(p => p.estado === 'finalizado')
        );
        const msg = tieneResultados
            ? '⚠️ Ya hay resultados cargados. Regenerar el fixture borrará todos los resultados. ¿Continuar?'
            : '¿Regenerar el fixture? Los partidos actuales serán reemplazados.';
        if (!confirm(msg)) return;
    }

    const equiposIds = [...selected.equiposInscritos];

    if (selected.tipo === 'liga') {
        generarFixtureLiga(selected, equiposIds);
    } else {
        generarFixtureTorneo(selected, equiposIds);
    }

    const index = competencias.findIndex(c => c.id === selected.id);
    competencias[index] = selected;
    saveCompetencias(competencias);

    // Actualizar la referencia en selectedCompetencia
    if (selectedCompetencia) selectedCompetencia = competencias[index];

    // Posicionar en la fecha más próxima
    selectedFechaIndex = getDefaultFechaIndex(competencias[index]);

    showToast('Fixture generado correctamente', 'success');
    refreshTabContent();
}

function generarFixtureLiga(competencia, equiposIds) {
    const numEquipos = equiposIds.length;
    const rondas     = [];
    let ids          = [...equiposIds];
    const fechaBase  = new Date(competencia.fechaInicio + 'T18:00:00');

    for (let fecha = 0; fecha < numEquipos - 1; fecha++) {
        const partidos    = [];
        const fechaRonda  = new Date(fechaBase.getTime() + fecha * 7 * 24 * 60 * 60 * 1000);

        for (let i = 0; i < Math.floor(numEquipos / 2); i++) {
            const local     = ids[i];
            const visitante = ids[numEquipos - 1 - i];

            if (local !== undefined && visitante !== undefined && local !== visitante) {
                const horaPartido = new Date(fechaRonda.getTime() + i * 2 * 60 * 60 * 1000);
                partidos.push({
                    id:              `${competencia.id}-f${fecha + 1}-p${i}`,
                    equipoLocal:     local,
                    equipoVisitante: visitante,
                    estado:          'programado',
                    fechaHora:       horaPartido.toISOString(),
                    resultado:       null
                });
            }
        }

        rondas.push({
            numero:        fecha + 1,
            nombre:        `Fecha ${fecha + 1}`,
            fechaPartidos: fechaRonda.toISOString().split('T')[0],
            partidos
        });

        // Rotar equipos (el primero queda fijo — algoritmo de Berger)
        ids.splice(1, 0, ids.pop());
    }

    competencia.fixture = {
        id:              competencia.id,
        fechaGeneracion: new Date().toISOString(),
        rondas
    };

    // Reiniciar tabla de posiciones
    competencia.tablaPosiciones = competencia.equiposInscritos.reduce((acc, eqId) => {
        acc[eqId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 };
        return acc;
    }, {});
}

function generarFixtureTorneo(competencia, equiposIds) {
    const numEquipos    = equiposIds.length;
    const numRondas     = Math.ceil(Math.log2(numEquipos));
    const rondas        = [];
    let equiposActuales = [...equiposIds];
    const fechaBase     = new Date(competencia.fechaInicio + 'T18:00:00');
    const nombresRondas = ['Final', 'Semifinal', 'Cuartos de Final', 'Octavos de Final', 'Dieciseisavos'];

    for (let r = 0; r < numRondas; r++) {
        const partidos   = [];
        const fechaRonda = new Date(fechaBase.getTime() + r * 7 * 24 * 60 * 60 * 1000);

        for (let i = 0; i < equiposActuales.length; i += 2) {
            if (equiposActuales[i + 1] !== undefined) {
                partidos.push({
                    id:              `${competencia.id}-r${r + 1}-p${Math.floor(i / 2)}`,
                    equipoLocal:     equiposActuales[i],
                    equipoVisitante: equiposActuales[i + 1],
                    estado:          'programado',
                    fechaHora:       fechaRonda.toISOString(),
                    resultado:       null
                });
            }
        }

        const nombreRonda = nombresRondas[numRondas - r - 1] || `Ronda ${r + 1}`;
        rondas.push({
            numero:        r + 1,
            nombre:        nombreRonda,
            fechaPartidos: fechaRonda.toISOString().split('T')[0],
            partidos
        });

        equiposActuales = equiposActuales.slice(0, Math.ceil(equiposActuales.length / 2));
    }

    competencia.fixture = {
        id:              competencia.id,
        fechaGeneracion: new Date().toISOString(),
        rondas
    };
}

// =====================================================
//  RESULTADOS
// =====================================================

function registrarResultado(partidoId, competenciaId) {
    const competencias = getCompetencias();
    const comp         = competencias.find(c => c.id === competenciaId);
    if (!comp?.fixture) { showToast('No se encontró el partido', 'error'); return; }

    let targetPartido = null;
    let targetRonda   = null;

    for (const ronda of comp.fixture.rondas) {
        const p = ronda.partidos.find(p => p.id === partidoId);
        if (p) { targetPartido = p; targetRonda = ronda; break; }
    }

    if (!targetPartido) { showToast('Partido no encontrado', 'error'); return; }

    const equipos   = getEquipos();
    const local     = equipos.find(e => e.id === targetPartido.equipoLocal);
    const visitante = equipos.find(e => e.id === targetPartido.equipoVisitante);

    currentResultadoCtx = { competenciaId, rondaNumero: targetRonda.numero, partidoId };

    document.getElementById('modal-resultado-title').textContent =
        targetPartido.estado === 'finalizado' ? 'Editar Resultado' : 'Registrar Resultado';
    document.getElementById('resultado-partido-id').value    = partidoId;
    document.getElementById('resultado-competencia-id').value = competenciaId;
    document.getElementById('resultado-nombre-local').textContent    = local?.nombre    || 'Local';
    document.getElementById('resultado-nombre-visitante').textContent = visitante?.nombre || 'Visitante';

    const res = targetPartido.resultado;
    document.getElementById('resultado-goles-local').value      = res ? res.golesLocal     : 0;
    document.getElementById('resultado-goles-visitante').value  = res ? res.golesVisitante : 0;
    document.getElementById('resultado-observaciones').value    = res ? (res.observaciones || '') : '';

    document.getElementById('modal-resultado').classList.add('activo');
    setTimeout(() => reinitLucide(), 50);
}

function guardarResultado() {
    if (!currentResultadoCtx) return;

    const golesLocal     = parseInt(document.getElementById('resultado-goles-local').value)     || 0;
    const golesVisitante = parseInt(document.getElementById('resultado-goles-visitante').value) || 0;
    const observaciones  = document.getElementById('resultado-observaciones').value.trim();

    const { competenciaId, rondaNumero, partidoId } = currentResultadoCtx;
    const competencias = getCompetencias();
    const compIndex    = competencias.findIndex(c => c.id === competenciaId);
    if (compIndex === -1) return;

    const comp   = competencias[compIndex];
    const ronda  = comp.fixture.rondas.find(r => r.numero === rondaNumero);
    const partido = ronda?.partidos.find(p => p.id === partidoId);
    if (!partido) return;

    const yaFinalizado = partido.estado === 'finalizado';
    const resAnterior  = partido.resultado;

    // Si ya había resultado, revertir los stats de tabla antes de aplicar el nuevo
    if (yaFinalizado && resAnterior && comp.tipo === 'liga' && comp.tablaPosiciones) {
        revertirEstadistica(comp, partido.equipoLocal, partido.equipoVisitante, resAnterior);
    }

    partido.estado    = 'finalizado';
    partido.resultado = { golesLocal, golesVisitante, observaciones };

    // Actualizar tabla de posiciones si es liga
    if (comp.tipo === 'liga') {
        if (!comp.tablaPosiciones) comp.tablaPosiciones = {};
        aplicarEstadistica(comp, partido.equipoLocal, partido.equipoVisitante, golesLocal, golesVisitante);
    }

    competencias[compIndex] = comp;
    saveCompetencias(competencias);

    // Sincronizar selectedCompetencia si corresponde
    if (selectedCompetencia?.id === competenciaId) {
        selectedCompetencia = comp;
    }

    currentResultadoCtx = null;
    closeModal('modal-resultado');
    showToast('Resultado guardado correctamente', 'success');
    refreshTabContent();
}

function aplicarEstadistica(comp, localId, visitanteId, gL, gV) {
    const kL = String(localId);
    const kV = String(visitanteId);
    const zero = () => ({ pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 });

    if (!comp.tablaPosiciones[kL]) comp.tablaPosiciones[kL] = zero();
    if (!comp.tablaPosiciones[kV]) comp.tablaPosiciones[kV] = zero();

    comp.tablaPosiciones[kL].pj++;
    comp.tablaPosiciones[kV].pj++;
    comp.tablaPosiciones[kL].gf += gL;
    comp.tablaPosiciones[kL].gc += gV;
    comp.tablaPosiciones[kV].gf += gV;
    comp.tablaPosiciones[kV].gc += gL;

    if (gL > gV) {
        comp.tablaPosiciones[kL].pg++;
        comp.tablaPosiciones[kL].pts += 3;
        comp.tablaPosiciones[kV].pp++;
    } else if (gV > gL) {
        comp.tablaPosiciones[kV].pg++;
        comp.tablaPosiciones[kV].pts += 3;
        comp.tablaPosiciones[kL].pp++;
    } else {
        comp.tablaPosiciones[kL].pe++;
        comp.tablaPosiciones[kL].pts++;
        comp.tablaPosiciones[kV].pe++;
        comp.tablaPosiciones[kV].pts++;
    }
}

function revertirEstadistica(comp, localId, visitanteId, res) {
    const kL = String(localId);
    const kV = String(visitanteId);
    const { golesLocal: gL, golesVisitante: gV } = res;

    if (!comp.tablaPosiciones[kL] || !comp.tablaPosiciones[kV]) return;

    comp.tablaPosiciones[kL].pj--;
    comp.tablaPosiciones[kV].pj--;
    comp.tablaPosiciones[kL].gf -= gL;
    comp.tablaPosiciones[kL].gc -= gV;
    comp.tablaPosiciones[kV].gf -= gV;
    comp.tablaPosiciones[kV].gc -= gL;

    if (gL > gV) {
        comp.tablaPosiciones[kL].pg--;
        comp.tablaPosiciones[kL].pts -= 3;
        comp.tablaPosiciones[kV].pp--;
    } else if (gV > gL) {
        comp.tablaPosiciones[kV].pg--;
        comp.tablaPosiciones[kV].pts -= 3;
        comp.tablaPosiciones[kL].pp--;
    } else {
        comp.tablaPosiciones[kL].pe--;
        comp.tablaPosiciones[kL].pts--;
        comp.tablaPosiciones[kV].pe--;
        comp.tablaPosiciones[kV].pts--;
    }
}

// =====================================================
//  HELPERS GENERALES
// =====================================================

function refreshTabContent() {
    const container = document.getElementById('torneos-tab-content');
    if (container) {
        container.innerHTML = renderTabContent();
        attachEventListeners();
        reinitLucide();
    }
}

function switchToTab(tabName) {
    activeTab           = tabName;
    selectedCompetencia = null;
    selectedFechaIndex  = 0;
    partidosFilter      = 'todos';
    refreshTabContent();
    document.querySelectorAll('.module-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
}
window.switchToTab = switchToTab;

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('activo');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast     = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon      = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    reinitLucide();
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id    = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '-';
    return new Date(dateTimeStr).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function reinitLucide() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =====================================================
//  REGISTRAR MÓDULO
// =====================================================

registerModule('torneos', { render, init });