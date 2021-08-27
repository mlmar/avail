const Column = ({ date, time, onClick }) => {
  const month = date?.getUTCMonth();
  const day = date?.getUTCDate();

  const handleClick = (event) => {
    const { id } = event.target;
    if(onClick) onClick(id);
  }

  const rows = () => {
    let r = [];
    for(var i = 0; i < 24; i++) {
      const id = month + "/" + day + "/" + i;
      r.push(<span className="flex small" onClick={handleClick} id={id} key={i}> {time ? i : null} </span>)
    }
    return r;
  }

  return (
    <div className="column flex-col"> 
      {date ? <label className="date flex small"> {month + 1}/{day} </label> : <span className="flex"></span>}
      <div className="rows flex-col">
        { rows() }
      </div>
    </div>
  )
}

export default Column;