let IdEditar = null;


const listarProductos = async () => {
    
    try{

        const response = await axios.get('http://localhost:3000/productos');
        const resCategorias = await axios.get('http://localhost:3000/categorias');

        const datos = response.data 
        const categorias = resCategorias.data;

        const productosSection = document.getElementById("productos");
        productosSection.innerHTML = '';

        datos.forEach(producto => {
            const categoria = categorias.find(c => c.id === producto.categoriaId); // Encuentra la categoria vinculando los id
            const div = document.createElement('div');
            div.classList.add('tarjeta-producto');
            div.innerHTML = `<div>
                            <p>${producto.nombre}</p>
                            <p>${producto.descripcion}</p>
                            <p>${producto.precio}</p>
                            <p>${producto.stock}</p>
                            <p>${categoria.nombre}</p></div>
                            <div>
                            <button type="button" class="btn btn-warning"
                             onclick="editarInputs('${producto.id}','${producto.nombre}','${producto.descripcion}','${producto.precio}','${producto.stock}','${producto.categoriaId}')">Editar</button>
                            <button type="button" class="btn btn-danger" onclick="eliminarProducto('${producto.id}')">Eliminar</button></div>
                                `
            productosSection.appendChild(div)

            
        });

    }catch(error){

        alert('error listar')

    }

}

listarProductos();

const cargarProducto = async() => {
    try{


        const nombreInput = document.getElementById("nombreProducto").value;
        const precioInput = document.getElementById("precioProducto").value;
        const stockInput = document.getElementById("stockProducto").value;
        const descInput = document.getElementById("descProducto").value;
        const categoriaInput  = document.getElementById("selectCategoria").value;

        if(nombreInput == '' || precioInput == '' || stockInput == '' || descInput == '' || categoriaInput == ''){

            alert('Campos incompletos');

            return;

        }

    
        const datos = {
            
            nombre : nombreInput,
            descripcion : descInput,
            precio :  precioInput,
            stock: stockInput,
            categoriaId :categoriaInput
            
        }
        const response = await axios.post('http://localhost:3000/productos', datos)
        listarProductos();
        cargarProductos();
        
    }catch(err){
        
        alert('algo salio mal creando')
        
    }
    nombreProducto.value = ''
    precioProducto.value = ''
    stockProducto.value = ''
    descProducto.value = ''
    selectCategoria.value = ''
}

const eliminarProducto = async (id) => {
    const confirmado = confirm("¿Estás seguro de que querés eliminar este producto?");
    if (!confirmado) return;

    try {
        
        const resVentas = await axios.get(`http://localhost:3000/ventas?productoId=${id}`);
        const ventas = resVentas.data;

        
        for (const venta of ventas) {
            await axios.delete(`http://localhost:3000/ventas/${venta.id}`);
        }

        await axios.delete(`http://localhost:3000/productos/${id}`);
        
        obtenerclientes();
        cargarProductos();
        listarProductos();

    } catch (error) {
        console.log(error);
    }
};

const editarInputs = (id, nombre, descripcion , precio , stock , categoria) =>{

    document.getElementById('nombreProducto').value = nombre;
    document.getElementById('descProducto').value = descripcion;
    document.getElementById('precioProducto').value = precio;
    document.getElementById('stockProducto').value = stock;
    document.getElementById('selectCategoria').value = categoria;   

    IdEditar = id;


    const modal = new bootstrap.Modal(document.getElementById('ModalProductos'))
    modal.show()


    const btn = document.getElementById('btnAgregar');

    btn.textContent = 'Actualizar Producto';
    btn.onclick = editarProducto;



}


const editarProducto = async() =>{

    try{

       const nombreInput = document.getElementById("nombreProducto").value;
        const precioInput = document.getElementById("precioProducto").value;
        const stockInput = document.getElementById("stockProducto").value;
        const descripcionInput = document.getElementById("descProducto").value;
        const categoriaInput  = document.getElementById("selectCategoria").value;

    
        const datos = {
            
            nombre : nombreInput,
            descripcion : descripcionInput,
            precio :  precioInput,
            stock: stockInput,
            categoriaId :categoriaInput
            
        }

        const btn = document.getElementById('btnAgregar');
        btn.textContent = 'Agregar Producto';
        btn.onclick = cargarProducto;

        const response = await axios.patch(`http://localhost:3000/productos/${IdEditar}`,datos)
        
        listarProductos()
    }catch(error){

        alert(error)

    }

    nombreProducto.value = ''
    precioProducto.value = ''
    stockProducto.value = ''
    selectCategoria.value = ''
    descProducto.value = ''

}



async function filtrarProductos(idCategoria) {
    try {
        const respuesta = await axios.get("http://localhost:3000/productos");

        let productos = respuesta.data;

        if(idCategoria !== "todas")
        {
            productos = productos.filter(producto=>producto.categoriaId ===  idCategoria);

        }
       
        const productosSection = document.getElementById("productos");
productosSection.innerHTML = "";

productos.forEach(producto => {

    const div = document.createElement("div");
    div.classList.add("tarjeta-producto");

    div.innerHTML = `
        <div>
            <p>${producto.nombre}</p>
            <p>${producto.descripcion}</p>
            <p>${producto.precio}</p>
            <p>${producto.stock}</p>
            <p>${producto.categoriaId}</p>
        </div>

        <div>
            <button type="button" class="btn btn-warning"
            onclick="editarInputs('${producto.id}','${producto.nombre}','${producto.descripcion}','${producto.precio}','${producto.stock}','${producto.categoriaId}')">
            Editar
            </button>

            <button type="button" class="btn btn-danger"
            onclick="eliminarProducto('${producto.id}')">
            Eliminar
            </button>
        </div>
    `;

    productosSection.appendChild(div);
});


    }
    catch(error){
        console.log(error);
    }
    
}