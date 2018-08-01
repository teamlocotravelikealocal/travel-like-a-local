import React from 'react';
import ReactDOM from 'react-dom';
import SuggestionListEntry from "./SuggestionListEntry.jsx";


class SuggestionList extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    //console.log(this.props);
    return (
      <div className="suggestion-list media">

        {this.props.weather && <div className="forecast">Current Weather <br /><br /> {this.props.weather}</div>}

        <ol>
          {
            this.props.suggestionList.map((suggestion, index) =>
              <SuggestionListEntry
                suggestion={suggestion}
                key={index}
                />
            )
          }
        </ol>
      </div>
    )
  }
}

export default SuggestionList;