import React from 'react';
import {
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

class ExperienceTracker extends React.Component {
  tick(a, b) {
     return this.props.onTick(a, b);
  }

  render() {
    return (
      <div className="tracker">
         <span className = 'xp-display'> XP: {this.props.currentXp} </span>
         <ButtonGroup vertical>
           <Button bsSize="lg" bsStyle="primary" onClick={() => this.tick('xp', 1)}>+</Button>
           <Button bsSize="lg" bsStyle="primary" onClick={() => this.tick('xp', -1)}>-</Button>
          </ButtonGroup>
      </div>
    );
  }
}

ExperienceTracker.propTypes = {
  onTick: PropTypes.func.isRequired,
  currentXp: PropTypes.number.isRequired,
};

export default ExperienceTracker;
