import React from 'react';
import { Segment } from 'semantic-ui-react';

// class Destination extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       inputDest: ""
//     }

//   }


//   render() {
//     return (
//       <Segment.Group raised>
//         <Segment>Austin</Segment>
//         <Segment>Temperature</Segment>
//         <Segment>Weather</Segment>
//       </Segment.Group>
//     );
//   }
// }

const Destination = (props) => (
    <Segment.Group raised>
      <Segment>{props.location}</Segment>
      <Segment>{props.weather}</Segment>
    </Segment.Group>
);


export default Destination;