// =====================================================
//  MÓDULO: Gestión de Canchas — RF11 al RF18
//  Entidades: Cancha, TipoCancha, Disponibilidad
// =====================================================

const CanchasView = (() => {

    // =====================================================
    //  DATOS MOCK (se reemplaza por fetch al backend)
    // =====================================================

    let tiposCanchas = [
        { id: 1, nombre: 'Fútbol 5',    superficie: 'Césped sintético', capacidadJugadores: 10, duracionMaxReservaMin: 60,  precioHora: 15000, descripcion: 'Cancha pequeña ideal para grupos reducidos.' },
        { id: 2, nombre: 'Fútbol 7',    superficie: 'Césped natural',   capacidadJugadores: 14, duracionMaxReservaMin: 90,  precioHora: 22000, descripcion: 'Formato intermedio, muy popular en torneos.' },
        { id: 3, nombre: 'Fútbol 11',   superficie: 'Tierra',           capacidadJugadores: 22, duracionMaxReservaMin: 120, precioHora: 35000, descripcion: 'Cancha reglamentaria para partidos completos.' },
        { id: 4, nombre: 'Paddle',      superficie: 'Cristal y césped', capacidadJugadores: 4,  duracionMaxReservaMin: 60,  precioHora: 12000, descripcion: 'Canchas de paddle cubiertas y ventiladas.' },
    ];
    let nextTipoId = 5;

    let canchas = [
        { id: 1, numero: 1, nombre: 'Cancha 1',  idTipo: 1, estado: 'activa',    descripcion: 'Ubicada en sector norte, iluminación LED.', imagen: '' },
        { id: 2, numero: 2, nombre: 'Cancha 2',  idTipo: 1, estado: 'activa',    descripcion: 'Sector sur, vestuarios propios.',            imagen: '' },
        { id: 3, numero: 3, nombre: 'Cancha 3',  idTipo: 2, estado: 'activa',    descripcion: 'Vista panorámica, ideal para torneos.',      imagen: '' },
        { id: 4, numero: 4, nombre: 'Cancha 4',  idTipo: 2, estado: 'inactiva',  descripcion: 'En mantenimiento por renovación de césped.',  imagen: '' },
        { id: 5, numero: 5, nombre: 'Cancha 5',  idTipo: 3, estado: 'activa',    descripcion: 'La más grande del complejo.',                imagen: '' },
        { id: 6, numero: 6, nombre: 'Cancha 6',  idTipo: 4, estado: 'activa',    descripcion: 'Paddle cubierta, techada y climatizada.',    imagen: '' },
    ];
    let nextCanchaId = 7;

    const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    let disponibilidades = [
        // Cancha 1 - Fútbol 5
        { id:  1, idCancha: 1, diaSemana: 'Lunes',     horaInicio: 8,  horaFin: 23, disponible: true  },
        { id:  2, idCancha: 1, diaSemana: 'Martes',    horaInicio: 8,  horaFin: 23, disponible: true  },
        { id:  3, idCancha: 1, diaSemana: 'Miércoles', horaInicio: 8,  horaFin: 23, disponible: true  },
        { id:  4, idCancha: 1, diaSemana: 'Jueves',    horaInicio: 8,  horaFin: 23, disponible: true  },
        { id:  5, idCancha: 1, diaSemana: 'Viernes',   horaInicio: 8,  horaFin: 23, disponible: true  },
        { id:  6, idCancha: 1, diaSemana: 'Sábado',    horaInicio: 9,  horaFin: 22, disponible: true  },
        { id:  7, idCancha: 1, diaSemana: 'Domingo',   horaInicio: 10, horaFin: 20, disponible: false },
        // Cancha 2 - Fútbol 5
        { id:  8, idCancha: 2, diaSemana: 'Lunes',     horaInicio: 8,  horaFin: 22, disponible: true  },
        { id:  9, idCancha: 2, diaSemana: 'Viernes',   horaInicio: 8,  horaFin: 22, disponible: true  },
        { id: 10, idCancha: 2, diaSemana: 'Sábado',    horaInicio: 10, horaFin: 18, disponible: false },
        // Cancha 3 - Fútbol 7
        { id: 11, idCancha: 3, diaSemana: 'Miércoles', horaInicio: 9,  horaFin: 21, disponible: true  },
        { id: 12, idCancha: 3, diaSemana: 'Sábado',    horaInicio: 9,  horaFin: 21, disponible: true  },
        { id: 13, idCancha: 3, diaSemana: 'Domingo',   horaInicio: 10, horaFin: 20, disponible: true  },
        // Cancha 6 - Paddle
        { id: 14, idCancha: 6, diaSemana: 'Lunes',     horaInicio: 7,  horaFin: 22, disponible: true  },
        { id: 15, idCancha: 6, diaSemana: 'Martes',    horaInicio: 7,  horaFin: 22, disponible: true  },
        { id: 16, idCancha: 6, diaSemana: 'Sábado',    horaInicio: 8,  horaFin: 20, disponible: true  },
    ];
    let nextDispId = 17;

    // =====================================================
    //  ESTADO DE UI
    // =====================================================

    let tabActivo    = 'canchas';      // 'canchas' | 'tipos' | 'disponibilidad'
    let filtroCanchas = '';
    let filtroTipos   = '';
    let canchaSelDispId = canchas.find(c => c.estado === 'activa')?.id || 1;
    let bajaTargetCanchaId = null;
    let bajaTargetTipoId = null;

    // =====================================================
    //  RENDER PRINCIPAL
    // =====================================================

    function render() {
        return `
            <div class="canchas-module">

                <div class="module-tabs">
                    <button class="module-tab ${tabActivo === 'canchas'       ? 'active' : ''}" data-tab="canchas">
                        <i data-lucide="goal"></i> Canchas
                    </button>
                    <button class="module-tab ${tabActivo === 'tipos'         ? 'active' : ''}" data-tab="tipos">
                        <i data-lucide="layers"></i> Tipos de Cancha
                    </button>
                    <button class="module-tab ${tabActivo === 'disponibilidad'? 'active' : ''}" data-tab="disponibilidad">
                        <i data-lucide="calendar-clock"></i> Disponibilidad
                    </button>
                </div>

                <div id="tab-content">
                    ${renderTabContent()}
                </div>

                ${renderModalCancha()}
                ${renderModalDetalleCancha()}
                ${renderModalBajaCancha()}
                ${renderModalTipo()}
                ${renderModalDetalleTipo()}
                ${renderModalBajaTipo()}
                ${renderModalDisponibilidad()}
            </div>
        `;
    }

    function renderTabContent() {
        if (tabActivo === 'canchas')        return renderTabCanchas();
        if (tabActivo === 'tipos')          return renderTabTipos();
        if (tabActivo === 'disponibilidad') return renderTabDisponibilidad();
        return '';
    }

    // =====================================================
    //  TAB: CANCHAS
    // =====================================================

    function renderTabCanchas() {
        const activas   = canchas.filter(c => c.estado === 'activa').length;
        const inactivas = canchas.filter(c => c.estado === 'inactiva').length;

        return `
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Canchas</h2>
                    <span class="crud-count">${canchas.length} registradas</span>
                </div>
                <div class="crud-toolbar-right">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-canchas" placeholder="Buscar por nombre o tipo…"
                               value="${filtroCanchas}" autocomplete="off">
                    </div>
                    <button class="btn-primary-action" id="btn-nueva-cancha">
                        <i data-lucide="plus"></i> Nueva cancha
                    </button>
                </div>
            </div>

            <div class="crud-mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-num">${canchas.length}</span>
                    <span class="mini-stat-label">Total</span>
                </div>
                <div class="mini-stat green">
                    <span class="mini-stat-num">${activas}</span>
                    <span class="mini-stat-label">Activas</span>
                </div>
                <div class="mini-stat red">
                    <span class="mini-stat-num">${inactivas}</span>
                    <span class="mini-stat-label">Inactivas</span>
                </div>
            </div>

            <div class="panel-card tabla-panel">
                <div class="table-wrapper" id="tabla-canchas-container">
                    ${renderTablaCanchas()}
                </div>
            </div>
        `;
    }

    function renderTablaCanchas() {
        const lista = canchasFiltradas();

        if (lista.length === 0) {
            return `
                <div class="tabla-empty">
                    <i data-lucide="search-x"></i>
                    <p>No se encontraron canchas${filtroCanchas ? ' con ese criterio' : ''}.</p>
                    ${filtroCanchas ? `<button class="link-btn" id="btn-limpiar-filtro-canchas">Limpiar búsqueda</button>` : ''}
                </div>
            `;
        }

        const filas = lista.map(c => {
            const tipo = tiposCanchas.find(t => t.id === c.idTipo);
            return `
                <tr>
                    <td>
                        <div class="user-cell">
                            <div class="cancha-num-badge">${c.numero}</div>
                            <div class="user-cell-info">
                                <strong>${c.nombre}</strong>
                                <span>${tipo?.nombre || '—'}</span>
                            </div>
                        </div>
                    </td>
                    <td>${tipo?.superficie || '—'}</td>
                    <td><span class="badge info">${tipo?.capacidadJugadores || '—'} jug.</span></td>
                    <td>${tipo ? '$' + tipo.precioHora.toLocaleString('es-AR') + '/h' : '—'}</td>
                    <td>${badgeEstado(c.estado)}</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn view"   title="Ver detalle" data-id="${c.id}" data-action="ver-cancha">
                                <i data-lucide="eye"></i>
                            </button>
                            <button class="action-btn edit"   title="Editar"      data-id="${c.id}" data-action="editar-cancha">
                                <i data-lucide="pencil"></i>
                            </button>
                            <button class="action-btn view"   title="Ver disponibilidad" data-id="${c.id}" data-action="ver-disp-cancha" style="background:var(--clr-purple-soft,#ede9fe);color:var(--clr-purple,#7c3aed)">
                                <i data-lucide="calendar-clock"></i>
                            </button>
                            <button class="action-btn toggle" title="${c.estado === 'activa' ? 'Dar de baja' : 'Reactivar'}"
                                    data-id="${c.id}" data-action="baja-cancha">
                                <i data-lucide="${c.estado === 'activa' ? 'x-circle' : 'check-circle'}"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <table>
                <thead>
                    <tr>
                        <th>Cancha</th>
                        <th>Superficie</th>
                        <th>Capacidad</th>
                        <th>Precio/h</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
    }

    // =====================================================
    //  TAB: TIPOS DE CANCHA
    // =====================================================

    function renderTabTipos() {
        return `
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Tipos de Cancha</h2>
                    <span class="crud-count">${tiposCanchas.length} tipos</span>
                </div>
                <div class="crud-toolbar-right">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-tipos" placeholder="Buscar tipo…"
                               value="${filtroTipos}" autocomplete="off">
                    </div>
                    <button class="btn-primary-action" id="btn-nuevo-tipo">
                        <i data-lucide="plus"></i> Nuevo tipo
                    </button>
                </div>
            </div>

            <div class="panel-card tabla-panel">
                <div class="table-wrapper" id="tabla-tipos-container">
                    ${renderTablaTipos()}
                </div>
            </div>
        `;
    }

    function renderTablaTipos() {
        const lista = tiposFiltrados();

        if (lista.length === 0) {
            return `
                <div class="tabla-empty">
                    <i data-lucide="search-x"></i>
                    <p>No se encontraron tipos${filtroTipos ? ' con ese criterio' : ''}.</p>
                </div>
            `;
        }

        const filas = lista.map(t => {
            const uso = canchas.filter(c => c.idTipo === t.id).length;
            return `
                <tr>
                    <td><strong>${t.nombre}</strong></td>
                    <td>${t.superficie}</td>
                    <td>${t.capacidadJugadores}</td>
                    <td>${t.duracionMaxReservaMin} min</td>
                    <td>$${t.precioHora.toLocaleString('es-AR')}</td>
                    <td><span class="badge ${uso > 0 ? 'info' : 'neutral'}">${uso} cancha${uso !== 1 ? 's' : ''}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn view" title="Ver detalle" data-id="${t.id}" data-action="ver-tipo">
                                <i data-lucide="eye"></i>
                            </button>
                            <button class="action-btn edit" title="Editar" data-id="${t.id}" data-action="editar-tipo">
                                <i data-lucide="pencil"></i>
                            </button>
                            <button class="action-btn delete" title="Eliminar" data-id="${t.id}" data-action="baja-tipo">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Superficie</th>
                        <th>Jugadores</th>
                        <th>Duración máx.</th>
                        <th>Precio/hora</th>
                        <th>En uso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
    }

    // =====================================================
    //  TAB: DISPONIBILIDAD
    // =====================================================

    function renderTabDisponibilidad() {
        const canchasActivas = canchas.filter(c => c.estado === 'activa');
        const cancha = canchas.find(c => c.id === canchaSelDispId) || canchasActivas[0];
        const tipo   = cancha ? tiposCanchas.find(t => t.id === cancha.idTipo) : null;
        const disps  = disponibilidades.filter(d => d.idCancha === cancha?.id);

        const disponiblesCount = disps.filter(d => d.disponible).length;
        const bloqueadasCount  = disps.filter(d => !d.disponible).length;

        return `
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Disponibilidad de Canchas</h2>
                </div>
                <div class="crud-toolbar-right">
                    <button class="btn-primary-action" id="btn-nueva-disp">
                        <i data-lucide="plus"></i> Agregar franja
                    </button>
                </div>
            </div>

            <div class="disp-layout">

                <aside class="cancha-selector">
                    <p class="cancha-selector-title">Seleccionar cancha</p>
                    ${canchasActivas.map(c => {
                        const t = tiposCanchas.find(t => t.id === c.idTipo);
                        return `
                            <button class="cancha-selector-item ${c.id === cancha?.id ? 'selected' : ''}"
                                    data-id="${c.id}" data-action="sel-cancha-disp">
                                <span class="cancha-num-badge sm">${c.numero}</span>
                                <div>
                                    <strong>${c.nombre}</strong>
                                    <span>${t?.nombre || ''}</span>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </aside>

                <div class="disp-main" id="disp-main-panel">
                    ${renderDispMain(cancha, tipo, disps, disponiblesCount, bloqueadasCount)}
                </div>
            </div>
        `;
    }

    function renderDispMain(cancha, tipo, disps, disponiblesCount, bloqueadasCount) {
        if (!cancha) return `<div class="tabla-empty"><p>No hay canchas activas.</p></div>`;

        return `
            <div class="cancha-info-banner">
                <div class="cancha-info-left">
                    <div class="cancha-num-badge lg">${cancha.numero}</div>
                    <div>
                        <h3>${cancha.nombre}</h3>
                        <p>${tipo?.nombre || '—'} · ${tipo?.superficie || '—'} · ${tipo?.capacidadJugadores || '—'} jugadores</p>
                    </div>
                </div>
                <div class="cancha-info-stats">
                    <span class="mini-stat-inline green">${disponiblesCount} franjas habilitadas</span>
                    <span class="mini-stat-inline red">${bloqueadasCount} bloqueadas</span>
                </div>
            </div>

            <div class="disp-grid-semana" id="disp-semana-grid">
                ${renderSemanaGrid(cancha, disps)}
            </div>
        `;
    }

    function renderSemanaGrid(cancha, disps) {
        return DIAS.map(dia => {
            const franjas = disps.filter(d => d.diaSemana === dia);
            return `
                <div class="disp-dia-card">
                    <div class="disp-dia-header">
                        <span class="disp-dia-nombre">${dia}</span>
                        <span class="disp-dia-count">${franjas.length} franja${franjas.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="disp-dia-franjas">
                        ${franjas.length === 0
                            ? `<span class="disp-sin-franja">Sin franjas configuradas</span>`
                            : franjas.map(f => `
                                <div class="disp-franja ${f.disponible ? 'habilitada' : 'bloqueada'}">
                                    <span class="disp-franja-hora">
                                        <i data-lucide="clock"></i>
                                        ${padHora(f.horaInicio)}:00 – ${padHora(f.horaFin)}:00
                                    </span>
                                    <div class="disp-franja-actions">
                                        <button class="disp-toggle-btn ${f.disponible ? 'deshabilitar' : 'habilitar'}"
                                                title="${f.disponible ? 'Bloquear' : 'Habilitar'}"
                                                data-id="${f.id}" data-action="toggle-disp">
                                            <i data-lucide="${f.disponible ? 'eye-off' : 'eye'}"></i>
                                        </button>
                                        <button class="disp-toggle-btn edit"
                                                title="Editar franja"
                                                data-id="${f.id}" data-action="editar-disp">
                                            <i data-lucide="pencil"></i>
                                        </button>
                                        <button class="disp-toggle-btn delete"
                                                title="Eliminar franja"
                                                data-id="${f.id}" data-action="eliminar-disp">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    // =====================================================
    //  MODALES: CANCHA
    // =====================================================

    function renderModalCancha() {
        const opcionesTipo = tiposCanchas.map(t =>
            `<option value="${t.id}">${t.nombre}</option>`
        ).join('');
        return `
            <div class="dash-modal-overlay" id="modal-cancha" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-cancha-titulo">Nueva cancha</h3>
                        <button class="dash-modal-close" id="cerrar-modal-cancha"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-cancha" novalidate>
                            <input type="hidden" id="fc-id">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fc-numero">Número <span class="req">*</span></label>
                                    <input type="number" id="fc-numero" min="1" placeholder="1">
                                    <span class="form-error" id="err-fc-numero"></span>
                                </div>
                                <div class="form-group">
                                    <label for="fc-nombre">Nombre <span class="req">*</span></label>
                                    <input type="text" id="fc-nombre" placeholder="Ej: Cancha Norte">
                                    <span class="form-error" id="err-fc-nombre"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="fc-tipo">Tipo de cancha <span class="req">*</span></label>
                                <select id="fc-tipo">
                                    <option value="">— Seleccionar tipo —</option>
                                    ${opcionesTipo}
                                </select>
                                <span class="form-error" id="err-fc-tipo"></span>
                            </div>
                            <div class="form-group">
                                <label for="fc-descripcion">Descripción</label>
                                <textarea id="fc-descripcion" rows="3" placeholder="Características adicionales…"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cancelar-modal-cancha">Cancelar</button>
                        <button class="btn-primary" id="guardar-cancha">Guardar</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalDetalleCancha() {
        return `
            <div class="dash-modal-overlay" id="modal-detalle-cancha" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3>Detalle de cancha</h3>
                        <button class="dash-modal-close" id="cerrar-detalle-cancha"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body" id="detalle-cancha-body">
                        </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cerrar-detalle-cancha-2">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalBajaCancha() {
        return `
            <div class="dash-modal-overlay" id="modal-baja-cancha" role="dialog" aria-modal="true">
                <div class="dash-modal dash-modal--sm">
                    <div class="dash-modal-header">
                        <h3 id="modal-baja-cancha-titulo">Dar de baja</h3>
                        <button class="dash-modal-close" id="cerrar-modal-baja-cancha"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body">
                        <p id="modal-baja-cancha-msg"></p>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cancelar-baja-cancha">Cancelar</button>
                        <button class="btn-danger" id="confirmar-baja-cancha">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  MODALES: TIPO DE CANCHA
    // =====================================================

    function renderModalTipo() {
        return `
            <div class="dash-modal-overlay" id="modal-tipo" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-tipo-titulo">Nuevo tipo de cancha</h3>
                        <button class="dash-modal-close" id="cerrar-modal-tipo"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-tipo" novalidate>
                            <input type="hidden" id="ft-id">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="ft-nombre">Nombre <span class="req">*</span></label>
                                    <input type="text" id="ft-nombre" placeholder="Ej: Fútbol 5">
                                    <span class="form-error" id="err-ft-nombre"></span>
                                </div>
                                <div class="form-group">
                                    <label for="ft-superficie">Superficie <span class="req">*</span></label>
                                    <input type="text" id="ft-superficie" placeholder="Ej: Césped sintético">
                                    <span class="form-error" id="err-ft-superficie"></span>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="ft-capacidad">Jugadores (total) <span class="req">*</span></label>
                                    <input type="number" id="ft-capacidad" min="2" max="50" placeholder="10">
                                    <span class="form-error" id="err-ft-capacidad"></span>
                                </div>
                                <div class="form-group">
                                    <label for="ft-duracion">Duración máx. reserva (min) <span class="req">*</span></label>
                                    <input type="number" id="ft-duracion" min="30" step="30" placeholder="60">
                                    <span class="form-error" id="err-ft-duracion"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="ft-precio">Precio por hora ($) <span class="req">*</span></label>
                                <input type="number" id="ft-precio" min="0" step="500" placeholder="15000">
                                <span class="form-error" id="err-ft-precio"></span>
                            </div>
                            <div class="form-group">
                                <label for="ft-descripcion">Descripción</label>
                                <textarea id="ft-descripcion" rows="2" placeholder="Descripción del tipo de cancha…"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cancelar-modal-tipo">Cancelar</button>
                        <button class="btn-primary" id="guardar-tipo">Guardar</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalDetalleTipo() {
        return `
            <div class="dash-modal-overlay" id="modal-detalle-tipo" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3>Detalle del tipo</h3>
                        <button class="dash-modal-close" id="cerrar-detalle-tipo"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body" id="detalle-tipo-body"></div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cerrar-detalle-tipo-2">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalBajaTipo() {
        return `
            <div class="dash-modal-overlay" id="modal-baja-tipo" role="dialog" aria-modal="true">
                <div class="dash-modal dash-modal--sm">
                    <div class="dash-modal-header">
                        <h3>Eliminar tipo</h3>
                        <button class="dash-modal-close" id="cerrar-modal-baja-tipo"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body">
                        <p id="modal-baja-tipo-msg"></p>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cancelar-baja-tipo">Cancelar</button>
                        <button class="btn-danger" id="confirmar-baja-tipo">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  MODAL: DISPONIBILIDAD
    // =====================================================

    function renderModalDisponibilidad() {
        const opcionesCancha = canchas.filter(c => c.estado === 'activa').map(c =>
            `<option value="${c.id}">${c.nombre}</option>`
        ).join('');
        const opcionesDia = DIAS.map(d =>
            `<option value="${d}">${d}</option>`
        ).join('');
        const opcionesHora = Array.from({length: 24}, (_, i) =>
            `<option value="${i}">${padHora(i)}:00</option>`
        ).join('');

        return `
            <div class="dash-modal-overlay" id="modal-disp" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-disp-titulo">Nueva franja horaria</h3>
                        <button class="dash-modal-close" id="cerrar-modal-disp"><i data-lucide="x"></i></button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-disp" novalidate>
                            <input type="hidden" id="fd-id">
                            <div class="form-group">
                                <label for="fd-cancha">Cancha <span class="req">*</span></label>
                                <select id="fd-cancha">
                                    <option value="">— Seleccionar —</option>
                                    ${opcionesCancha}
                                </select>
                                <span class="form-error" id="err-fd-cancha"></span>
                            </div>
                            <div class="form-group">
                                <label for="fd-dia">Día de la semana <span class="req">*</span></label>
                                <select id="fd-dia">
                                    <option value="">— Seleccionar —</option>
                                    ${opcionesDia}
                                </select>
                                <span class="form-error" id="err-fd-dia"></span>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fd-inicio">Hora inicio <span class="req">*</span></label>
                                    <select id="fd-inicio">${opcionesHora}</select>
                                    <span class="form-error" id="err-fd-inicio"></span>
                                </div>
                                <div class="form-group">
                                    <label for="fd-fin">Hora fin <span class="req">*</span></label>
                                    <select id="fd-fin">${opcionesHora}</select>
                                    <span class="form-error" id="err-fd-fin"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-check-label">
                                    <input type="checkbox" id="fd-disponible" checked>
                                    Franja habilitada desde el alta
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-secondary" id="cancelar-modal-disp">Cancelar</button>
                        <button class="btn-primary" id="guardar-disp">Guardar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  INIT — DELEGACIÓN DE EVENTOS PRINCIPAL
    // =====================================================

    function init() {
        const root = document.querySelector('.canchas-module');
        if (!root) return;

        // Evitar doble binding si se llama a init accidentalmente de nuevo sin limpiar DOM
        if (root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';

        // 1) DELEGACIÓN DE EVENTOS CLICK
        root.addEventListener('click', e => {
            // Manejo de TABS
            const tabBtn = e.target.closest('.module-tab');
            if (tabBtn) {
                tabActivo = tabBtn.dataset.tab;
                refreshModulo();
                return;
            }

            // Manejo de botones dinámicos (tablas, lista lateral)
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const action = actionBtn.dataset.action;
                const id = parseInt(actionBtn.dataset.id);

                switch(action) {
                    case 'ver-cancha':      verDetalleCancha(id); break;
                    case 'editar-cancha':   abrirFormCancha(id); break;
                    case 'baja-cancha':     confirmarBajaCancha(id); break;
                    case 'ver-disp-cancha':
                        canchaSelDispId = id;
                        tabActivo = 'disponibilidad';
                        refreshModulo();
                        break;
                    case 'ver-tipo':        verDetalleTipo(id); break;
                    case 'editar-tipo':     abrirFormTipo(id); break;
                    case 'baja-tipo':       confirmarBajaTipo(id); break;
                    case 'sel-cancha-disp':
                        canchaSelDispId = id;
                        refreshDispPanel();
                        break;
                    case 'toggle-disp':     toggleDisp(id); break;
                    case 'editar-disp':     abrirFormDisp(id); break;
                    case 'eliminar-disp':   eliminarDisp(id); break;
                }
                return;
            }

            // Manejo de botones fijos / modales por ID
            const targetId = e.target.id || e.target.closest('button')?.id;
            if (!targetId) {
                // Cerrar modales si hacen click en el overlay oscuro exterior
                if (e.target.classList.contains('dash-modal-overlay')) {
                    cerrarModal(e.target.id);
                }
                return;
            }

            switch(targetId) {
                // Canchas
                case 'btn-limpiar-filtro-canchas':
                    filtroCanchas = '';
                    const sc = document.getElementById('search-canchas');
                    if (sc) sc.value = '';
                    refreshTablaCanchas();
                    break;
                case 'btn-nueva-cancha': abrirFormCancha(null); break;
                case 'guardar-cancha':   guardarCancha(); break;
                case 'cancelar-modal-cancha':
                case 'cerrar-modal-cancha': cerrarModal('modal-cancha'); break;
                case 'cerrar-detalle-cancha':
                case 'cerrar-detalle-cancha-2': cerrarModal('modal-detalle-cancha'); break;
                case 'cancelar-baja-cancha':
                case 'cerrar-modal-baja-cancha': cerrarModal('modal-baja-cancha'); break;
                case 'confirmar-baja-cancha': ejecutarBajaCancha(); break;

                // Tipos
                case 'btn-nuevo-tipo': abrirFormTipo(null); break;
                case 'guardar-tipo':   guardarTipo(); break;
                case 'cancelar-modal-tipo':
                case 'cerrar-modal-tipo': cerrarModal('modal-tipo'); break;
                case 'cerrar-detalle-tipo':
                case 'cerrar-detalle-tipo-2': cerrarModal('modal-detalle-tipo'); break;
                case 'cancelar-baja-tipo':
                case 'cerrar-modal-baja-tipo': cerrarModal('modal-baja-tipo'); break;
                case 'confirmar-baja-tipo': ejecutarBajaTipo(); break;

                // Disponibilidad
                case 'btn-nueva-disp':
                    abrirFormDisp(null);
                    const sel = document.getElementById('fd-cancha');
                    if (sel) sel.value = canchaSelDispId;
                    break;
                case 'guardar-disp': guardarDisp(); break;
                case 'cancelar-modal-disp':
                case 'cerrar-modal-disp': cerrarModal('modal-disp'); break;
            }
        });

        // 2) DELEGACIÓN DE EVENTOS INPUT (búsquedas en vivo)
        root.addEventListener('input', e => {
            if (e.target.id === 'search-canchas') {
                filtroCanchas = e.target.value;
                refreshTablaCanchas();
            } else if (e.target.id === 'search-tipos') {
                filtroTipos = e.target.value;
                refreshTablaTipos();
            }
        });
    }

    // =====================================================
    //  FUNCIONES: CANCHAS
    // =====================================================

    function abrirFormCancha(id) {
        const c = id ? canchas.find(x => x.id === id) : null;
        document.getElementById('modal-cancha-titulo').textContent = c ? 'Editar cancha' : 'Nueva cancha';
        document.getElementById('fc-id').value          = c?.id || '';
        document.getElementById('fc-numero').value      = c?.numero || '';
        document.getElementById('fc-nombre').value      = c?.nombre || '';
        document.getElementById('fc-tipo').value        = c?.idTipo || '';
        document.getElementById('fc-descripcion').value = c?.descripcion || '';
        limpiarErrores(['err-fc-numero','err-fc-nombre','err-fc-tipo']);
        abrirModal('modal-cancha');
    }

    function guardarCancha() {
        const id     = document.getElementById('fc-id').value;
        const numero = parseInt(document.getElementById('fc-numero').value);
        const nombre = document.getElementById('fc-nombre').value.trim();
        const idTipo = parseInt(document.getElementById('fc-tipo').value);
        const desc   = document.getElementById('fc-descripcion').value.trim();

        let ok = true;
        if (!numero || numero < 1)    { setFormError('err-fc-numero', 'Ingrese un número válido'); ok = false; }
        if (nombre.length < 2)        { setFormError('err-fc-nombre', 'Nombre muy corto'); ok = false; }
        if (!idTipo)                  { setFormError('err-fc-tipo',   'Seleccione un tipo'); ok = false; }
        if (!ok) return;

        if (id) {
            const c = canchas.find(x => x.id === parseInt(id));
            if (c) { c.numero = numero; c.nombre = nombre; c.idTipo = idTipo; c.descripcion = desc; }
            mostrarToast('Cancha actualizada correctamente.');
        } else {
            canchas.push({ id: nextCanchaId++, numero, nombre, idTipo, estado: 'activa', descripcion: desc, imagen: '' });
            mostrarToast('Cancha registrada correctamente.');
        }
        cerrarModal('modal-cancha');
        refreshModulo();
    }

    function verDetalleCancha(id) {
        const c = canchas.find(x => x.id === id);
        if (!c) return;
        const tipo = tiposCanchas.find(t => t.id === c.idTipo);
        const dispsCancha = disponibilidades.filter(d => d.idCancha === id);
        const franjas = DIAS.map(dia => {
            const f = dispsCancha.find(d => d.diaSemana === dia);
            if (!f) return `<li class="det-dia neutral">${dia}: <em>Sin configurar</em></li>`;
            return `<li class="det-dia ${f.disponible ? 'ok' : 'bloq'}">${dia}: ${padHora(f.horaInicio)}:00–${padHora(f.horaFin)}:00 ${f.disponible ? '<span class="badge success">Habilitada</span>' : '<span class="badge danger">Bloqueada</span>'}</li>`;
        }).join('');

        document.getElementById('detalle-cancha-body').innerHTML = `
            <div class="detalle-grid">
                <div class="det-row"><span>Número</span><strong>${c.numero}</strong></div>
                <div class="det-row"><span>Nombre</span><strong>${c.nombre}</strong></div>
                <div class="det-row"><span>Tipo</span><strong>${tipo?.nombre || '—'}</strong></div>
                <div class="det-row"><span>Superficie</span><strong>${tipo?.superficie || '—'}</strong></div>
                <div class="det-row"><span>Capacidad</span><strong>${tipo?.capacidadJugadores || '—'} jugadores</strong></div>
                <div class="det-row"><span>Precio/hora</span><strong>${tipo ? '$' + tipo.precioHora.toLocaleString('es-AR') : '—'}</strong></div>
                <div class="det-row"><span>Estado</span>${badgeEstado(c.estado)}</div>
                <div class="det-row full"><span>Descripción</span><strong>${c.descripcion || '—'}</strong></div>
            </div>
            <h4 class="det-subtitle">Disponibilidad semanal</h4>
            <ul class="det-disponibilidad">${franjas}</ul>
        `;
        reinitLucide();
        abrirModal('modal-detalle-cancha');
    }

    function confirmarBajaCancha(id) {
        const c = canchas.find(x => x.id === id);
        if (!c) return;
        bajaTargetCanchaId = id;
        const esBaja = c.estado === 'activa';
        document.getElementById('modal-baja-cancha-titulo').textContent = esBaja ? 'Dar de baja' : 'Reactivar cancha';
        document.getElementById('modal-baja-cancha-msg').textContent =
            esBaja ? `¿Dar de baja a "${c.nombre}"? No estará disponible para reservas.`
                   : `¿Reactivar "${c.nombre}"? Volverá a estar disponible.`;
        abrirModal('modal-baja-cancha');
    }

    function ejecutarBajaCancha() {
        if (!bajaTargetCanchaId) return;
        const c = canchas.find(x => x.id === bajaTargetCanchaId);
        if (!c) return;
        const esBaja = c.estado === 'activa';
        c.estado = esBaja ? 'inactiva' : 'activa';
        cerrarModal('modal-baja-cancha');
        mostrarToast(esBaja ? `"${c.nombre}" dada de baja.` : `"${c.nombre}" reactivada.`, esBaja ? 'warning' : 'success');
        bajaTargetCanchaId = null;
        refreshModulo();
    }

    // =====================================================
    //  FUNCIONES: TIPOS
    // =====================================================

    function abrirFormTipo(id) {
        const t = id ? tiposCanchas.find(x => x.id === id) : null;
        document.getElementById('modal-tipo-titulo').textContent = t ? 'Editar tipo' : 'Nuevo tipo de cancha';
        document.getElementById('ft-id').value          = t?.id || '';
        document.getElementById('ft-nombre').value      = t?.nombre || '';
        document.getElementById('ft-superficie').value  = t?.superficie || '';
        document.getElementById('ft-capacidad').value   = t?.capacidadJugadores || '';
        document.getElementById('ft-duracion').value    = t?.duracionMaxReservaMin || '';
        document.getElementById('ft-precio').value      = t?.precioHora || '';
        document.getElementById('ft-descripcion').value = t?.descripcion || '';
        limpiarErrores(['err-ft-nombre','err-ft-superficie','err-ft-capacidad','err-ft-duracion','err-ft-precio']);
        abrirModal('modal-tipo');
    }

    function guardarTipo() {
        const id          = document.getElementById('ft-id').value;
        const nombre      = document.getElementById('ft-nombre').value.trim();
        const superficie  = document.getElementById('ft-superficie').value.trim();
        const capacidad   = parseInt(document.getElementById('ft-capacidad').value);
        const duracion    = parseInt(document.getElementById('ft-duracion').value);
        const precio      = parseFloat(document.getElementById('ft-precio').value);
        const descripcion = document.getElementById('ft-descripcion').value.trim();

        let ok = true;
        if (nombre.length < 2)      { setFormError('err-ft-nombre',      'Nombre muy corto'); ok = false; }
        if (superficie.length < 2)  { setFormError('err-ft-superficie',  'Ingrese la superficie'); ok = false; }
        if (!capacidad || capacidad < 2) { setFormError('err-ft-capacidad', 'Capacidad mínima: 2'); ok = false; }
        if (!duracion  || duracion < 30) { setFormError('err-ft-duracion',  'Mínimo 30 minutos'); ok = false; }
        if (!precio    || precio   < 0)  { setFormError('err-ft-precio',    'Precio inválido'); ok = false; }
        if (!ok) return;

        if (id) {
            const t = tiposCanchas.find(x => x.id === parseInt(id));
            if (t) Object.assign(t, { nombre, superficie, capacidadJugadores: capacidad, duracionMaxReservaMin: duracion, precioHora: precio, descripcion });
            mostrarToast('Tipo de cancha actualizado.');
        } else {
            tiposCanchas.push({ id: nextTipoId++, nombre, superficie, capacidadJugadores: capacidad, duracionMaxReservaMin: duracion, precioHora: precio, descripcion });
            mostrarToast('Tipo de cancha registrado.');
        }
        cerrarModal('modal-tipo');
        refreshModulo();
    }

    function verDetalleTipo(id) {
        const t = tiposCanchas.find(x => x.id === id);
        if (!t) return;
        const uso = canchas.filter(c => c.idTipo === id);
        document.getElementById('detalle-tipo-body').innerHTML = `
            <div class="detalle-grid">
                <div class="det-row"><span>Nombre</span><strong>${t.nombre}</strong></div>
                <div class="det-row"><span>Superficie</span><strong>${t.superficie}</strong></div>
                <div class="det-row"><span>Capacidad</span><strong>${t.capacidadJugadores} jugadores</strong></div>
                <div class="det-row"><span>Duración máx.</span><strong>${t.duracionMaxReservaMin} minutos</strong></div>
                <div class="det-row"><span>Precio/hora</span><strong>$${t.precioHora.toLocaleString('es-AR')}</strong></div>
                <div class="det-row full"><span>Descripción</span><strong>${t.descripcion || '—'}</strong></div>
            </div>
            <h4 class="det-subtitle">Canchas con este tipo (${uso.length})</h4>
            <ul class="det-lista">
                ${uso.length === 0 ? '<li>Sin canchas asignadas.</li>' : uso.map(c => `<li>${c.nombre} — ${badgeEstado(c.estado)}</li>`).join('')}
            </ul>
        `;
        reinitLucide();
        abrirModal('modal-detalle-tipo');
    }

    function confirmarBajaTipo(id) {
        const t = tiposCanchas.find(x => x.id === id);
        if (!t) return;
        const uso = canchas.filter(c => c.idTipo === id).length;
        if (uso > 0) {
            mostrarToast(`No se puede eliminar: ${uso} cancha(s) usan este tipo.`, 'error');
            return;
        }
        bajaTargetTipoId = id;
        document.getElementById('modal-baja-tipo-msg').textContent = `¿Eliminar el tipo "${t.nombre}"? Esta acción no se puede deshacer.`;
        abrirModal('modal-baja-tipo');
    }

    function ejecutarBajaTipo() {
        if (!bajaTargetTipoId) return;
        const t = tiposCanchas.find(x => x.id === bajaTargetTipoId);
        tiposCanchas = tiposCanchas.filter(x => x.id !== bajaTargetTipoId);
        cerrarModal('modal-baja-tipo');
        mostrarToast(`Tipo "${t?.nombre || ''}" eliminado.`, 'warning');
        bajaTargetTipoId = null;
        refreshModulo();
    }

    // =====================================================
    //  FUNCIONES: DISPONIBILIDAD
    // =====================================================

    function toggleDisp(id) {
        const d = disponibilidades.find(x => x.id === id);
        if (!d) return;
        d.disponible = !d.disponible;
        mostrarToast(d.disponible ? 'Franja habilitada.' : 'Franja bloqueada.', d.disponible ? 'success' : 'warning');
        refreshDispPanel();
    }

    function eliminarDisp(id) {
        if (!confirm('¿Eliminar esta franja horaria?')) return;
        disponibilidades = disponibilidades.filter(x => x.id !== id);
        mostrarToast('Franja eliminada.', 'warning');
        refreshDispPanel();
    }

    function abrirFormDisp(id) {
        const d = id ? disponibilidades.find(x => x.id === id) : null;
        document.getElementById('modal-disp-titulo').textContent = d ? 'Editar franja' : 'Nueva franja horaria';
        document.getElementById('fd-id').value          = d?.id || '';
        document.getElementById('fd-cancha').value      = d?.idCancha || canchaSelDispId || '';
        document.getElementById('fd-dia').value         = d?.diaSemana || '';
        document.getElementById('fd-inicio').value      = d?.horaInicio ?? 8;
        document.getElementById('fd-fin').value         = d?.horaFin    ?? 23;
        document.getElementById('fd-disponible').checked = d ? d.disponible : true;
        limpiarErrores(['err-fd-cancha','err-fd-dia','err-fd-inicio','err-fd-fin']);
        abrirModal('modal-disp');
    }

    function guardarDisp() {
        const id        = document.getElementById('fd-id').value;
        const idCancha  = parseInt(document.getElementById('fd-cancha').value);
        const diaSemana = document.getElementById('fd-dia').value;
        const horaInicio = parseInt(document.getElementById('fd-inicio').value);
        const horaFin    = parseInt(document.getElementById('fd-fin').value);
        const disponible = document.getElementById('fd-disponible').checked;

        let ok = true;
        if (!idCancha)    { setFormError('err-fd-cancha',  'Seleccione una cancha'); ok = false; }
        if (!diaSemana)   { setFormError('err-fd-dia',     'Seleccione un día'); ok = false; }
        if (horaFin <= horaInicio) { setFormError('err-fd-fin', 'La hora de fin debe ser mayor a la de inicio'); ok = false; }
        if (!ok) return;

        if (id) {
            const d = disponibilidades.find(x => x.id === parseInt(id));
            if (d) Object.assign(d, { idCancha, diaSemana, horaInicio, horaFin, disponible });
            mostrarToast('Franja actualizada.');
        } else {
            disponibilidades.push({ id: nextDispId++, idCancha, diaSemana, horaInicio, horaFin, disponible });
            mostrarToast('Franja registrada.');
        }
        cerrarModal('modal-disp');
        canchaSelDispId = idCancha;
        refreshModulo();
    }

    // =====================================================
    //  REFRESH HELPERS
    // =====================================================

    function refreshModulo() {
        const content = document.getElementById('tab-content');
        if (!content) return;
        content.innerHTML = renderTabContent();
        reinitLucide();
        // NOTA: Eliminado el llamado a init(). La delegación de eventos ya maneja todo.
    }

    function refreshTablaCanchas() {
        const container = document.getElementById('tabla-canchas-container');
        if (container) {
            container.innerHTML = renderTablaCanchas();
            reinitLucide();
        }
    }

    function refreshTablaTipos() {
        const container = document.getElementById('tabla-tipos-container');
        if (container) {
            container.innerHTML = renderTablaTipos();
            reinitLucide();
        }
    }

    function refreshDispPanel() {
        const cancha = canchas.find(c => c.id === canchaSelDispId);
        const tipo   = cancha ? tiposCanchas.find(t => t.id === cancha.idTipo) : null;
        const disps  = disponibilidades.filter(d => d.idCancha === cancha?.id);
        const panel  = document.getElementById('disp-main-panel');
        if (!panel) return;
        panel.innerHTML = renderDispMain(cancha, tipo, disps,
            disps.filter(d => d.disponible).length,
            disps.filter(d => !d.disponible).length
        );
        reinitLucide();
        // Actualizar selector activo en la vista lateral
        document.querySelectorAll('.cancha-selector-item').forEach(btn => {
            btn.classList.toggle('selected', parseInt(btn.dataset.id) === canchaSelDispId);
        });
    }

    // =====================================================
    //  UTILIDADES
    // =====================================================

    function canchasFiltradas() {
        if (!filtroCanchas) return canchas;
        const q = filtroCanchas.toLowerCase();
        return canchas.filter(c => {
            const tipo = tiposCanchas.find(t => t.id === c.idTipo);
            return c.nombre.toLowerCase().includes(q) || tipo?.nombre.toLowerCase().includes(q);
        });
    }

    function tiposFiltrados() {
        if (!filtroTipos) return tiposCanchas;
        const q = filtroTipos.toLowerCase();
        return tiposCanchas.filter(t =>
            t.nombre.toLowerCase().includes(q) || t.superficie.toLowerCase().includes(q)
        );
    }

    function padHora(h) { return String(h).padStart(2, '0'); }

    function badgeEstado(estado) {
        return estado === 'activa'
            ? `<span class="badge success">Activa</span>`
            : `<span class="badge danger">Inactiva</span>`;
    }

    function abrirModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.add('activo');
        document.body.style.overflow = 'hidden';
        reinitLucide();
    }

    function cerrarModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function setFormError(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = msg;
        const input = el.closest('.form-group')?.querySelector('input, select, textarea');
        input?.classList.add('input-error-field');
    }

    function limpiarErrores(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = '';
            const input = el.closest('.form-group')?.querySelector('input, select, textarea');
            input?.classList.remove('input-error-field');
        });
    }

    function reinitLucide() {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function mostrarToast(mensaje, tipo = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <i data-lucide="${tipo === 'success' ? 'check-circle-2' : tipo === 'warning' ? 'alert-triangle' : 'x-circle'}"></i>
            <span>${mensaje}</span>
        `;
        container.appendChild(toast);
        reinitLucide();
        requestAnimationFrame(() => toast.classList.add('toast-show'));
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =====================================================
    //  EXPONER
    // =====================================================

    return { render, init };

})();

// Registrar en el router principal
if (typeof registerModule === 'function') {
    registerModule('canchas', CanchasView);
}