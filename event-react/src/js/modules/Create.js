import { useState } from 'react';
import { Navigate } from 'react-router';
import { Panel } from './ui/Interface';

import { createEvent } from '../service/EventService.js';

const Create = ({ setEvent }) => {
  const [redirect, setRedirect] = useState(null);
  const [eventName, setEventName] = useState("");
  const [dates, setDates] = useState([new Date()]);

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
    const event = { name: eventName, dates };
    setEvent();
    // setRedirect(<Navigate to="/test"/>);

    const response = await createEvent(event);
    console.log(response);
  }

  if(redirect) return redirect;
  return (
    <Panel className="create center-self flex-col">
      {/* <label className="subtitle medium bold"> Create an Event </label> */}

      <div className="flex-col">
        <label className="medium"> Event Name </label>
        <input type="text" value={eventName} onChange={handleEventName}/>
      </div>

      <div className="flex-col">
        <label className="medium"> Event Date </label>
        { dates.map((date, i) => <input type="date" value={date.toLocaleDateString('en-CA')} id={i} onChange={handleDateChange} key={i}/> )}
        <button onClick={handleAddDate}> + Add Another Date </button>
      </div>

      <button onClick={handleCreate}> Create Event </button>
    </Panel>
  )
}

export default Create;