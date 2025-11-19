
import './styles.css';
import { useState } from 'react';

function App() {
  const [u,setU]=useState('');
  const [p,setP]=useState('');
  const [msg,setMsg]=useState('');

  const login = async ()=>{
    const r = await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:u, password:p})
    });
    if(r.ok){ setMsg("LOGIN OK ✔️"); }
    else{ setMsg("Usuario o contraseña inválidos"); }
  };

  return (
    <div className="container">
      <h1>Quiniela App</h1>
      <input placeholder="Usuario" value={u} onChange={e=>setU(e.target.value)}/>
      <br/><br/>
      <input placeholder="Contraseña" type="password" value={p} onChange={e=>setP(e.target.value)}/>
      <br/><br/>
      <button onClick={login}>Entrar</button>
      <p>{msg}</p>
    </div>
  );
}
export default App;
