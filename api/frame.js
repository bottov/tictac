const board = Array(9).fill(null);
let currentPlayer = 'X';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { untrustedData } = req.body;
        const buttonIndex = untrustedData.buttonIndex - 1; // Кнопки 1-9 → индексы 0-8

        // Обновляем доску
        if (!board[buttonIndex]) {
            board[buttonIndex] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }

        // Проверяем победителя
        const winner = checkWinner();

        // Генерируем новое изображение (в реальном приложении используйте Canvas API)
        const boardImageUrl = `https://xotictaclol.netlify.app/board.png?state=${board.join('')}`;

        return res.json({
            type: 'frame',
            frame: {
                version: 'vNext',
                image: boardImageUrl,
                buttons: [
                    { label: "1 (Top-Left)", action: "post" },
                    { label: "2 (Top-Mid)", action: "post" },
                    { label: "3 (Top-Right)", action: "post" },
                    { label: "4 (Mid-Left)", action: "post" }
                ],
                postUrl: "https://xotictaclol.netlify.app/api/frame"
            }
        });
    }

    // Первый запуск Frame
    return res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="https://xotictaclol.netlify.app/board.png">
                <meta property="fc:frame:button:1" content="Start Game">
            </head>
        </html>
    `);
};

function checkWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
