import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import pieceX from './cat_piece.png'; // Tell webpack this JS file uses this image
import pieceO from './dog_piece.png'; 



/*
class Square extends React.Component {
*/

/*
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }
*/

/*
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}
*/




// replace the Square class by this function component
function Square(props) {
    // make square communicate with CSS and let CSS file change the color of the squares consisting of the winning line
    /*
    let win = false;
    if(props.winningLine && props.winningLine.includes(i)){
      win = true; 
    }
    */
    return (
        <button className="square" data-pro={props.value} data-win={props.win} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let win = false;
        ///*
        if (this.props.winningLine && this.props.winningLine.includes(i)) {
            win = true;
        }
        //*/
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                win={win}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }


    //********************************
    //<img className="player1" src={pieceX} alt="pieceX" />  

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const result = calculateWinner(squares);
        let winner = null;
        if (result) {
            winner = result.winner;
        }

        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? <img className="player1" src={pieceX} alt="pieceX" />  : <img className="player2" src={pieceO} alt="pieceO" />;  //*************************
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        let winner = null;
        let winningLine = null;
        if (result) {
            winner = result.winner;
            winningLine = result.match;
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "Player1"  : "Player2"); //**********************
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningLine={winningLine}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{winningLine}</div>
                    <ol>{moves}</ol>
                </div>

                <div>

                </div>

               


            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // debug
        console.log("test", squares[a]);
        if (squares[a] && squares[a].src && squares[a].src === squares[b].src && squares[a].src === squares[c].src) { 
            return { winner: squares[a].className, match: lines[i] };
        }
    }
    

    return null;
}

