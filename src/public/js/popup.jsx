// Import CSS as components
// import 'font-awesome-webpack';
import '../css/style.css';

import Utils from './utils';
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

var port = chrome.runtime.connect({name: "kickmeoff"});
// port.postMessage({joke: "helloworld"});


// All options for choose duration in MuiSelectField.
const durationItems = [
  <MuiMenuItem key={0} value={0} primaryText="Never" />,
  <MuiMenuItem key={60} value={60} primaryText="1 minute" />,
  <MuiMenuItem key={300} value={300} primaryText="5 minutes" />,
  <MuiMenuItem key={600} value={600} primaryText="10 minutes" />,
  <MuiMenuItem key={1800} value={1800} primaryText="30 minutes" />,
  <MuiMenuItem key={3600} value={3600} primaryText="1 hour" />,
  <MuiMenuItem key={7200} value={7200} primaryText="2 hours" />,
  <MuiMenuItem key={43200} value={43200} primaryText="12 hours" />,
];


class CountDownApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: {},
      text: 'youtube.com',
      sec: 0,
      errorText: ""
    };
    this.intervals = [];

    // Bind functions to be used in callback.
    this.handleURLFieldChange = this.handleURLFieldChange.bind(this);
    this.handleMessageReceive = this.handleMessageReceive.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Get port from props and set handler for message communication
    this.port = this.props.port;
    port.onMessage.addListener(this.handleMessageReceive);
  }

  // Query initial items data from background after component mounted.
  componentDidMount() {
    this.port.postMessage({name: 'query'});
  }

  CountDownList(props) {
    // itemKeys contains all the urls for blacklist.
    const itemKeys = Object.keys(props.items);
    const items = props.items;

    // Icon button for deleting item.
    var createLabeledIconButton = (itemKey) => {
      // Use a tweak to pass one more param.
      return (
        <MuiIconButton onClick={(e) => this.handleDeleteClick(e, itemKey)}
          key={name} name='iconButton'>
          <MuiRemoveSVG />
        </MuiIconButton>
      );
    }
    createLabeledIconButton.bind(this);

    return (
      <List>
        {itemKeys.map(itemKey => {
          var seconds = items[itemKey].sec;
          var iconButton = createLabeledIconButton(itemKey);
          return (
            <ListItem secondaryText={itemKey} rightIcon={iconButton}
              key={itemKey} primaryText={Utils.secondToString(seconds)}
            />
          );
        })}
      </List>
    );
  }

  render() {
    // Create a new element and bind it to current context.
    var CountDownList = this.CountDownList.bind(this);

    return (
      <MuiThemeProvider>
        <div>
          <form onSubmit={this.handleSubmit}>

            <MuiSelectField name='sec' floatingLabelText="Timer" value={this.state.sec}
              onChange={(event, index, value) => this.setState({sec: value})}>
              {durationItems}
            </MuiSelectField>

            <MuiTextField onChange={this.handleURLFieldChange} name='url'
              floatingLabelText="Enter url e.g. youtube.com"
              errorText={this.state.errorText}
              value={this.state.text}
            />

            <MuiRaisedButton label="Add Item" type="submit"/>
          </form>

          <CountDownList items={this.state.items} />
        </div>
      </MuiThemeProvider>
    );
  }

  /**
   * Receive message msg.items from background script and update
   * its own state with decremented sec attribute.
   * @param  {Object} msg [description]
   */
  handleMessageReceive(msg) {
    console.log(msg);
    // Remove all existing intervals
    this.intervals.map((interval) => {clearInterval(interval)});
    if(msg.items == undefined) return;

    // After receive messages from background, update items with new seconds
    // based on calculation of current time and timestamp.
    this.setState((prevState) => {
      var newItems = Object.assign({}, prevState.items);
      var itemKeys = Object.keys(msg.items);
      var timenow = Date.now();

      itemKeys.map((itemKey) => {
        var seconds = msg.items[itemKey].sec;
        var timestamp = msg.items[itemKey].timestamp;
        var newSeconds = seconds -  Math.floor((timenow - timestamp) / 1000);
        newItems[itemKey] = {sec: newSeconds};
        // Create new intervals for each url.
        var interval = setInterval(() => {
          this.decrementSec(itemKey);
        }, 1000);
        this.intervals.push(interval);
      });
      return {items: newItems};
    });
  }

  /**
   * Decrement time on the timer bar and reset items in state.
   * @param  {String} url
   */
  decrementSec(url) {
    this.setState((prevState) => {
      // Make a deep copy for Immutability and remove one item.
      var newItems = Object.assign({}, prevState.items);
      if(newItems[url].sec > 0) {
        newItems[url].sec = newItems[url].sec - 1;
      }
      return {items: newItems};
    });
  }

  /**
   * Notify background script to delete timer for this url and
   * graphically delete this item from list.
   * @param  {Event} e    Default onClick event
   * @param  {String} url
   */
  handleDeleteClick(e, url) {
    this.port.postMessage({name: 'delete', url: url});
    this.removeItem(url);
  }

  /**
   * Handle URL field change on input, set it to either empty string
   * or error text.
   * @param  {Event} e
   */
  handleURLFieldChange(e) {
    // Save the input text to state variable and do validation.
    this.setState({text: e.target.value});
    if(Utils.isValidURL(e.target.value))
      this.setState({errorText: ""});
    else
      this.setState({errorText: "Your input is not a valid URL."});
  }

  /**
   * Get URL and seconds from submit form and send a message to
   * background script to notify a new item is added.
   * @param  {Event} e
   */
  handleSubmit(e) {
    e.preventDefault();
    var url = e.target.url.value;
    if(Utils.isValidURL(url)) {
      var seconds = this.state.sec;
      // Send message to background.js about new item.
      this.port.postMessage({name: 'add', url: url, sec: seconds});
    }
  }

  /**
   * Graphically remove selected item from popup page.
   * @param  {String} url
   */
  removeItem(url) {
    this.setState((prevState) => {
      // Must make a deep copy for Immutability, otherwise the Object
      // reference is unchanged.
      var newItems = Object.assign({}, prevState.items);
      delete newItems[url];
      return {items: newItems};
    });
  }
}


var mountNode = document.getElementById("root");
ReactDOM.render(<CountDownApp port={port} />, mountNode);
