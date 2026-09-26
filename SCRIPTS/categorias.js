//creo funcion asincronica para obtener las categorias en el db y sino salga error
async function obtenerCategorias() {
    try {
        const respuesta= await axios.get("http://localhost:3000/categorias");


        mostrarCategorias(respuesta.data);

        cargarSelectCategoria();
        crearFiltrosCategorias();
    }
    catch(error) {
        console.log(error);
    }
}

//creo funcion para mostrar categorias
//y pongo el boton de eliminar y editar dentro del foreach ya que este recorre todas las categorias
function mostrarCategorias(categorias) {
    const contenedor=document.getElementById("contenedorCategorias");

    contenedor.innerHTML="";

    categorias.forEach(categoria => {
        contenedor.innerHTML += `
    <div class="tarjeta-categoria">
        <h3>${categoria.nombre}</h3>

        <p>${categoria.descripcion}</p>

        <button onclick="eliminarCategoria('${categoria.id}')">Eliminar</button>

        <button onclick="editarCategoria('${categoria.id}')">Editar</button>
    </div>


    `;
    });

    
}

//traiga el formulario
const formulario=document.getElementById("formCategoria");

//que detecte cuando se envie
formulario.addEventListener("submit", crearCategoria);

//la funcion que crea la categoria que viene del formulario
async function crearCategoria(event) {
    //el prevent hace que la pagina evite recargarse
    event.preventDefault();

    //ahora obtengo los valores
    const nombre=document.getElementById("nombreCategoria").value;

    const descripcion=document.getElementById("descripcionCategoria").value;

    if(nombre.trim()==="" ||descripcion.trim()==="")
    {
        alert("Complete todos los campos");
        return;
    }

    //creo el objeto
    const nuevaCategoria= {
        nombre,
        descripcion
    };

    //ahora el POST para enviar los datos al servido
    try{
        await axios.post("http://localhost:3000/categorias", nuevaCategoria);

        obtenerCategorias();

        formulario.reset();
    }
    catch(error){
        console.log(error);
    }


}

async function eliminarCategoria(id) {
    if (confirm("¿Seguro que desea eliminar esta categoria?")) {
        try {
            const respuesta = await axios.get("http://localhost:3000/productos");
            const productos = respuesta.data;
            const tieneProductos = productos.some(producto => producto.categoriaId === id);

            if (tieneProductos) {
                const continuar = confirm("Esta categoría tiene productos asociados. ¿Querés eliminarlos junto con la categoría?");
                if (!continuar) return;

                const productosDeCategoria = productos.filter(p => p.categoriaId === id);
                for (const producto of productosDeCategoria) {
                    await axios.delete(`http://localhost:3000/productos/${producto.id}`);
                }
            }

            await axios.delete(`http://localhost:3000/categorias/${id}`);
            obtenerCategorias();
            listarProductos();



        } catch (error) {
            console.log(error);
        }
    }
}

async function editarCategoria(id){
    const nuevoNombre=prompt("Ingrese el nuevo nombre");
    const nuevaDescripcion=prompt("Ingrese la nueva descripcion");

    //verifico que no ingrese nada vacio
    if( nuevoNombre===null || 
        nuevaDescripcion===null || 
        nuevoNombre.trim()==="" || 
        nuevaDescripcion.trim()==="")
    {
        return;
    }
    
    
    try
    {
        await axios.patch(`http://localhost:3000/categorias/${id}`,
            {
                nombre: nuevoNombre,
                descripcion: nuevaDescripcion
            }
        );
        obtenerCategorias();
    }
    catch(error)
    {
        console.log("Error");
    }

}


async function cargarSelectCategoria() 
{
    try{

    
const respuesta= await axios.get("http://localhost:3000/categorias");

const select= document.getElementById("selectCategoria");

if(!select) return;

select.innerHTML= `
                <option value="">
                Seleccione una categoria
                </option>
                `;




respuesta.data.forEach(categoria=>{
    select.innerHTML += ` 
                        <option value="${categoria.id}">
                        ${categoria.nombre} </option> `;
});
    }
    catch(error){

        console.log(error);
    }
}

async function crearFiltrosCategorias() {
    try{

    const respuesta = await axios.get("http://localhost:3000/categorias");

    const contenedor= document.getElementById("filtrosCategorias");
        if(!contenedor) return;
    contenedor.innerHTML= "";

    contenedor.innerHTML += ` 
                            <button class="btn btn-info w-100 m-1" onclick="filtrarProductos('todas')">
                            Todas
                            </button>
                            `;

    respuesta.data.forEach(categoria=>{
        contenedor.innerHTML += `
                                <button class="btn btn-info w-100 m-1" onclick="filtrarProductos('${categoria.id}')">
                                ${categoria.nombre}
                                </button>
                                `;
    });
    }
    catch(error)
    {
        console.log(error);
    }

}



obtenerCategorias();