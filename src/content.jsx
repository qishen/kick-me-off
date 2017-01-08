import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Make material-ui SelectField to change on event and render options correctly.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


class DialogExampleSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.setState({open: false})}
      />
    ];

    return (
      <MuiThemeProvider>
        <div>
          <Dialog
            title="Message from Kick Me Off"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            You're detected of wasting your time on these stupid sites, so I have to kick your ass!
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

// document.body.style.backgroundColor="red"
var divElement = document.createElement("div");
document.body.appendChild(divElement);
ReactDOM.render(<DialogExampleSimple />, divElement);
