// const socket = io();
// const chess = new Chess()
// const boardElement = document.querySelector(".chessboard");
// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;
//
// const renderBoard = () => {
//     const board = chess.board();
//     boardElement.innerHTML = "";
//     board.forEach((row, rowindex) => {
//         row.forEach((square, squareindex) => {
//             const squareElement = document.createElement("div");
//             squareElement.classList.add(
//                 "square",
//                 (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
//             );
//             squareElement.dataset.row = rowindex;
//             squareElement.dataset.col = squareindex;
//             if (square) {
//                 const pieceElement = document.createElement("div");
//                 pieceElement.classList.add(
//                     "piece",
//                     square.color === "w" ? "white" : "black"
//                 )
//                 pieceElement.innerText = getPieceUnicode(square)
//                 pieceElement.draggable = playerRole === square.color;
//                 pieceElement.addEventListener("dragstart", (e) => {
//                     if (pieceElement.draggable) {
//                         draggedPiece = pieceElement;
//                         sourceSquare = { row: rowindex, col: squareindex };
//                         e.dataTransfer.setData("text/plain", "");
//                     }
//                 });
//                 pieceElement.addEventListener("dragend", (e) => {
//                     draggedPiece = null;
//                     sourceSquare = null;
//                 });
//                 squareElement.appendChild(pieceElement);
//             }
//             squareElement.addEventListener("dragover",function(e){
//                 e.preventDefault();
//             })
//             squareElement.addEventListener("drop",function(e){
//                 e.preventDefault();
//                 if(draggedPiece){
//                     const targetSquare = {
//                         row: parseInt(e.target.dataset.row),
//                         col: parseInt(e.target.dataset.col)
//                     };
//                     socket.emit("move", {
//                         from: sourceSquare,
//                         to: targetSquare
//                     });
//                     handleMove(sourceSquare,targetSquare);
//                 }
//             })
//             boardElement.appendChild(squareElement);
//         });
//     });
// };
// const handleMove = (sourceSquare,targetSquare) => {
//     console.log("inside the handel move")
//     const move = {
//         from: `${String.fromCharCode(97+sourceSquare.col)}${8-sourceSquare.row}`,
//         to: `${String.fromCharCode(97+targetSquare.col)}${8-targetSquare.row}`,
//         promotion: "q"
//     }
//     socket.move("move",move)
// };
// const getPieceUnicode = (pices) => {
//     const unicodePieces = {
//         p: "♟︎", // Pawn
//         r: "♜", // Rook
//         n: "♞", // Knight
//         b: "♝", // Bishop
//         q: "♛", // Queen
//         k: "♚", // King
//         P: "♟︎", // Pawn
//         R: "♜", // Rook
//         N: "♞", // Knight
//         B: "♝", // Bishop
//         Q: "♛", // Queen
//         K: "♚", // King
//     };
//     return unicodePieces[pices.type] || "";
// };
//
// socket.on("playerRole", function(role){
//     playerRole = role;
//     renderBoard()
// })
// socket.on("spectatorRole", function(){
//     playerRole = null;
//     renderBoard()
// })
//
// socket.on("invalidMove", function(move){
//     alert(`Invalid move ${move}`)
// })
//
// socket.on("boardState", function(fen){
//     chess.load(fen)
//     renderBoard()
// })
// socket.on("move", function(move){
//     chess.move(move)
//     renderBoard()
// })
// renderBoard()