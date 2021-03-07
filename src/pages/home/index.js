import './index.css';

import Button from '../../components/button'
import Footer from '../../components/footer'
import Navbar from '../../components/navbar'
import Banner from '../../components/banner'

import service1 from '../../assets/img/service1.png'
import service2 from '../../assets/img/service2.png'
import service3 from '../../assets/img/service3.png'
import { ReactComponent as Star } from '../../assets/icons/star.svg'

function Home() {
  const menuOptions = [
    <button className="button-simple">SERVIÇOS</button>,
    <button className="button-simple">ENTRAR</button>,
    <Button title="SEJA UM PROFISSIONAL"></Button>
  ]

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

  var stars = value => {
    let newArr = []
    for (let i = 1; i <= 5; i++) {
      newArr[i-1] = <Star className="star" key={i} width={20} color={i <= value ? '#FFDE5B' : '#FFFFFF'} stroke="#3a3a3a" strokeWidth={20}></Star>      
    }
    return newArr
  }

  return <div className="home">
    <Navbar menuOptions={menuOptions}></Navbar>
    <Banner></Banner>
    <div className="area">
      <h2>BUSCA POR CATEGORIA</h2>
    </div>
    <div className="area">
      <h2>SERVIÇOS MAIS SOLICITADOS</h2>
      <div className="services">
        <div className="service">
          <img className="service-image" src={service3} alt=""></img>
          <p className="service-label">Construção de casas</p>
        </div>
        <div className="service">
          <img className="service-image" src={service1} alt=""></img>
          <p className="service-label">Instalações elétricas</p>
        </div>
        <div className="service">
          <img className="service-image" src={service2} alt=""></img>
          <p className="service-label">Instalações hidráulicas</p>
        </div>
      </div>
    </div>
    <div className="area">
      <h2>OPINIÃO DOS USUÁRIOS</h2>
      {
        depoimentos.map((el, i) => {
          return <div key={i} className="depoimento">
            <p>{el.text}</p>
            <p className="author">{el.author}
              <span className="stars">
                {stars(el.value)}
              </span>
            </p>
          </div>
        })
      }
    </div>
    <Footer></Footer>
  </div>
}

export default Home;
