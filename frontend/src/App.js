import './App.css';
import React, { Component, useEffect } from 'react';
import Logo from "./content/logo.png";

const io = require("socket.io-client")



class App extends Component {

  state = {
    socket: null,
    message: "",
    chat: []
  }

  async componentDidMount() {
    this.setState({socket: await io("ws://localhost:8080")});
    this.state.socket.on("message", (message) => {
      let chat = this.state.chat;
      chat.push(message);
      this.setState({chat});
    })
  };

  handleType = (e) => {
    const change = e.currentTarget.value;
    this.setState({message: change});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {message} = this.state;
    if(message.length == 0) return;
    this.state.socket.emit("send", message)
    this.setState({message: ""});
  }

  formatPost = ({time, name, text}) => {
    return(
      <>
        <h6>{time}</h6>
        <h1>{name}:</h1>
        <h2>{text}</h2>
      </>
    );
  }

  render() { 

    let submitButton = this.state.message == "" ? <button disabled>Send</button> : <button type="submit">Send</button>;

    return(
      <div id="container">
        <div id="header">
          <img src={Logo}></img>
        </div>

        <div id="chatbox">
          <ul>
            {this.state.chat.length == 0 ? <li>There are no messages. Try sending one!</li> : this.state.chat.map(post => {
              return <li class="post">{this.formatPost(post)}</li>
            })}
          </ul>
        </div>

        <form id="footer" onSubmit={this.handleSubmit}>
          <input id = "text" type ="text" placeholder="Type a message" value={this.state.message} onChange={this.handleType}></input>
          {submitButton}
        </form>
      </div>
    )
  }
}
 
export default App;