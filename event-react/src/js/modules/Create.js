import { useState } from 'react';
import { Navigate } from 'react-router';
import { Panel } from './ui/Interface';

import { createEvent } from '../service/EventsService.js';

const DEFAULT_DATE = new Date();
DEFAULT_DATE.setHours(0, 0, 0, 0);

const Create = () => {
  const [redirect, setRedirect] = useState(null);
  const [eventName, setEventName] = useState("");
  const [dates, setDates] = useState([DEFAULT_DATE]);

  const handleEventName = (event) => {
    setEventName(event.target.value);
  }

  const isValidDate = (id, value) => {
    const _id = parseInt(id);
    const userDate = new Date(value.split("-"));
    const isGreater = dates[_id - 1] ? dates[_id - 1] < userDate : true;
    const isLess = dates[_id + 1] ? userDate < dates[_id + 1] : true;
    return isGreater && isLess ? userDate : false;
  }

  const handleDateChange = (event) => {
    const { id, value } = event.target;

    setDates((prev) => {
      let changes = [...prev];
      const validated = isValidDate(id, value);
      if(validated) {
        changes[id] = validated;
      }
      return changes;
    });
  }

  const handleAddDate = () => {
    const nextDate = new Date()
    nextDate.setDate(dates[dates.length-1].getDate() + 1);
    nextDate.setHours(0, 0, 0, 0);
    setDates((prev) => [...prev, nextDate]);
  }

  const handleCreate = async () => {
    const event = { name: eventName.trim(), dates };
    const response = await createEvent(event);
    setRedirect(<Navigate to={`/${response?.data?.id}`}/>);
  }

  if(redirect) return redirect;
  return (
    <Panel className="create center-self flex-col">
      {/* <label className="subtitle medium bold"> Create an Event </label> */}

      <div className="flex-col">
        <label className="medium"> Event Name </label>
        <input type="text" value={eventName} onChange={handleEventName} pattern="([A-z0-9À-ž\s]){2,}"/>
      </div>

      <div className="flex-col">
        <label className="medium"> Event Date </label>
        { dates.map((date, i) => <input type="date" value={date.toLocaleDateString('en-CA')} onChange={handleDateChange} id={i} key={i}/> )}
        <button onClick={handleAddDate}> + Add Another Date </button>
      </div>

      <button onClick={handleCreate} disabled={eventName.trim().length === 0}> Create Event </button>
    </Panel>
  )
}

export default Create;