import React from 'react';
import PropTypes from 'prop-types';
import "./PerkCheck.css"

class PerkCheck extends React.Component {
  updateCharacter(a, b) {
     return this.props.onUpdateCharacter(a, b);
  }

  canBeToggled(index) {
      return (this.props.availablePerks > 0 || this.checked[index])? false : true;
  }

  checked = [false, false];

  toggle(index) {
      this.checked[index] = (this.checked[index])? false : true;
      if(this.checked[index]) {
                this.props.selectedPerks.push(this.props.thisPerk);
                this.props.thisPerk.effects.forEach((info) => {
                    if(this.props.fullDeck[info.card] === undefined) {
                        this.props.fullDeck[info.card] = 0;
                    }
                    this.props.fullDeck[info.card] += (info.amount);
                });
                this.updateCharacter('modifierDeck', this.props.fullDeck);
                this.updateCharacter('perks', this.props.selectedPerks);
                this.updateCharacter('availablePerks', this.props.availablePerks - 1);
      } else {
                var newPerks = [];
                var found = 0;
                this.props.selectedPerks.forEach((thisPerk) => {
                    if(thisPerk.perk !== this.props.thisPerk.perk || found) {
                        newPerks.push(thisPerk);
                    } else {
                        found = 1;
                    }
                });
                this.props.thisPerk.effects.forEach((info) => {
                    this.props.fullDeck[info.card] += (info.amount) * (-1);
                });
                this.updateCharacter('modifierDeck', this.props.fullDeck);
                this.updateCharacter('perks', newPerks);
                this.updateCharacter('availablePerks', this.props.availablePerks + 1);
      }
  }

  render() {
      var checkboxes = [];
      for (var i = 1; i <= this.props.thisPerk.amount ; i++) {
         checkboxes.push(i);
       }
    return (
        <div className = 'perk'>
        <label>
        {checkboxes.map( (element, index) => {
                return (
                    <input
                      key = {index}
                      className = "perkCheckBox"
                      disabled = {this.canBeToggled(index)}
                      ref={"perk" + index}
                      type="checkbox"
                      defaultChecked = {false}
                      onClick={() => {this.toggle(index)}} />)
            })}
            &nbsp;
            {this.props.thisPerk.perk}
        </label>
        </div>
    );
  }
}

PerkCheck.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  thisPerk: PropTypes.object.isRequired,
  selectedPerks: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  availablePerks: PropTypes.number.isRequired,
};

export default PerkCheck;
