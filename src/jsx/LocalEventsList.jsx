import React from 'react';
import ReactDOM from 'react-dom';
import LocalEventsListEntry from "./LocalEventsListEntry.jsx";


class LocalEventsList extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="suggestion-list media">

        <ol>
          {
            this.props.eventsList.map((event, index) =>
              <LocalEventsListEntry
                event={event}
                key={index}
                />
            )
          }
        </ol>
      </div>
    )
  }
}

export default LocalEventsList;