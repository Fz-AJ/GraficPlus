// ===== CARRITO DE COMPRAS - GRAFIC PLUS =====

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        // Si existe, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregar nuevo producto
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar notificación
    mostrarNotificacion(`${nombre} añadido al carrito`);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.innerHTML = `
        <span>✅ ${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 2500);
}

// Función para actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const contador = document.querySelector('.carrito-contador');
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ===== FUNCIONES PARA INDEX5.HTML (Página del carrito) =====

// Función para cargar y mostrar el carrito
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('carrito-contenido');
    const totalGeneral = document.getElementById('total-general');
    const vacioMensaje = document.getElementById('carrito-vacio');
    
    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío
        contenedor.innerHTML = '';
        vacioMensaje.style.display = 'block';
        totalGeneral.textContent = 'L 0.00';
        document.querySelector('.btn-comprar-carrito').style.display = 'none';
        return;
    }
    
    vacioMensaje.style.display = 'none';
    document.querySelector('.btn-comprar-carrito').style.display = 'inline-block';
    
    // Generar HTML de los productos
    let html = '';
    let total = 0;
    
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        html += `
            <div class="carrito-item" data-index="${index}">
                <div class="carrito-item-imagen">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p class="carrito-item-precio">L ${item.precio.toFixed(2)}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button onclick="cambiarCantidad(${index}, -1)" class="btn-cantidad btn-menos">−</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)" class="btn-cantidad btn-mas">+</button>
                </div>
                <div class="carrito-item-subtotal">
                    <p>L ${subtotal.toFixed(2)}</p>
                </div>
                <button onclick="eliminarProducto(${index})" class="btn-eliminar">✕</button>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
    totalGeneral.textContent = `L ${total.toFixed(2)}`;
    
    // Actualizar contador en header
    actualizarContadorCarrito();
}

// Función para cambiar cantidad
function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        // Si la cantidad llega a 0, eliminar el producto
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        
        // Guardar cambios
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Recargar el carrito
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

// Función para eliminar producto completo
function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

// Función para mostrar el formulario de compra
function mostrarFormularioCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío. Agrega productos primero.');
        return;
    }
    
    const formulario = document.getElementById('formulario-compra');
    const total = document.getElementById('total-general').textContent;
    
    if (formulario.style.display === 'block') {
        formulario.style.display = 'none';
        return;
    }
    
    // Actualizar total en el formulario
    document.getElementById('total-compra').textContent = total;
    formulario.style.display = 'block';
    formulario.scrollIntoView({ behavior: 'smooth' });
}

// Función para cerrar el formulario
function cerrarFormulario() {
    document.getElementById('formulario-compra').style.display = 'none';
}

// Función para confirmar compra (simulada)
function confirmarCompra() {
    const metodo = document.querySelector('input[name="metodo-pago"]:checked');
    if (!metodo) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }
    
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = document.getElementById('total-general').textContent;
    const nombre = document.getElementById('nombre-cliente').value.trim();
    const telefono = document.getElementById('telefono-cliente').value.trim();
    
    if (!nombre) {
        alert('Por favor, ingresa tu nombre.');
        return;
    }
    
    // Simular compra exitosa
    const mensaje = `
        🛒 ¡Compra realizada con éxito!
        
        Cliente: ${nombre}
        Teléfono: ${telefono || 'No especificado'}
        Método: ${metodo.value === 'tarjeta' ? '💳 Pago con tarjeta' : '🏪 Recoger en tienda'}
        Total: ${total}
        
        Productos:
        ${carrito.map(item => `- ${item.nombre} x${item.cantidad} = L ${(item.precio * item.cantidad).toFixed(2)}`).join('\n')}
        
        ¡Gracias por tu compra en Grafic Plus! ❤️
    `;
    
    alert(mensaje);
    
    // Vaciar carrito después de la compra
    localStorage.removeItem('carrito');
    cargarCarrito();
    actualizarContadorCarrito();
    cerrarFormulario();
    
    // Reiniciar formulario
    document.getElementById('nombre-cliente').value = '';
    document.getElementById('telefono-cliente').value = '';
    document.querySelector('input[name="metodo-pago"]:checked').checked = false;
}

// ===== INICIALIZACIÓN =====
// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    // Para index5.html - cargar carrito
    if (document.getElementById('carrito-contenido')) {
        cargarCarrito();
    }
    
    // Para todas las páginas - actualizar contador
    actualizarContadorCarrito();
});