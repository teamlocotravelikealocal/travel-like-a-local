import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Container, Divider, Grid, Header, Image, Segment } from 'semantic-ui-react';
import ReactDOM from 'react-dom';
import Title from './Title.jsx'
import ajaxHandler from '../../lib/ajaxHandler.js';
import DestinationInput from './DestinationInput.jsx';
import AddFriend from './AddFriend.jsx';
import Nav from "./Nav.jsx";
import SuggestionList from "./SuggestionList.jsx";
import FriendList from "./FriendList.jsx";
import SearchInput from "./SearchInput.jsx";
import AddSuggestion from "./AddSuggestion.jsx";
import LocalEventsList from './LocalEventsList.jsx';
import LoginForm from './LoginForm.jsx';
import Destination from './Destination.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputDest = this.handleInputDest.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
    this.handleSearchDest = this.handleSearchDest.bind(this);
    this.handleAddSuggestion = this.handleAddSuggestion.bind(this);
    this.handleFriendDelete = this.handleFriendDelete.bind(this);
    this.loginPress = this.loginPress.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setNavItem = this.setNavItem.bind(this);
    this.state = {
      userName: this.props.username,
      userID: '',
      friendsToAdd: [],
      friendList: [],
      suggestionList: [],
      suggestionToAdd: {},
      destinations: [],
      weather: '',
      weatherIcon: '',
      events:[],
      showLoginComponent: false,
      location: '',
      navItem : 'Search'
    };
  }

  componentDidMount() {
    ajaxHandler.getFriendList(this.state.userName, function (response) {
      //console.log(response.data);
      this.setState({
        friendList: response.data
      });
    }.bind(this));
    ajaxHandler.getRemainingFriends(this.state.userName, function (response) {
      this.setState({
        friendsToAdd: response.data
      });
    }.bind(this));
    if (this.state.userName === 'not logged in') {
      this.setState({ suggestionList: [] });
    }
    ajaxHandler.getDestinations(function (response) {
      this.setState({
        destinations: response
      });
    }.bind(this));
    ajaxHandler.handleGetLoggedUserID(this.state.userName, function (response) {
      //console.log(response.data);
      if (response.data.length > 0) {
        this.setState({
          userID: response.data[0].ID
        });
      }
    }.bind(this));
  }

  handleInputDest(destination) {
    var that = this;
    ajaxHandler.handlePostDestination(destination, function (response) {
      ajaxHandler.getDestinations(function (response) {
        that.setState({
          destinations: response
        });
      });
    });
  }

  loginPress(bool){
   if(bool){
    this.setState({
      showLoginComponent:true
    })
   }
  }

  handleAddFriend(friend, friendList) {
    var that = this;
    ajaxHandler.handleAddFriend(this.state.userName, friend, function () {
      ajaxHandler.getFriendList(that.state.userName, function (response) {
        that.setState({
          friendList: response.data
        });
      });
      ajaxHandler.getRemainingFriends(that.state.userName, function (response) {
        that.setState({
          friendsToAdd: response.data
        });
      });
    });
  }

  handleSearchDest(location) {
    //get weather data


    ajaxHandler.getWeatherData(location, function (response) {
      var weather = response.data.query.results.channel.item.condition.temp + "°C and " + response.data.query.results.channel.item.condition.text;
      this.setState({ weather: weather, location: location });
    }.bind(this));

    if (this.state.userName === 'not logged in') {
      var source = 'Google';
      var suggestionList = [];
      ajaxHandler.getPlacesFromGoogleMaps(location, function (response) {
        let suggestions = response.suggestions;
        let lattitude = response.lattitude;
        let longitude = response.longitude;
        console.log(`lattitude is ${lattitude} and longitude is ${longitude}`);

        let latLong = {
          lattitude: lattitude,
          longitude: longitude
        };

        ajaxHandler.getEventsFromEventbrite(latLong, function (events) {
          console.log('events from eventbrite...');
          this.setState({
            events:events
          })
        }.bind(this));

        for (var i = 0; i < suggestions.length; i++) {
          if (suggestions[i].photos !== undefined) {
            var link = suggestions[i].photos[0].html_attributions[0].match(/href="(.*?")/g);
            link = link[0].slice(6).slice(0, -1);
            suggestionList.push({ suggestionName: suggestions[i].name, suggestionSource: source, suggestionLink: link, target: '_blank' });
          } else {
            suggestionList.push({ suggestionName: suggestions[i].name, suggestionSource: source, suggestionLink: '#', target: '' });
          }
        }
        this.setState({ suggestionList: suggestionList });
        //console.log(suggestionList);
      }.bind(this));

      //Call to get Local Events
      // console.log('after google maps places before eventbrite');
      // ajaxHandler.getEventsFromGoogleMapsAndEventbrite(location, function (events) {
      //   console.log('events from eventbrite...');
      // }.bind(this));

    }

    // case when user is logged in
    if (this.state.userName !== 'not logged in') {
      var source = 'Google';
      var suggestionList = [];
      var that = this;
      ajaxHandler.getPlacesFromGoogleMaps(location, function (response) {
        let suggestions = response.suggestions;
        let lattitude = response.lattitude;
        let longitude = response.longitude;

        let latLong = {
          lattitude: lattitude,
          longitude: longitude
        };
      console.log(`lattitude is ${lattitude} and longitude is ${longitude}`);

        ajaxHandler.getEventsFromEventbrite(latLong, function (events) {
          that.setState({
            events:events.data
          })
        }.bind(that));

        for (var i = 0; i < suggestions.length; i++) {
          if (suggestions[i].photos !== undefined) {
            var link = suggestions[i].photos[0].html_attributions[0].match(/href="(.*?")/g);
              if (link) {
                link = link[0].slice(6).slice(0, -1);
                suggestionList.push({ suggestionName: suggestions[i].name, suggestionSource: source, suggestionLink: link, target: '_blank' });
              }
          } else {
            suggestionList.push({ suggestionName: suggestions[i].name, suggestionSource: source, suggestionLink: '#', target: '' });
          }
        }
        ajaxHandler.getSuggestionsForLoggedUsers(that.state.userName, location, function (suggestions) {
          if (suggestions.length > 0) {
            for (var i = 0; i < suggestions.length; i++) {
              suggestionList.unshift({ suggestionName: suggestions[i].suggestionName, suggestionSource: suggestions[i].friendName, suggestionLink: suggestions[i].photoLink, target: '_blank' });
            }
          }
          that.setState({ suggestionList: suggestionList });
        });
      });




    }
  }

  handleAddSuggestion(location, suggestionName, suggestionLink) {
    var userName = this.state.userName;
    ajaxHandler.postNewSuggestion(userName, location, suggestionName, suggestionLink, function (response) {
      console.log(response);
    });
  }

  handleFriendDelete(userID, friendID) {
    var thisComponent = this;
    var friendList = this.state.friendList;
    var length = friendList.length;
    for (var i = 0; i < length; i++) {
      if (JSON.stringify(friendList[i].userID) === JSON.stringify(userID) && JSON.stringify(friendList[i].friendID) === JSON.stringify(friendID)) {
        friendList = friendList.slice(0, i).concat(friendList.slice(i + 1, length));
        break;
      }
    }
    ajaxHandler.deleteFriendship(userID, friendID, function () {
      ajaxHandler.getRemainingFriends(thisComponent.state.userName, function (response) {
        thisComponent.setState({
          friendList: friendList,
          friendsToAdd: response.data
        });
      });
    }.bind(thisComponent));
  }


    // ajaxHandler.handleGetLoggedUserID(this.state.userName, function (response) {
    //   //console.log(response.data);
    //   if (response.data.length > 0) {
    //     this.setState({
    //       userID: response.data[0].ID
    //     });
    //   }
    // }.bind(this));



  setUser(username) {
    var thisComponent = this;
    if ( username !== 'not logged in' ) {
      ajaxHandler.getFriendList(username, function (response) {
        console.log('retreiving friendList...', response.data);
        let friendListResult = response.data;
        ajaxHandler.getRemainingFriends(username, function (response) {
          let remainingFriends = response.data;
          ajaxHandler.handleGetLoggedUserID(username, function (response) {
            debugger;
            console.log('getting userID...response..', response);
            thisComponent.setState({
              userName: username,
              userID: response.data[0].ID,
              friendsToAdd: remainingFriends,
              friendList: friendListResult,
              showLoginComponent: !thisComponent.state.showLoginComponent
            });
          });
        });
      }.bind(thisComponent));
    } else {
        thisComponent.setState({
          userName: username,
          friendList: [],
          friendsToAdd: [],
          showLoginComponent: !thisComponent.state.showLoginComponent
        });
    }
  }

  setNavItem(item){
    this.setState({
      navItem:item
    })
  }

  render() {
    return (
      <div>
        <Title />
        <Nav userName={this.state.userName} handleSearchDest={this.handleSearchDest} loginPress={this.loginPress} setUser={this.setUser} navItem={this.state.navItem} setNavItem={this.setNavItem}/>
        <div>
{/*          <SearchInput handleSearchDest={this.handleSearchDest} />*/}

          {this.state.showLoginComponent && <LoginForm userName={this.state.userName} setUser={this.setUser}/>}
          {this.state.navItem === 'Search' && this.state.suggestionList.length !== 0 && <Destination location={this.state.location} weather={this.state.weather} />}
          <Grid columns={2}>
            <Grid.Row>
            <Grid.Column>
            {this.state.navItem === 'Search' && this.state.suggestionList.length !== 0 && <SuggestionList suggestionList={this.state.suggestionList} weather={this.state.weather} />}
            </Grid.Column>
            <Grid.Column>
            {this.state.navItem === 'Search' && this.state.events.length !==0 && <LocalEventsList eventsList = {this.state.events} />}
            </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        {this.state.userName !== 'not logged in' && this.state.navItem === 'Recommend' &&
          <Segment>
            <Grid columns={2} divided>
              <Grid.Row stretched>

                <Grid.Column>
                <Segment>
                  <DestinationInput handleInputDest={this.handleInputDest} />
                </Segment>
                </Grid.Column>
                <Grid.Column>
                <Segment>
                  <AddSuggestion userName={this.state.userName} handleAddSuggestion={this.handleAddSuggestion} destinations={this.state.destinations} />
                </Segment>
                </Grid.Column>

              </Grid.Row>
            </Grid>
          </Segment>
        }

        {this.state.userName !== 'not logged in' && this.state.navItem === 'Friends' &&
          <Segment>
            <Grid columns={2} divided>
              <Grid.Row stretched>

                <Grid.Column>
                <Segment>
                  <AddFriend userName={this.state.userName} friendsToAdd={this.state.friendsToAdd} handleAddFriend={this.handleAddFriend} />
                </Segment>
                </Grid.Column>
                <Grid.Column>
                <Segment>
                  <FriendList userName={this.state.userName} userID={this.state.userID} friendList={this.state.friendList} handleFriendDelete={this.handleFriendDelete} />
                </Segment>
                </Grid.Column>

              </Grid.Row>
            </Grid>
          </Segment>
        }

      </div>
    );
  }
}

export default App;