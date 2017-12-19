import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { 
  withScriptjs,
  withGoogleMap, 
  GoogleMap, 
  Marker 
} from 'react-google-maps'



const Mapa = withScriptjs(withGoogleMap( props => {
 return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 0, lng: 0}}
      center={props.center}
      
    >       
      {   props.profissional.map( (r, i) => <Marker key={i} position={r} title={`
${r.title}
${r.lat}
${r.lng}`} 

icon={r.icon}/>  )}

    </GoogleMap> 
 )
}))

const ViewCounter = ({ counter, title }) => {
  return ( 
    <h1 className="App-title">
      { title } - { counter } 
    </h1>
)
}
class App extends Component {
  constructor(props){
    super(props)

    this.state = { 
      counter: 0,
      isGettingPosition: false,
      position: {},
      profissional: []

    }
    setInterval(()=> this.setState({ counter: this.state.counter+1}), 1000)
    //this.getProfissional = this.getProfissional.bind(this)
  }

  getProfissional(lat, lng){
    
    const url = 'http://localhost:3000/api/profissional/distancia'
    axios
    .get( `${url}?lat=${lat}&lng=${lng}` )
    .then( ret => {
      this.setState({ profissional: ret.data })
         
    })
    
  }
  componentDidMount(){
    
    this.setState({ isGettingPosition: false })
    // navigator.geolocation.getCurrentPosition( position => {
    //   var lat= position.coords.latitude
    //   var lng= position.coords.longitude
      
    //   this.setState({
    //     isGettingPosition: false,
    //     position: { lat, lng }
    //   })
    
    //   this.getProfissional(lat, lng)

    // })

      navigator.geolocation.watchPosition(position => {
      var lat= position.coords.latitude
      var lng= position.coords.longitude
      
      this.setState({
        isGettingPosition: false,
        position: { lat, lng  }
      })
      
      this.getProfissional(lat, lng)

    })
      
  }
 

  render() {
   
    if(this.state.isGettingPosition){
      return <p> Pegando Posição do Usúario... </p>
    }
   
    return (

      <div className="App">

        <header className="App-header">

          <img src={logo} className="App-logo" alt="logo" />
          <ViewCounter 
            title='Localizador de Consultórios' 
            counter={ this.state.counter } 
          />
          <button onClick={ () => this.getProfissional(this.state.position.lat, this.state.position.lng)}> Atualizar </button>
          {JSON.stringify(this.position)}
          

        
        </header>
        
        <div className='App-intro'> 
          
          <Mapa            
            googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyCBXu7-bvb8JlU9gPy51IjJsAx9FCNX7XQ'
            loadingElement={<div style={{height: '100%', width: '100%' }} />}
            containerElement={<div style={{height: '100%', width: '100%' }} />}
            mapElement={<div style={{height: '200px', width: '100%' }} />}
            center={this.state.position}
            profissional={this.state.profissional}
            marker={this.state.position}
          />
          <table>
            <thead>
              <tr>
              <th>Nome:</th><th>Distancia</th>
              </tr>
            </thead>
          <tbody>
            {
              this.state.profissional.map((r, i) => {
                return (
                  <tr key={i}>
                  <td>{r.nome}</td>
                  <td>{r.dis.toFixed(3)*1000}m</td>
                  </tr>
                )
              })
            }
          </tbody>
          </table>

        </div>
      
      </div>

    );

  }

}

export default App;
