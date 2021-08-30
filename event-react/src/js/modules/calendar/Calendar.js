import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { findEvent } from '../../service/EventsService.js';
import { updateUser, findUsers, findUser } from '../../service/UsersService.js';
import { Panel } from '../ui/Interface';
import Grid from './Grid.js';


const Calendar = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [counts, setCounts] = useState({});

  const [user, setUser] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    const fetch = async () => {
      const eventResponse = await findEvent(id)
      setEvent(eventResponse?.data);
    };

    fetch();
  }, [id])

  useEffect(() => {
    const fetch = async () => {
      const usersResponse = await findUsers(id)

      let _counts = {};
      usersResponse?.data?.forEach((u) => {
        u.selected?.forEach((sel) => {
          const split = sel.split("-");
          const date = split[0], day = split[1];
          if(!_counts[date]) _counts[date] = {};
          _counts[date][day] = (_counts[date][day] || 0) + 1;
        });
      });
      
      _counts.max = usersResponse.data?.length;
      setCounts(_counts);
    }

    fetch();
  }, [id, editing])

  const handleUserChange = (event) => {
    setUser(event.target.value);
  }

  const handleColumnClick = (date) => {
    if(!editing) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if(prev.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      
      return next;
    });
  }

  const handleSignIn = async () => {
    const response = await findUser({ id, user });
    setSelected(new Set(response?.data?.selected));
    setSignedIn(true);
  }

  const handleEdit = () => {
    setEditing(true);
  }

  const handleSave = async () => {
    const event = { id, user, selected: Array.from(selected) };
    await updateUser(event);
    setEditing(false);
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
        <label className="medium"> {event?.name} </label>
        {/* <div className="flex">
          <Column time/>
          { event?.dates?.map((d, i ) => {
            const _date = new Date(d);
            const date = (_date.getUTCMonth() + 1) + "/" + _date.getUTCDate();
            return <Column date={date} counts={counts[date]} max={counts.max} editing={editing} onClick={handleColumnClick} key={i}/> 
          })}
        </div> */}
        <Grid dates={event?.dates} counts={counts}/>
      </div>

      { !signedIn &&
        <div className="flex-col">
          <label className="medium"> Your Name </label>
          <input type="text" value={user} onChange={handleUserChange} pattern="([A-z0-9À-ž\s]){2,}"/>
          <button disabled={user.trim().length === 0} onClick={handleSignIn}> Sign In </button>
        </div>
      }

      { signedIn && !editing && 
        <button onClick={handleEdit}> Edit </button>
      }

      { editing &&
        <button onClick={handleSave}> Save Changes </button>
      }
    </Panel>
  )
}

export default Calendar;