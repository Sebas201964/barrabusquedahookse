import './Historialficha.css';
import {useEffect, useState} from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx/xlsx.mjs';

function Historial_ficha() {

  const [ficha, setFichas]= useState([]);
  const [tablaFichas, setTablaFichas]= useState([]);
  const [busqueda, setBusqueda]= useState("");
  
  var XLSX = require("xlsx");
  const generateExcel = () => {
    // Obtener la tabla
    const table = document.getElementById('my-table');

    // Convertir la tabla en un objeto de datos de Excel
    const workbook = XLSX.utils.table_to_book(table);

    // Descargar el archivo Excel
    XLSX.writeFile(workbook, 'HISTORIAL FICHA.xlsx');
  }

const peticionGet=async()=>{
  await axios.get("http://localhost:8082/api/ficha/listar")
  .then(response=>{
    setFichas(response.data);
    setTablaFichas(response.data);
  }).catch(error=>{
    console.log(error);
  })
}

const handleChange=e=>{
  setBusqueda(e.target.value);
  filtrar(e.target.value);
}

const filtrar=(terminoBusqueda)=>{
  var resultadosBusqueda=tablaFichas.filter((elemento)=>{
    if(elemento.id_ficha.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    || elemento.persona.id_persona.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    || elemento.fecha_consulta.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    || elemento.persona.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())+elemento.persona.apellido.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
    ){
      return elemento;
    }
  });
  setFichas(resultadosBusqueda);
}

useEffect(()=>{
peticionGet();
},[])

  return (
    <div className="App">
      
      <div className="containerInput">
        <input
          className="form-control inputBuscar"
          value={busqueda}
          placeholder="Búsqueda por Id Ficha,Id Persona, Fecha, Nombre"
          onChange={handleChange}
        />
        <button className="btn btn-success">
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>

     <div className="table-responsive">
       <table id="my-table" className="table table-sm table-bordered">
         <thead>
           <tr>
             <th>ID</th>
             <th>DIAGNOSTICO</th>
             <th>FECHA</th>
             <th>MOTIVO</th>
             <th>OBSERVACIONES</th>
             <th>ID PERSONA</th>
             <th>NOMBRE</th>
           </tr>
         </thead>

         <tbody>
           {ficha && 
           ficha.map((ficha)=>(
             <tr key={ficha.id_ficha}>
               <td>{ficha.id_ficha}</td>
               <td>{ficha.diagnostico}</td>

               <td>{ficha.fecha_consulta}</td>
               <td>{ficha.motivo_consulta}</td>
               <td>{ficha.observaciones}</td>
               <td>{ficha.persona.id_persona}</td>
               <td>{ficha.persona.nombre+" "+ficha.persona.apellido}</td>
             </tr>
           ))}
         </tbody>

       </table>
      
     </div>
     <button onClick={generateExcel} className="mi-boton">IMPRIMIR</button>
    </div>
  );
}

export default Historial_ficha;
