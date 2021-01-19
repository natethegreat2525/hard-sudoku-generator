import './App.css';
import Sudoku from './Sudoku';
import React from 'react';
import {generateVeryHardSudoku} from './utils';

class App extends React.Component {
  constructor() {
    super();

    let empty = new Array(81);
    empty.fill('-');
    this.state = {
      loading: false,
      board: empty,
    };
  }
  generateNewSudoku() {
    let empty = new Array(81);
    empty.fill('-');
    this.setState({loading: true, board: empty});
    setTimeout(() => {
      let sudoku = generateVeryHardSudoku();
      this.setState({board: sudoku, loading: false});
    }, 100);
  }

  render() {
    return (
      <div className="App">
        <h1>Very Hard Sudoku Generator</h1>
        <Sudoku board={this.state.board}></Sudoku>
        <div>
          <button onClick={()=>this.generateNewSudoku()}>Generate New Sudoku</button>
          {
            this.state.loading ?
            <div style={{
              display: 'inline-block',
              position: 'relative',
              top: 5,
              left: 5,
            }}>
              <div className="loader"></div>
            </div>
            : null
          }
        </div>
        <div style={{
          width: 800,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <h2>How does it work?</h2>
        <p>
          There are three stages to this sudoku generation algorithm.
        </p>
        <ol style={{display: 'table', margin: 'auto', textAlign: 'left'}}>
          <li>Generate Solved Sudoku</li>
          <li>Remove elements until the sudoku is both <a href="https://en.wikipedia.org/wiki/Mathematics_of_Sudoku#Overview">proper and minimal</a></li>
          <li>If basic solving techniques can solve the sudoku, discard the sudoku and start from step 1.</li>
        </ol>
        <p>
          In the first stage a solved sudoku is generated. This is done by randomly filling in valid sudoku values in empty squares and
          backtracking when a valid value can no longer be filled in.
        </p>
        <p>
          In the second stage, values are removed from the solved sudoku randomly. After each value is removed, the sudoku is solved by a brute force solver which also checks for multiple solutions.
          If removing a value leads to multiple solutions, the value is placed back in the sudoku and a different square is selected to be removed. After this stage is complete, no number can be removed
          without allowing for an ambiguous solution so the sudoku is called a minimal sudoku. Minimal sudokus do not have many numbers but this does not necessarily make them hard. To ensure the sudoku
          is difficult, a third stage is necessary.
        </p>
        <p>
          The final stage runs the generated sudoku from the previous steps through a constraint propagation based solving algorithm which mimics the most common human solving strategies. If the
          sudoku can be solved with this algorithm then it is discarded and the process repeats until a sudoku that cannot be solved with constraint propagation is generated.
        </p>
        <h2>More on constraint propagation</h2>
        <p>
          The constraint propagation I implemented only looks for <a href="https://www.learn-sudoku.com/basic-techniques.html">hidden subsets (up to 4) and naked subsets (up to 4)</a>.
          This seems to be enough to solve many human generated sudokus even many of those rated "hard" or "expert" (although that is subjective). The purpose of this
          algorithm is not to solve all sudokus but rather to attempt to solve them only using a restricted set of logical rules. If the sudoku cannot be solved using these
          rules then it must require a more advanced trick. I implemented a custom algorithm for this based on the first part of Peter Norvig's page <a href="https://norvig.com/sudoku.html">Solving Every Sudoku Puzzle</a>. Eliminating sudokus that are solved with this method ensures that any
          sudoku generated at some point requires the use of a more advanced technique like <a href="https://www.learn-sudoku.com/advanced-techniques.html">X-Wing or Swordfish</a>. Some
          of the generated sudokus seem to require completely custom logic tricks as well which can make them more interesting.
        </p>
        </div>
        <a style={{
          color: 'grey',
          position: 'fixed',
          right: 10,
          bottom: 10,
        }}
        href="https://natethegreat2525.github.io/">Nathan's Projects</a>
      </div>
  );
  }
}

export default App;
