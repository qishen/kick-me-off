import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import MuiTextField from 'material-ui/TextField';
import MuiSelectField from 'material-ui/SelectField'
import MuiMenuItem from 'material-ui/MenuItem';
import MuiRaisedButton from 'material-ui/RaisedButton';
import MuiIconButton from 'material-ui/IconButton';
import MuiRemoveSVG from 'material-ui/svg-icons/action/delete';

// Make material-ui SelectField to change on event and render options correctly.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const durationItems = [
  <MuiMenuItem key={0} value={0} primaryText="Never" />,
  <MuiMenuItem key={300} value={300} primaryText="5 minutes" />,
  <MuiMenuItem key={600} value={600} primaryText="10 minutes" />,
  <MuiMenuItem key={1800} value={1800} primaryText="30 minutes" />,
  <MuiMenuItem key={3600} value={3600} primaryText="1 hour" />,
  <MuiMenuItem key={7200} value={7200} primaryText="2 hours" />,
  <MuiMenuItem key={43200} value={43200} primaryText="12 hours" />,
];

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

  onClick() {
    console.log("hi, Qishen");
  }

  render() {
    const itemKeys = Object.keys(this.props.items);
    const items = this.props.items;
    var iconButton = (
      <MuiIconButton onClick={this.onClick}>
        <MuiRemoveSVG />
      </MuiIconButton>
    );
    return (
      <List>
        {itemKeys.map(itemKey => {
          var h = Math.floor(items[itemKey].sec / 3600);
          var m = Math.floor(items[itemKey].sec % 3600 / 60);
          var s = items[itemKey].sec % 3600 % 60;
          return (
            <ListItem secondaryText={itemKey} rightIcon={iconButton}
            key={itemKey} primaryText={h + ':' + m + ':' + s} />
          )
        })}
      </List>
    );
  }
}

class CountDownApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {items: {}, text: '', sec: 0};
    // Bind functions to be used in callback.
    this.handleSecFieldChange = this.handleSecFieldChange.bind(this);
    this.handleURLFieldChange = this.handleURLFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <h1>Kick Me Off!</h1>
          <form onSubmit={this.handleSubmit}>
            <MuiSelectField name='sec' floatingLabelText="Timer"
            value={this.state.sec} onChange={this.handleSecFieldChange}>
              {durationItems}
            </MuiSelectField>
            <MuiTextField onChange={this.handleURLFieldChange} name='url'
                          floatingLabelText="Enter url e.g. www.youtube.com"
                          value={this.state.text} />
            <MuiRaisedButton label="Add Item" type="submit"/>
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

  handleSecFieldChange(event, index, value) {
    this.setState({sec: value}); // Turn minutes to seconds.
  }

  handleURLFieldChange(e) {
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
    var seconds = this.state.sec;
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


var mountNode = document.getElementById("root");
ReactDOM.render(<CountDownApp />, mountNode);
