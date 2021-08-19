import { Panel } from "./ui/Interface";

const Create = () => {
  return (
    <Panel className="create flex-col">
      {/* <label className="subtitle medium bold"> Create an Event </label> */}

      <div className="flex-col">
        <label className="medium"> Event Name </label>
        <input type="text"/>
      </div>

      <div className="flex-col">
        <label className="medium"> Event Date </label>
        <input type="date"/>
        <button> + Add Another Date </button>
      </div>

      <button> Create Event </button>
    </Panel>
  )
}

export default Create;