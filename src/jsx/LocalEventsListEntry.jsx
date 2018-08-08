import React from 'react';
import ReactDOM from 'react-dom';
import ajaxHandler from '../../lib/ajaxHandler.js';
import { Image, List, Icon, Label, Grid } from 'semantic-ui-react';


class LocalEventsListEntry extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   imageLinks: ''
    // }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('Inside LocalEventsListEntry componentDidUpdate before api call');
  //   if ( this.props.suggestion.suggestionLink !== prevProps.suggestion.suggestionLink ) {
  //     ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
  //       console.log('in SugestionListEntry componentDidUpdate...response.data is...', response.data);
  //       this.setState({
  //         imageLinks: response.data
  //       });
  //     }.bind(this));
  //   }
  // }

  // componentDidMount() {
  //   console.log('Inside LocalEventsListEntry componentDidMount before api call');
  //   if ( this.state.imageLinks === '' ) {
  //     ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
  //       console.log('in SugestionListEntry componentDidMount...response.data is...', response.data);
  //       this.setState({
  //         imageLinks: response.data
  //       });
  //     }.bind(this));
  //   }
  // }

  render() {
    let event = JSON.parse(this.props.event);
    return (
      <li>
        <a href={event.url} target="_blank">
          <h2>
            {event.name}
          </h2>
        </a>
        <p> {event.description} </p>
        <h4> {event.localtime} </h4>
        <h4> {event.free ? 'Free' : '$'} </h4>
      </li>);
  }
}


export default LocalEventsListEntry;