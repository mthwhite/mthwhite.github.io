import React from 'react';
import {
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

class HealthTracker extends React.Component {
  tick(a, b) {
     return this.props.onTick(a, b);
  }

  render() {
    return (
      <div className="tracker">
      <ButtonGroup vertical>
       <Button bsSize="lg" bsStyle="danger" onClick={() => this.tick('hp', 1)}>+</Button>
       <Button bsSize="lg" bsStyle="danger" onClick={() => this.tick('hp', -1)}>-</Button>
       </ButtonGroup>
       <span className = 'hp-display'> HP: {this.props.currentHp} </span>
      </div>
    );
  }
}

HealthTracker.propTypes = {
  onTick: PropTypes.func.isRequired,
  currentHp: PropTypes.number.isRequired,
};

export default HealthTracker;
