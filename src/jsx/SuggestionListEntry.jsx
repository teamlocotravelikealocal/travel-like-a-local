import React from 'react';
import ReactDOM from 'react-dom';
import ajaxHandler from '../../lib/ajaxHandler.js';
import { Image, List, Icon, Label, Grid } from 'semantic-ui-react';

class SuggestionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLinks: ''
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Inside SuggestionListEntry componentDidUpdate before api call');
    if ( this.props.suggestion.suggestionLink !== prevProps.suggestion.suggestionLink ) {
      ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
        // console.log('in SugestionListEntry componentDidUpdate...response.data is...', response.data);
        this.setState({
          imageLinks: response.data
        });
      }.bind(this));
    }
  }

  componentDidMount() {
    // console.log('Inside SuggestionListEntry componentDidMount before api call');
    if ( this.state.imageLinks === '' ) {
      ajaxHandler.getImageForSuggestionLinks(this.props.suggestion.suggestionLink, function (response) {
        // console.log('in SugestionListEntry componentDidMount...response.data is...', response.data);
        this.setState({
          imageLinks: response.data
        });
      }.bind(this));
    }
  }

  render() {
    let imgSrc = this.state.imageLinks[0] || 'https://photos.smugmug.com/Other/Madurai-Meenakshi-Amman-Temple/i-wdGtMtV/0/a96afd1a/X4/IMG_8216_HDR-X4.jpg';
    let imgSize = {
      width:'100px',
      height: '100px'
    };

    return (
      <List.Item>
        <Grid verticalAlign='middle' columns={3} padded='vertically'>
          <Grid.Row>
            <Grid.Column width={2}>
              <Label color='orange'> <a href={this.props.suggestion.suggestionLink} target={this.props.suggestion.target}>{this.props.suggestion.suggestionName}</a>
              </Label>
            </Grid.Column>
            <Grid.Column width={4}>
              <Image src={imgSrc} fluid rounded />
            </Grid.Column>
            <Grid.Column width={1}>
              <Icon name={ this.props.suggestion.suggestionSource === 'Google' ? 'google' : 'user'} size='small' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </List.Item>
    );
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

export default SuggestionListEntry;