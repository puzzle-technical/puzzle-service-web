import './index.css';

import Banner from '../../components/banner'

import { ReactComponent as Star } from '../../assets/icons/star.svg'

function Home() {
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
    <Banner></Banner>
    <div className="area">
      <h2>SERVIÇOS MAIS SOLICITADOS</h2>
      <div className="services">
        <div className="service">
          <img className="service-image" src={'http://localhost:5000/img/services/service3.png'} alt=""></img>
          <p className="service-label">Construção de casas</p>
        </div>
        <div className="service">
          <img className="service-image" src={'http://localhost:5000/img/services/service1.png'} alt=""></img>
          <p className="service-label">Instalações elétricas</p>
        </div>
        <div className="service">
          <img className="service-image" src={'http://localhost:5000/img/services/service2.png'} alt=""></img>
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
  </div>
}

export default Home;
