import React from 'react';
import PropTypes from 'prop-types';
import PerkCheck from "./PerkCheck";

class PerkSelection extends React.Component {
  updateCharacter(a, b) {
     return this.props.onUpdateCharacter(a, b);
  }


  render() {
    return (
      <div className="perks">
      <form>
        {this.props.allPerks.map( (element, index) => {
                return (
                    <PerkCheck
                    key = {index}
                    onUpdateCharacter = {(a,b) => this.updateCharacter(a, b)}
                    thisPerk = {element}
                    selectedPerks = {this.props.perks}
                    fullDeck = {this.props.fullDeck}
                    availablePerks = {this.props.availablePerks}
                />)
            })}
      </form>
      </div>
    );
  }
}

PerkSelection.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  allPerks: PropTypes.array.isRequired,
  perks: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  availablePerks: PropTypes.number.isRequired,
};

export default PerkSelection;
