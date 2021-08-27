import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { findEvent } from '../../service/EventsService.js';
import { updateUser } from '../../service/UsersService.js';
import { Panel } from '../ui/Interface';
import Column from './Column.js'; 


const Calendar = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    const fetch = async () => {
      const response = await findEvent(id)
      setEvent(response?.data);
    };

    fetch();
  }, [id])

  const handleUserChange = (event) => {
    setUser(event.target.value);
  }

  const handleColumnClick = (date) => {
    setSelected((prev) => {
      prev.add(date);
      return prev;
    });
  }

  const handleSave = async () => {
    const event = { id, user, selected: Array.from(selected) };
    const response = await updateUser(event);
    console.log(response)
  }

  if(!event) {
    return (
      <Panel className="calendar center-self flex-col">
        <label className="large"> Event does not exist! </label>
      </Panel>
    )
  }

  return (
    <Panel className="calendar center-self flex-col">
      { !signedIn &&
        <div className="flex-col">
          <label className="medium"> Your Name </label>
          <input type="text" value={user} onChange={handleUserChange} pattern="([A-z0-9À-ž\s]){2,}"/>
          <button disabled={user.trim().length === 0} onClick={setSignedIn}> Sign In </button>
        </div>
      }

      <div className="flex-col">
        <label className="medium"> {event?.name} </label>
        <div className="flex">
          <Column time/>
          { event?.dates?.map((d, i ) => <Column date={new Date(d)} onClick={handleColumnClick} key={i}/> )}
        </div>
      </div>

      { signedIn &&
        <button onClick={handleSave}> Save Changes </button>
      }
    </Panel>
  )
}








export default Calendar;