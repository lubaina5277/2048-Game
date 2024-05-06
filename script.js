document.addEventListener("DOMContentLoaded", () => {
	const gridDisplay = document.querySelector(".grid");
	const scoreDisplay = document.getElementById("score");
	let squares = [];
	let score = 0;

	function createBoard() {
		for (let i = 0; i < 16; i++) {
			let square = document.createElement("div");
			square.textContent = 0;
			gridDisplay.appendChild(square);
			squares.push(square);
		}
		addNewNumber();
		addNewNumber();
	}

	function addNewNumber() {
		let available = squares.filter((square) => square.textContent == "0");
		if (available.length > 0) {
			let randomSquare =
				available[Math.floor(Math.random() * available.length)];
			randomSquare.textContent = 2;
			checkGameOver();
		}
	}

	function slideRowLeft(row) {
		let filteredRow = row.filter((num) => num > 0);
		let missing = 4 - filteredRow.length;
		let zeros = Array(missing).fill(0);
		return filteredRow.concat(zeros);
	}

	function slideRowRight(row) {
		return slideRowLeft(row.reverse()).reverse();
	}

	function combineRow(row) {
		for (let i = 0; i < row.length - 1; i++) {
			if (row[i] === row[i + 1]) {
				row[i] *= 2;
				row[i + 1] = 0;
				score += row[i];
				scoreDisplay.textContent = score;
			}
		}
		return row;
	}

	function control(e) {
		if (e.keyCode === 39) keyRight();
		if (e.keyCode === 37) keyLeft();
		if (e.keyCode === 38) keyUp();
		if (e.keyCode === 40) keyDown();
	}

	function keyRight() {
		let changed = false;
		for (let i = 0; i < 16; i += 4) {
			let row = [
				parseInt(squares[i].textContent),
				parseInt(squares[i + 1].textContent),
				parseInt(squares[i + 2].textContent),
				parseInt(squares[i + 3].textContent),
			];
			let newRow = slideRowRight(row);
			newRow = combineRow(newRow);
			newRow = slideRowRight(newRow);
			if (!changed) changed = !newRow.every((val, idx) => val === row[idx]);
			[squares[i], squares[i + 1], squares[i + 2], squares[i + 3]].forEach(
				(square, j) => {
					square.textContent = newRow[j];
				}
			);
		}
		if (changed) addNewNumber();
	}

	function keyLeft() {
		let changed = false;
		for (let i = 0; i < 16; i += 4) {
			let row = [
				parseInt(squares[i].textContent),
				parseInt(squares[i + 1].textContent),
				parseInt(squares[i + 2].textContent),
				parseInt(squares[i + 3].textContent),
			];
			let newRow = slideRowLeft(row);
			newRow = combineRow(newRow);
			newRow = slideRowLeft(newRow);
			if (!changed) changed = !newRow.every((val, idx) => val === row[idx]);
			[squares[i], squares[i + 1], squares[i + 2], squares[i + 3]].forEach(
				(square, j) => {
					square.textContent = newRow[j];
				}
			);
		}
		if (changed) addNewNumber();
	}

	function keyDown() {
		moveDownUp(true);
	}

	function keyUp() {
		moveDownUp(false);
	}

	function moveDownUp(isDown) {
		let changed = false;
		for (let i = 0; i < 4; i++) {
			let column = [
				parseInt(squares[i].textContent),
				parseInt(squares[i + 4].textContent),
				parseInt(squares[i + 8].textContent),
				parseInt(squares[i + 12].textContent),
			];
			let newColumn = isDown ? slideRowRight(column) : slideRowLeft(column);
			newColumn = combineRow(newColumn);
			newColumn = isDown ? slideRowRight(newColumn) : slideRowLeft(newColumn);
			if (!changed)
				changed = !newColumn.every((val, idx) => val === column[idx]);
			[squares[i], squares[i + 4], squares[i + 8], squares[i + 12]].forEach(
				(square, j) => {
					square.textContent = newColumn[j];
				}
			);
		}
		if (changed) addNewNumber();
	}

	function checkGameOver() {
		if (
			squares.every(
				(square) => square.textContent != "0" && !hasAdjacentMerge(square)
			)
		) {
			alert("Game Over! Refresh the page to play again.");
			document.removeEventListener("keyup", control);
		}
	}

	function hasAdjacentMerge(square) {
		let idx = squares.indexOf(square);
		let value = parseInt(square.textContent);
		return (
			(squares[idx - 1] && parseInt(squares[idx - 1].textContent) === value) ||
			(squares[idx + 1] && parseInt(squares[idx + 1].textContent) === value) ||
			(squares[idx - 4] && parseInt(squares[idx - 4].textContent) === value) ||
			(squares[idx + 4] && parseInt(squares[idx + 4].textContent) === value)
		);
	}

	document.addEventListener("keyup", control);
	createBoard();
});
