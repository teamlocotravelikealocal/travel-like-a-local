import React from 'react';
import FriendListEntry from "./FriendListEntry.jsx";
import { Button, Form, Segment, Dropdown, Input, Grid } from 'semantic-ui-react';


class FriendList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log(this.props.friendList);
    return (
      <div>
        <p><span className="name">{this.props.userName} </span>these are your friends:</p>
        {this.props.friendList.map((friend) => <FriendListEntry friendID={friend.friendID} userID={this.props.userID} friend={friend.friendName} key={friend.friendID} handleFriendDelete={this.props.handleFriendDelete} />)}
      </div>
    );


    // let friends = this.props.friendList.map( (friend, index) => {
    //   return ({
    //     key: index,
    //     text: city.destinationName,
    //     value: city.destinationName
    //   });
    // });

    // return (
    //     <Form onSubmit={this.handleSuggestionSubmit}>

    //     <Segment.Group>
    //       <Segment basic>
    //         <Dropdown selection onChange={this.destinationOptionChange} value={this.state.destinationOption} options={options} ></Dropdown>
    //       </Segment>

    //       <Segment>
    //         <Button type="submit" value="Submit" onClick={this.handleSuggestionSubmit}>Add Friend</Button>
    //       </Segment>
    //     </Segment.Group>
    //     </Form>

    // );
  }
}

export default FriendList;