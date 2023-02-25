//Prorgamcion Web, Tarea 2, Uso de Firebase con JS
//Cuevas Martinez Adrian de Jesus 19211623
//Dueñas Nuñez Alan Gabriel 19211630


//Configuracion e inicializacion de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAR6VoZ11wvXzABKam0-A3kekHHmGa-Dlo",
    authDomain: "ejemplo1-3ffa2.firebaseapp.com",
    databaseURL: "https://ejemplo1-3ffa2-default-rtdb.firebaseio.com",
    projectId: "ejemplo1-3ffa2",
    storageBucket: "ejemplo1-3ffa2.appspot.com",
    messagingSenderId: "272907891291",
    appId: "1:272907891291:web:577b9ef1319513538b457e",
    measurementId: "G-YGWM7KGZ3D"
};

firebase.initializeApp(firebaseConfig);

//Limpiar Inputs
function resetFields(){
    document.getElementById("Input1").value='';
    document.getElementById("Input2").value='';
    document.getElementById("Input3").value='';
    document.getElementById("Input4").value='';
    document.getElementById("Input5").value='selecciona';
    document.getElementById("Input6").value='';
    document.getElementById("Input7").value='';
}

//Creacion y adicion de registro a base de datos
function createR() {
    document.getElementById("Input1").disabled = false;

    var numRastreo = document.getElementById("Input1").value;
    var nomProducto = document.getElementById("Input2").value;   
    var unidades = document.getElementById("Input3").value;
    var nomUsuario = document.getElementById("Input4").value;
    var tipoProducto = document.getElementById("Input5").value;
    var domicilioEnvio = document.getElementById("Input6").value;
    var telUsuario = document.getElementById("Input7").value;

    //validaciones
    if(numRastreo.length == 0 || nomProducto.length == 0 || unidades.length == 0
        || nomUsuario.length == 0 || tipoProducto === 'Selecciona' || domicilioEnvio.length == 0 
        || telUsuario.length == 0) {

            swal("Error", "Llena todos los campos","Warning");
            return;
    }

    if (isNaN(numRastreo)) {
        
        swal("Error", "Número de rastreo no valido","Warning");
        return;
    } 

    if (parseInt(numRastreo) <= 0) {

        swal("Error", "Número de rastreo no valido","Warning");
        return;
    }

    if(isNaN(unidades) || isNaN(telUsuario)) {

        swal("Error", "Unidades o telefono no validos","Warning");
        return;
    }

    var envio = {
        numRastreo, //id:numRastreo
        nomProducto,
        unidades,
        nomUsuario,
        tipoProducto,
        domicilioEnvio,
        telUsuario
    }

    firebase.database().ref('Envios/' + numRastreo).update(envio).then(() => {
       resetFields();
    }).then(()=>{
       read();
    });

    swal("Listo!", "Agregado correctamente", "Success"); 

    document.getElementById("Input1").disabled = false;
}

//Consultar registros cada que se añade un registro
function read(){
    document.getElementById("Table1").innerHTML='';

    var ref = firebase.database().ref('Envios');

    ref.on("child_added", function(snapshot) {
        printRow(snapshot.val());
    });
}

//Mostrar Registro en tabla
function printRow(envio){
    
    if(envio!=null){
        var table = document.getElementById("Table1"); 

        //Se crea una fila con cada una de sus columnas correspondientes
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        
        //Se agrega la informacion a cada una de las columnas del registro
        cell1.innerHTML = envio.numRastreo;
        cell2.innerHTML = envio.nomProducto; 
        cell3.innerHTML = envio.unidades;
        cell4.innerHTML = envio.nomUsuario;
        cell5.innerHTML = envio.tipoProducto; 
        cell6.innerHTML = envio.domicilioEnvio; 
        cell7.innerHTML = envio.telUsuario; 

        cell8.innerHTML = `<button type="button" class="btn btn-danger" onClick="deleteR(${envio.numRastreo})">Eliminar</button>`;
        cell9.innerHTML = '<button type="button" class="btn btn-success" onClick="seekR('+envio.numRastreo+')">Modificar</button>';
    }
}

//Borrar Registro
function deleteR(numRastreo){

    firebase.database().ref('Envios/' + numRastreo).set(null).then(() => {
      read();
    }).then(()=>{
       swal("Listo!", "Eliminado correctamente", "success");
    });
}

//Se busca el registro a modificar
function seekR(numRastreo){
    var ref = firebase.database().ref('Envios/' + numRastreo);
    ref.on('value', function(snapshot) {
      updateR(snapshot.val());
    });
}

//Actualizacion de registro
function updateR(envio){
    if(envio!=null)
    {
        document.getElementById("Input1").value=envio.numRastreo;
        document.getElementById("Input1").disabled = true;

        document.getElementById("Input2").value=envio.nomProducto;
        document.getElementById("Input3").value=envio.unidades;
        document.getElementById("Input4").value=envio.nomUsuario;
        document.getElementById("Input5").value=envio.tipoProducto;
        document.getElementById("Input6").value=envio.domicilioEnvio;
        document.getElementById("Input7").value=envio.telUsuario;
    }
}


//Consulta de envios por tipo de producto
function readQ(){
    document.getElementById("Table2").innerHTML='';
    var c = document.getElementById("Input5").value;

    var ref = firebase.database().ref("Envios");
    ref.orderByChild("tipoProducto").equalTo(c).on("child_added", function(snapshot) {
        printRowQ(snapshot.val());
    });
}

//Despliegue de envios por tipo de producto seleccionado
function printRowQ(envio){

    var table = document.getElementById("Table2"); 
    
    //Se crea una fila con cada una de sus columnas correspondientes
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    
    //Se agrega la informacion a cada una de las columnas del registro
    cell1.innerHTML = envio.numRastreo;
    cell2.innerHTML = envio.nomProducto; 
    cell3.innerHTML = envio.unidades;
    cell4.innerHTML = envio.nomUsuario; 
    cell5.innerHTML = envio.tipoProducto; 
    cell6.innerHTML = envio.domicilioEnvio; 
    cell7.innerHTML = envio.telUsuario; 
}