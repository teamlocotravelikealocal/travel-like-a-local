import React from 'react';
import { Button, Form, Segment, Dropdown, Input, Grid } from 'semantic-ui-react';


class AddFriend extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddFriendClick = this.handleAddFriendClick.bind(this);
    this.friendOptionChange = this.friendOptionChange.bind(this);
    this.state = { friendOption: '' };
  }

  handleAddFriendClick(e) {
    e.preventDefault();
    this.props.handleAddFriend(this.state.friendOption);
  }

  friendOptionChange(e, data) {
    this.setState({ friendOption: data.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.friendsToAdd[0]) {
      this.setState({ friendOption: nextProps.friendsToAdd[0].username });
    }
  }

  render() {
    // return (
    //   <div>
    //     <form>
    //       <label>
    //         <select onChange={this.friendOptionChange} value={this.state.friendOption}>
    //           {this.props.friendsToAdd.map((friend) => <option value={friend.username} key={friend.id}>{friend.username}</option>)}
    //         </select>
    //       </label>
    //       <input className="add-friend-btn" type="submit" value="Add Friend" onClick={this.handleAddFriendClick} />
    //     </form>
    //   </div>
    // );




    let friends = this.props.friendsToAdd.map( (friend, index) => {
      return ({
        key: index,
        text: friend.username,
        value: friend.username
      });
    });

    return (
        <Form onSubmit={this.handleSuggestionSubmit}>

        <Segment.Group>
          <Segment basic>
            <Dropdown selection onChange={this.friendOptionChange} value={this.state.friendOption} options={friends} ></Dropdown>
          </Segment>

          <Segment>
            <Button type="submit" value="Submit" onClick={this.handleAddFriendClick}>Add Friend</Button>
          </Segment>
        </Segment.Group>
        </Form>

    );


  }
}

export default AddFriend;