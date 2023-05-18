import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Classic OX';
  gameSettingUp = true;
  userScore = 0;
  cpuScore = 0;
  maxScore = 10;
  width = 10;
  height = 10;
  board: Array<Array<Cell>> = [];
  gameEnded = false;
  gameEndedMessage = "";

  constructor() {
    //this.createBoard(this.width, this.height);
  }

  startGame(width: string, height: string, score: string) {
    this.width = parseInt(width)
    this.height = parseInt(height)
    this.maxScore = parseInt(score)

    for (let i = 0; i < this.height; i++) {
      const helper: Array<Cell> = []
      for (let i = 0; i < this.width; i++) helper.push(new Cell)
      this.board.push(helper)
    }

    this.gameSettingUp = false
  }

  handleClick(i: number, j: number) {
    if (!this.gameEnded && this.legalMove(i, j)) {
      this.makeMove(i, j, "O")

      this.cpuMove()
    }
  }

  makeMove(i: number, j: number, player: string) {
    this.board[i][j].content = player

    this.checkForFive()

    this.checkGameEnd()
  }

  legalMove(i: number, j: number) {
    console.log(i, j);
    console.log(this.board);

    return i >= 0 && j >= 0 && i < this.height && j < this.width && this.board[i][j].content === ""
  }

  cpuMove() {
    // 3 z rzędu
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width - 2; j++) {
        if (this.board[i][j].content === "O" && this.board[i][j + 1].content === "O" && this.board[i][j + 2].content === "O") {
          if (this.legalMove(i, j - 1)) {
            this.makeMove(i, j - 1, "X")
            return;
          } else if (this.legalMove(i, j + 3)) {
            this.makeMove(i, j + 3, "X")
            return;
          }
        }
      }
    }

    // 3 w kolumnie
    for (let j = 0; j < this.width; j++) {
      for (let i = 0; i < this.height - 2; i++) {
        if (this.board[i][j].content === "O" && this.board[i + 1][j].content === "O" && this.board[i + 2][j].content === "O") {
          if (this.legalMove(i - 1, j)) {
            this.makeMove(i - 1, j, "X")
            return;
          } else if (this.legalMove(i + 3, j)) {
            this.makeMove(i + 3, j, "X")
            return;
          }
        }
      }
    }

    // 3 na skos (góra lewo - dół prawo)
    for (let i = 0; i < this.height - 2; i++) {
      for (let j = 0; j < this.width - 2; j++) {
        if (this.board[i][j].content === "O" && this.board[i + 1][j + 1].content === "O" && this.board[i + 2][j + 2].content === "O") {
          console.log("E");

          if (this.legalMove(i - 1, j - 1)) {
            this.makeMove(i - 1, j - 1, "X")
            return;
          } else if (this.legalMove(i + 3, j + 3)) {
            this.makeMove(i + 3, j + 3, "X")
            return;
          }
        }
      }
    }

    // 3 na skos (dół lewo - góra prawo)
    for (let i = 2; i < this.height; i++) {
      for (let j = 0; j < this.width - 2; j++) {
        if (this.board[i][j].content === "O" && this.board[i - 1][j + 1].content === "O" && this.board[i - 2][j + 2].content === "O") {
          console.log("F");
          if (this.legalMove(i + 1, j - 1)) {
            this.makeMove(i + 1, j - 1, "X");
            return;
          }
          else if (this.legalMove(i - 3, j + 3)) {
            this.makeMove(i - 3, j + 3, "X");
            return;
          }
        }
      }
    }

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.board[i][j].content === "X") {
          let helper = [{ x: i - 1, y: j - 1 }, { x: i, y: j - 1 }, { x: i + 1, y: j - 1 }, { x: i - 1, y: j }, { x: i + 1, y: j }, { x: i - 1, y: j + 1 }, { x: i, y: j + 1 }, { x: i + 1, y: j + 1 }]
          helper = helper.sort(() => Math.random() - 0.5);
          for (let x = 0; x < helper.length; x++) {
            if (this.legalMove(helper[x].x, helper[x].y)) {
              this.makeMove(helper[x].x, helper[x].y, "X")
              return;
            }
          }
        }
      }
    }

    let isLegal = false
    do {
      const i = Math.round(Math.random() * this.height)
      const j = Math.round(Math.random() * this.width)
      isLegal = this.legalMove(i, j)
      if (isLegal) {
        this.makeMove(i, j, "X")
        return;
      }
    } while (isLegal)
  }

  checkForFive() {
    // 5 w rzędzie
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width - 4; j++) {
        if (this.board[i][j].content !== "" && this.board[i][j].content === this.board[i][j + 1].content && this.board[i][j].content === this.board[i][j + 2].content && this.board[i][j].content === this.board[i][j + 3].content && this.board[i][j].content === this.board[i][j + 4].content && !this.board[i][j].usedInLine && !this.board[i][j + 1].usedInLine && !this.board[i][j + 2].usedInLine && !this.board[i][j + 3].usedInLine && !this.board[i][j + 4].usedInLine) {
          this.board[i][j].usedInLine = true
          this.board[i][j + 1].usedInLine = true
          this.board[i][j + 2].usedInLine = true
          this.board[i][j + 3].usedInLine = true
          this.board[i][j + 4].usedInLine = true

          if (this.board[i][j].content === "O") this.userScore += 1
          else this.cpuScore += 1
        }
      }
    }

    // 5 w kolumnie
    for (let j = 0; j < this.width; j++) {
      for (let i = 0; i < this.height - 4; i++) {
        if (this.board[i][j].content !== "" && this.board[i][j].content === this.board[i + 1][j].content && this.board[i][j].content === this.board[i + 2][j].content && this.board[i][j].content === this.board[i + 3][j].content && this.board[i][j].content === this.board[i + 4][j].content && !this.board[i][j].usedInLine && !this.board[i + 1][j].usedInLine && !this.board[i + 2][j].usedInLine && !this.board[i + 3][j].usedInLine && !this.board[i + 4][j].usedInLine) {
          this.board[i][j].usedInLine = true
          this.board[i + 1][j].usedInLine = true
          this.board[i + 2][j].usedInLine = true
          this.board[i + 3][j].usedInLine = true
          this.board[i + 4][j].usedInLine = true

          if (this.board[i][j].content === "O") this.userScore += 1
          else this.cpuScore += 1
        }
      }
    }

    // 5 na skos (góra lewo - dół prawo)
    for (let i = 0; i < this.height - 4; i++) {
      for (let j = 0; j < this.width - 4; j++) {
        if (this.board[i][j].content !== "" && this.board[i][j].content === this.board[i + 1][j + 1].content && this.board[i][j].content === this.board[i + 2][j + 2].content && this.board[i][j].content === this.board[i + 3][j + 3].content && this.board[i][j].content === this.board[i + 4][j + 4].content && !this.board[i][j].usedInLine && !this.board[i + 1][j + 1].usedInLine && !this.board[i + 2][j + 2].usedInLine && !this.board[i + 3][j + 3].usedInLine && !this.board[i + 4][j + 4].usedInLine) {
          this.board[i][j].usedInLine = true
          this.board[i + 1][j + 1].usedInLine = true
          this.board[i + 2][j + 2].usedInLine = true
          this.board[i + 3][j + 3].usedInLine = true
          this.board[i + 4][j + 4].usedInLine = true

          if (this.board[i][j].content === "O") this.userScore += 1
          else this.cpuScore += 1
        }
      }
    }

    // 5 na skos (dół lewo - góra prawo)
    for (let i = 4; i < this.height; i++) {
      for (let j = 0; j < this.width - 4; j++) {
        if (this.board[i][j].content !== "" && this.board[i][j].content === this.board[i - 1][j + 1].content && this.board[i][j].content === this.board[i - 2][j + 2].content && this.board[i][j].content === this.board[i - 3][j + 3].content && this.board[i][j].content === this.board[i - 4][j + 4].content && !this.board[i][j].usedInLine && !this.board[i - 1][j + 1].usedInLine && !this.board[i - 2][j + 2].usedInLine && !this.board[i - 3][j + 3].usedInLine && !this.board[i - 4][j + 4].usedInLine) {
          this.board[i][j].usedInLine = true
          this.board[i - 1][j + 1].usedInLine = true
          this.board[i - 2][j + 2].usedInLine = true
          this.board[i - 3][j + 3].usedInLine = true
          this.board[i - 4][j + 4].usedInLine = true

          if (this.board[i][j].content === "O") this.userScore += 1
          else this.cpuScore += 1
        }
      }
    }
  }

  checkGameEnd() {
    if (this.userScore >= this.maxScore) this.displayGameEnd("Wygrałeś!")
    else if (this.cpuScore >= this.maxScore) this.displayGameEnd("Przegrałeś!")

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.board[i][j].content === "") return;
      }
    }
    if (this.userScore == this.cpuScore) this.displayGameEnd("Remis!")
    else if (this.userScore > this.cpuScore) this.displayGameEnd("Wygrałeś!")
    else this.displayGameEnd("Przegrałeś!")
  }

  displayGameEnd(message: string) {
    this.gameEndedMessage = message
    this.gameEnded = true
  }
}

class Cell {
  public content = ""
  public usedInLine = false
}