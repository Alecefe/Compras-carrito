//Variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');


//Listeners
cargarEventListeners();

function cargarEventListeners(){
    //Dispara cuando se presiona agregar carrito
    cursos.addEventListener('click', comprarCurso);

    //Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Presionando el botón de vaciar carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    //Al cargar documento mostrar local storage
    document.addEventListener('DOMContentLoaded', LeerLS);
}



//Funciones

function comprarCurso(e){

    e.preventDefault();
    //Delegation para agg carrito
    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement;
        //Envio de curso a la otra funcion
        leerDatosCurso(curso);
    }
}

//Leer datos del curso al que se le dio click
function leerDatosCurso(curso){

    const infoCurso = {
        imagen : curso.querySelector('img').src,
        titulo : curso.querySelector('h4').textContent,
        precio : curso.querySelector('.precio span').textContent,
        id : curso.querySelector('a').getAttribute('data-id'),
    }

    //Evitando que se agregue más de una vez
    let cursosLS = obtenerCursosLocalStorage();
    let enCarrito = false;

    cursosLS.forEach(function(curso){
        if(curso.id === infoCurso.id){enCarrito=true;}
    });
    
    if(enCarrito){
        alert('Curso ya agregado al carrito');
    }else{
        insertarCarrito(infoCurso);
        guardarCursoLocalStorage(infoCurso);
    }
    
}

//Muestra el curso seleccionado en el carrito

function insertarCarrito(infoCurso){
    const row = document.createElement('tr');
    row.innerHTML = `
    
    <td> 
        <img src="${infoCurso.imagen}" width=100>
    </td>
    <td>${infoCurso.titulo}</td>
    <td>${infoCurso.precio}</td>
    <td>
        <a href="#" class="borrar-curso" data-id="${infoCurso.id}">X</a>
    </td>
    `;

    listaCursos.appendChild(row);

}

//Elimina el curso del carrito en el dom
function eliminarCurso(e){
    e.preventDefault();

    let curso;

    if(e.target.classList.contains('borrar-curso')){
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        let cursoID = curso.querySelector('a').getAttribute('data-id');
        eliminarCursoLS(cursoID);
    }

}

//Elimina todos los cursos del carrito
function vaciarCarrito(){
    //Forma rápida
    // listaCursos.innerHTML = '';

    //Forma lenta
    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild);
    }
    vaciarLS();

    return false; //Para que no se cierre de golpe el carrito
}
    
//Guardar curso en local storage
function guardarCursoLocalStorage(curso) {
    let cursos;

    cursos = obtenerCursosLocalStorage();

    cursos.push(curso);

    localStorage.setItem('cursos', JSON.stringify(cursos));
}

function obtenerCursosLocalStorage(){
    let cursosLS

    //Prueba que haya elementos en LS
    if(localStorage.getItem('cursos')===null){
        cursosLS = [];
    }else{
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }return cursosLS

}

//Imprime los cursos de LS en el carrito

function LeerLS(){
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function(curso){

        insertarCarrito(curso);

    });
}

//Elimina los cursos desde LS

function eliminarCursoLS(cursoID) {
    //Obteniendo arreglo de cursos
    let cursosLS = obtenerCursosLocalStorage();

    console.log(cursoID);
    //Iteramos comparando el arreglo de cursos con el de entrada
    cursosLS.forEach(function(curso, index){
        if(curso.id === cursoID){
            cursosLS.splice(index,1);
        }

    });

    localStorage.setItem('cursos', JSON.stringify(cursosLS));

}

//Limpiando todo el carrito de local storage con boton

function vaciarLS(){
    localStorage.clear();
}

