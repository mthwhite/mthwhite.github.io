import React from 'react';
import PropTypes from 'prop-types';
import HealthTracker from './health-tracker/HealthTracker';
import ExperienceTracker from './experience-tracker/ExperienceTracker';
import './HpXpBoard.css';


class HpXpBoard extends React.Component {
  tick(a, b) {
     return this.props.onTick(a, b);
  }

  render() {
    return (
        <div className="hp-xp-bar">
            <div className="health-wrapper">
              <HealthTracker onTick={(a,b) => this.tick(a,b)} currentHp={this.props.currentStats.hp} />
            </div>
            <div className="experience-wrapper">
              <ExperienceTracker onTick={(a,b) => this.tick(a,b)} currentXp={this.props.currentStats.xp} />
            </div>
        </div>
    );
  }
}

HpXpBoard.propTypes = {
  onTick: PropTypes.func.isRequired,
  currentStats: PropTypes.object.isRequired,
};

export default HpXpBoard;
