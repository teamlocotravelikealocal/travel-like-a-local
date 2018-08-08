import React from "react";
import ReactDOM from "react-dom";
import { Button, Menu, Input, Label } from 'semantic-ui-react'
import LoginForm from './LoginForm.jsx';
import $ from 'jquery';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSearchDest: ''
      // activeItem : 'Search'
    }
    this.handleDestInputSearch = this.handleDestInputSearch.bind(this);
    this.handleSearchDestSubmit = this.handleSearchDestSubmit.bind(this);
    this.loginLogoutClick = this.loginLogoutClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);

  }

  handleItemClick(e, { name }) {

    // this.setState({ activeItem: name })
    this.props.setNavItem(name);
  };


  handleDestInputSearch(e, data) {
    this.setState({
      inputSearchDest: data['value']
    })
    this.props.setNavItem('Search');
  }

  handleSearchDestSubmit(e, data) {
    e.preventDefault();
    console.log('search term is...' + this.state.inputSearchDest);
    this.props.handleSearchDest(this.state.inputSearchDest);
  }

  loginLogoutClick() {
    var thisComponent = this;
    if ( this.props.userName === 'not logged in' ) {
      this.props.loginPress(true);
    } else {
      $.ajax({
          type: 'GET',
          url: '/logout'
        })
        .done(function(data){
          console.log('logged out data....', data);
          thisComponent.props.setUser('not logged in');
          //console.log('data has been posted from search', data);
        })
    }
  }

  render() {
    return (
      <Menu attached='top' tabular>

{/*        <Menu.Item>

        </Menu.Item>*/}

        <Menu.Item active={this.props.navItem === 'Search'}>
          <Label color='teal' horizontal pointing='right'>
            Where to?
          </Label>
          <Input className='icon' icon='search' action={{ onClick: this.handleSearchDestSubmit }}  onChange ={this.handleDestInputSearch}  placeholder='Search...' />
        </Menu.Item>
        {this.props.userName !== 'not logged in' && <Menu.Item name='Recommend' active={this.props.navItem === 'Recommend'} onClick={this.handleItemClick}></Menu.Item>}
        {this.props.userName !== 'not logged in' && <Menu.Item name='Friends' active={this.props.navItem === 'Friends'} onClick={this.handleItemClick}></Menu.Item>}
        <Menu.Item position='right'>
          <Button primary onClick = {() => this.loginLogoutClick()}>{this.props.userName === 'not logged in' ? 'Login' : 'Logout'}</Button>
        </Menu.Item>
        <Menu.Item>
        {this.props.userName === 'not logged in' && <Button onClick={this.props.signupPress}>Sign up</Button>}
        </Menu.Item>

      </Menu>
    )
  }

};

export default Nav;





// var Nav = (props) => {
//   return (
//     <nav className="navbar">
//       <div class="clearfix">
//         <div className="logo">
//           <h3>Travel Like a Local</h3>
//           <img />
//         </div>
//         <div className="login-signup">
//           {props.userName !== 'not logged in' && <span>Hello {props.userName}!     </span>}
//           {props.userName === 'not logged in' && <a href="login">Login</a>}
//           {props.userName !== 'not logged in' && <a href="logout">Logout</a>}
//           {props.userName === 'not logged in' && <a href="signup">Sign Up</a>}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Nav;
