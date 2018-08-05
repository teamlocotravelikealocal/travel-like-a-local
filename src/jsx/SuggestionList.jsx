import React from 'react';
import ReactDOM from 'react-dom';
import SuggestionListEntry from "./SuggestionListEntry.jsx";
import { List, Grid, Segment } from 'semantic-ui-react';


class SuggestionList extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    //console.log(this.props);

    return (
      <Grid>
      <Segment>
      <List divided verticalAlign='middle'>
        {
          this.props.suggestionList.map( (suggestion, index) => {
            return (
              <Segment inverted color={ index%2 === 0 ? 'blue' : 'red' } tertiary>
                <SuggestionListEntry suggestion={suggestion} key={index} />
              </Segment>
            );
          })
        }
      </List>
      </Segment>
      </Grid>
    );




    // return (
    //   <div className="suggestion-list media">

    //     {this.props.weather && <div className="forecast">Current Weather <br /><br /> {this.props.weather}</div>}

    //     <ol>
    //       {
    //         this.props.suggestionList.map((suggestion, index) =>
    //           <SuggestionListEntry
    //             suggestion={suggestion}
    //             key={index}
    //             />
    //         )
    //       }
    //     </ol>
    //   </div>
    // )
  }
}

export default SuggestionList;