// ===== PANEL LATERAL DE COTIZACIÓN =====
const WHATSAPP_NUMERO = '50498283026';

const panel = document.getElementById('panelCotizacion');
const overlay = document.getElementById('panelOverlay');
const btnCerrar = document.getElementById('panelCerrar');
const form = document.getElementById('panelForm');
const nombreProducto = document.getElementById('panelProducto');
const precioProducto = document.getElementById('panelPrecio');

let botonOrigen = null;

function abrirPanel(boton) {
    botonOrigen = boton;
    nombreProducto.textContent = boton.dataset.producto || 'Producto personalizado';
    precioProducto.textContent = boton.dataset.precio || '';
    overlay.hidden = false;
    panel.classList.add('abierto');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sin-scroll');
    document.getElementById('cotNombre').focus();
}

function cerrarPanel() {
    panel.classList.remove('abierto');
    panel.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    document.body.classList.remove('sin-scroll');
    if (botonOrigen) {
        botonOrigen.focus();
        botonOrigen = null;
    }
}

document.querySelectorAll('.btn-producto').forEach(function (boton) {
    boton.addEventListener('click', function () {
        abrirPanel(boton);
    });
});

btnCerrar.addEventListener('click', cerrarPanel);
overlay.addEventListener('click', cerrarPanel);

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && panel.classList.contains('abierto')) {
        cerrarPanel();
    }
});

form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const datos = new FormData(form);
    const mensaje =
        'Hola Grafic Plus, quiero cotizar:\n' +
        'Producto: ' + nombreProducto.textContent + '\n' +
        'Precio de referencia: ' + (precioProducto.textContent || 'N/D') + '\n' +
        'Cantidad: ' + datos.get('cantidad') + '\n' +
        'Nombre: ' + datos.get('nombre') + '\n' +
        'Contacto: ' + datos.get('contacto') + '\n' +
        'Detalles: ' + (datos.get('detalles') || 'Sin detalles');

    window.open('https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensaje), '_blank');
    form.reset();
    cerrarPanel();
});
