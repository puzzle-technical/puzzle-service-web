import './index.css'
import { Link } from 'react-router-dom'

export default function Banner() {

  return <div className="banner">
    <div className="banner-content">
      <h2 className="banner-title">Puzzle, a arte de juntar o cliente ao profissional ideal para o seu serviço</h2>
      <Link to="/login" className="banner-button">PEÇA UM ORÇAMENTO</Link>
    </div>
  </div>
}