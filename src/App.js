import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios'; 

function App() {
  const baseUrl = "http://localhost/apiciudades/";
  const[data,setData]=useState([]);
  const[modalInsertar,setModalInsertar] = useState(false);
  const[modalEditar,setModalEditar] = useState(false);
  const[modalEliminar,setModalEliminar] = useState(false);
  const[ciudadSeleccionada,setCiudadSeleccionada]=useState({
    id: '',
    country: '',
    state: '',
    city: ''
  });

  const handleChange=e=>{
    const {name, value}= e.target;
    setCiudadSeleccionada((prevState)=>({
      ...prevState,
    [name]: value
    }))
    console.log(ciudadSeleccionada);
  }
    const abrirCerrarModalInsertar=()=>{
       setModalInsertar(!modalInsertar);
     }
     const abrirCerrarModalEditar=()=>{
      setModalEditar(!modalEditar);
    }
    const abrirCerrarModalEliminar=()=>{
      setModalEliminar(!modalEliminar);
    }
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
      })
  } 
  const peticionPost=async()=>{
    var f = new FormData();
        f.append("country",ciudadSeleccionada.country);
        f.append("state",ciudadSeleccionada.state);
        f.append("city",ciudadSeleccionada.city);
	      f.append("method","post");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
    	abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
      })
  } 
  const peticionPut=async()=>{
    var f = new FormData();
        f.append("country",ciudadSeleccionada.country);
        f.append("state",ciudadSeleccionada.state);
        f.append("city",ciudadSeleccionada.city);
	      f.append("method","put");
    await axios.put(baseUrl, f,{params:{id:ciudadSeleccionada.id}})
	.then(response=>{
		var dataNueva = data;
		dataNueva.map(ciudad=>
		{
		if(ciudad.id===ciudadSeleccionada.id){
		ciudad.country = ciudadSeleccionada.country;
		ciudad.state = ciudadSeleccionada.state;	
		ciudad.city = ciudadSeleccionada.city;	
		}
	});
	setData(dataNueva);
	abrirCerrarModalEditar();					 
	}).catch(error=>{
      console.log(error);
    })
  } 
  const peticionDelete=async()=>{
    var f = new FormData();
        f.append("method","delete");
    await axios.post(baseUrl, f, {params:{id:ciudadSeleccionada.id}})
    .then(response=>{
      setData(data.filter(ciudad=>ciudad.id!==ciudadSeleccionada.id));
    	abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
      })
  } 
  const seleccionarCiudad = (ciudad, caso)=>{
      setCiudadSeleccionada(ciudad);
      (caso === "editar")?
	  abrirCerrarModalEditar() : 
	  abrirCerrarModalEliminar()
    }
  useEffect(()=>{
    peticionGet();
  },[])
  return (
    <div className="App">
      <br />
        <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
			<br/><br/>	  
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(ciudad=>(
          <tr key={ciudad.id}>
            <td>{ciudad.id}</td>
            <td>{ciudad.country}</td>
            <td>{ciudad.state}</td>
            <td>{ciudad.city}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarCiudad(ciudad,"editar")}>Editar </button>{" "}
              <button className="btn btn-danger"  onClick={()=>seleccionarCiudad(ciudad,"eliminar")}>Eliminar</button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
        <Modal isOpen={modalInsertar}>
            <ModalHeader> Insertar Ciudad </ModalHeader>
            <ModalBody>
                  <div className="form-group">
                  <label>Country: </label>
                  <br/>
                  <input type="text" className="form-control" name="country" onChange={handleChange} />
                  <br/>
                  <label>State: </label>
                  <br/>
                  <input type="text" className="form-control" name="state" onChange={handleChange}/>
                  <br/>
                  <label>City: </label>
                  <br/>
                  <input type="text" className="form-control" name="city" onChange={handleChange}  />
                  <br/>
                  </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>peticionPost()}> Insertar</button>{" "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}> Cancelar</button>
            </ModalFooter>
       </Modal>

      <Modal isOpen={modalEditar}>
            <ModalHeader> Editar Ciudad </ModalHeader>											 
            <ModalBody>
                  <div className="form-group">
                  <label>Country: </label>
                  <br/>
                  <input type="text" className="form-control" name="country" onChange={handleChange}  value={ciudadSeleccionada && ciudadSeleccionada.country} />
                  <br/>
                  <label>State: </label>
                  <br/>
                  <input type="text" className="form-control" name="state" onChange={handleChange}  value={ciudadSeleccionada && ciudadSeleccionada.state}  />
                  <br/>
                  <label>City: </label>
                  <br/>
                  <input type="text" className="form-control" name="city" onChange={handleChange} value={ ciudadSeleccionada && ciudadSeleccionada.city} />
                  <br/>
                  </div>
            </ModalBody>
            <ModalFooter>
            <button className="btn btn-primary"  onClick={()=>peticionPut()}> Actualizar</button>{" "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}> Cancelar</button>
            </ModalFooter>
      </Modal>
       <Modal isOpen={modalEliminar}>
          <ModalBody>
                ¿Estás seguro  que deseas eliminar la ciudad{ciudadSeleccionada && ciudadSeleccionada.city}?
          </ModalBody>
            <ModalFooter>
                <button className="btn btn-danger"
                onClick={()=> peticionDelete()}>
                Si
                </button>
                <button className="btn btn-secondary"
                onClick={()=>abrirCerrarModalEliminar()}>
                No
                </button>
            </ModalFooter>
      </Modal>
  </div>
  );
}
export default App;
