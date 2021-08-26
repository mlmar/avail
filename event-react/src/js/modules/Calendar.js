import { Panel } from "./ui/Interface"

const Calendar = ({ name, dates }) => {
  return (
    <Panel className="calendar center-self flex-col">
      <label className="medium"> {name} </label>
      <div className="flex">
        <Column time/>
        { dates?.map((d, i ) => <Column date={d} key={i}/> )}
      </div>
    </Panel>
  )
}

const Column = ({ date, time}) => {
  const rows = () => {
    let r = [];
    for(var i = 0; i < 24; i++) {
      r.push(<span className="flex" key={i}> {time ? i : null} </span>)
    }
    return r;
  }

  return (
    <div className="column flex-col"> 
      {date ? <label className="date flex"> {`${date.getUTCMonth() + 1}/${date.getUTCDate()}`} </label> : <span className="flex"></span>}
      <div className="rows flex-col">
        { rows() }
      </div>
    </div>
  )
}

export default Calendar;