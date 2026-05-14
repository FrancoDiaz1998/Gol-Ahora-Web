// =====================================================
//  MÓDULO DE GESTIÓN DE EMPLEADOS
// =====================================================

const EmpleadosView = (() => {

    // =====================================================
    //  DATOS MOCK
    // =====================================================

    let empleados = [
        {
            idEmpleado: 1,
            nombre: 'Carlos',
            apellido: 'Ramírez',
            dni: '38455122',
            email: 'carlos.ramirez@golahora.com',
            telefono: '11-44556677',
            userName: 'cramirez',
            activo: true,
            legajo: 'EMP-1001',
            fechaIngreso: '2024-06-01',
            cargo: 'Cajero',
            turno: 'Mañana',
            sector: 'Recepción'
        },
        {
            idEmpleado: 2,
            nombre: 'Martín',
            apellido: 'López',
            dni: '39200555',
            email: 'martin.lopez@golahora.com',
            telefono: '11-55667788',
            userName: 'mlopez',
            activo: true,
            legajo: 'EMP-1002',
            fechaIngreso: '2024-05-15',
            cargo: 'Operador',
            turno: 'Tarde',
            sector: 'Cancha'
        },
        {
            idEmpleado: 3,
            nombre: 'Analía',
            apellido: 'González',
            dni: '37800111',
            email: 'analia.gonzalez@golahora.com',
            telefono: '11-66778899',
            userName: 'agonzalez',
            activo: true,
            legajo: 'EMP-1003',
            fechaIngreso: '2024-04-20',
            cargo: 'Administrativo',
            turno: 'Mañana',
            sector: 'Administración'
        },
        {
            idEmpleado: 4,
            nombre: 'Roberto',
            apellido: 'Fernández',
            dni: '36500333',
            email: 'roberto.fernandez@golahora.com',
            telefono: '11-77889900',
            userName: 'rfernandez',
            activo: false,
            legajo: 'EMP-1004',
            fechaIngreso: '2024-03-10',
            cargo: 'Limpieza',
            turno: 'Noche',
            sector: 'Mantenimiento'
        }
    ];

    let nextId = 5;
    let filtro = '';
    let bajaTargetId = null;

    // =====================================================
    //  RENDER PRINCIPAL
    // =====================================================

    function render() {
        const activos = empleados.filter(e => e.activo).length;
        const inactivos = empleados.filter(e => !e.activo).length;

        return `
            <div class="crud-toolbar">
                <div class="crud-toolbar-left">
                    <h2 class="crud-title">Empleados</h2>
                    <span class="crud-count">${empleados.length} total</span>
                </div>
                <div class="crud-toolbar-right">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="search-empleados" placeholder="Buscar empleado..." value="${filtro}">
                    </div>
                    <button class="btn-primary-action" id="btn-nuevo-empleado">
                        <i data-lucide="user-plus"></i>
                        Nuevo empleado
                    </button>
                </div>
            </div>

            <!-- STATS -->
            <div class="crud-mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-num">${empleados.length}</span>
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
        const lista = empleadosFiltrados();

        if (lista.length === 0) {
            return `
                <div class="tabla-empty">
                    <i data-lucide="search-x"></i>
                    <p>No se encontraron empleados${filtro ? ' con ese criterio' : ''}.</p>
                    ${filtro ? `<button class="link-btn" id="btn-limpiar-filtro">Limpiar búsqueda</button>` : ''}
                </div>
            `;
        }

        const filas = lista.map(e => `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-sm ${!e.activo ? 'inactive' : ''}">${iniciales(e)}</div>
                        <div class="user-cell-info">
                            <strong>${e.nombre} ${e.apellido}</strong>
                            <span>${e.legajo}</span>
                        </div>
                    </div>
                </td>
                <td>${e.cargo}</td>
                <td>${e.turno}</td>
                <td>${e.sector}</td>
                <td>${badgeEstado(e.activo)}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" title="Ver detalle" data-id="${e.idEmpleado}" data-action="ver">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="action-btn edit" title="Editar" data-id="${e.idEmpleado}" data-action="editar">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button class="action-btn toggle" title="${e.activo ? 'Dar de baja' : 'Reactivar'}" data-id="${e.idEmpleado}" data-action="baja">
                            <i data-lucide="${e.activo ? 'user-x' : 'user-check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        return `
            <table>
                <thead>
                    <tr>
                        <th>Empleado</th>
                        <th>Cargo</th>
                        <th>Turno</th>
                        <th>Sector</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
    }

    // =====================================================
    //  MODAL FORMULARIO
    // =====================================================

    function renderModal() {
        return `
            <div class="dash-modal-overlay" id="modal-empleado" role="dialog" aria-modal="true" aria-labelledby="modal-empleado-titulo">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3 id="modal-empleado-titulo">Nuevo empleado</h3>
                        <button class="dash-modal-close" id="cerrar-modal-empleado" aria-label="Cerrar">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <form id="form-empleado" novalidate>
                            <input type="hidden" id="form-id">

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-nombre">Nombre <span class="req">*</span></label>
                                    <input type="text" id="form-nombre" required>
                                    <small class="form-error" id="err-nombre"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-apellido">Apellido <span class="req">*</span></label>
                                    <input type="text" id="form-apellido" required>
                                    <small class="form-error" id="err-apellido"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-dni">DNI <span class="req">*</span></label>
                                    <input type="text" id="form-dni" required>
                                    <small class="form-error" id="err-dni"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-email">Email <span class="req">*</span></label>
                                    <input type="email" id="form-email" required>
                                    <small class="form-error" id="err-email"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-telefono">Teléfono <span class="req">*</span></label>
                                    <input type="text" id="form-telefono" required>
                                    <small class="form-error" id="err-telefono"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-legajo">Legajo <span class="req">*</span></label>
                                    <input type="text" id="form-legajo" required>
                                    <small class="form-error" id="err-legajo"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-userName">Username <span class="req">*</span></label>
                                    <input type="text" id="form-userName" required>
                                    <small class="form-error" id="err-userName"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-cargo">Cargo <span class="req">*</span></label>
                                    <select id="form-cargo" required>
                                        <option value="">Seleccionar</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="Operador">Operador</option>
                                        <option value="Limpieza">Limpieza</option>
                                    </select>
                                    <small class="form-error" id="err-cargo"></small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="form-turno">Turno <span class="req">*</span></label>
                                    <select id="form-turno" required>
                                        <option value="">Seleccionar</option>
                                        <option value="Mañana">Mañana</option>
                                        <option value="Tarde">Tarde</option>
                                        <option value="Noche">Noche</option>
                                    </select>
                                    <small class="form-error" id="err-turno"></small>
                                </div>
                                <div class="form-group">
                                    <label for="form-sector">Sector <span class="req">*</span></label>
                                    <input type="text" id="form-sector" placeholder="Ej: Recepción" required>
                                    <small class="form-error" id="err-sector"></small>
                                </div>
                            </div>

                            <div class="form-group" id="grupo-password">
                                <label for="form-password">Contraseña <span class="req">*</span></label>
                                <div class="pw-wrapper">
                                    <input type="password" id="form-password">
                                    <button type="button" class="pw-toggle">
                                        👁️
                                    </button>
                                </div>
                                <small class="form-error" id="err-password"></small>
                            </div>

                            <div class="form-group" id="grupo-estado" style="display:none">
                                <label for="form-estado">Estado</label>
                                <select id="form-estado">
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-modal-empleado">
                            Cancelar
                        </button>
                        <button class="btn-modal-save" id="aceptar-modal-empleado">
                            Guardar empleado
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  MODAL DETALLE
    // =====================================================

    function renderDetalle() {
        return `
            <div class="dash-modal-overlay" id="modal-detalle-empleado">
                <div class="dash-modal">
                    <div class="dash-modal-header">
                        <h3>Detalle del Empleado</h3>
                        <button class="dash-modal-close" id="cerrar-detalle-empleado">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body" id="detalle-empleado-body">
                        <!-- Se carga dinámicamente -->
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  MODAL CONFIRMAR BAJA
    // =====================================================

    function renderModalBaja() {
        return `
            <div class="dash-modal-overlay" id="modal-baja-empleado">
                <div class="dash-modal modal-sm">
                    <div class="dash-modal-header">
                        <h3>Cambiar estado</h3>
                        <button class="dash-modal-close" id="cerrar-baja-empleado">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="dash-modal-body">
                        <p id="baja-mensaje">¿Desea continuar?</p>
                    </div>
                    <div class="dash-modal-footer">
                        <button class="btn-modal-cancel" id="cancelar-baja-empleado">
                            Cancelar
                        </button>
                        <button class="btn-modal-danger" id="confirmar-baja-empleado">
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // =====================================================
    //  LÓGICA - INIT
    // =====================================================

    function init() {
        attachSearchListener();
        attachBtnNuevoEmpleado();
        attachModalEvents();
        attachDetalleEvents();
        attachBajaEvents();
        attachTableActions();
    }

    function attachSearchListener() {
        const searchInput = document.getElementById('search-empleados');
        searchInput?.addEventListener('input', (e) => {
            filtro = e.target.value;
            refreshTabla();
        });

        const btnLimpiar = document.getElementById('btn-limpiar-filtro');
        btnLimpiar?.addEventListener('click', () => {
            filtro = '';
            refreshTabla();
        });
    }

    function attachBtnNuevoEmpleado() {
        document.getElementById('btn-nuevo-empleado')?.addEventListener('click', () => {
            abrirModalNuevo();
        });
    }

    function attachModalEvents() {
        document.getElementById('cerrar-modal-empleado')?.addEventListener('click', () => {
            cerrarModal('modal-empleado');
        });

        document.getElementById('cancelar-modal-empleado')?.addEventListener('click', () => {
            cerrarModal('modal-empleado');
        });

        document.getElementById('aceptar-modal-empleado')?.addEventListener('click', () => {
            guardarEmpleado();
        });

        const form = document.getElementById('form-empleado');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarEmpleado();
        });

        // Toggle password
        document.querySelector('#modal-empleado .pw-toggle')?.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.getElementById('form-password');
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    }

    function attachDetalleEvents() {
        document.getElementById('cerrar-detalle-empleado')?.addEventListener('click', () => {
            cerrarModal('modal-detalle-empleado');
        });
    }

    function attachBajaEvents() {
        document.getElementById('cerrar-baja-empleado')?.addEventListener('click', () => {
            cerrarModal('modal-baja-empleado');
        });

        document.getElementById('cancelar-baja-empleado')?.addEventListener('click', () => {
            cerrarModal('modal-baja-empleado');
        });

        document.getElementById('confirmar-baja-empleado')?.addEventListener('click', () => {
            confirmarCambioEstado();
        });
    }

    function attachTableActions() {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                const accion = btn.dataset.action;

                if (accion === 'ver') {
                    abrirDetalle(id);
                } else if (accion === 'editar') {
                    abrirModalEditar(id);
                } else if (accion === 'baja') {
                    abrirModalBaja(id);
                }
            });
        });
    }

    // =====================================================
    //  FUNCIONES - MODALES
    // =====================================================

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

    function abrirModalNuevo() {
        limpiarForm();
        limpiarErrores();
        document.getElementById('form-id').value = '';
        document.getElementById('modal-empleado-titulo').textContent = 'Nuevo empleado';
        document.getElementById('grupo-password').style.display = 'block';
        document.getElementById('grupo-estado').style.display = 'none';
        abrirModal('modal-empleado');
    }

    function abrirModalEditar(id) {
        const emp = empleados.find(e => e.idEmpleado === id);
        if (!emp) return;

        limpiarForm();
        limpiarErrores();

        document.getElementById('form-id').value = id;
        document.getElementById('form-nombre').value = emp.nombre;
        document.getElementById('form-apellido').value = emp.apellido;
        document.getElementById('form-dni').value = emp.dni;
        document.getElementById('form-email').value = emp.email;
        document.getElementById('form-telefono').value = emp.telefono;
        document.getElementById('form-legajo').value = emp.legajo;
        document.getElementById('form-userName').value = emp.userName;
        document.getElementById('form-cargo').value = emp.cargo;
        document.getElementById('form-turno').value = emp.turno;
        document.getElementById('form-sector').value = emp.sector;
        document.getElementById('form-estado').value = emp.activo ? 'true' : 'false';

        document.getElementById('modal-empleado-titulo').textContent = 'Editar empleado';
        document.getElementById('grupo-password').style.display = 'none';
        document.getElementById('grupo-estado').style.display = 'block';

        abrirModal('modal-empleado');
    }

    function abrirDetalle(id) {
        const emp = empleados.find(e => e.idEmpleado === id);
        if (!emp) return;

        const body = document.getElementById('detalle-empleado-body');
        body.innerHTML = `
            <div class="detalle-info">
                <div class="detalle-avatar">${iniciales(emp)}</div>
                <h2 class="detalle-nombre">${emp.nombre} ${emp.apellido}</h2>
                <p class="detalle-username">
                    @${emp.userName}
                </p>
                <div class="detalle-grid">
                    <div class="detalle-campo">
                        <span class="detalle-label">DNI</span>
                        <div class="detalle-valor">${emp.dni}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Legajo</span>
                        <div class="detalle-valor">${emp.legajo}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Cargo</span>
                        <div class="detalle-valor">${emp.cargo}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Turno</span>
                        <div class="detalle-valor">${emp.turno}</div>
                    </div>
                    <div class="detalle-campo detalle-full">
                        <span class="detalle-label">Email</span>
                        <div class="detalle-valor">${emp.email}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Teléfono</span>
                        <div class="detalle-valor">${emp.telefono}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Sector</span>
                        <div class="detalle-valor">${emp.sector}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Fecha Ingreso</span>
                        <div class="detalle-valor">${formatFecha(emp.fechaIngreso)}</div>
                    </div>
                    <div class="detalle-campo">
                        <span class="detalle-label">Estado</span>
                        <div class="detalle-valor">${badgeEstado(emp.activo)}</div>
                    </div>
                </div>
            </div>
        `;

        abrirModal('modal-detalle-empleado');
    }

    function abrirModalBaja(id) {
        const emp = empleados.find(e => e.idEmpleado === id);
        if (!emp) return;

        bajaTargetId = id;
        const mensaje = emp.activo
            ? `¿Dar de baja a ${emp.nombre} ${emp.apellido}?`
            : `¿Reactivar a ${emp.nombre} ${emp.apellido}?`;

        document.getElementById('baja-mensaje').textContent = mensaje;
        abrirModal('modal-baja-empleado');
    }

    function confirmarCambioEstado() {
        const emp = empleados.find(e => e.idEmpleado === bajaTargetId);
        if (!emp) return;

        emp.activo = !emp.activo;
        mostrarToast(
            emp.activo ? 'Empleado reactivado correctamente' : 'Empleado dado de baja correctamente',
            'success'
        );

        cerrarModal('modal-baja-empleado');
        refreshAll();
        bajaTargetId = null;
    }

    // =====================================================
    //  VALIDACIÓN Y GUARDADO
    // =====================================================

    function guardarEmpleado() {
        limpiarErrores();

        if (!validarForm()) return;

        const id = document.getElementById('form-id').value;
        const datos = {
            nombre: document.getElementById('form-nombre').value.trim(),
            apellido: document.getElementById('form-apellido').value.trim(),
            dni: document.getElementById('form-dni').value.trim(),
            email: document.getElementById('form-email').value.trim(),
            telefono: document.getElementById('form-telefono').value.trim(),
            legajo: document.getElementById('form-legajo').value.trim(),
            userName: document.getElementById('form-userName').value.trim(),
            cargo: document.getElementById('form-cargo').value,
            turno: document.getElementById('form-turno').value,
            sector: document.getElementById('form-sector').value.trim(),
        };

        if (id) {
            // Editar
            const index = empleados.findIndex(e => e.idEmpleado === Number(id));
            if (index !== -1) {
                empleados[index] = {
                    ...empleados[index],
                    ...datos,
                    activo: document.getElementById('form-estado').value === 'true'
                };
                mostrarToast('Empleado actualizado correctamente', 'success');
            }
        } else {
            // Crear nuevo
            const password = document.getElementById('form-password').value;
            if (password.length < 6) {
                setFormError('err-password', 'Mínimo 6 caracteres');
                return;
            }

            const nuevoEmpleado = {
                idEmpleado: Date.now(),
                ...datos,
                activo: true,
                fechaIngreso: hoy()
            };

            empleados.push(nuevoEmpleado);
            mostrarToast('Nuevo empleado registrado correctamente', 'success');
        }

        cerrarModal('modal-empleado');
        refreshAll();
    }

    function validarForm() {
        let ok = true;

        const nombre = document.getElementById('form-nombre').value.trim();
        const apellido = document.getElementById('form-apellido').value.trim();
        const dni = document.getElementById('form-dni').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const telefono = document.getElementById('form-telefono').value.trim();
        const legajo = document.getElementById('form-legajo').value.trim();
        const userName = document.getElementById('form-userName').value.trim();
        const cargo = document.getElementById('form-cargo').value;
        const turno = document.getElementById('form-turno').value;
        const sector = document.getElementById('form-sector').value.trim();
        const esNuevo = !document.getElementById('form-id').value;
        const password = document.getElementById('form-password').value;

        if (nombre.length < 2) { setFormError('err-nombre', 'Nombre muy corto'); ok = false; }
        if (apellido.length < 2) { setFormError('err-apellido', 'Apellido muy corto'); ok = false; }
        if (!/^\d{7,8}$/.test(dni)) { setFormError('err-dni', 'DNI inválido (7 u 8 dígitos)'); ok = false; }
        if (telefono.length < 8 || telefono.length > 20) { setFormError('err-telefono', 'Teléfono inválido'); ok = false; }
        if (!email.includes('@') || !email.includes('.')) { setFormError('err-email', 'Email inválido'); ok = false; }
        if (legajo.length < 4) { setFormError('err-legajo', 'Legajo inválido'); ok = false; }
        if (userName.length < 4 || userName.length > 20) { setFormError('err-userName', 'Entre 4 y 20 caracteres'); ok = false; }
        if (!cargo) { setFormError('err-cargo', 'Seleccione un cargo'); ok = false; }
        if (!turno) { setFormError('err-turno', 'Seleccione un turno'); ok = false; }
        if (sector.length < 2) { setFormError('err-sector', 'Sector muy corto'); ok = false; }
        if (esNuevo && password.length < 6) { setFormError('err-password', 'Mínimo 6 caracteres'); ok = false; }

        return ok;
    }

    function setFormError(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = msg;
        const input = el.previousElementSibling?.tagName === 'INPUT' || el.previousElementSibling?.tagName === 'SELECT'
            ? el.previousElementSibling
            : el.closest('.form-group')?.querySelector('input, select');
        input?.classList.add('input-error-field');
    }

    function limpiarErrores() {
        document.querySelectorAll('#modal-empleado .form-error').forEach(e => e.textContent = '');
        document.querySelectorAll('#modal-empleado .input-error-field').forEach(e => e.classList.remove('input-error-field'));
    }

    function limpiarForm() {
        ['form-nombre', 'form-apellido', 'form-dni', 'form-email', 'form-telefono', 'form-legajo', 'form-userName', 'form-cargo', 'form-turno', 'form-sector', 'form-password']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    }

    // =====================================================
    //  ACTUALIZACIÓN Y REFRESCO
    // =====================================================

    function refreshTabla() {
        const container = document.getElementById('tabla-container');
        if (container) {
            container.innerHTML = renderTabla();
            reinitLucideLocal();
            attachTableActions();
        }
    }

    function refreshAll() {
        const activos = empleados.filter(e => e.activo).length;
        const inactivos = empleados.filter(e => !e.activo).length;
        const stats = document.querySelector('.crud-mini-stats');
        if (stats) {
            stats.querySelectorAll('.mini-stat-num')[0].textContent = empleados.length;
            stats.querySelectorAll('.mini-stat-num')[1].textContent = activos;
            stats.querySelectorAll('.mini-stat-num')[2].textContent = inactivos;
        }
        refreshTabla();
    }

    // =====================================================
    //  UTILIDADES
    // =====================================================

    function empleadosFiltrados() {
        if (!filtro) return empleados;
        const q = filtro.toLowerCase();
        return empleados.filter(e =>
            `${e.nombre} ${e.apellido}`.toLowerCase().includes(q) ||
            e.dni.includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.legajo.toLowerCase().includes(q) ||
            e.userName.toLowerCase().includes(q)
        );
    }

    function iniciales(e) {
        return (e.nombre[0] + e.apellido[0]).toUpperCase();
    }

    function badgeEstado(activo) {
        return activo
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

// Registrar el módulo en el router principal
if (typeof registerModule === 'function') {
    registerModule('empleados', EmpleadosView);
}