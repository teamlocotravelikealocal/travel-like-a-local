import React from 'react';
import { Button, Form, Segment, Dropdown, Input, Grid } from 'semantic-ui-react';


class AddSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.handleSuggestionSubmit = this.handleSuggestionSubmit.bind(this);
    this.destinationOptionChange = this.destinationOptionChange.bind(this);
    this.handleSugNameInputChange = this.handleSugNameInputChange.bind(this);
    this.handleSugLinkInputChange = this.handleSugLinkInputChange.bind(this);
    this.state = {
      destinationOption: this.props.destinations[0].destinationName,
      suggestionName: '',
      suggestionLink: ''
    };
  }


  componentDidUpdate(prevProps) {
    if ( JSON.stringify(this.props.destinations) !== JSON.stringify(prevProps.destinations) ) {
      this.setState({ destinationOption: this.props.destinations[0].destinationName });
    }
  }

  handleSugNameInputChange(e) {
    this.setState({ suggestionName: e.target.value });
  }

  handleSugLinkInputChange(e) {
    this.setState({ suggestionLink: e.target.value });
  }

  handleSuggestionSubmit(e) {
    e.preventDefault();
    this.props.handleAddSuggestion(this.state.destinationOption, this.state.suggestionName, this.state.suggestionLink);
    this.setState({ suggestionName: '', suggestionLink: '' });
  }

  destinationOptionChange(e, data) {
    this.setState({ destinationOption: data.value });
  }

  render() {
    let options = this.props.destinations.map( (city, index) => {
      return ({
        key: index,
        text: city.destinationName,
        value: city.destinationName
      });
    });

    return (
        <Form onSubmit={this.handleSuggestionSubmit}>

        <Segment.Group>
          <Segment basic>
            <Dropdown selection onChange={this.destinationOptionChange} value={this.state.destinationOption} options={options} ></Dropdown>
          </Segment>

          <Segment>
            <Input placeholder="Add Your Comment To Selected Destination" type="text" value={this.state.suggestionName} onChange={this.handleSugNameInputChange} required />
          </Segment>
          <Segment>
            <Input placeholder="Add Your Link" type="text" value={this.state.suggestionLink} onChange={this.handleSugLinkInputChange} required />
          </Segment>

          <Segment>
            <Button type="submit" value="Submit" onClick={this.handleSuggestionSubmit}>Submit</Button>
          </Segment>
        </Segment.Group>
        </Form>

    );




//     return (
//         <Form onSubmit={this.handleSuggestionSubmit}>

//         <Grid celled padded>
//         <Grid.Row stretched>
// {/*        <Segment>*/}
//           <Dropdown selection onChange={this.destinationOptionChange} value={this.state.destinationOption} options={options} ></Dropdown>
// {/*        </Segment>*/}
//         </Grid.Row>
//         <Grid.Row>
// {/*        <Segment>*/}
//           <Input placeholder="Add Your Comment To Selected Destination" type="text" value={this.state.suggestionName} onChange={this.handleSugNameInputChange} required />
// {/*        </Segment>*/}
//         </Grid.Row>
//         <Grid.Row>
// {/*        <Segment>*/}
//           <Input placeholder="Add Your Link" type="text" value={this.state.suggestionLink} onChange={this.handleSugLinkInputChange} required />
// {/*        </Segment>*/}
//         </Grid.Row>
//         <Grid.Row>
// {/*        <Segment>*/}
//           <Button type="submit" value="Submit" onClick={this.handleSuggestionSubmit}>Submit</Button>
// {/*        </Segment>*/}
//         </Grid.Row>
//         </Grid>
//         </Form>

//     );
  }





  // render() {
  //   return (
  //     <div>
  //       <form onSubmit={this.handleSuggestionSubmit}>
  //         <hr />
  //         <select onChange={this.destinationOptionChange} value={this.state.destinationOption}>
  //           {this.props.destinations.map((destination) => <option value={destination.destinationName} key={destination.destinationName}>{destination.destinationName}</option>)}
  //         </select>
  //         <input className="comment-input" placeholder="Add Your Comment To Selected Destination" type="text" value={this.state.suggestionName} onChange={this.handleSugNameInputChange} required />
  //         <hr />
  //         <input placeholder="Add Your Link" type="text" value={this.state.suggestionLink} onChange={this.handleSugLinkInputChange} required />
  //         <input type="submit" value="Submit" />
  //         <hr />
  //       </form>
  //     </div>
  //   );
  // }
}

export default AddSuggestion;