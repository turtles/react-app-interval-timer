import React, {Component} from 'react'
import {Grid, Image, Row,Col,Button,ButtonToolbar,PageHeader} from 'react-bootstrap'
import PageIcon from '../assets/favicon64.png'

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
          <Image src={PageIcon}/> Interval Timer <small>{"Timer that plays sounds on an interval to remind you it's running."}</small> <Button type="button" pullRight="true" onClick={this.openGitHub}>View Source</Button>
        </PageHeader>
      </Grid>
    );
  }
}

export default TitleBox;
