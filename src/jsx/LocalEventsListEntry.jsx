import React from 'react';
import ReactDOM from 'react-dom';
import ajaxHandler from '../../lib/ajaxHandler.js';

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
    // let imgSrc = this.state.imageLinks[0] || 'https://photos.smugmug.com/Other/Madurai-Meenakshi-Amman-Temple/i-wdGtMtV/0/a96afd1a/X4/IMG_8216_HDR-X4.jpg';
    // let imgSize = {
    //   width:'100px',
    //   height: '100px'
    // };
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
    // return (
    //   <li className="suggestion-list-entry">
    //     <div className="suggestion-list-entry-title">
    //       <a href={this.props.suggestion.suggestionLink} target={this.props.suggestion.target}>{this.props.suggestion.suggestionName}</a>
    //       <h4> Recommended by  {this.props.suggestion.suggestionSource} </h4>
    //       <a href = {imgSrc} target='#'> <img src = {imgSrc} style={imgSize} /> </a>
    //     </div>
    //   </li>
    // );
  }
}

export default LocalEventsListEntry;