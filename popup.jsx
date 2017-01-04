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

// All options for choose duration in MuiSelectField.
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

class CountDownApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {items: {}, text: '', sec: 0};
    // Bind functions to be used in callback.
    this.handleSecFieldChange = this.handleSecFieldChange.bind(this);
    this.handleURLFieldChange = this.handleURLFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          <h1>Kick Me Off!</h1>
          <form onSubmit={this.handleSubmit}>

            <MuiSelectField name='sec' floatingLabelText="Timer"
              value={this.state.sec} onChange={this.handleSecFieldChange}>
              {durationItems}
            </MuiSelectField>

            <MuiTextField onChange={this.handleURLFieldChange} name='url'
              floatingLabelText="Enter url e.g. www.youtube.com"
              value={this.state.text}
            />

            <MuiRaisedButton label="Add Item" type="submit"/>
          </form>

          <CountDownList items={this.state.items} />
        </div>
      </MuiThemeProvider>
    );
  }
  
  handleDeleteClick(e, url) {
    this.removeItem(url);
  }

  handleSecFieldChange(event, index, value) {
    this.setState({sec: value}); // Turn minutes to seconds.
  }

  handleURLFieldChange(e) {
    // Save the input text to state variable and do validation.
    this.setState({text: e.target.value});
    if(Utils.isValidURL(e.target.value)){

    }
    else {
      this.setState((prevState) => ({
        text: prevState.text
      }));
    }
  }

  // TODO: Prevent enter same url if one already exists.
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
      clearInterval(newItems[url].interval);
      delete newItems[url];
      return {items: newItems};
    });
  }
}


var mountNode = document.getElementById("root");
ReactDOM.render(<CountDownApp />, mountNode);
