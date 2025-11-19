import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App(){
  const [page, setPage] = useState('login');
  const [jornadas, setJornadas] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    axios.get('/api/jornadas').then(r=> setJornadas(r.data)).catch(()=>{});
  },[]);

  if(page==='login') return <Login onLogin={u=>{setUser(u); setPage('home');}} />;
  return (
    <div className="app">
      <Sidebar onNav={setPage} user={user} />
      <main className="main">
        <h1>Quiniela - {page}</h1>
        {page==='home' && <Home jornadas={jornadas} />}
        {page==='jornadas' && <Jornadas jornadas={jornadas} />}
      </main>
    </div>
  );
}

function Login({onLogin}){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [error,setError]=useState('');
  const submit=async()=>{
    try{
      const r = await axios.post('/api/login',{username,password});
      onLogin(r.data);
    }catch(e){ setError('Usuario o contraseña inválidos'); }
  };
  return (
    <div className="login">
      <h2>Entrar</h2>
      <input placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} />
      <div className="pw">
        <input placeholder="Contraseña" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={()=>setShow(s=>!s)}>{show?'Ocultar':'Ver'}</button>
      </div>
      <button onClick={submit}>Entrar</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function Sidebar({onNav, user}){
  return (
    <aside className="sidebar">
      <div className="logo">QUINIELA</div>
      <nav>
        <button onClick={()=>onNav('home')}>Inicio</button>
        <button onClick={()=>onNav('jornadas')}>Jornadas</button>
        <button onClick={()=>onNav('pronosticos')}>Pronóstico</button>
        <button onClick={()=>onNav('resultados')}>Resultados</button>
        <button onClick={()=>onNav('clasificacion')}>Clasificación</button>
        <button onClick={()=>onNav('perfil')}>Mi perfil</button>
      </nav>
    </aside>
  );
}

function Home({jornadas}){
  return <div>Bienvenido — jornadas: {jornadas.length}</div>
}
function Jornadas({jornadas}){
  return <div className="jornadas">{jornadas.map(j=> <div key={j.id} className="j">{j.title} — {j.date}</div>)}</div>
}
