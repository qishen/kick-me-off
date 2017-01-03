import React from 'react';
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import {render} from 'react-dom';

// Example component
class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}


class CountDownList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {items: this.props.items};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const itemKeys = Object.keys(this.props.items);
    const items = this.props.items;
    return (
      <ul>
        {itemKeys.map(itemKey => (
          <li key={itemKey}>{itemKey + ' ' + items[itemKey].sec}</li>
        ))}
      </ul>
    );
  }
}

class CountDownApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {items: {}, text: ''};
    // Bind functions to be used in callback.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <h3>Kick Me Off!</h3>
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.handleChange} name='url' value={this.state.text} />
            <input name='sec' />
            <button>Add</button>
          </form>
          <CountDownList items={this.state.items} />
        </div>
      </MuiThemeProvider>
    );
  }

  isValidURL(url){
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(url);
  }

  handleChange(e) {
    // Save the input text to state variable and do validation.
    this.setState({text: e.target.value});
    if(this.isValidURL(e.target.value)){

    }
    else {
      this.setState((prevState) => ({
        text: prevState.text
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var seconds = e.target.sec.value;
    var url = e.target.url.value;
    this.setState((prevState) => {
      // Decrement attribute sec every second.
      var interval = setInterval(() => this.decrementSec(url), 1000);

      // Make a deep copy for Immutability and add one new item.
      var newItems = Object.assign({}, prevState.items);
      newItems[url] = {sec: seconds, interval: interval};

      return {items: newItems};
    });
  }

  decrementSec(url) {
    this.setState((prevState) => {
      // Make a deep copy for Immutability and remove one item.
      var newItems = Object.assign({}, prevState.items);
      if(newItems[url].sec !== 0) {
        newItems[url].sec = newItems[url].sec - 1;
      }
      else {
        // Clear interval and delete item from dict.
        clearInterval(newItems[url].interval);
        delete newItems[url];
      }
      return {items: newItems};
    });
  }

  removeItem(url) {
    this.setState((prevState) => {
      // Make a deep copy for Immutability and remove one item.
      var newItems = Object.assign({}, prevState.items);
      delete newItems[url];
      return {items: newItems};
    });
  }
}


var mountNode = document.getElementById("title");
ReactDOM.render(<CountDownApp />, mountNode);
//ReactDOM.render(<HelloMessage />, mountNode);
