import './App.css';

import Button from './components/button'
import Footer from './components/footer'
import Navbar from './components/navbar'

function App() {
  const menuOptions = [
    <button className="button-simple">SERVIÇOS</button>,
    <button className="button-simple">ENTRAR</button>,
    <Button title="SEJA UM PROFISSIONAL"></Button>
  ]

  return <>
    <Navbar menuOptions={menuOptions}></Navbar>
    <Footer></Footer>
  </>
}

export default App;
