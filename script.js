const Game = (function () {
  let board = []
  const getBoard = () => board

  const makeBoard = () => {
    if (board) {
      board = []
    }
    for (let i = 0; i < 9; i += 1) {
      board.push(Square(i))
    }
  }

  const boardUI = document.querySelector('.board')
  const boardTemplate = boardUI.querySelector('#boardTemplate').innerHTML

  makeBoard()
  render()

  function Square(index) {
    let squareValue = null
    const squareIndex = index

    const getValue = () => squareValue
    const setValue = (newValue) => {
      squareValue = newValue
    }
    const getIndex = () => squareIndex

    return {
      getValue,
      setValue,
      getIndex
    }
  }

  function markSquare(square, player) {
    if (board[square].getValue() !== null) return

    board[square].setValue(player.mark)

    render()
  }

  function render() {
    const compiledTemplate = Handlebars.compile(boardTemplate)

    boardUI.innerHTML = compiledTemplate({ board })
  }
  return {
    getBoard,
    makeBoard,
    markSquare,
    boardUI,
    render
  }
})()

const Player = (name, mark) => {
  const score = 0

  return {
    name,
    mark,
    score
  }
}

const gameController = (function () {
  const player1 = Player('Player 1', 'O')
  const player2 = Player('Player 2', 'X')
  const players = [player1, player2]

  let currentPlayer = players[0]

  const getCurrentPlayer = () => currentPlayer
  const getPlayers = () => players

  function playRound (square) {
    Game.markSquare(square, getCurrentPlayer())

    const result = calculateWinner(Game.getBoard())
    if (result) {
      getCurrentPlayer().isWinner = true
      return
    }
    switchTurn()
  }

  function calculateWinner(board) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (let i = 0; i < winPatterns.length; i += 1) {
      const [a, b, c] = winPatterns[i]
      if (board[a].getValue() && board[a].getValue() === board[b].getValue() && board[a].getValue() === board[c].getValue()) {
        return board[a].getValue()
      }
    }
    return null
  }

  function switchTurn () {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
  }

  return {
    playRound,
    getCurrentPlayer,
    getPlayers
  }
})()

const screenController = (function () {
  const container = document.querySelector('.container')
  const scoreUI = container.querySelector('.score')
  const scoreTemplate = container.querySelector('#scoreTemplate').innerHTML

  Game.boardUI.addEventListener('click', handleBoardClick)
  scoreUI.addEventListener('click', resetGame)

  render()

  function handleBoardClick (event) {
    const square = event.target.dataset.square

    if (square) {
      const result = gameController.playRound(square)

    }
    render()
  }

  function resetGame (event) {
    if (event.target.className === 'reset') {
      gameController.getCurrentPlayer().isWinner = null

      Game.makeBoard()
      Game.render()
      render()

    }
  }

  function render () {
    const data = {
      players: gameController.getPlayers(),
      currentPlayer: gameController.getCurrentPlayer()
    }
    const compiledTemplate = Handlebars.compile(scoreTemplate)

    scoreUI.innerHTML = compiledTemplate(data)
  }
})()
