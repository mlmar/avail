import clipboard from '../../../icons/clipboard.png';
import close from '../../../icons/close.png';

const icons = {
  clipboard,
  close
}

const Icon = ({type, className}) => {
  if(!icons[type]) return;
  return <span className={"icon " + (className || "")}> <img src={icons[type]} alt={type}/> </span>
}

export default Icon;