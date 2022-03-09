import './App.css';
import React, { Component, useEffect } from 'react';

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

  render() { 
    return(
      <div id="container">
        <div id="chatbox">
          <ul>
            {this.state.chat.length == 0 ? "There are no messages. Try sending one!" : this.state.chat.map(post => {
              return <li class="post">{post.time} - {post.text}</li>
            })}
          </ul>
        </div>

        <form id="footer" onSubmit={this.handleSubmit}>
          <input id = "text" type ="text" placeholder="Type a message" value={this.state.message} onChange={this.handleType}></input>
          <button type="submit">Send</button>
        </form>
      </div>
    )
  }
}
 
export default App;