// Linter changes
/* jslint browser */
/* global window */

import React from 'react';
import {
  Tab,
  Row,
  Col,
  Nav,
  NavItem,
} from 'react-bootstrap';

// App Components
import CharacterSheet from '../character-sheet/CharacterSheet';
import ModifierDeck from '../modifier-deck/ModifierDeck';
import HpXpBoard from '../hp-xp-board/HpXpBoard';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        characterInfo: {
            characterClass: 'spellweaver',
            gold: 0,
            totalXp: 0,
            level: 1,
            items: [],
            checks: 0,
            availablePerks: 2,
            perks: [],
            modifierDeck: {
                bless: 0,
                curse: 0,
                plusZero: 6,
                plusOne: 5,
                minusOne: 5,
                plusTwo: 1,
                minusTwo: 1,
                timesTwo: 1,
                miss: 1,
            }
        },
        scenarioInfo: {
            prosperity: 0,
            difficultyLevel: 1,
            retiredCharacters: 0,
        },
        currentStats: {
            xp: 0,
            hp: 10,
            coins: 0,
            activeItems: [],
            usedItems: [],
            spendItems: [],
            shuffledDeck: [],
            discard: [],
        }
    };

    this.tick = this.tick.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
  }

  tick(value, amount) {
    var newState = this.state;
    newState.currentStats[value] += (amount);
    this.setState(newState);
  }

  updateCharacter(field, newValue) {
      var newState = this.state;
      if(!(this.state.currentStats[field] === undefined)) {
          newState.currentStats[field] = newValue;
      } else {
          newState.characterInfo[field] = newValue;
      }

      this.setState(newState);
      if(field === 'perks') {
          this.shuffleDeck();
      }
  }

  shuffle(array) {
      var cIndex = array.length;
      var tValue;
      var rIndex;

      while (0 !== cIndex) {
          rIndex = Math.floor(Math.random() * cIndex);
          cIndex += -1;
          tValue = array[cIndex];
          array[cIndex] = array[rIndex];
          array[rIndex] = tValue;
      }

      return array;
  }

  shuffleDeck() {
      var deck = [];
      for(var key in this.state.characterInfo.modifierDeck) {
          for(var cardNumber = 0; cardNumber < this.state.characterInfo.modifierDeck[key];cardNumber++) {
              deck.push(key);
          }
      }
      var newState = this.state;
      newState.currentStats.shuffledDeck = this.shuffle(deck);
      this.setState(newState);
  }

  render() {
    return (
      <div className="gameboard-wrapper">
      <div className="tracker">
        <HpXpBoard onTick = {(a,b) => this.tick(a,b)} currentStats = {this.state.currentStats}/>
      </div>
        <div className = 'tabbedContent'>
        <Tab.Container id="left-tab" defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">Modifier Deck</NavItem>
                <NavItem eventKey="second">Character Info</NavItem>
              </Nav>
            </Col>
            <Col sm={8}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first"><ModifierDeck
                    onUpdateCharacter = {(a, b) => this.updateCharacter(a,b)}
                    fullDeck = {this.state.characterInfo.modifierDeck}
                    shuffledDeck={this.state.currentStats.shuffledDeck}
                    discard = {this.state.currentStats.discard}
                    shuffleDeck = {() => this.shuffleDeck()}
                    shuffle = {(array) => this.shuffle(array)}
                    /></Tab.Pane>
                <Tab.Pane eventKey="second"><div className="character">
                  <CharacterSheet onUpdateCharacter = {(a, b) => this.updateCharacter(a,b)} characterInfo = {this.state.characterInfo} />
                </div></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        </div>
      </div>
    );
  }
}

export default GameBoard;
