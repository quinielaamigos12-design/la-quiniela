import './styles.css';
import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App(){
  const [u,setU]=useState('');
  const [p,setP]=useState('');
  const [msg,setMsg]=useState('');
  const login = async ()=>{
    try{
      const res = await fetch(API + '/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username: u, password: p })
      });
      const data = await res.json();
      if(res.ok) setMsg('Login correcto: ' + data.username);
      else setMsg(data.msg || 'Error');
    }catch(err){
      setMsg('Error conectando al backend');
    }
  };
  return (<div className="container">
    <h1>Quiniela</h1>
    <input placeholder="Usuario" value={u} onChange={e=>setU(e.target.value)} /><br/><br/>
    <input placeholder="Contraseña" type="password" value={p} onChange={e=>setP(e.target.value)} /><br/><br/>
    <button onClick={login}>Entrar</button>
    <p>{msg}</p>
    <p>Frontend conectado a: {API}</p>
  </div>);
}
