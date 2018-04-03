import React from 'react';
import {
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

class ModifierDeck extends React.Component {
    updateCharacter(a, b) {
       return this.props.onUpdateCharacter(a, b);
    }

  addToFullDeck(card, change) {
      if(this.props.fullDeck[card] === undefined) {
          this.props.fullDeck[card] = change;
      } else {
        this.props.fullDeck[card] += change;
      }
      this.updateCharacter('modifierDeck', this.props.fullDeck);
  }

  addToPartialDeck(card, change) {
      for(var j = 0;j < change;j++) {
         this.props.shuffledDeck.push(card);
      }
      this.shufflePartialDeck();
  }

  modifyCard(card, change) {
      this.addToFullDeck(card, change);

      this.addToPartialDeck(card, change);
  }

  shufflePartialDeck() {
      return this.props.shuffle(this.props.shuffledDeck);
  }

  drawCard() {
      var discard = this.props.discard;
      var drawnCard = this.props.shuffledDeck.pop();
      discard.unshift(drawnCard);
      this.updateCharacter('discard', discard);

      switch(drawnCard) {
          case 'bless':
            this.addToFullDeck('bless', -1);
            break;
          case 'curse':
             this.addToFullDeck('curse', -1);
             break;
          case 'timesTwo':
              this.props.shuffleDeck();
              console.log("This is wrong, it should happen at end of turn.");
              this.props.discard.unshift('~~shuffle~~');
              break;
          case 'miss':
              this.props.shuffleDeck();
              console.log("This is wrong, it should happen at end of turn.");
              this.props.discard.unshift('~~shuffle~~');
              break;
          default:
            break;
      }
  }

  componentDidMount() {
      if(this.props.shuffledDeck.length === 0) {
          this.props.shuffleDeck();
      }
  }

  render() {
    return (
        <div className = 'modifierDeck'>
        <ButtonGroup>
         <Button bsSize="lg" bsStyle="danger" onClick={() => this.drawCard()}>Draw Card</Button>
         <Button bsSize="lg" bsStyle="danger" onClick={() => this.modifyCard('bless', 1)}>Add Bless</Button>
         <Button bsSize="lg" bsStyle="danger" onClick={() => this.modifyCard('curse', 1)}>Add Curse</Button>
        </ButtonGroup>
        <div className = 'discard'>
        Cards Drawn: {this.props.discard.map((card, index) => {return (<div key = {index}>{card}</div>)})}
        </div>
        </div>
    );
  }
}

ModifierDeck.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  discard: PropTypes.array.isRequired,
  shuffledDeck: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  shuffleDeck: PropTypes.func.isRequired,
  shuffle: PropTypes.func.isRequired,
};

export default ModifierDeck;
