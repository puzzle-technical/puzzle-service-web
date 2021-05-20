import './index.scss'
import { Link } from 'react-router-dom'
import Rating from '../../components/rating'

import service1 from '../../assets/img/service1.png'
import service2 from '../../assets/img/service2.png'
import service3 from '../../assets/img/service3.png'
import Banner from '../../assets/img/banner.png'

export default function Home() {

  const banner = <div className="hero" style={{ backgroundImage: `url(${Banner})` }}>
    <div className="hero-body columns has-text-centered-mobile is-flex is-align-items-center">
      <div className="column is-4">
        <h1 className="title has-text-primary is-5 is-size-3-desktop">Puzzle, a arte de juntar o cliente ao profissional ideal para o seu serviço</h1>
        <Link className="button is-primary is-outlined is-rounded" to="/login">PEÇA UM ORÇAMENTO</Link>
      </div>
    </div>
  </div>

  const depoimentos = [
    {
      text: 'Melhor plataforma da área para procurar e ofertar serviços. Só tem profissional de qualidade e com comprometimento. Nota 10!',
      value: 5,
      author: 'Wellington Diniz'
    },
    {
      text: 'Procurei tanto tempo por um profissional que resolvesse meu problema e finalmente consegui.',
      value: 4,
      author: 'Gabriel Victor'
    },
    {
      text: 'Muito bom o site. Estava precisando consertar o meu escritório e foi muito prático e rápido conseguir alguém para fazer isso.',
      value: 5,
      author: 'Darnley Faneco'
    },
  ]

  return <div>
    {banner}

    <div className="section has-text-centered">
      <h2 className="title is-4">Serviços mais solicitados</h2>
      <div className="columns  is-justify-content-center">
        <div className="column is-3">
          <img className="" src={service3} alt=""></img>
          <p className="">Construção de casas</p>
        </div>
        <div className="column is-3">
          <img className="" src={service1} alt=""></img>
          <p className="">Instalações elétricas</p>
        </div>
        <div className="column is-3">
          <img className="" src={service2} alt=""></img>
          <p className="">Instalações hidráulicas</p>
        </div>
      </div>
    </div>
    
    <div className="section has-text-centered">
      <h2 className="title is-4">Opinião dos usuários</h2>
      {depoimentos.map((el, index) => {
        return <div className="block my-6 px-5" key={index}>
          <p>{el.text}</p>
          <div className="mt-2">
            <strong>{el.author}</strong>
            <span className="ml-2">
              <Rating value={el.value} evaluations={130}>
              </Rating>
            </span>
          </div>
        </div>
      })}
    </div>
  </div>
}