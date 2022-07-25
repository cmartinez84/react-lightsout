
import { Component, useEffect } from 'react';
import Board from './components/board/board.js';

import { Button } from '@atomic-reactor/reactium-ui/Button';

import './App.css';
import { DirectionLtr, ThreeDGlasses } from '@atomic-reactor/reactium-ui/Icon/Linear';
import { toBeInvalid } from '@testing-library/jest-dom/dist/matchers';


class App extends Component{

  state = {
    tiles: new Array(25),
    plays: 0, 
    highlightedTile: null, 
    showWinOverlay: false, 
    showPreGameOverlay: true,
    demoMode: true, 
    gameInPLay: false, 
  }


  handleTileClick=(index)=>{
    
    const tilesToFlip = this.calculateAdjacentTiles(index);
    this.flipAdjacentTiles(tilesToFlip);
    if(!this.state.demoMode){
      this.setState({plays: this.state.plays + 1 })      
    }
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
    if (allLightsOut){
      this.setState({
        showWinOverlay:true, 
        highlightedTile: null, 
        gameInPLay: false, 
        demoMode: true
      });
      this.startCelebrationSequence();
    }
  }
  startCelebrationSequence=()=>{
    const allFalse = this.state.tiles.map(tile=>false);
    const allTrue = this.state.tiles.map(tile=>true);
    setTimeout(()=>{this.setState({tiles: allTrue})}, 500)
    setTimeout(()=>{this.setState({tiles: allFalse})}, 1000)
    setTimeout(()=>{this.setState({tiles: allTrue})}, 1500)
    setTimeout(()=>{this.setState({tiles: allFalse})}, 2000)
    setTimeout(()=>{this.setState({tiles: allTrue})}, 2500)
    setTimeout(()=>{this.setState({tiles: allFalse})}, 3000)

  }


  componentDidMount(){
    const myArray = [];
    let i = 0;
      do {
        myArray.push(false);
        i++;
      } while (i < 25);
      this.setState({tiles: myArray});
    document.addEventListener('keydown', this.navigateWithKeyboard);
    setTimeout(this.startDemoMode, 500)
    }

  
  createChaos=()=>{
    //theoretically, there are unbeatable boards. Generated actual plays from a blank board is an attempt to avoid that
    let preplays = [];
    const totalPreplays = Math.floor(Math.random() * 10) +2;
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
    this.setState({ tiles: newTiles, highlightedTile: null});
  }
  startGame = ()=>{  


    
    this.setState({
      showWinOverlay: false,
      showPreGameOverlay: false,
      plays: 0, 
      gameInPLay: true,
      demoMode: false, 
      tiles: this.state.tiles.map(tile=>false)
    })
    setTimeout(this.createChaos, 600)

  }
  navigateWithKeyboard=(e)=>{
  
    const moveKeys = [37, 38, 39, 40];
    let next = '';
    if(moveKeys.includes(e.keyCode)){
      e.preventDefault();
      if(e.keyCode === 39){
        next = this.state.highlightedTile + 1;
      }
      else if(e.keyCode ===37){
        e.preventDefault()
        next = this.state.highlightedTile - 1;
      }
      else if(e.keyCode ===38){
        next = this.state.highlightedTile -5;
      }
      else if(e.keyCode ===40){      e.preventDefault()
        next = this.state.highlightedTile + 5;
      }
      if(next >= 0 && next < 25)
      this.setState({highlightedTile: next});
    }
    if(e.keyCode===32){
      this.handleTileClick(this.state.highlightedTile);
    }
    
  }
  
  handleHover=(index)=>{
    this.setState({ highlightedTile: index})
  }


  calculateComputerMove=()=>{
    const directionMath = [-5, 5, -1, 1];
    let directionIndex = 0;
    let nextIndex = 0;
    do{
      directionIndex  = Math.floor(Math.random() * 4 );
      nextIndex = this.state.highlightedTile + directionMath[directionIndex];
    }
    while( nextIndex > 24 || nextIndex < 0 );
    this.setState({highlightedTile: nextIndex});

    if(this.state.tiles[nextIndex]){
      this.handleTileClick(nextIndex);
    }
    if(this.state.demoMode)
    setTimeout(this.calculateComputerMove, 1000)
  }

  startDemoMode=()=>{
    this.createChaos();
    setTimeout(this.calculateComputerMove, 500)
  }

 

  render(){
    return (
      <div className="page"
      onKeyDown={this.navigateWithKeyboard}>
        <div className="col-1">
        <div>        
          <h1 className='site-title'><span className="site-title-lights">LIGHTS</span><span className="site-title-out">OUT</span></h1>
        </div>
        <div className="col-1-row-2">
          <div className='instructions'>
            <p> The 90s are back!</p>
            <p>Usings either <span className="pink">← → ↑ ↓</span> or the mouse to navigate </p>
            <p>Select a tile with either a mouseclick or the <span className="pink">[spacebar]</span></p>
            <p>Turn off all the lights with as few moves as possible!</p>
          </div> 
        <div>
          
          <button 
              className="start-button"
              onClick={this.startGame}>NEW GAME
          </button>
          
        </div>
          
        </div>
        <div>        
            <p className='score'>{this.state.plays}</p>
        </div>
        </div>
      
        <Board
          showPreGameOverlay={this.state.showPreGameOverlay}
          showWinOverlay={this.state.showWinOverlay}
          highlightedTile={this.state.highlightedTile}
          handleHover={this.handleHover}
          handleTileClick={this.handleTileClick}
          tiles={this.state.tiles}
        ></Board>

      </div>
    )
  }
}


export default App;
