// =====================================================
//  CONFIGURACIÓN DE VISTAS
// =====================================================

const VIEW_META = {
    home:          { title: 'Dashboard',       subtitle: 'Bienvenido al panel de administración.' },
    usuarios:      { title: 'Clientes',        subtitle: 'Gestión de usuarios del sistema.' },
    empleados:     { title: 'Empleados',       subtitle: 'Gestión de empleados del club.' },
    reservas:      { title: 'Reservas',        subtitle: 'Gestión de reservas de canchas.' },
    canchas:       { title: 'Canchas',         subtitle: 'Administración de canchas.' },
    torneos:       { title: 'Torneos',         subtitle: 'Ligas y torneos activos.' },
    clases:        { title: 'Clases',          subtitle: 'Clases y entrenamientos.' },
    profesores:    { title: 'Profesores',      subtitle: 'Gestión de profesores y entrenadores.' },
    asistencias:   { title: 'Asistencias',     subtitle: 'Registro de asistencias.' },
    cobros:        { title: 'Cobros',          subtitle: 'Gestión de cobros y pagos.' },
    recibos:       { title: 'Recibos',         subtitle: 'Gestión de recibos.' },
    reportes:      { title: 'Reportes',        subtitle: 'Reportes e informes del sistema.' },
    configuracion: { title: 'Configuración',   subtitle: 'Configuración del sistema.' },
};

// Módulos registrados (los módulos se registran solos al cargarse)
const MODULES = {};

// Registrar un módulo desde sus propios archivos
function registerModule(name, module) {
    MODULES[name] = module;
}

// =====================================================
//  ROUTER
// =====================================================

let currentView = null;

function navigateTo(viewName) {
    if (currentView === viewName) return;
    currentView = viewName;

    // Actualizar sidebar activo
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Actualizar topbar
    const meta = VIEW_META[viewName] || VIEW_META.home;
    document.getElementById('topbar-title').textContent = meta.title;
    document.getElementById('topbar-subtitle').textContent = meta.subtitle;

    // Renderizar vista
    const content = document.getElementById('dashboard-content');
    content.classList.add('view-loading');

    setTimeout(() => {
        if (viewName === 'home') {
            content.innerHTML = renderHomeView();
        } else if (MODULES[viewName]) {
            content.innerHTML = MODULES[viewName].render();
            MODULES[viewName].init?.();
        } else {
            content.innerHTML = renderComingSoon(viewName);
        }

        content.classList.remove('view-loading');
        reinitLucide();
    }, 80); // micro-delay para que se vea la transición
}

// Exponer globalmente para usar desde onclick y módulos
window.navigateTo = navigateTo;

// =====================================================
//  INIT
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    reinitLucide();
    initSidebar();
    initLogout();
    navigateTo('home');
});

function reinitLucide() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar    = document.getElementById('sidebar');
    const overlay    = document.getElementById('sidebar-overlay');

    if (!menuToggle || !sidebar || !overlay) return;

    const open  = () => { sidebar.classList.add('open');    overlay.classList.add('active'); };
    const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); };
    const toggle = () => sidebar.classList.contains('open') ? close() : open();

    menuToggle.addEventListener('click', toggle);
    overlay.addEventListener('click', close);

    // Navegación por sidebar
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            close();
            navigateTo(link.dataset.view);
        });
    });
}

function initLogout() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) {
            window.location.href = '../../../index.html';
        }
    });
}

// =====================================================
//  VISTA HOME
// =====================================================

function renderHomeView() {
    return `
        <!-- STATS -->
        <section class="stats-grid">
            <article class="stat-card">
                <div class="stat-icon purple"><i data-lucide="calendar-check"></i></div>
                <div>
                    <span class="stat-label">Reservas Hoy</span>
                    <h2>128</h2>
                </div>
            </article>
            <article class="stat-card">
                <div class="stat-icon yellow"><i data-lucide="wallet-cards"></i></div>
                <div>
                    <span class="stat-label">Ingresos del Día</span>
                    <h2>$1.485.000</h2>
                </div>
            </article>
            <article class="stat-card">
                <div class="stat-icon green"><i data-lucide="goal"></i></div>
                <div>
                    <span class="stat-label">Canchas Activas</span>
                    <h2>12</h2>
                </div>
            </article>
            <article class="stat-card">
                <div class="stat-icon blue"><i data-lucide="users"></i></div>
                <div>
                    <span class="stat-label">Clientes Activos</span>
                    <h2>324</h2>
                </div>
            </article>
        </section>

        <!-- ACCESOS RÁPIDOS -->
        <section class="shortcuts-section">
            <h3 class="section-subtitle">Accesos rápidos</h3>
            <div class="shortcuts-grid">
                <button class="shortcut-card" onclick="navigateTo('usuarios')">
                    <div class="shortcut-icon blue"><i data-lucide="users"></i></div>
                    <span>Clientes</span>
                </button>
                <button class="shortcut-card" onclick="navigateTo('reservas')">
                    <div class="shortcut-icon purple"><i data-lucide="calendar-days"></i></div>
                    <span>Reservas</span>
                </button>
                <button class="shortcut-card" onclick="navigateTo('canchas')">
                    <div class="shortcut-icon green"><i data-lucide="goal"></i></div>
                    <span>Canchas</span>
                </button>
                <button class="shortcut-card" onclick="navigateTo('cobros')">
                    <div class="shortcut-icon yellow"><i data-lucide="wallet"></i></div>
                    <span>Cobros</span>
                </button>
                <button class="shortcut-card" onclick="navigateTo('torneos')">
                    <div class="shortcut-icon purple"><i data-lucide="trophy"></i></div>
                    <span>Torneos</span>
                </button>
                <button class="shortcut-card" onclick="navigateTo('reportes')">
                    <div class="shortcut-icon blue"><i data-lucide="bar-chart-3"></i></div>
                    <span>Reportes</span>
                </button>
            </div>
        </section>

        <!-- CONTENT GRID -->
        <section class="content-grid">
            <article class="panel-card">
                <div class="panel-header">
                    <div>
                        <h3>Próximas Reservas</h3>
                        <p>Reservas confirmadas para hoy.</p>
                    </div>
                    <button class="panel-btn" onclick="navigateTo('reservas')">Ver todas</button>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Cancha</th>
                                <th>Horario</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Juan Pérez</td>
                                <td>Cancha 3</td>
                                <td>18:00</td>
                                <td><span class="badge success">Confirmada</span></td>
                            </tr>
                            <tr>
                                <td>Martín López</td>
                                <td>Cancha 1</td>
                                <td>19:30</td>
                                <td><span class="badge warning">Pendiente</span></td>
                            </tr>
                            <tr>
                                <td>Lucas Díaz</td>
                                <td>Cancha 5</td>
                                <td>21:00</td>
                                <td><span class="badge success">Confirmada</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>

            <article class="panel-card">
                <div class="panel-header">
                    <div>
                        <h3>Actividad Reciente</h3>
                        <p>Últimos movimientos del sistema.</p>
                    </div>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-dot purple"></div>
                        <p>Nueva reserva registrada para Cancha 2.</p>
                    </div>
                    <div class="activity-item">
                        <div class="activity-dot yellow"></div>
                        <p>Cobro validado correctamente.</p>
                    </div>
                    <div class="activity-item">
                        <div class="activity-dot green"></div>
                        <p>Nuevo cliente registrado.</p>
                    </div>
                    <div class="activity-item">
                        <div class="activity-dot blue"></div>
                        <p>Fixture actualizado en torneo apertura.</p>
                    </div>
                </div>
            </article>
        </section>
    `;
}

// =====================================================
//  VISTA PLACEHOLDER (secciones sin implementar)
// =====================================================

function renderComingSoon(viewName) {
    const meta = VIEW_META[viewName] || {};
    return `
        <div class="coming-soon-view">
            <div class="coming-soon-icon"><i data-lucide="construction"></i></div>
            <h3>${meta.title || viewName}</h3>
            <p>Esta sección está siendo desarrollada.<br>Próximamente disponible.</p>
        </div>
    `;
}
