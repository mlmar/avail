import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Panel } from './ui/Interface';
import { findEvent } from '../service/EventsService.js';

const Calendar = () => {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState("");
  const { id } = useParams();

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

  if(!event) {
    return (
      <Panel className="calendar center-self flex-col">
        <label className="large"> Event does not exist! </label>
      </Panel>
    )
  }
  return (
    <Panel className="calendar center-self flex-col">
      <div className="flex-col">
        <label className="medium"> Your Name </label>
        <input type="text" value={user} onChange={handleUserChange} pattern="([A-z0-9À-ž\s]){2,}"/>
        <button disabled={user.trim().length === 0}> Sign In </button>
      </div>

      <div className="flex-col">
        <label className="medium"> {event?.name} </label>
        <div className="flex">
          <Column time/>
          { event?.dates?.map((d, i ) => <Column date={new Date(d)} key={i}/> )}
        </div>
      </div>
    </Panel>
  )
}

const Column = ({ date, time }) => {
  const month = date?.getUTCMonth();
  const day = date?.getUTCDate();

  const rows = () => {
    let r = [];
    for(var i = 0; i < 24; i++) {
      r.push(<span className="flex" key={i}> {time ? i : null} </span>)
    }
    return r;
  }

  return (
    <div className="column flex-col"> 
      {date ? <label className="date flex"> {month + 1}/{day} </label> : <span className="flex"></span>}
      <div className="rows flex-col">
        { rows() }
      </div>
    </div>
  )
}

export default Calendar;