import './index.scss'
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';
import { ReactComponent as MailIcon } from '../../assets/icons/envelope.svg';

export default function Footer() {

  return <footer className="footer has-background-primary has-text-light">
    <div className="content">
      <div className="columns">
        <div className="column has-text-centered-mobile is-three-fourths">
          <p>© {(new Date()).getFullYear()} - Puzzle Service</p>
        </div>
        
        <div className="column columns">
          <div className="column is-offset-2 is-5 is-flex is-flex-align-center is-justify-content-center">  
            <PhoneIcon width={20} color="#fff"></PhoneIcon>
            <span className="ml-2">+55 81 99251-9226</span>
          </div>
          <div className="column is-5 is-flex is-flex-align-center is-justify-content-center">
            <MailIcon width={20} color="#fff"></MailIcon>
            <span className="ml-2">puzzletechnical@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
}