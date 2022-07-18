import logo from './logo.svg';
import { Component } from 'react';
import Board from './components/board/board.js';

import './App.css';


class App extends Component{

state = {
  tiles: new Array(25),
  plays: 0
}


  handleTileClick=(index)=>{
    
    const tilesToFlip = this.calculateAdjacentTiles(index);
    this.flipAdjacentTiles(tilesToFlip);
    this.setState({plays: this.state.plays + 1 })
  }
  calculateAdjacentTiles(index){
      const isRightEdge =  (index +1) % 5 === 0;
      const isLeftEdge = index % 5 === 0;
      const isBottomEdge = (index + 5) > 24;
      const isTopEdge = index < 5;
  
      const toTheRight =  index +1;
      const toTheLeft = index -1;
      const below = index + 5;
      const above = index - 5;
  
      let tilesToFlip = [index];
  
      if(!isRightEdge){
        tilesToFlip.push(toTheRight)
      }
      if(!isLeftEdge){
        tilesToFlip.push(toTheLeft)
      }
      if(!isBottomEdge){
        tilesToFlip.push(below)
      }
      if(!isTopEdge){
        tilesToFlip.push(above)
      }
    return tilesToFlip;
  }
  
  flipAdjacentTiles=(tilesToFlip)=>{
    const newTiles = [...this.state.tiles];
    tilesToFlip.forEach(index=>{
      newTiles[index]= !newTiles[index];
    })
    this.setState({
      tiles: newTiles
    });
    this.checkForWin(newTiles);
  }

  checkForWin(newTiles){
    const allLightsOut = newTiles.every(tile => tile === false);
  }


  componentDidMount(){
    const myArray = [];
    let i = 0;
      do {
        myArray.push(false);
        i++;
      } while (i < 25);
      this.setState({tiles: myArray});
      this.startButton.focus();
    }

  
  createChaos(){
    //theoretically, there are unbeatable boards. Generated actual plays from a blnak board is an attempt to avoid that
    let preplays = [];
    const totalPreplays = Math.floor(Math.random() * 30) + 10;
    for(let i = 0; i <totalPreplays ; i++){
      const val = Math.floor(Math.random() * 25);
      preplays.push(val);
    }
    let newTiles = [...this.state.tiles];

    preplays.forEach((preplay)=>{
      const tilesToFlip = this.calculateAdjacentTiles(preplay);
      tilesToFlip.forEach(index=>{
        newTiles[index] = !newTiles[index];
      })
    });
    this.setState({ tiles: newTiles});
  }
  onStartClicked = ()=>{  
    console.log("f")
    this.createChaos();
  }
  render(){
    return (
      <>
      <h1>LightsOut</h1>
      <button 
        ref={inputEl => (this.startButton = inputEl)}
        onClick={this.onStartClicked}>Start</button>
      <h1>{this.state.plays}</h1>
      <Board
        handleTileClick={this.handleTileClick}
        tiles={this.state.tiles}
      ></Board>
      </>
    )
  }
}


export default App;
