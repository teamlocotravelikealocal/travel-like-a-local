import React , {Component} from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import $ from 'jquery';



class LoginForm extends Component{

  constructor(props){
    super(props);
    this.state = {  userName: '', password: ''}
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  submitForm(data) {
    console.log('data inside submitForm',data);
    let thisComponent = this;
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {credentials:data}
      })
      .done(function(data){
        console.log('logged in data...',data);
        thisComponent.props.setUser(thisComponent.state.userName);
        //console.log('data has been posted from search', data);
      })
  }

  handleSubmit = () => {

    console.log('inside handleSubmit');
    const { userName, password } = this.state;

    this.setState({ userName: userName, password: password });
    this.submitForm({ userName: userName, password: password });
  }



  render(){

    const { userName, password } = this.state

return(

  <div className='login-form'>
    {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
    <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Log-in to your account
        </Header>
        <Form size='large' onSubmit={this.handleSubmit}>
          <Segment stacked>
            <Form.Input id="userName" fluid icon='user' iconPosition='left' placeholder='Username' name='userName' value={userName} onChange={this.handleChange} />
            <Form.Input id="password"
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              name='password'
              onChange={this.handleChange}
            />

            <Button color='teal' fluid size='large'>
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  </div>
  )
}

};



export default LoginForm;