import React from 'react';
import ReactDOM from 'react-dom';
import ajaxHandler from '../../lib/ajaxHandler.js';

class SuggestionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLinks: ''
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('Inside SuggestionListEntry componentDidUpdate before api call');
  //   if ( this.state.imageLinks === '' ) {
  //     ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
  //       console.log('in SugestionListEntry componentDidUpdate...response.data is...', response.data);
  //       this.setState({
  //         imageLinks: response.data
  //       });
  //     }.bind(this));
  //   }
  // }

  componentDidMount() {
    console.log('Inside SuggestionListEntry componentDidMount before api call');
    if ( this.state.imageLinks === '' ) {
      ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
        console.log('in SugestionListEntry componentDidMount...response.data is...', response.data);
        this.setState({
          imageLinks: response.data
        });
      }.bind(this));
    }
  }

  render() {
    let imgSrc = this.state.imageLinks || 'https://photos.smugmug.com/Other/Madurai-Meenakshi-Amman-Temple/i-wdGtMtV/0/a96afd1a/X4/IMG_8216_HDR-X4.jpg';
    let imgSize = {
      width:'100px',
      height: '100px'
    };
    return (
      <li className="suggestion-list-entry">
        <div className="suggestion-list-entry-title">
          <a href={this.props.suggestion.suggestionLink} target={this.props.suggestion.target}>{this.props.suggestion.suggestionName}</a>
          <h4> Recommended by  {this.props.suggestion.suggestionSource} </h4>
          <a href = {imgSrc} target='#'> <img src = {imgSrc} style={imgSize} /> </a>
        </div>
      </li>
    );
  }
}

export default SuggestionListEntry;
