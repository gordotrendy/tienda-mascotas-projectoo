
let idEditar=null;

const obtenerclientes= async() =>{
    try {
        const response = await axios.get('http://localhost:3000/ventas')
        const resProductos = await axios.get('http://localhost:3000/productos');

        const datos = response.data
        const productos = resProductos.data;

        const tbody= document.getElementById('TablaVentas')

        tbody.innerHTML = ''

        datos.forEach(cliente => {
            const producto = productos.find(p => p.id == cliente.productoId);
            const tr=document.createElement('tr')
            tr.innerHTML=`
            <td>${cliente.id}</td>
            <td>${producto.nombre}</td>
            <td>${cliente.cliente}</td>
            <td>${cliente.cantidad}</td>
            <td>${cliente.total}</td>
            <td>${cliente.fecha}</td>
            <td>
            <button onclick="Editarcliente('${cliente.id}','${cliente.cliente}','${cliente.cantidad}','${cliente.total}')"type="button" class="btn btn-warning">Editar</button>
            <button onclick="Eliminarcliente('${cliente.id}')" type="button" class="btn btn-danger">Eliminar</button>
            <button onclick="Verhistorial('${cliente.cliente}')" type="button" class="btn btn-info">Historial</button>
            </td>
            
            `

            tbody.appendChild(tr)

        });


    } catch (error) {
        console.log(error);
    }



}


obtenerclientes()

const Eliminarcliente= async(id) =>{

    const confirmacion = confirm("Esta seguro de querer eliminar el pedido?") 
    if (!confirmacion) return


    try {
        const ventaResponse = await axios.get(`http://localhost:3000/ventas/${id}`)
        const venta = ventaResponse.data

        const productoResponse = await axios.get(`http://localhost:3000/productos/${venta.productoId}`)
        const producto = productoResponse.data

        const nuevoStock = producto.stock + Number(venta.cantidad)

        await axios.patch(`http://localhost:3000/productos/${venta.productoId}`, { stock: nuevoStock })




        const response = await axios.delete(`http://localhost:3000/ventas/${id}`)
        obtenerclientes();
        listarProductos();


    } catch (error) {
        console.log(error)
    }



}

const Verhistorial = async(clienteNombre) =>{   

try {
    
    const response = await axios.get(`http://localhost:3000/ventas?cliente=${clienteNombre}`)
    const resProductos = await axios.get('http://localhost:3000/productos');

    const datos=response.data
    const productos = resProductos.data;

    const tbody = document.getElementById('TablaHistorial')
    tbody.innerHTML = ''

    datos.forEach(venta => {
            const producto = productos.find(p => p.id == venta.productoId);
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${venta.cliente}</td>
                <td>${producto.nombre}</td>
                <td>${venta.cantidad}</td>
                <td>${venta.total}</td>
                <td>${venta.fecha}</td>
            `
            tbody.appendChild(tr)
        })


    const modal = new bootstrap.Modal(document.getElementById('modalHistorial'))
    modal.show()




} catch (error) {
    console.log(error)
}




}

const cargarProductos = async () => {
    try {
        const response = await axios.get('http://localhost:3000/productos')
        const datos = response.data
        const select = document.getElementById('selectProducto')

        select.innerHTML = '<option>Selecciona un producto</option>'

        datos.forEach(producto => {
            const option = document.createElement('option')
            option.value = producto.id
            option.dataset.precio = producto.precio
            option.dataset.stock = producto.stock
            option.textContent = producto.nombre
            select.appendChild(option)
        })

    } catch (error) {
        console.log(error)
    }
}

cargarProductos()

const Crearcliente = async () => {
    const clienteInput = document.getElementById('inputCliente').value;
    const productoInput = document.getElementById('selectProducto').value;
    const cantidadInput = Number(document.getElementById('inputCantidad').value);
    const totalInput = Number(document.getElementById('inputTotal').value);

    if (!clienteInput || cantidadInput <= 0 || totalInput <= 0) {
        alert("Por favor completar todos los campos correctamente");
        return;
    }

    try {
        const datos = {
            cliente: clienteInput,
            productoId : productoInput,
            cantidad: cantidadInput,
            total: totalInput,
            fecha: new Date().toISOString().split('T')[0]
        };
       
        await axios.post('http://localhost:3000/ventas', datos);

        const resProducto = await axios.get(`http://localhost:3000/productos/${productoInput}`);
        const stockActual = Number(resProducto.data.stock);
        const nuevoStock = stockActual - cantidadInput;

        await axios.patch(`http://localhost:3000/productos/${productoInput}`, { stock: nuevoStock });

        obtenerclientes();
        listarProductos()
;
    } catch (error) {
        console.log(error);
    }
}

const GuardarCambios = async () => {
    let cliente  = document.getElementById('inputClienteEditar').value   
    let cantidad = document.getElementById('inputCantidadEditar').value  
    let total    = document.getElementById('inputTotalEditar').value   


    cantidad=Number(cantidad)
    total=Number(total)

    if(!cliente || cantidad <= 0 || total <= 0) {

        alert("Por favor completar todos los campos correctamente")
        return
    

    }
    

    try {
        

        const datos = { cliente, cantidad, total }

        await axios.patch(`http://localhost:3000/ventas/${idEditar}`, datos)
        idEditar = null
        obtenerclientes()

    } catch (error) {
        console.log(error)
    }
}


const calcularTotal = () => {
    const select = document.getElementById('selectProducto')
    const opcion = select.options[select.selectedIndex]
    const precio = Number(opcion?.dataset?.precio || 0)
    const cantidad = Number(document.getElementById('inputCantidad').value)
    const total = precio * cantidad
    document.getElementById('inputTotal').value = total > 0 ? total : ''
}

document.getElementById('selectProducto').addEventListener('change', calcularTotal)
document.getElementById('inputCantidad').addEventListener('input', calcularTotal)



const Editarcliente= async (id,nombre,cantidad,total) =>{

    document.getElementById('inputClienteEditar').value = nombre
    document.getElementById('inputCantidadEditar').value = cantidad
    document.getElementById('inputTotalEditar').value = total
    idEditar=id 

    const modal = new bootstrap.Modal(document.getElementById('modalEditar'))
    modal.show()



}


