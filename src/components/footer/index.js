import './index.css'
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';
import { ReactComponent as MailIcon } from '../../assets/icons/envelope.svg';

export default function Footer() {
  return <div className="footer">
    <p className="text">© {(new Date()).getFullYear()} - Puzzle Service</p>

    <div className="elements">
      <div className="element">
        <PhoneIcon width={20} color="#fff"></PhoneIcon>
        <span>+55 81 9251-9226</span>
      </div>
      <div className="element">
        <MailIcon width={20} color="#fff"></MailIcon>
        <span>puzzletechnical@gmail.com</span>
      </div>
    </div>
  </div>
}