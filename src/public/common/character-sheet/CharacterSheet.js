import React from 'react';
import PropTypes from 'prop-types';
import SheetText from './sheet-text/SheetText'
import PerkSelection from './perks/PerkSelection'
import "./CharacterSheet.css";

class CharacterSheet extends React.Component {
  updateCharacter(a, b) {
    return this.props.onUpdateCharacter(a, b);
  }

  componentDidMount() {
    const characterBase = this.getNewCharacter(this.props.characterInfo.characterClass);
    this.updateCharacter('hp', characterBase.hp[this.props.characterInfo.level - 1]);
 }

  getNewCharacter(classname) {
      return {
          fullClass: "Orchid Spellweaver",
          perks: [
              {perk: 'Remove four +0 cards', amount: 1, effects:[{card: 'plusZero', amount: -4}]},
              {perk: 'Replace one -1 card with one +1 card', amount: 2, effects:[{card: 'plusOne', amount: 1}, {card:'minusOne', amount: -1}]},
              {perk: 'Add two +1 cards', amount: 2, effects:[{card: 'plusOne', amount: 2}]},
              {perk: 'Add one +0 STUN card', amount: 1, effects:[{card: 'plusZeroStun', amount: 1}]},
              {perk: 'Add one +1 WOUND card', amount: 1, effects:[{card: 'plusOneWound', amount: 1}]},
              {perk: 'Add one +1 IMMOBILIZE card', amount: 1, effects:[{card: 'plusOneImmobilize', amount: 1}]},
              {perk: 'Add one +1 CURSE card', amount: 1, effects:[{card: 'plusOneCurse', amount: 1}]},
              {perk: 'Add one +2 FIRE card', amount: 2, effects:[{card: 'plusTwoFire', amount: 1}]},
              {perk: 'Add one +2 ICE card', amount: 2, effects:[{card: 'plusTwoIce', amount: 1}]},
              {perk: 'Add one chain LEAF card and one chain WIND', amount: 1, effects:[{card: 'chainLeaf', amount: 1},{card: 'chainWind', amount: 1}]},
              {perk: 'Add one chain SUN card and one chain DARK', amount: 1, effects:[{card: 'chainSun', amount: 1},{card: 'chainDark', amount: 1}]},
          ],
          hp: [6,7,8,9,10,11,12,13,14],
      }
  }

  render() {
      const characterBase = this.getNewCharacter(this.props.characterInfo.characterClass);
    return (
    <div className = "character-sheet-wrapper">
      <SheetText label = {characterBase.fullClass} />
      <SheetText label = 'Name' textField = {true} />
      <SheetText label = 'Level' text = {this.props.characterInfo.level}/>
      <SheetText label = 'Total xp' text = {this.props.characterInfo.totalXp}/>
      <SheetText label = 'Gold' text = {this.props.characterInfo.gold}/>
      <PerkSelection
        onUpdateCharacter = {(a,b) => this.updateCharacter(a,b)}
        fullDeck = {this.props.characterInfo.modifierDeck}
        perks = {this.props.characterInfo.perks}
        allPerks = {characterBase.perks}
        availablePerks = {this.props.characterInfo.availablePerks}
        />
     </div>
    );
  }
}

CharacterSheet.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  characterInfo: PropTypes.object.isRequired,
};

export default CharacterSheet;
