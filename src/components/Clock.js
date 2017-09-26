import React, { Component } from 'react';
import {Glyphicon, ButtonToolbar, Table, tr, td, th, thead, tbody, Grid, Row, Col, FormGroup, Checkbox,InputGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import Sound from 'react-sound';
import intervalAlarmSound from '../sounds/intervalAlarm.ogg';
import timerAlarmSound from '../sounds/timerAlarm.ogg';

function circle(props)
{
    const {ctx, x, y, radius, fillcolor} = props;
    ctx.beginPath();
    ctx.arc(x,y,radius, 0, 2*Math.PI, false);
    ctx.fillStyle = fillcolor;
    ctx.fill();
}
class Clock extends Component {
    constructor(props)
    {
      super(props);
      this.state = {
        paused: false,
        seconds: 0,
        secondsLeft: 100,
        secondsLeftInterval: 0,
        secondsLeftIntervalReset: 0,
        playSoundOnComplete: false,
        playSoundOnInterval: false,
        timeText: "0:00",
        intervalText: "0:00",
        timerActive: false,
        // Separate form values from actual values
        inputTimerMinutes: 10,
        inputIntervalMinutes: 1,
        inputTimerSeconds: 0,
        inputIntervalSeconds: 0,
        inputPlaySoundOnComplete: true,
        inputPlaySoundOnInterval: true,
      };
      this.startTimer = this.startTimer.bind(this);
      this.pauseTimer = this.pauseTimer.bind(this);

      this.updateInputTimerMinutes = this.updateInputTimerMinutes.bind(this);
      this.updateInputTimerSeconds = this.updateInputTimerSeconds.bind(this);
      this.updateInputIntervalMinutes = this.updateInputIntervalMinutes.bind(this);
      this.updateInputIntervalSeconds = this.updateInputIntervalSeconds.bind(this);
      this.updatePlaySoundOnComplete = this.updatePlaySoundOnComplete.bind(this);
      this.updatePlaySoundOnInterval = this.updatePlaySoundOnInterval.bind(this);
    }

    updateInputTimerMinutes(e) {
      this.setState({inputTimerMinutes: parseInt(e.target.value)});
    }
    updateInputTimerSeconds(e) {
      this.setState({inputTimerSeconds: parseInt(e.target.value)});
    }
    updateInputIntervalMinutes(e) {
      this.setState({inputIntervalMinutes: parseInt(e.target.value)});
    }
    updateInputIntervalSeconds(e) {
      this.setState({inputIntervalSeconds: parseInt(e.target.value)});
    }
    updatePlaySoundOnComplete(e) {
      this.setState((prevState) => ({inputPlaySoundOnComplete: !prevState.inputPlaySoundOnComplete}));
    }
    updatePlaySoundOnInterval(e) {
      this.setState((prevState) => ({inputPlaySoundOnInterval: !prevState.inputPlaySoundOnInterval}));
    }

    tick() {
      if (this.state.paused)
      {
        return;
      }
      if (this.state.secondsLeft <= 0)
      {
        this.endTick();
        return;
      }
      this.setState((prevState) => ({
        seconds: prevState.seconds + 1,
        secondsLeft: Math.max(0, prevState.secondsLeft - 1),
        secondsLeftInterval: (prevState.secondsLeftInterval <= 0) ? prevState.secondsLeftIntervalReset-1 : (prevState.secondsLeftInterval-1),
        timeText: this.getFormattedTime(this.state.secondsLeft),
        intervalText: prevState.playSoundOnInterval ? this.getFormattedTime(this.state.secondsLeftInterval) : "0:00",
      }));
      this.updateDocumentTitle();
    }
    getFormattedTime(seconds)
    {
      return String(Math.floor((seconds-1) / 60)) + ":" + (((seconds-1)%60) < 10 ? "0" : "") + String((seconds-1)%60);
    }
    componentDidMount() {
      this.renderClock();
    }
    componentWillUnmount() {
      this.endTick();
    }
    startTick() {
      this.setState({timerActive:true});
      this.interval = setInterval(() => this.tick(), 1000);
    }
    endTick() {
      this.setState({timerActive:false});
      clearInterval(this.interval);
    }
    componentDidUpdate() {
      this.renderClock();
    }
    startTimer() {
      var totalTimerSeconds = Math.round(this.state.inputTimerMinutes * 60 + this.state.inputTimerSeconds);
      var totalIntervalSeconds = this.state.inputPlaySoundOnInterval ? Math.round(this.state.inputIntervalMinutes * 60 + this.state.inputIntervalSeconds) : 0;

      this.setState((prevState) => ({
        seconds: 0,
        paused: false,
        secondsLeft: totalTimerSeconds,
        secondsLeftInterval: totalIntervalSeconds,
        secondsLeftIntervalReset: totalIntervalSeconds,
        playSoundOnComplete: prevState.inputPlaySoundOnComplete,
        playSoundOnInterval: prevState.inputPlaySoundOnInterval,
        timeText: this.getFormattedTime(totalTimerSeconds+1),
        intervalText: this.getFormattedTime(totalIntervalSeconds+1),
      }));
      this.endTick();
      this.startTick();
    }
    pauseTimer() {
      this.setState((prevState)=> ({
        paused: !prevState.paused,
      }));
    }
    // Render methods
    renderClock() {
      var canvasW = 300;
      var canvasH = 300;

      const ctx = this.refs.canvas.getContext('2d');

      // Reset
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0,0, canvasW, canvasH);

      ctx.translate(canvasW*0.5, canvasH*0.5);
      circle({ctx, x: 0, y: 0, radius: 16, fillcolor: '#DDD'});

      var numPoints = 16;
      for (var i = 0; i < numPoints; i++) {
        ctx.rotate(Math.PI * 2 / numPoints);
        ctx.fillRect(132, -1, 16, 2);
      }
      circle({ctx, x: 0, y: 0, radius: 4, fillcolor: '#000'});

      ctx.fillStyle = '#000';

      ctx.rotate(Math.PI * 2 * ((this.state.seconds%60)/60.0 + 0.5));
      ctx.fillRect(-1,0,2,120);

      // Draw a special icon when the clock is paused
      if (this.state.paused)
      {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Fade out the clock behind it
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0, canvasW, canvasH);
        ctx.globalAlpha = 1;
        // Draw the pause symbol
        ctx.translate(canvasW*0.5, canvasH*0.5);
        ctx.fillStyle = '#add0e6';
        ctx.fillRect(-64, -64, 32, 128);
        ctx.fillRect(32, -64, 32, 128);
      }
    }
    updateDocumentTitle()
    {
      document.title = this.getFormattedTime(this.state.secondsLeft+1);
    }
    renderIntervalTimer() {
      if (this.state.inputPlaySoundOnInterval == true)
      {
        return (
          <FormGroup>
            <ControlLabel>Interval: </ControlLabel>
            <InputGroup>
              <FormControl type="number" value={this.state.inputIntervalMinutes} onChange={this.updateInputIntervalMinutes} />
              <InputGroup.Addon>Minutes</InputGroup.Addon>
              <FormControl type="number" value={this.state.inputIntervalSeconds} onChange={this.updateInputIntervalSeconds} />
              <InputGroup.Addon>Seconds</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        );
      }
      else {
        return (null);
      }
    }
    renderPauseButton() {
      if (!this.state.timerActive)
      {
        return null;
      }
      if (this.state.paused) {
        return (
          <Button type="submit" bsStyle="success" onClick={this.pauseTimer}><Glyphicon glyph="play" /> Resume</Button>
        );
      }
      return (
        <Button type="submit" bsStyle="danger" onClick={this.pauseTimer}><Glyphicon glyph="pause" /> Pause</Button>
      );
    }
    renderSounds() {
        // Using the React Sound library, rendering <Sound> with status PLAYING plays a sound.
        return (<div>
          <Sound url={intervalAlarmSound} playStatus={
              (!this.state.paused && this.state.timerActive && this.state.playSoundOnInterval && this.state.secondsLeftInterval == 0) ?
                Sound.status.PLAYING : Sound.status.STOPPED}
                />
          <Sound url={timerAlarmSound} playStatus={
              (!this.state.paused && this.state.timerActive && this.state.playSoundOnComplete && this.state.secondsLeft == 0) ?
                Sound.status.PLAYING : Sound.status.STOPPED}
                />
        </div>);
    }
    renderStartTimerButton() {
      if (this.state.timerActive)
      {
        return (<Button type="submit" bsStyle="warning" onClick={this.startTimer}><Glyphicon glyph="time" /> Restart Timer</Button>);
      }
      else {
        return (<Button type="submit" bsStyle="success" onClick={this.startTimer}><Glyphicon glyph="play" /> Start Timer</Button>);
      }
    }
    render() {
         return (
          <Grid>
            <Row>
              <Col xs={8} md={4}>
                <canvas ref="canvas" width={300} height={300}/>
                <Table>
                  <thead>
                    <tr>
                      <th>Timer</th>
                      <th>Interval</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.timeText}</td>
                      <td>{this.state.intervalText}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col xs={10} md={8}>
                <ControlLabel>Time:</ControlLabel>
                <InputGroup>
                  <FormControl type="number" value={this.state.inputTimerMinutes} onChange={this.updateInputTimerMinutes} />
                  <InputGroup.Addon>Minutes</InputGroup.Addon>
                  <FormControl type="number" value={this.state.inputTimerSeconds} onChange={this.updateInputTimerSeconds} />
                  <InputGroup.Addon>Seconds</InputGroup.Addon>
                </InputGroup>
                <Checkbox value={this.state.inputPlaySoundOnComplete} checked={this.state.inputPlaySoundOnComplete} onChange={this.updatePlaySoundOnComplete}>Play Sound on Complete</Checkbox>
                <Checkbox value={this.state.inputPlaySoundOnInterval} checked={this.state.inputPlaySoundOnInterval} onChange={this.updatePlaySoundOnInterval}>Play Sound on Interval</Checkbox>
                {this.renderIntervalTimer()}
                <ButtonToolbar>
                  {this.renderStartTimerButton()}

                  {this.renderPauseButton()}
                </ButtonToolbar>
              </Col>
            </Row>
            {this.renderSounds()}
          </Grid>
         );
    }
}

export default Clock;
