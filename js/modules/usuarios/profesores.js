// =====================================================
//  MÓDULO DE GESTIÓN DE PROFESORES
// =====================================================

const ProfesoresView = (() => {

    // =====================================================
    //  DATOS MOCK
    // =====================================================

    let profesores = [
        {
            id: 1,
            legajo: 'PROF-1001',
            nombre: 'Carlos',
            apellido: 'Gómez',
            fechaNacimiento: '1989-04-12',
            dni: '32456789',
            email: 'carlos.gomez@mail.com',
            telefono: '11-2345-6789',
            username: 'cgomez',
            cargo: 'Profesor',
            turno: 'Tarde',
            especialidad: 'Fútbol Infantil',
            certificaciones: 'AFA Nivel 1',
            verificacionCertificacion: true,
            estado: 'activo',
            fechaIngreso: '2024-01-10',
            fechaRegistro: '2024-01-10'
        },
        {
            id: 2,
            legajo: 'PROF-1002',
            nombre: 'Lucía',
            apellido: 'Fernández',
            fechaNacimiento: '1992-08-21',
            dni: '36555111',
            email: 'lucia.fernandez@mail.com',
            telefono: '11-5555-1111',
            username: 'lfernandez',
            cargo: 'Profesora',
            turno: 'Mañana',
            especialidad: 'Preparación Física',
            certificaciones: 'Preparador Físico Nacional',
            verificacionCertificacion: true,
            estado: 'activo',
            fechaIngreso: '2024-02-14',
            fechaRegistro: '2024-02-14'
        },
        {
            id: 3,
            legajo: 'PROF-1003',
            nombre: 'Matías',
            apellido: 'Ruiz',
            fechaNacimiento: '1987-11-05',
            dni: '30111222',
            email: 'matias.ruiz@mail.com',
            telefono: '11-7777-8888',
            username: 'mruiz',
            cargo: 'Profesor',
            turno: 'Noche',
            especialidad: 'Entrenamiento Técnico',
            certificaciones: 'CONMEBOL Licencia C',
            verificacionCertificacion: false,
            estado: 'inactivo',
            fechaIngreso: '2023-09-01',
            fechaRegistro: '2023-09-01'
        }
    ];

    let nextId = 4;
    let filtro = '';
    let bajaTargetId = null;

    // =====================================================
    //  RENDER PRINCIPAL
    // =====================================================

    function render() {
        const activos = profesores.filter(p => p.estado === 'activo').length;
        const inactivos = profesores.filter(p => p.estado === 'inactivo').length;

        return `
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Profesores</h2>
                    <span class="crud-count">${profesores.length} total</span>
                </div>
                <div class="crud-toolbar-right">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-profesores" placeholder="Buscar profesor..." value="${filtro}">
                    </div>
                    <button class="btn-primary-action" id="btn-nuevo-profesor">
                        <i data-lucide="user-plus"></i>
                        Nuevo profesor
                    </button>
                </div>
            </div>
            <!-- STATS -->
            <div class="crud-mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-num">${profesores.length}</span>
                    <span class="mini-stat-label">Total</span>
                </div>
                <div class="mini-stat green">
                    <span class="mini-stat-num">${activos}</span>
                    <span class="mini-stat-label">Activos</span>
                </div>
                <div class="mini-stat red">
                    <span class="mini-stat-num">${inactivos}</span>
                    <span class="mini-stat-label">Inactivos</span>
                </div>
            </div>
            <!-- TABLA -->
            <div class="panel-card tabla-panel">
                <div class="table-wrapper" id="tabla-container">
                    ${renderTabla()}
                </div>
            </div>
            ${renderModal()}
            ${renderDetalle()}
            ${renderModalBaja()}
        `;
    }

    // =====================================================
    //  TABLA
    // =====================================================

    function renderTabla() {
        const lista = profesoresFiltrados();
        if (lista.length === 0) {
            return `
                <div class="tabla-empty">
                    <i data-lucide="search-x"></i>
                    <p>No se encontraron profesores.</p>
                </div>
            `;
        }

        const filas = lista.map(p => `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-sm ${p.estado === 'inactivo' ? 'inactive' : ''}">
                            ${iniciales(p)}
                        </div>
                        <div class="user-cell-info">
                            <strong>${p.nombre} ${p.apellido}</strong>
                            <span>@${p.username}</span>
                        </div>
                    </div>
                </td>
                <td>${p.especialidad}</td>
                <td>${p.turno}</td>
                <td>${badgeEstado(p.estado)}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" data-id="${p.id}" data-action="ver" title="Ver detalle">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="action-btn edit" data-id="${p.id}" data-action="editar" title="Editar">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button class="action-btn toggle" data-id="${p.id}" data-action="baja" title="Cambiar estado">
                            <i data-lucide="${p.estado === 'activo' ? 'user-x' : 'user-check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        return `
            <table>
                <thead>
                    <tr>
                        <th>Profesor</th>
                        <th>Especialidad</th>
                        <th>Turno</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }

    // =====================================================
    //  MODAL
    // =====================================================

    function renderModal() {
        return `
            <div class="dash-modal-overlay" id="modal-profesor">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-profesor-title">Nuevo profesor</h3>
                        <button class="dash-modal-close" id="cerrar-modal-profesor">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-profesor">
                            <input type="hidden" id="form-id">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Nombre *</label>
                                    <input type="text" id="form-nombre">
                                    <small class="form-error" id="err-nombre"></small>
                                </div>
                                <div class="form-group">
                                    <label>Apellido *</label>
                                    <input type="text" id="form-apellido">
                                    <small class="form-error" id="err-apellido"></small>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Fecha nacimiento *</label>
                                    <input type="date" id="form-fechaNacimiento">
                                    <small class="form-error" id="err-fechaNacimiento"></small>
                                </div>
                                <div class="form-group">
                                    <label>DNI *</label>
                                    <input type="text" id="form-dni">
                                    <small class="form-error" id="err-dni"></small>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Teléfono *</label>
                                    <input type="text" id="form-telefono">
                                    <small class="form-error" id="err-telefono"></small>
                                </div>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" id="form-email">
                                    <small class="form-error" id="err-email"></small>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Username *</label>
                                    <input type="text" id="form-username">
                                    <small class="form-error" id="err-username"></small>
                                </div>
                                <div class="form-group">
                                    <label>Legajo *</label>
                                    <input type="text" id="form-legajo">
                                    <small class="form-error" id="err-legajo"></small>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Especialidad *</label>
                                    <input type="text" id="form-especialidad">
                                    <small class="form-error" id="err-especialidad"></small>
                                </div>
                                <div class="form-group">
                                    <label>Turno *</label>
                                    <select id="form-turno">
                                        <option value="">Seleccionar</option>
                                        <option value="Mañana">Mañana</option>
                                        <option value="Tarde">Tarde</option>
                                        <option value="Noche">Noche</option>
                                    </select>
                                    <small class="form-error" id="err-turno"></small>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Certificaciones</label>
                                <input type="text" id="form-certificaciones">
                            </div>
                            <div class="form-group" id="grupo-password">
                                <label>Contraseña *</label>
                                <div class="pw-wrapper">
                                    <input type="password" id="form-password">
                                    <button type="button" class="pw-toggle">
                                        👁️
                                    </button>
                                </div>
                                <small class="form-error" id="err-password"></small>
                            </div>
                            <div class="form-group" id="grupo-estado" style="display:none">
                                <label>Estado</label>
                                <select id="form-estado">
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-modal-profesor">
                            Cancelar
                        </button>
                        <button class="btn-modal-save" id="guardar-profesor">
                            <i data-lucide="save"></i>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  DETALLE
    // =====================================================

    function renderDetalle() {
        return `
            <div class="dash-modal-overlay" id="modal-detalle-profesor">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3>Detalle del profesor</h3>
                        <button class="dash-modal-close" id="cerrar-detalle-profesor">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body" id="detalle-profesor-body"></div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cerrar-detalle-btn">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  MODAL BAJA
    // =====================================================

    function renderModalBaja() {
        return `
            <div class="dash-modal-overlay" id="modal-baja-profesor">
                <div class="dash-modal dash-modal--sm">
                    <div class="dash-modal-header">
                        <h3>Cambiar estado</h3>
                        <button class="dash-modal-close" id="cerrar-modal-baja">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <p id="texto-baja-profesor"></p>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-baja">Cancelar</button>
                        <button class="btn-modal-danger" id="confirmar-baja">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  INIT
    // =====================================================

    function init() {
        document.getElementById('search-profesores')?.addEventListener('input', e => {
                filtro = e.target.value.trim();
                refreshTabla();
            });

        document.getElementById('btn-nuevo-profesor')?.addEventListener('click', abrirModalNuevo);
        document.getElementById('tabla-container')?.addEventListener('click', e => {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;
                const id = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                if (action === 'ver') abrirDetalle(id);
                if (action === 'editar') abrirModalEditar(id);
                if (action === 'baja') abrirModalBaja(id);
            });
        document.getElementById('guardar-profesor')?.addEventListener('click', guardarProfesor);
        document.getElementById('cerrar-modal-profesor')?.addEventListener('click', () => cerrarModal('modal-profesor'));
        document.getElementById('cancelar-modal-profesor')?.addEventListener('click', () => cerrarModal('modal-profesor'));
        document.getElementById('cerrar-detalle-profesor')?.addEventListener('click', () => cerrarModal('modal-detalle-profesor'));
        document.getElementById('cerrar-detalle-btn')?.addEventListener('click', () => cerrarModal('modal-detalle-profesor'));
        document.getElementById('cerrar-modal-baja')?.addEventListener('click', () => cerrarModal('modal-baja-profesor'));
        document.getElementById('cancelar-baja')?.addEventListener('click', () => cerrarModal('modal-baja-profesor'));
        document.getElementById('confirmar-baja')?.addEventListener('click', ejecutarBaja);
        document.querySelector('.pw-toggle')?.addEventListener('click', togglePassword);
        reinitLucideLocal();
    }

    // =====================================================
    //  CRUD
    // =====================================================

    function abrirModalNuevo() {
        limpiarForm();
        document.getElementById('modal-profesor-title').textContent = 'Nuevo profesor';
        document.getElementById('grupo-password').style.display = '';
        document.getElementById('grupo-estado').style.display = 'none';
        abrirModal('modal-profesor');
    }

    function abrirModalEditar(id) {
        const p = profesores.find(x => x.id === id);
        if (!p) return;
        limpiarForm();
        document.getElementById('modal-profesor-title').textContent = 'Editar profesor';
        document.getElementById('form-id').value = p.id;
        document.getElementById('form-nombre').value = p.nombre;
        document.getElementById('form-apellido').value = p.apellido;
        document.getElementById('form-fechaNacimiento').value = p.fechaNacimiento;
        document.getElementById('form-dni').value = p.dni;
        document.getElementById('form-telefono').value = p.telefono;
        document.getElementById('form-email').value = p.email;
        document.getElementById('form-username').value = p.username;
        document.getElementById('form-legajo').value = p.legajo;
        document.getElementById('form-especialidad').value = p.especialidad;
        document.getElementById('form-turno').value = p.turno;
        document.getElementById('form-certificaciones').value = p.certificaciones;
        document.getElementById('form-estado').value = p.estado;
        document.getElementById('grupo-password').style.display = 'none';
        document.getElementById('grupo-estado').style.display = '';

        abrirModal('modal-profesor');
    }

    function guardarProfesor() {
        if (!validarForm()) return;
        const id = document.getElementById('form-id').value;
        const data = {
            nombre: document.getElementById('form-nombre').value.trim(),
            apellido: document.getElementById('form-apellido').value.trim(),
            fechaNacimiento: document.getElementById('form-fechaNacimiento').value,
            dni: document.getElementById('form-dni').value.trim(),
            telefono: document.getElementById('form-telefono').value.trim(),
            email: document.getElementById('form-email').value.trim(),
            username: document.getElementById('form-username').value.trim(),
            legajo: document.getElementById('form-legajo').value.trim(),
            especialidad: document.getElementById('form-especialidad').value.trim(),
            turno: document.getElementById('form-turno').value,
            certificaciones: document.getElementById('form-certificaciones').value.trim(),
            estado: document.getElementById('form-estado').value || 'activo'
        };

        if (id) {
            const idx = profesores.findIndex(p => p.id === parseInt(id));
            profesores[idx] = {...profesores[idx], ...data};
            mostrarToast('Profesor actualizado.', 'success');

        } else {
            profesores.push({id: nextId++, cargo: 'Profesor', fechaIngreso: hoy(), fechaRegistro: hoy(), verificacionCertificacion: true,
                ...data
            });

            mostrarToast('Profesor registrado.', 'success');
        }
        cerrarModal('modal-profesor');
        refreshAll();
    }

    function abrirDetalle(id) {
        const p = profesores.find(x => x.id === id);
        if (!p) return;

        document.getElementById('detalle-profesor-body').innerHTML = `
            <div class="detalle-avatar">
                ${iniciales(p)}
            </div>
            <div class="detalle-nombre">
                ${p.nombre} ${p.apellido}
            </div>
            <div class="detalle-username">
                @${p.username}
            </div>
            <div class="detalle-grid">
                <div class="detalle-campo">
                    <span class="detalle-label">Legajo</span>
                    <span class="detalle-valor">${p.legajo}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Especialidad</span>
                    <span class="detalle-valor">${p.especialidad}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Turno</span>
                    <span class="detalle-valor">${p.turno}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Estado</span>
                    <span class="detalle-valor">${p.estado}</span>
                </div>
                <div class="detalle-campo detalle-full">
                    <span class="detalle-label">Email</span>
                    <span class="detalle-valor">${p.email}</span>
                </div>
                <div class="detalle-campo detalle-full">
                    <span class="detalle-label">Certificaciones</span>
                    <span class="detalle-valor">${p.certificaciones}</span>
                </div>
            </div>
        `;
        abrirModal('modal-detalle-profesor');
    }

    function abrirModalBaja(id) {
        bajaTargetId = id;
        const p = profesores.find(x => x.id === id);
        if (!p) return;

        const accion = p.estado === 'activo'? 'dar de baja': 'reactivar';

        document.getElementById('texto-baja-profesor').innerHTML = `
            ¿Deseás ${accion} a <strong>${p.nombre} ${p.apellido}</strong>?
        `;
        abrirModal('modal-baja-profesor');
    }

    function ejecutarBaja() {
        const p = profesores.find(x => x.id === bajaTargetId);
        if (!p) return;
        p.estado = p.estado === 'activo'? 'inactivo': 'activo';
        mostrarToast('Estado actualizado.', 'warning');
        cerrarModal('modal-baja-profesor');
        refreshAll();
    }

    // =====================================================
    //  VALIDACIÓN
    // =====================================================

    function validarForm() {
        let ok = true;
        limpiarErrores();

        const nombre = document.getElementById('form-nombre').value.trim();
        const apellido = document.getElementById('form-apellido').value.trim();
        const dni = document.getElementById('form-dni').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const username = document.getElementById('form-username').value.trim();
        const legajo = document.getElementById('form-legajo').value.trim();

        if (nombre.length < 2) {setFormError('err-nombre', 'Nombre inválido'); ok = false;}
        if (apellido.length < 2) {setFormError('err-apellido', 'Apellido inválido'); ok = false;}
        if (!/^\d{7,8}$/.test(dni)) {setFormError('err-dni', 'DNI inválido'); ok = false;}
        if (!email.includes('@')) {setFormError('err-email', 'Email inválido'); ok = false;}
        if (username.length < 4) {setFormError('err-username', 'Username inválido'); ok = false;}
        if (legajo.length < 4) {setFormError('err-legajo', 'Legajo inválido'); ok = false;}

        return ok;
    }
    // =====================================================
    //  HELPERS
    // =====================================================

    function profesoresFiltrados() {
        if (!filtro) return profesores;
        const q = filtro.toLowerCase();

        return profesores.filter(p =>
            `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
            p.especialidad.toLowerCase().includes(q) ||
            p.dni.includes(q)
        );
    }

    function refreshTabla() {
        document.getElementById('tabla-container').innerHTML = renderTabla();
        reinitLucideLocal();
    }

    function refreshAll() {
        navigateTo('profesores');
    }

    function abrirModal(id) {
        document.getElementById(id)?.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal(id) {
        document.getElementById(id)?.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function iniciales(p) {
        return (p.nombre[0] + p.apellido[0]).toUpperCase();
    }

    function badgeEstado(estado) {
        return estado === 'activo'
            ? `<span class="badge success">Activo</span>`
            : `<span class="badge danger">Inactivo</span>`;
    }

    function limpiarForm() {
        document.querySelectorAll('#form-profesor input').forEach(input => input.value = '');
        limpiarErrores();
    }

    function limpiarErrores() {
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    }

    function setFormError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    }

    function togglePassword(e) {
        const input = document.getElementById('form-password');
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        e.target.textContent = isPass ? '🙈' : '👁️';
    }

    function reinitLucideLocal() {
        if (typeof lucide !== 'undefined') {lucide.createIcons();}
    }

    function hoy() {
        return new Date().toISOString().split('T')[0];
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
            <i data-lucide="check-circle-2"></i>
            <span>${mensaje}</span>
        `;
        container.appendChild(toast);
        reinitLucideLocal();
        requestAnimationFrame(() => {toast.classList.add('toast-show');});

        setTimeout(() => {toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);}, 3000);
    }

    return { render, init };

})();

// =====================================================
//  REGISTRO EN ROUTER
// =====================================================

if (typeof registerModule === 'function') {
    registerModule('profesores', ProfesoresView);
}