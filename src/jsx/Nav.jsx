import React from "react";
import ReactDOM from "react-dom";
import { Button, Menu, Input, Label } from 'semantic-ui-react'

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSearchDest: ''
    }
    this.handleDestInputSearch = this.handleDestInputSearch.bind(this)
    this.handleSearchDestSubmit = this.handleSearchDestSubmit.bind(this)
  }

  handleDestInputSearch(e, data) {
    this.setState({
      inputSearchDest: data['value']
    })
  }

  handleSearchDestSubmit(e, data) {
    e.preventDefault();
    console.log('search term is...' + this.state.inputSearchDest);
    this.props.handleSearchDest(this.state.inputSearchDest);
  }


  render() {
    return (
      <Menu>

{/*        <Menu.Item>

        </Menu.Item>*/}

        <Menu.Item>
          <Label color='teal' horizontal pointing='right'>
            Where to?
          </Label>
          <Input className='icon' icon='search' action={{ onClick: this.handleSearchDestSubmit }}  onChange ={this.handleDestInputSearch}  placeholder='Search...' />
        </Menu.Item>

        <Menu.Item position='right'>
          <Button primary onClick = { () => alert('Logging in...') }>Log-in</Button>
        </Menu.Item>

        <Menu.Item>
          <Button >Sign up</Button>
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
