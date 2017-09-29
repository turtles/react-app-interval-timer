import React, { Component } from 'react';
import Clock from './components/Clock.js'
import TitleBox from './components/TitleBox.js'

class App extends Component {
  render() {
    return (
      <div>
        <TitleBox />
        <Clock />
      </div>
    );
  }
}

export default App;
