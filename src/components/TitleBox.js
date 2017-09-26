import React, {Component} from 'react'
import {Grid, Row,Col,Button,ButtonToolbar,PageHeader} from 'react-bootstrap'

class TitleBox extends React.Component
{
  constructor(props)
  {
    super(props);
    this.openGitHub = this.openGitHub.bind(this);
  }
  openGitHub()
  {
    var page = window.open("https://github.com/turtles/react-app-interval-timer", '_blank');
    page.focus();
  }
  render() {

    return (
      <Grid>
        <PageHeader>
          Interval Timer <small>{"Timer that play sounds on an interval to remind you it's running."}</small> <Button type="button" pullRight="true" onClick={this.openGitHub}>View Source</Button>
        </PageHeader>
      </Grid>
    );
  }
}

export default TitleBox;
