import React, {Component} from 'react'
import {Grid, PageHeader, small} from 'react-bootstrap'

class TitleBox extends React.Component
{
  render() {
    return (
      <Grid>
        <PageHeader>Interval Timer <small>{"Timer that play sounds on an interval to remind you it's running."}</small></PageHeader>
      </Grid>
    );
  }
}

export default TitleBox;
