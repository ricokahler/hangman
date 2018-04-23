import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { range } from 'lodash';
import * as Immutable from 'immutable';
import { randomWord } from './random-word';

const lives = 6;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
`;
const Result = styled.div`
  font-size: 5rem;
  margin: 0 auto;
`;
const Letter = styled.button`
  width: 5rem;
  font-size: 3rem;
`;
const Text = styled.div`
  font-size: 2rem;
`;
const ResetButton = styled.button`
  font-size: 2rem;
  padding: 1rem;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secretWord: randomWord(),
      lettersGuessed: Immutable.Set(),
    };
  }

  handleLetterClick(letter) {
    if (letter === '_') return;
    this.setState(previousState => ({
      ...previousState,
      lettersGuessed: previousState.lettersGuessed.add(letter),
    }));
  }

  get secretWordSet() {
    return this.state.secretWord.split('').reduce((set, next) => set.add(next), Immutable.Set());
  }

  get result() {
    const guessedLetters = this.secretWordSet.intersect(this.state.lettersGuessed);

    return this.state.secretWord
      .split('')
      .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
      .join(' ');
  }

  get tries() {
    return (
      lives -
      this.state.lettersGuessed.reduce(
        (count, guessedLetter) => (!this.secretWordSet.includes(guessedLetter) ? count + 1 : count),
        0,
      )
    );
  }

  get won() {
    return this.secretWordSet.every(letter => this.state.lettersGuessed.includes(letter));
  }

  handleReset = () => {
    this.setState(previousState => ({
      ...previousState,
      secretWord: randomWord(),
      lettersGuessed: Immutable.Set(),
    }));
  };

  render() {
    if (this.tries <= 0) {
      return (
        <Text>
          You lost! The word was {this.state.secretWord}
          <ResetButton onClick={this.handleReset}>Try again?</ResetButton>
        </Text>
      );
    }

    if (this.won) {
      return (
        <Text>
          You won with {this.tries} lives left! The word was in fact {this.state.secretWord}
          <ResetButton onClick={this.handleReset}>Play again?</ResetButton>
        </Text>
      );
    }

    return (
      <Container>
        <Result>{this.result}</Result>
        <Text>{this.tries} tries left</Text>
        <Text>letters guessed: {this.state.lettersGuessed.toArray().join(' ')}</Text>
        <div>
          {range(65, 65 + 26)
            .map(i => String.fromCharCode(i))
            .map(letter => !this.state.lettersGuessed.includes(letter) ? letter : '_')
            .map(letter => (
              <Letter onClick={() => this.handleLetterClick(letter)}>{letter}</Letter>
            ))}
        </div>
        <ResetButton onClick={this.handleReset}>reset</ResetButton>
      </Container>
    );
  }
}

export default App;
