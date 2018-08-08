import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';


class DestinationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputDest: ""
    }
    this.handleDestInputChange = this.handleDestInputChange.bind(this)
    this.handleInputDestClick = this.handleInputDestClick.bind(this)
  }

  handleDestInputChange(e){
    this.setState({
      inputDest: e.target.value
    })
  }

  handleInputDestClick(e){
    e.preventDefault();
    this.props.handleInputDest(this.state.inputDest);
    this.setState({
      inputDest: ""
    });
  }

  render() {
    return(
        <Form onSubmit={this.handleInputDestClick} >
        <Form.Group widths="equal">
          <Form.Input placeholder='Add Your City to our Database!' value={this.state.inputDest} onChange={this.handleDestInputChange} />
        </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
    );
  }
  // render() {
  //   return(
  //     <div>
  //       <form>
  //         <label>
  //           <input placeholder="Add Your City to our Database!" type="text" value={this.state.inputDest} onChange={this.handleDestInputChange}/>
  //         </label>
  //         <input type="submit" value="Submit" onClick={this.handleInputDestClick} />
  //       </form>
  //     </div>
  //   );
  // }
}

export default DestinationInput;