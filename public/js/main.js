const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;
            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowindex, col: squareindex};
                        e.dataTransfer.setData("text/plain", "");
                    }
                });
                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });
                squareElement.appendChild(pieceElement);
            }
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    // Check if target square is valid
                    // if (isNaN(targetSquare.row) || isNaN(targetSquare.col)) {
                    //     const targetParentSquare = e.target.parentElement;
                    //     targetSquare.row = parseInt(targetParentSquare.dataset.row);
                    //     targetSquare.col = parseInt(targetParentSquare.dataset.col);
                    // }
                    handleMove(sourceSquare, targetSquare);
                    // socket.emit("move", {
                    //     from: sourceSquare,
                    //     to: targetSquare
                    // });
                }
            });
            boardElement.appendChild(squareElement);
        });
    });
    if(playerRole === 'b'){
        boardElement.classList.add("flipped")
    }
};

const handleMove = (sourceSquare, targetSquare) => {
    console.log("Inside handleMove");
    const move = {
        from: `${String.fromCharCode(97 + sourceSquare.col)}${8 - sourceSquare.row}`,
        to: `${String.fromCharCode(97 + targetSquare.col)}${8 - targetSquare.row}`,
        promotion: "q" // Assuming promotion to queen, can be dynamic based on user input
    };
    socket.emit("move",move);
    renderBoard();
};

const getPieceUnicode = (piece) => {
    // const unicodePieces = {
    //     p: "♟︎", // Pawn
    //     r: "♜", // Rook
    //     n: "♞", // Knight
    //     b: "♝", // Bishop
    //     q: "♛", // Queen
    //     k: "♚", // King
    //     P: "♙", // Pawn
    //     R: "♖", // Rook
    //     N: "♘", // Knight
    //     B: "♗", // Bishop
    //     Q: "♕", // Queen
    //     K: "♔", // King
    // };
    const unicodePieces = {
        p: "♟︎", // Pawn
        r: "♜", // Rook
        n: "♞", // Knight
        b: "♝", // Bishop
        q: "♛", // Queen
        k: "♚", // King
        P: "♟︎", // Pawn
        R: "♜", // Rook
        N: "♞", // Knight
        B: "♝", // Bishop
        Q: "♛", // Queen
        K: "♚", // King
    };
    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", (role) => {
    playerRole = role;
    console.log("onPlayerRole", role);
    renderBoard();
});

socket.on("spectatorRole", () => {
    playerRole = null;
    console.log("onSpectatorRole")
    renderBoard();
});

socket.on("invalidMove", (move) => {
    console.log("onInvalidMove", move);
    alert(`Invalid move ${move}`);
});

socket.on("boardState", (fen) => {
    chess.load(fen);
    console.log("onBoardState", fen);
    renderBoard();
});

socket.on("move", (move) => {
    chess.move(move);
    console.log("onMove", move)
    renderBoard();
});

renderBoard();