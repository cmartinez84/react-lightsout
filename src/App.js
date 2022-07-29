
import { Component } from 'react';
import Board from './components/board/board.js';
import Controls from './components/controls/controls.js';
import './App.css';
import { useRef } from 'react';

class App extends Component{

  state = {
    tiles: new Array(25),
    plays: 0, 
    highlightedTile: null, 
    showWinOverlay: false, 
    showPreGameOverlay: true,
    demoMode: true, 
    gameInPlay: false, 
    boardWidth: 5, 
    selectedWidth: 5
  }

  handleTileClick=(index)=>{
    
    const tilesToFlip = this.calculateAdjacentTiles(index);
    this.flipAdjacentTiles(tilesToFlip);
    if(!this.state.demoMode){
      this.setState({plays: this.state.plays + 1 })      
    }
  }

  calculateAdjacentTiles(index){
      const isRightEdge =  (index +1) % this.state.boardWidth === 0;
      const isLeftEdge = index % this.state.boardWidth === 0;
      const isBottomEdge = (index + this.state.boardWidth ) > (this.state.boardWidth * this.state.boardWidth) -1;
      const isTopEdge = index < this.state.boardWidth;
  
      const toTheRight =  index +1;
      const toTheLeft = index -1;
      const below = index + this.state.boardWidth;
      const above = index - this.state.boardWidth;
  
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
        gameInPlay: false, 
        demoMode: true
      });
      this.startCelebrationSequence();
      this.startButtonRef.focus();
 
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
    setTimeout(this.startDemoMode, 500)
    this.startButtonRef.focus();
    }
    buildBoard(){
      const myArray = [];
      let i = 0;
        do {
          myArray.push(false);
          i++;
        } while (i < (this.state.selectedWidth * this.state.selectedWidth));
        this.setState({tiles: myArray});
    }
  
  createChaos=()=>{
    //theoretically, there are unbeatable boards. Generated actual plays from a blank board is an attempt to avoid that
    let preplays = [];
    const totalPreplays = Math.floor(Math.random() * 10) +2;
    for(let i = 0; i <totalPreplays ; i++){
      const val = Math.floor(Math.random() * (this.state.boardWidth * this.state.boardWidth));
      preplays.push(val);
    }
    let newTiles = [...this.state.tiles];

    preplays.forEach((preplay)=>{
      const tilesToFlip = this.calculateAdjacentTiles(preplay);
      tilesToFlip.forEach(index=>{
        newTiles[index] = !newTiles[index];
      })
    });
    this.setState({ tiles: newTiles, highlightedTile: 0});
  }

  addKeyBoardFunctionality=()=>{
    document.addEventListener('keydown', this.navigateWithKeyboard);
  }
  removeKeyBoardFunctionality=()=>{
    document.removeEventListener('keydown', this.navigateWithKeyboard);
  }

  startGame=()=>{  
    this.removeKeyBoardFunctionality();
    this.buildBoard();
    this.setState({
      showWinOverlay: false,
      showPreGameOverlay: false,
      plays: 0, 
      gameInPlay: true,
      demoMode: false, 
      highlightedTile: null,
      boardWidth: this.state.selectedWidth,
    })
    setTimeout(this.createChaos, 1000);
    setTimeout(this.addKeyBoardFunctionality, 1500);

    this.startButtonRef.blur();
    this.col2ref.scrollIntoView()
  }


  navigateWithKeyboard=(e)=>{
    if(this.state.gameInPlay){
      const moveKeys = [37, 38, 39, 40];
      let next = '';
      if(moveKeys.includes(e.keyCode)){
        e.preventDefault();
        //right
        if(e.keyCode === 39){
          if((this.state.highlightedTile + 1) % 5 === 0){
            next = this.state.highlightedTile;
          }
          else{
            next = this.state.highlightedTile + 1;
          }
        }
        //left
        else if(e.keyCode ===37){
          if(this.state.highlightedTile % 5 === 0 ){
            next = this.state.highlightedTile;
          }
          else{
            next = this.state.highlightedTile - 1;
          }
        }
        //up
        else if(e.keyCode ===38){
          next = this.state.highlightedTile - this.state.boardWidth;
        }
        //down
        else if(e.keyCode ===40){     
          next = this.state.highlightedTile + this.state.boardWidth;
        }
        if(next >= 0 && next < (this.state.boardWidth * this.state.boardWidth))
        this.setState({highlightedTile: next});
      }
      if(e.keyCode===32){
        this.handleTileClick(this.state.highlightedTile);
      }
    }
  }
  
  handleHover=(index)=>{
    this.setState({ highlightedTile: index})
  }


  calculateComputerMove=()=>{
    const directionMath = [(0-this.state.boardWidth), this.state.boardWidth , -1, 1];
    let directionIndex = 0;
    let nextIndex = 0;
    do{
      directionIndex  = Math.floor(Math.random() * 4 );
      nextIndex = this.state.highlightedTile + directionMath[directionIndex];
    }
    while( nextIndex > ((this.state.boardWidth * this.state.boardWidth) - 1) || nextIndex < 0 );
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
    // delay is purely aesthetic
  }
  changeInput=(e)=>{
    this.setState({boardWidth: e.target.value})
  }

 setSelectedWidth=(selectedWidth)=>{
    this.setState({selectedWidth: selectedWidth})
    // this.buildBoard();
 }

  render(){
    return (
      <div className="page">
        <div className="col-1">
        <div className="col-1-block-1" >        
          <h1 className='site-title'><span className="site-title-lights">LIGHTS</span><span className="site-title-out">OUT</span></h1>
        </div>
        <div className="col-1-block-2">
          <div className='instructions'>
            <p> The 90s are back!</p>
            <p>Usings either <span className="pink">← → ↑ ↓</span> or the mouse to navigate </p>
            <p>Select a tile with either a mouseclick or the <span className="pink">[spacebar]</span></p>
            <p>Turn off all the lights with as few moves as possible!</p>
          </div> 
        <div className=" all-buttons-container">
          <Controls
            selectedWidth={this.state.selectedWidth}
            setSelectedWidth={this.setSelectedWidth}
          ></Controls>
          <button 
              ref={ startButtonElement =>this.startButtonRef = startButtonElement}
              className="start-button"
              onClick={this.startGame}>NEW GAME
          </button>
        </div>
        </div>
        <div className="col-1-block-3">        
            <p className='score'>{this.state.plays}</p>
        </div>
        </div>
        <div className="col-2"  ref={col2Element => this.col2ref = col2Element}>
          <Board 
            selectedWidth={this.state.selectedWidth}
            boardWidth={this.state.boardWidth}
            gameInPlay={this.state.gameInPlay}
            showPreGameOverlay={this.state.showPreGameOverlay}
            showWinOverlay={this.state.showWinOverlay}
            highlightedTile={this.state.highlightedTile}
            handleHover={this.handleHover}
            handleTileClick={this.handleTileClick}
            tiles={this.state.tiles}
          ></Board>

        </div>

   
      </div>
    )
  }
}

export default App;

