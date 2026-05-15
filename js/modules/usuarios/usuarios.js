// Módulo de Gestión de Clientes — RF01 al RF05

const UsuariosView = (() => {

    // =====================================================
    //  DATOS (se reemplaza por fetch al backend)
    // =====================================================

    let usuarios = [
        { id: 1, nombre: 'Juan', apellido: 'Pérez',  fechaNacimiento: '1998-04-12', nroSocio: 'SOC-1001', dni: '40255711', email: 'juan@mail.com',
        telefono: '11-2222-3333', username: 'juanp', estado: 'activo', fechaAlta: '2025-03-15'},
        { id: 1, nombre: 'Juan', apellido: 'Pérez', fechaNacimiento: '1999-04-12', nroSocio: 'SOC-1002', dni: '40255711', email: 'juan.perez@mail.com', telefono: '11-2345-6789', username: 'juanp', estado: 'activo', fechaAlta: '2025-02-15' },
        { id: 2, nombre: 'Martín', apellido: 'López', fechaNacimiento: '2000-05-12', nroSocio: 'SOC-1003', dni: '38741200', email: 'martin.l@mail.com', telefono: '11-3456-7890', username: 'martinl',  estado: 'activo', fechaAlta: '2025-02-03' },
        { id: 3, nombre: 'Camila', apellido: 'Torres', fechaNacimiento: '1998-07-02', nroSocio: 'SOC-1004', dni: '42100055', email: 'cami.torres@gmail.com', telefono: '11-4567-8901', username: 'camit', estado: 'activo', fechaAlta: '2025-02-18' },
        { id: 4, nombre: 'Lucas', apellido: 'Díaz', fechaNacimiento: '1999-08-15', nroSocio: 'SOC-1005', dni: '39800123', email: 'lucas.diaz@mail.com', telefono: '11-5678-9012', username: 'lucasd', estado: 'inactivo', fechaAlta: '2025-03-01' },
        { id: 5, nombre: 'Valentina', apellido: 'García',  fechaNacimiento: '2000-01-20', nroSocio: 'SOC-1006', dni: '44301987', email: 'vale.garcia@mail.com', telefono: '11-6789-0123', username: 'valeg', estado: 'activo',   fechaAlta: '2025-03-22' },
        { id: 6, nombre: 'Rodrigo', apellido: 'Fernández', fechaNacimiento: '1998-11-10', nroSocio: 'SOC-1007', dni: '37500660', email: 'rodri.f@mail.com', telefono: '11-7890-1234', username: 'rodrif', estado: 'activo',   fechaAlta: '2025-04-05' },
        { id: 7, nombre: 'Sofía',   apellido: 'Martínez',  fechaNacimiento: '2000-03-25', nroSocio: 'SOC-1008', dni: '43650098', email: 'sofi.martinez@mail.com', telefono: '11-8901-2345', username: 'sofim', estado: 'inactivo', fechaAlta: '2025-04-14' },
        { id: 8, nombre: 'Nicolás', apellido: 'Romero', fechaNacimiento: '1999-06-30', nroSocio: 'SOC-1009', dni: '41235387', email: 'nico.romero@mail.com', telefono: '11-9012-4444', username: 'nicor', estado: 'activo', fechaAlta: '2025-05-02' }
    ];    

    let nextId = 9;
    let filtro = '';

    // =====================================================
    //  RENDER PRINCIPAL
    // =====================================================

    function render() {
        const activos   = usuarios.filter(u => u.estado === 'activo').length;
        const inactivos = usuarios.filter(u => u.estado === 'inactivo').length;

        return `
            <!-- TOOLBAR -->
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Clientes</h2>
                    <span class="crud-count">${usuarios.length} total</span>
                </div>
                <div class="crud-toolbar-right">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-usuarios" placeholder="Buscar por nombre, DNI o email…" value="${filtro}" autocomplete="off">
                    </div>
                    <button class="btn-primary-action" id="btn-nuevo-usuario">
                        <i data-lucide="user-plus"></i>
                        Nuevo cliente
                    </button>
                </div>
            </div>

            <!-- MINI STATS -->
            <div class="crud-mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-num">${usuarios.length}</span>
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

            <!-- MODAL FORM -->
            ${renderModal()}

            <!-- MODAL DETALLE -->
            ${renderModalDetalle()}

            <!-- MODAL CONFIRMAR BAJA -->
            ${renderModalBaja()}
        `;
    }

    // =====================================================
    //  TABLA
    // =====================================================
    function renderTabla() {
        const lista = usuariosFiltrados();

        if (lista.length === 0) {
            return `
                <div class="tabla-empty">
                    <i data-lucide="search-x"></i>
                    <p>No se encontraron clientes${filtro ? ' con ese criterio' : ''}.</p>
                    ${filtro ? `<button class="link-btn" id="btn-limpiar-filtro">Limpiar búsqueda</button>` : ''}
                </div>
            `;
        }

        const filas = lista.map(u => `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-sm ${u.estado === 'inactivo' ? 'inactive' : ''}">${iniciales(u)}</div>
                        <div class="user-cell-info">
                            <strong>${u.nombre} ${u.apellido}</strong>
                            <span>@${u.username}</span>
                        </div>
                    </div>
                </td>
                <td>${u.dni}</td>
                <td class="td-email">${u.email}</td>
                <td>${u.telefono}</td>
                <td>${badgeEstado(u.estado)}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view"   title="Ver detalle"  data-id="${u.id}" data-action="ver">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="action-btn edit"   title="Editar"       data-id="${u.id}" data-action="editar">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button class="action-btn toggle" title="${u.estado === 'activo' ? 'Dar de baja' : 'Reactivar'}" data-id="${u.id}" data-action="baja">
                            <i data-lucide="${u.estado === 'activo' ? 'user-x' : 'user-check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        return `
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
    }

    // =====================================================
    //  MODALES HTML
    // =====================================================

    function renderModal() {
        return `
            <div class="dash-modal-overlay" id="modal-usuario" role="dialog" aria-modal="true" aria-labelledby="modal-usuario-titulo">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-usuario-titulo">Nuevo cliente</h3>
                        <button class="dash-modal-close" id="cerrar-modal-usuario" aria-label="Cerrar">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-usuario" novalidate>
                            <input type="hidden" id="form-id">

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-nombre">Nombre(s) <span class="req">*</span></label>
                                    <input type="text" id="form-nombre" placeholder="Ej: Juan Pablo" autocomplete="given-name">
                                    <small class="form-error" id="err-nombre"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-apellido">Apellido <span class="req">*</span></label>
                                    <input type="text" id="form-apellido" placeholder="Ej: Pérez" autocomplete="family-name">
                                    <small class="form-error" id="err-apellido"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-fechaNacimiento">
                                        Fecha nacimiento <span class="req">*</span>
                                    </label>
                                    <input type="date" id="form-fechaNacimiento">
                                    <small class="form-error" id="err-fechaNacimiento"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-nroSocio">N° Socio <span class="req">*</span></label>
                                    <input type="text" id="form-nroSocio" placeholder="SOC-1001">
                                    <small class="form-error" id="err-nroSocio"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-dni">DNI <span class="req">*</span></label>
                                    <input type="text" id="form-dni" placeholder="Ej: 40255711" inputmode="numeric" maxlength="8">
                                    <small class="form-error" id="err-dni"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-telefono">Teléfono <span class="req">*</span></label>
                                    <input type="text" id="form-telefono" placeholder="+54 11..." autocomplete="tel">
                                    <small class="form-error" id="err-telefono"></small>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="form-email">Correo electrónico <span class="req">*</span></label>
                                <input type="email" id="form-email" placeholder="correo@ejemplo.com" autocomplete="email">
                                <small class="form-error" id="err-email"></small>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-username">Nombre de usuario <span class="req">*</span></label>
                                    <input type="text" id="form-username" placeholder="usuario123" autocomplete="username">
                                    <small class="form-error" id="err-username"></small>
                                </div>
                                <div class="form-group" id="grupo-estado" style="display:none">
                                    <label for="form-estado">Estado</label>
                                    <select id="form-estado">
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" id="grupo-password">
                                <label for="form-password">Contraseña <span class="req">*</span></label>
                                <div class="pw-wrapper">
                                    <input type="password" id="form-password" placeholder="Mínimo 6 caracteres" minlength="6">
                                    <button type="button" class="pw-toggle" aria-label="Mostrar contraseña">👁️</button>
                                </div>
                                <small class="form-error" id="err-password"></small>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-modal-usuario">Cancelar</button>
                        <button class="btn-modal-save" id="guardar-usuario">
                            <i data-lucide="save"></i>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalDetalle() {
        return `
            <div class="dash-modal-overlay" id="modal-detalle" role="dialog" aria-modal="true">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3>Detalle del cliente</h3>
                        <button class="dash-modal-close" id="cerrar-modal-detalle" aria-label="Cerrar">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body" id="detalle-body">
                        <!-- Se llena dinámicamente -->
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cerrar-detalle-btn">Cerrar</button>
                        <button class="btn-modal-save" id="editar-desde-detalle">
                            <i data-lucide="pencil"></i>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModalBaja() {
        return `
            <div class="dash-modal-overlay" id="modal-baja" role="dialog" aria-modal="true">
                <div class="dash-modal dash-modal--sm">
                    <div class="dash-modal-header">
                        <h3 id="baja-titulo">Dar de baja</h3>
                        <button class="dash-modal-close" id="cerrar-modal-baja" aria-label="Cerrar">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <p id="baja-texto" style="color: var(--text); line-height:1.6"></p>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-baja">Cancelar</button>
                        <button class="btn-modal-danger" id="confirmar-baja">
                            <i data-lucide="user-x"></i>
                            <span id="baja-btn-texto">Confirmar baja</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  INIT — event listeners
    // =====================================================

    function init() {
        // Búsqueda
        document.getElementById('search-usuarios')?.addEventListener('input', e => {
            filtro = e.target.value.trim();
            refreshTabla();
        });

        // Limpiar filtro (vacía)
        document.addEventListener('click', e => {
            if (e.target.id === 'btn-limpiar-filtro') {
                filtro = '';
                document.getElementById('search-usuarios').value = '';
                refreshTabla();
            }
        });

        // Nuevo usuario
        document.getElementById('btn-nuevo-usuario')?.addEventListener('click', () => abrirModalNuevo());

        // Delegación de acciones en tabla
        document.getElementById('tabla-container')?.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id     = parseInt(btn.dataset.id);
            const action = btn.dataset.action;
            if (action === 'ver')    abrirDetalle(id);
            if (action === 'editar') abrirModalEditar(id);
            if (action === 'baja')   abrirModalBaja(id);
        });

        // Modal usuario — cerrar
        ['cerrar-modal-usuario', 'cancelar-modal-usuario'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => cerrarModal('modal-usuario'));
        });

        // Modal usuario — guardar
        document.getElementById('guardar-usuario')?.addEventListener('click', () => guardarUsuario());

        // Toggle password
        document.querySelector('#modal-usuario .pw-toggle')?.addEventListener('click', e => {
            const input = document.getElementById('form-password');
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            e.target.textContent = isPass ? '🙈' : '👁️';
        });

        // Modal detalle — cerrar
        ['cerrar-modal-detalle', 'cerrar-detalle-btn'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => cerrarModal('modal-detalle'));
        });

        // Modal detalle — editar
        document.getElementById('editar-desde-detalle')?.addEventListener('click', () => {
            const id = parseInt(document.getElementById('editar-desde-detalle').dataset.userId);
            cerrarModal('modal-detalle');
            abrirModalEditar(id);
        });

        // Modal baja — cerrar
        ['cerrar-modal-baja', 'cancelar-baja'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => cerrarModal('modal-baja'));
        });

        // Modal baja — confirmar
        document.getElementById('confirmar-baja')?.addEventListener('click', () => ejecutarBaja());

        // Cerrar modales con Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                cerrarModal('modal-usuario');
                cerrarModal('modal-detalle');
                cerrarModal('modal-baja');
            }
        });

        // Cerrar modales haciendo click fuera
        ['modal-usuario', 'modal-detalle', 'modal-baja'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', e => {
                if (e.target.id === id) cerrarModal(id);
            });
        });

        reinitLucideLocal();
    }

    // =====================================================
    //  MODAL NUEVO / EDITAR
    // =====================================================

    function abrirModalNuevo() {
        limpiarForm();
        document.getElementById('modal-usuario-titulo').textContent = 'Nuevo cliente';
        document.getElementById('form-id').value = '';
        document.getElementById('grupo-estado').style.display = 'none';
        document.getElementById('grupo-password').style.display = '';
        document.getElementById('form-password').required = true;
        abrirModal('modal-usuario');
    }

    function abrirModalEditar(id) {
        const u = usuarios.find(x => x.id === id);
        if (!u) return;

        limpiarForm();
        document.getElementById('modal-usuario-titulo').textContent = 'Editar cliente';
        document.getElementById('form-id').value       = u.id;
        document.getElementById('form-nombre').value   = u.nombre;
        document.getElementById('form-apellido').value = u.apellido;
        document.getElementById('form-dni').value      = u.dni;
        document.getElementById('form-telefono').value = u.telefono;
        document.getElementById('form-email').value    = u.email;
        document.getElementById('form-username').value = u.username;
        document.getElementById('form-estado').value   = u.estado;
        document.getElementById('grupo-estado').style.display   = '';
        document.getElementById('grupo-password').style.display = 'none';
        document.getElementById('form-password').required = false;

        abrirModal('modal-usuario');
    }

    function guardarUsuario() {
        if (!validarForm()) return;

        const id       = document.getElementById('form-id').value;
        const nombre   = document.getElementById('form-nombre').value.trim();
        const apellido = document.getElementById('form-apellido').value.trim();
        const dni      = document.getElementById('form-dni').value.trim();
        const telefono = document.getElementById('form-telefono').value.trim();
        const email    = document.getElementById('form-email').value.trim();
        const username = document.getElementById('form-username').value.trim();
        const estado   = document.getElementById('form-estado').value || 'activo';
        const nroSocio = document.getElementById('form-nroSocio').value.trim();
        const fechaNacimiento = document.getElementById('form-fechaNacimiento').value;

        if (id) {
            // Editar
            const idx = usuarios.findIndex(u => u.id === parseInt(id));
            if (idx !== -1) {
                usuarios[idx] = { ...usuarios[idx], nombre, apellido, dni, telefono, email, username, estado, nroSocio, fechaNacimiento };
                mostrarToast('Cliente actualizado correctamente.', 'success');
            }
        } else {
            // Nuevo
            usuarios.push({ id: nextId++, nombre, apellido, dni, telefono, email, username, estado: 'activo', fechaAlta: hoy(), nroSocio, fechaNacimiento });
            mostrarToast('Cliente registrado correctamente.', 'success');
        }

        cerrarModal('modal-usuario');
        refreshAll();
    }

    // =====================================================
    //  MODAL DETALLE
    // =====================================================

    function abrirDetalle(id) {
        const u = usuarios.find(x => x.id === id);
        if (!u) return;

        document.getElementById('detalle-body').innerHTML = `
            <div class="detalle-avatar">${iniciales(u)}</div>
            <div class="detalle-nombre">${u.nombre} ${u.apellido}</div>
            <div class="detalle-username">@${u.username} &nbsp;·&nbsp; ${badgeEstado(u.estado)}</div>
            <div class="detalle-grid">
                <div class="detalle-campo">
                    <span class="detalle-label">DNI</span>
                    <span class="detalle-valor">${u.dni}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Teléfono</span>
                    <span class="detalle-valor">${u.telefono}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Edad</span>
                    <span class="detalle-valor">
                        ${calcularEdad(u.fechaNacimiento)} años
                    </span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Fecha de nacimiento</span>
                    <span class="detalle-valor">
                        ${formatFecha(u.fechaNacimiento)}
                    </span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">N° Socio</span>
                    <span class="detalle-valor">
                        ${u.nroSocio}
                    </span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">Alta</span>
                    <span class="detalle-valor">${formatFecha(u.fechaAlta)}</span>
                </div>
                <div class="detalle-campo detalle-full">
                    <span class="detalle-label">Email</span>
                    <span class="detalle-valor">${u.email}</span>
                </div>
                <div class="detalle-campo">
                    <span class="detalle-label">ID</span>
                    <span class="detalle-valor">#${String(u.id).padStart(4,'0')}</span>
                </div>
            </div>
        `;

        document.getElementById('editar-desde-detalle').dataset.userId = u.id;
        abrirModal('modal-detalle');
    }

    // =====================================================
    //  MODAL BAJA / REACTIVAR
    // =====================================================

    let bajaTargetId = null;

    function abrirModalBaja(id) {
        const u = usuarios.find(x => x.id === id);
        if (!u) return;

        bajaTargetId = id;
        const deBaja = u.estado === 'activo';

        document.getElementById('baja-titulo').textContent = deBaja ? 'Dar de baja' : 'Reactivar cliente';
        document.getElementById('baja-texto').innerHTML = deBaja
            ? `¿Estás seguro que querés dar de baja a <strong>${u.nombre} ${u.apellido}</strong>?<br>El cliente no podrá acceder al sistema.`
            : `¿Querés reactivar a <strong>${u.nombre} ${u.apellido}</strong>?`;
        document.getElementById('baja-btn-texto').textContent = deBaja ? 'Dar de baja' : 'Reactivar';

        document.getElementById('form-fechaNacimiento').value = u.fechaNacimiento;
        document.getElementById('form-nroSocio').value = u.nroSocio;

        const btnConfirmar = document.getElementById('confirmar-baja');
        btnConfirmar.querySelector('i').setAttribute('data-lucide', deBaja ? 'user-x' : 'user-check');

        reinitLucideLocal();
        abrirModal('modal-baja');
    }

    function ejecutarBaja() {
        if (!bajaTargetId) return;
        const u = usuarios.find(x => x.id === bajaTargetId);
        if (!u) return;

        const deBaja = u.estado === 'activo';
        u.estado = deBaja ? 'inactivo' : 'activo';

        mostrarToast(
            deBaja ? `${u.nombre} ${u.apellido} fue dado de baja.` : `${u.nombre} ${u.apellido} fue reactivado.`,
            deBaja ? 'warning' : 'success'
        );

        bajaTargetId = null;
        cerrarModal('modal-baja');
        refreshAll();
    }

    // =====================================================
    //  VALIDACIÓN
    // =====================================================

    function validarForm() {
        let ok = true;
        limpiarErrores();

        const nombre   = document.getElementById('form-nombre').value.trim();
        const apellido = document.getElementById('form-apellido').value.trim();
        const dni      = document.getElementById('form-dni').value.trim();
        const tel      = document.getElementById('form-telefono').value.trim();
        const email    = document.getElementById('form-email').value.trim();
        const username = document.getElementById('form-username').value.trim();
        const pw       = document.getElementById('form-password').value;
        const esNuevo  = !document.getElementById('form-id').value;
        const nroSocio = document.getElementById('form-nroSocio').value.trim();
        const fechaNacimiento = document.getElementById('form-fechaNacimiento').value;    

        if (nombre.length < 2)                             { setFormError('err-nombre',   'Nombre muy corto'); ok = false; }
        if (apellido.length < 2)                           { setFormError('err-apellido', 'Apellido muy corto'); ok = false; }
        if (!/^\d{7,8}$/.test(dni))                        { setFormError('err-dni',      'DNI inválido (7 u 8 dígitos)'); ok = false; }
        if (tel.length < 8 || tel.length > 20)             { setFormError('err-telefono', 'Teléfono inválido'); ok = false; }
        if (!email.includes('@') || !email.includes('.'))  { setFormError('err-email',    'Email inválido'); ok = false; }
        if (username.length < 4 || username.length > 20)   { setFormError('err-username', 'Entre 4 y 20 caracteres'); ok = false; }
        if (esNuevo && pw.length < 6)                      { setFormError('err-password', 'Mínimo 6 caracteres'); ok = false; }
        if (!fechaNacimiento)                              { setFormError('err-fechaNacimiento','Ingrese fecha'); ok = false;}
        if (nroSocio.length < 4)                           { setFormError('err-nroSocio','Número inválido'); ok = false;}

        return ok;
    }

    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function setFormError(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = msg;
        // Marcar input hermano como error
        const input = el.previousElementSibling?.tagName === 'INPUT' || el.previousElementSibling?.tagName === 'SELECT'
            ? el.previousElementSibling
            : el.closest('.form-group')?.querySelector('input, select');
        input?.classList.add('input-error-field');
    }

    function limpiarErrores() {
        document.querySelectorAll('#modal-usuario .form-error').forEach(e => e.textContent = '');
        document.querySelectorAll('#modal-usuario .input-error-field').forEach(e => e.classList.remove('input-error-field'));
    }

    function limpiarForm() {
        ['form-nombre','form-apellido','form-dni','form-telefono','form-email','form-username','form-password']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        limpiarErrores();
    }

    // =====================================================
    //  UTILIDADES
    // =====================================================

    function usuariosFiltrados() {
        if (!filtro) return usuarios;
        const q = filtro.toLowerCase();
        return usuarios.filter(u =>
            `${u.nombre} ${u.apellido}`.toLowerCase().includes(q) ||
            u.dni.includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q)
        );
    }

    function refreshTabla() {
        const container = document.getElementById('tabla-container');
        if (container) {
            container.innerHTML = renderTabla();
            reinitLucideLocal();
        }
        // Actualizar contador
        const countEl = document.querySelector('.crud-count');
        if (countEl) countEl.textContent = `${usuarios.length} total`;
    }

    function refreshAll() {
        // Re-renderizar mini stats también
        const activos   = usuarios.filter(u => u.estado === 'activo').length;
        const inactivos = usuarios.filter(u => u.estado === 'inactivo').length;
        const stats = document.querySelector('.crud-mini-stats');
        if (stats) {
            stats.querySelectorAll('.mini-stat-num')[0].textContent = usuarios.length;
            stats.querySelectorAll('.mini-stat-num')[1].textContent = activos;
            stats.querySelectorAll('.mini-stat-num')[2].textContent = inactivos;
        }
        refreshTabla();
    }

    function abrirModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('activo');
        document.body.style.overflow = 'hidden';
        reinitLucideLocal();
    }

    function cerrarModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function iniciales(u) {
        return (u.nombre[0] + u.apellido[0]).toUpperCase();
    }

    function badgeEstado(estado) {
        return estado === 'activo'
            ? `<span class="badge success">Activo</span>`
            : `<span class="badge danger">Inactivo</span>`;
    }

    function formatFecha(fecha) {
        if (!fecha) return '—';
        const [y, m, d] = fecha.split('-');
        return `${d}/${m}/${y}`;
    }

    function hoy() {
        return new Date().toISOString().split('T')[0];
    }

    function reinitLucideLocal() {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // =====================================================
    //  TOAST
    // =====================================================

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
            <i data-lucide="${tipo === 'success' ? 'check-circle-2' : tipo === 'warning' ? 'alert-triangle' : 'info'}"></i>
            <span>${mensaje}</span>
        `;

        container.appendChild(toast);
        reinitLucideLocal();

        // Animar entrada
        requestAnimationFrame(() => toast.classList.add('toast-show'));

        // Auto-eliminar
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

// Registrar el módulo en el router principal
if (typeof registerModule === 'function') {
    registerModule('usuarios', UsuariosView);
}
