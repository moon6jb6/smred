/**
 * 纯JS中国象棋引擎 — 赓续红色血脉 Mod2
 * 完整规则：車/马/炮/象/士/将/兵，蹩马腿、塞象眼、飞将检测
 * 6关卡：教学+湘江+泸定桥+四渡赤水+会宁会师+总结
 */

/* ============================================================
   棋盘与棋子
   ============================================================ */

const ROWS = 10;
const COLS = 9;

// 棋子类型
const PIECES = {
    R_CHE: 'r_che', R_MA: 'r_ma', R_PAO: 'r_pao',
    R_XIANG: 'r_xiang', R_SHI: 'r_shi', R_SHUAI: 'r_shuai', R_BING: 'r_bing',
    B_JU: 'b_ju', B_MA: 'b_ma', B_PAO: 'b_pao',
    B_XIANG: 'b_xiang', B_SHI: 'b_shi', B_JIANG: 'b_jiang', B_ZU: 'b_zu'
};

// 棋子显示名
const PIECE_NAMES = {
    r_che: '車', r_ma: '馬', r_pao: '炮', r_xiang: '相',
    r_shi: '仕', r_shuai: '帥', r_bing: '兵',
    b_ju: '車', b_ma: '馬', b_pao: '砲', b_xiang: '象',
    b_shi: '士', b_jiang: '將', b_zu: '卒'
};

// 棋子分值（用于AI评估）
const PIECE_VALUES = {
    r_che: 100, r_ma: 50, r_pao: 50, r_xiang: 25,
    r_shi: 25, r_shuai: 10000, r_bing: 10,
    b_ju: 100, b_ma: 50, b_pao: 50, b_xiang: 25,
    b_shi: 25, b_jiang: 10000, b_zu: 10
};

function isRed(piece) { return piece && piece.startsWith('r_'); }
function isBlack(piece) { return piece && piece.startsWith('b_'); }
function sameColor(p1, p2) { return (isRed(p1) && isRed(p2)) || (isBlack(p1) && isBlack(p2)); }

/* ============================================================
   棋盘类
   ============================================================ */
class Board {
    constructor() {
        this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        this.redTurn = true; // 红方先手
        this.history = [];   // 悔棋栈
        this.captureCount = { red: 0, black: 0 }; // 吃子计数
        this.capturePositions = []; // 吃子位置记录（代价可视化）
    }

    /** 放置棋子 */
    set(row, col, piece) {
        this.grid[row][col] = piece;
    }

    /** 获取棋子 */
    get(row, col) {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return undefined;
        return this.grid[row][col];
    }

    /** 移动棋子（不验证合法性） */
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.grid[fromRow][fromCol];
        const captured = this.grid[toRow][toCol];

        // 保存历史
        this.history.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: captured,
            redTurn: this.redTurn
        });

        // 记录吃子位置
        if (captured) {
            this.capturePositions.push({ row: toRow, col: toCol, piece: captured });
            if (isRed(captured)) this.captureCount.black++;
            else this.captureCount.red++;
        }

        this.grid[toRow][toCol] = piece;
        this.grid[fromRow][fromCol] = null;
        this.redTurn = !this.redTurn;
    }

    /** 悔棋 */
    undo() {
        if (this.history.length === 0) return false;
        const last = this.history.pop();
        this.grid[last.from[0]][last.from[1]] = last.piece;
        this.grid[last.to[0]][last.to[1]] = last.captured;
        this.redTurn = last.redTurn;

        if (last.captured) {
            this.capturePositions.pop();
            if (isRed(last.captured)) this.captureCount.black--;
            else this.captureCount.red--;
        }
        return true;
    }

    /** 复制棋盘 */
    clone() {
        const b = new Board();
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                b.grid[r][c] = this.grid[r][c];
        b.redTurn = this.redTurn;
        return b;
    }

    /** 找到指定棋子的位置 */
    findPiece(piece) {
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                if (this.grid[r][c] === piece) return [r, c];
        return null;
    }

    /** 获取某方所有棋子位置 */
    getAllPieces(isRedSide) {
        const pieces = [];
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
                const p = this.grid[r][c];
                if (p && ((isRedSide && isRed(p)) || (!isRedSide && isBlack(p))))
                    pieces.push({ row: r, col: c, piece: p });
            }
        return pieces;
    }
}

/* ============================================================
   走法验证
   ============================================================ */

/** 边界检查 */
function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

/** 通用走法验证：目标位置为空或有敌方棋子 */
function canMoveTo(board, toRow, toCol, isRedSide) {
    if (!inBounds(toRow, toCol)) return false;
    const target = board.get(toRow, toCol);
    return !target || (isRedSide ? isBlack(target) : isRed(target));
}

/** 車/车：直线走，中间无阻挡 */
function getCheMoves(board, row, col, isRedSide) {
    const moves = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc;
        while (inBounds(r, c)) {
            const target = board.get(r, c);
            if (!target) {
                moves.push([r, c]);
            } else {
                if (!sameColor(board.get(row, col), target)) moves.push([r, c]);
                break;
            }
            r += dr; c += dc;
        }
    }
    return moves;
}

/** 马/马：日字走，蹩马腿 */
function getMaMoves(board, row, col) {
    const moves = [];
    const piece = board.get(row, col);
    // 八个方向：[马腿位置, 落点偏移]
    const jumps = [
        [-2, -1, -1, 0], [-2, 1, -1, 0],
        [2, -1, 1, 0], [2, 1, 1, 0],
        [-1, -2, 0, -1], [-1, 2, 0, 1],
        [1, -2, 0, -1], [1, 2, 0, 1]
    ];
    for (const [dr, dc, legR, legC] of jumps) {
        const legRow = row + legR, legCol = col + legC;
        const toRow = row + dr, toCol = col + dc;
        // 蹩马腿检查
        if (inBounds(legRow, legCol) && !board.get(legRow, legCol)) {
            if (inBounds(toRow, toCol) && canMoveTo(board, toRow, toCol, isRed(piece)))
                moves.push([toRow, toCol]);
        }
    }
    return moves;
}

/** 炮/炮：直线走，吃子需隔一个棋子（炮架） */
function getPaoMoves(board, row, col, isRedSide) {
    const moves = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc;
        let jumped = false;
        while (inBounds(r, c)) {
            const target = board.get(r, c);
            if (!jumped) {
                if (!target) {
                    moves.push([r, c]);
                } else {
                    jumped = true; // 找到炮架
                }
            } else {
                if (target) {
                    if (!sameColor(board.get(row, col), target)) moves.push([r, c]);
                    break;
                }
            }
            r += dr; c += dc;
        }
    }
    return moves;
}

/** 象/相：走田字，塞象眼，不过河 */
function getXiangMoves(board, row, col) {
    const moves = [];
    const piece = board.get(row, col);
    const red = isRed(piece);
    const jumps = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
    for (const [dr, dc] of jumps) {
        const eyeRow = row + dr / 2, eyeCol = col + dc / 2;
        const toRow = row + dr, toCol = col + dc;
        // 塞象眼检查
        if (inBounds(eyeRow, eyeCol) && !board.get(eyeRow, eyeCol)) {
            if (inBounds(toRow, toCol)) {
                // 不过河
                if (red && toRow >= 5 && canMoveTo(board, toRow, toCol, true))
                    moves.push([toRow, toCol]);
                if (!red && toRow <= 4 && canMoveTo(board, toRow, toCol, false))
                    moves.push([toRow, toCol]);
            }
        }
    }
    return moves;
}

/** 士/仕：走斜线一格，在九宫内 */
function getShiMoves(board, row, col) {
    const moves = [];
    const piece = board.get(row, col);
    const red = isRed(piece);
    const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of dirs) {
        const r = row + dr, c = col + dc;
        if (red && r >= 7 && r <= 9 && c >= 3 && c <= 5 && canMoveTo(board, r, c, true))
            moves.push([r, c]);
        if (!red && r >= 0 && r <= 2 && c >= 3 && c <= 5 && canMoveTo(board, r, c, false))
            moves.push([r, c]);
    }
    return moves;
}

/** 帅/将：走直线一格，在九宫内 */
function getShuaiMoves(board, row, col) {
    const moves = [];
    const piece = board.get(row, col);
    const red = isRed(piece);
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
        const r = row + dr, c = col + dc;
        if (red && r >= 7 && r <= 9 && c >= 3 && c <= 5 && canMoveTo(board, r, c, true))
            moves.push([r, c]);
        if (!red && r >= 0 && r <= 2 && c >= 3 && c <= 5 && canMoveTo(board, r, c, false))
            moves.push([r, c]);
    }
    return moves;
}

/** 兵/卒：过河前只能前进，过河后可左右 */
function getBingMoves(board, row, col) {
    const moves = [];
    const piece = board.get(row, col);
    const red = isRed(piece);

    if (red) {
        // 红方兵：未过河(row>=5)只能前进(row-1)，过河后可左右
        if (row - 1 >= 0 && canMoveTo(board, row - 1, col, true)) moves.push([row - 1, col]);
        if (row <= 4) { // 已过河
            if (col - 1 >= 0 && canMoveTo(board, row, col - 1, true)) moves.push([row, col - 1]);
            if (col + 1 < COLS && canMoveTo(board, row, col + 1, true)) moves.push([row, col + 1]);
        }
    } else {
        // 黑方卒：未过河(row<=4)只能前进(row+1)，过河后可左右
        if (row + 1 < ROWS && canMoveTo(board, row + 1, col, false)) moves.push([row + 1, col]);
        if (row >= 5) { // 已过河
            if (col - 1 >= 0 && canMoveTo(board, row, col - 1, false)) moves.push([row, col - 1]);
            if (col + 1 < COLS && canMoveTo(board, row, col + 1, false)) moves.push([row, col + 1]);
        }
    }
    return moves;
}

/** 获取某棋子的所有合法走法 */
function getValidMoves(board, row, col) {
    const piece = board.get(row, col);
    if (!piece) return [];

    let moves;
    if (piece === PIECES.R_CHE || piece === PIECES.B_JU) moves = getCheMoves(board, row, col, isRed(piece));
    else if (piece === PIECES.R_MA || piece === PIECES.B_MA) moves = getMaMoves(board, row, col);
    else if (piece === PIECES.R_PAO || piece === PIECES.B_PAO) moves = getPaoMoves(board, row, col, isRed(piece));
    else if (piece === PIECES.R_XIANG || piece === PIECES.B_XIANG) moves = getXiangMoves(board, row, col);
    else if (piece === PIECES.R_SHI || piece === PIECES.B_SHI) moves = getShiMoves(board, row, col);
    else if (piece === PIECES.R_SHUAI || piece === PIECES.B_JIANG) moves = getShuaiMoves(board, row, col);
    else if (piece === PIECES.R_BING || piece === PIECES.B_ZU) moves = getBingMoves(board, row, col);
    else moves = [];

    // 过滤掉会导致自己被将军的走法
    return moves.filter(([tr, tc]) => {
        const testBoard = board.clone();
        testBoard.grid[tr][tc] = testBoard.grid[row][col];
        testBoard.grid[row][col] = null;
        return !isInCheck(testBoard, isRed(piece));
    });
}

/* ============================================================
   将军检测
   ============================================================ */

/** 飞将检测：将帅面对面 */
function checkFlyingGeneral(board) {
    const redPos = board.findPiece(PIECES.R_SHUAI);
    const blackPos = board.findPiece(PIECES.B_JIANG);
    if (!redPos || !blackPos) return false;
    if (redPos[1] !== blackPos[1]) return false;

    // 检查中间是否有棋子
    const minR = Math.min(redPos[0], blackPos[0]);
    const maxR = Math.max(redPos[0], blackPos[0]);
    for (let r = minR + 1; r < maxR; r++) {
        if (board.get(r, redPos[1])) return false;
    }
    return true; // 飞将！
}

/** 检查某方是否被将军 */
function isInCheck(board, isRedSide) {
    // 找到将/帅
    const king = isRedSide ? PIECES.R_SHUAI : PIECES.B_JIANG;
    const kingPos = board.findPiece(king);
    if (!kingPos) return true; // 将/帅已被吃，算被将

    // 检查对方任何棋子是否能攻击到将/帅
    const opponentPieces = board.getAllPieces(!isRedSide);
    for (const { row, col, piece } of opponentPieces) {
        // 使用不含过滤的原始走法（避免递归）
        let attacks;
        if (piece === PIECES.R_CHE || piece === PIECES.B_JU) attacks = getCheMoves(board, row, col, isRed(piece));
        else if (piece === PIECES.R_MA || piece === PIECES.B_MA) attacks = getMaMoves(board, row, col);
        else if (piece === PIECES.R_PAO || piece === PIECES.B_PAO) attacks = getPaoMoves(board, row, col, isRed(piece));
        else if (piece === PIECES.R_XIANG || piece === PIECES.B_XIANG) attacks = getXiangMoves(board, row, col);
        else if (piece === PIECES.R_SHI || piece === PIECES.B_SHI) attacks = getShiMoves(board, row, col);
        else if (piece === PIECES.R_SHUAI || piece === PIECES.B_JIANG) attacks = getShuaiMoves(board, row, col);
        else if (piece === PIECES.R_BING || piece === PIECES.B_ZU) attacks = getBingMoves(board, row, col);
        else attacks = [];

        if (attacks.some(([r, c]) => r === kingPos[0] && c === kingPos[1])) return true;
    }

    // 飞将检测
    if (checkFlyingGeneral(board)) return true;

    return false;
}

/** 检查某方是否被将死（无合法走法且被将军） */
function isCheckmate(board, isRedSide) {
    if (!isInCheck(board, isRedSide)) return false;
    const pieces = board.getAllPieces(isRedSide);
    for (const { row, col } of pieces) {
        if (getValidMoves(board, row, col).length > 0) return false;
    }
    return true;
}

/* ============================================================
   关卡定义
   ============================================================ */

const LEVELS = [
    {
        id: 1,
        name: '教学关',
        subtitle: '学会走棋',
        narrative: '在正式战斗之前，先学会如何指挥你的部队。',
        history: null,
        setup: function(board) {
            // 简化布局：只有車、马、帅、将
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(0, 4, PIECES.B_JIANG);
            board.set(9, 0, PIECES.R_CHE);
            board.set(9, 8, PIECES.R_CHE);
            board.set(0, 0, PIECES.B_JU);
            board.set(0, 8, PIECES.B_JU);
            board.set(9, 1, PIECES.R_MA);
            board.set(0, 1, PIECES.B_MA);
        },
        aiDepth: 1,
        winCondition: 'checkmate' // 将死对方
    },
    {
        id: 2,
        name: '血战湘江',
        subtitle: '1934年11月',
        narrative: '湘江之畔，红军遭遇了长征以来最惨烈的战斗。86000人渡江后，只剩30000人。',
        history: { event: '湘江战役', toll: '36000人牺牲', detail: '红军从86000锐减到30000，湘江水被血染红' },
        setup: function(board) {
            // 红方：少量残兵
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(9, 0, PIECES.R_CHE);
            board.set(8, 1, PIECES.R_MA);
            board.set(7, 4, PIECES.R_PAO);
            board.set(7, 6, PIECES.R_BING);
            board.set(6, 0, PIECES.R_BING);
            // 黑方：优势兵力
            board.set(0, 4, PIECES.B_JIANG);
            board.set(0, 0, PIECES.B_JU);
            board.set(0, 8, PIECES.B_JU);
            board.set(1, 1, PIECES.B_MA);
            board.set(1, 7, PIECES.B_MA);
            board.set(2, 4, PIECES.B_PAO);
            board.set(2, 5, PIECES.B_PAO);
            board.set(3, 0, PIECES.B_ZU);
            board.set(3, 2, PIECES.B_ZU);
            board.set(3, 4, PIECES.B_ZU);
            board.set(3, 6, PIECES.B_ZU);
            board.set(3, 8, PIECES.B_ZU);
        },
        aiDepth: 2,
        winCondition: 'checkmate'
    },
    {
        id: 3,
        name: '飞夺泸定桥',
        subtitle: '1935年5月',
        narrative: '13根铁索，22名突击队员。对面是枪林弹雨，身后是万丈深渊。',
        history: { event: '飞夺泸定桥', toll: '4人牺牲', detail: '22名突击队员攀爬铁索，4人永远留在了大渡河上' },
        setup: function(board) {
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(9, 0, PIECES.R_CHE);
            board.set(9, 8, PIECES.R_CHE);
            board.set(8, 1, PIECES.R_MA);
            board.set(8, 7, PIECES.R_MA);
            board.set(7, 2, PIECES.R_PAO);
            board.set(7, 6, PIECES.R_PAO);
            board.set(6, 0, PIECES.R_BING);
            board.set(6, 2, PIECES.R_BING);
            board.set(6, 4, PIECES.R_BING);
            board.set(6, 6, PIECES.R_BING);
            board.set(6, 8, PIECES.R_BING);
            board.set(9, 3, PIECES.R_SHI);
            board.set(9, 5, PIECES.R_SHI);
            board.set(8, 2, PIECES.R_XIANG);
            board.set(8, 6, PIECES.R_XIANG);
            // 黑方完整布局
            board.set(0, 4, PIECES.B_JIANG);
            board.set(0, 0, PIECES.B_JU);
            board.set(0, 8, PIECES.B_JU);
            board.set(0, 1, PIECES.B_MA);
            board.set(0, 7, PIECES.B_MA);
            board.set(2, 1, PIECES.B_PAO);
            board.set(2, 7, PIECES.B_PAO);
            board.set(3, 0, PIECES.B_ZU);
            board.set(3, 2, PIECES.B_ZU);
            board.set(3, 4, PIECES.B_ZU);
            board.set(3, 6, PIECES.B_ZU);
            board.set(3, 8, PIECES.B_ZU);
            board.set(0, 3, PIECES.B_SHI);
            board.set(0, 5, PIECES.B_SHI);
            board.set(0, 2, PIECES.B_XIANG);
            board.set(0, 6, PIECES.B_XIANG);
        },
        aiDepth: 2,
        winCondition: 'checkmate'
    },
    {
        id: 4,
        name: '四渡赤水',
        subtitle: '1935年1-3月',
        narrative: '毛泽东的得意之笔。四次渡过赤水河，甩开40万追兵。',
        history: { event: '四渡赤水', toll: '30000人减员', detail: '40万敌军围追堵截，红军以灵活机动甩开包围' },
        setup: function(board) {
            // 标准开局
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(9, 0, PIECES.R_CHE); board.set(9, 8, PIECES.R_CHE);
            board.set(9, 1, PIECES.R_MA); board.set(9, 7, PIECES.R_MA);
            board.set(9, 2, PIECES.R_XIANG); board.set(9, 6, PIECES.R_XIANG);
            board.set(9, 3, PIECES.R_SHI); board.set(9, 5, PIECES.R_SHI);
            board.set(7, 1, PIECES.R_PAO); board.set(7, 7, PIECES.R_PAO);
            board.set(6, 0, PIECES.R_BING); board.set(6, 2, PIECES.R_BING);
            board.set(6, 4, PIECES.R_BING); board.set(6, 6, PIECES.R_BING); board.set(6, 8, PIECES.R_BING);
            board.set(0, 4, PIECES.B_JIANG);
            board.set(0, 0, PIECES.B_JU); board.set(0, 8, PIECES.B_JU);
            board.set(0, 1, PIECES.B_MA); board.set(0, 7, PIECES.B_MA);
            board.set(0, 2, PIECES.B_XIANG); board.set(0, 6, PIECES.B_XIANG);
            board.set(0, 3, PIECES.B_SHI); board.set(0, 5, PIECES.B_SHI);
            board.set(2, 1, PIECES.B_PAO); board.set(2, 7, PIECES.B_PAO);
            board.set(3, 0, PIECES.B_ZU); board.set(3, 2, PIECES.B_ZU);
            board.set(3, 4, PIECES.B_ZU); board.set(3, 6, PIECES.B_ZU); board.set(3, 8, PIECES.B_ZU);
        },
        aiDepth: 3,
        winCondition: 'checkmate'
    },
    {
        id: 5,
        name: '会宁会师',
        subtitle: '1936年10月',
        narrative: '三大主力在会宁胜利会师。长征结束了，但新的征途才刚开始。',
        history: { event: '会宁会师', toll: '79000人未归', detail: '86000人出发，7000人到达。79000人，再也没有回来。' },
        setup: function(board) {
            // 标准开局（与四渡赤水相同，但AI更强）
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(9, 0, PIECES.R_CHE); board.set(9, 8, PIECES.R_CHE);
            board.set(9, 1, PIECES.R_MA); board.set(9, 7, PIECES.R_MA);
            board.set(9, 2, PIECES.R_XIANG); board.set(9, 6, PIECES.R_XIANG);
            board.set(9, 3, PIECES.R_SHI); board.set(9, 5, PIECES.R_SHI);
            board.set(7, 1, PIECES.R_PAO); board.set(7, 7, PIECES.R_PAO);
            board.set(6, 0, PIECES.R_BING); board.set(6, 2, PIECES.R_BING);
            board.set(6, 4, PIECES.R_BING); board.set(6, 6, PIECES.R_BING); board.set(6, 8, PIECES.R_BING);
            board.set(0, 4, PIECES.B_JIANG);
            board.set(0, 0, PIECES.B_JU); board.set(0, 8, PIECES.B_JU);
            board.set(0, 1, PIECES.B_MA); board.set(0, 7, PIECES.B_MA);
            board.set(0, 2, PIECES.B_XIANG); board.set(0, 6, PIECES.B_XIANG);
            board.set(0, 3, PIECES.B_SHI); board.set(0, 5, PIECES.B_SHI);
            board.set(2, 1, PIECES.B_PAO); board.set(2, 7, PIECES.B_PAO);
            board.set(3, 0, PIECES.B_ZU); board.set(3, 2, PIECES.B_ZU);
            board.set(3, 4, PIECES.B_ZU); board.set(3, 6, PIECES.B_ZU); board.set(3, 8, PIECES.B_ZU);
        },
        aiDepth: 3,
        winCondition: 'checkmate'
    },
    {
        id: 6,
        name: '代价',
        subtitle: '回顾',
        narrative: '你赢了。但看看棋盘上的红点。每一场胜利，都有代价。',
        history: { event: '长征全程', toll: '79000人牺牲', detail: '翻越18座山脉，渡过24条河流，行程二万五千里' },
        setup: function(board) {
            // 残局：少数棋子
            board.set(9, 4, PIECES.R_SHUAI);
            board.set(7, 4, PIECES.R_CHE);
            board.set(8, 3, PIECES.R_MA);
            board.set(6, 4, PIECES.R_BING);
            board.set(0, 4, PIECES.B_JIANG);
            board.set(1, 3, PIECES.B_JU);
            board.set(2, 4, PIECES.B_PAO);
            board.set(3, 0, PIECES.B_ZU);
        },
        aiDepth: 2,
        winCondition: 'checkmate'
    }
];

/* ============================================================
   简易AI（Minimax + Alpha-Beta 剪枝）
   ============================================================ */

function evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const p = board.grid[r][c];
            if (!p) continue;
            const val = PIECE_VALUES[p] || 0;
            if (isRed(p)) score += val;
            else score -= val;
        }
    }
    return score;
}

function minimax(board, depth, alpha, beta, maximizing) {
    if (depth === 0) return evaluateBoard(board);

    const isRedSide = maximizing;
    const pieces = board.getAllPieces(isRedSide);
    let best = maximizing ? -Infinity : Infinity;

    for (const { row, col } of pieces) {
        const moves = getValidMoves(board, row, col);
        for (const [tr, tc] of moves) {
            const testBoard = board.clone();
            testBoard.movePiece(row, col, tr, tc);

            // 检查是否将死对方
            if (isCheckmate(testBoard, !isRedSide)) {
                return maximizing ? 99999 - (ROWS * COLS - depth) : -99999 + (ROWS * COLS - depth);
            }

            const val = minimax(testBoard, depth - 1, alpha, beta, !maximizing);
            if (maximizing) {
                best = Math.max(best, val);
                alpha = Math.max(alpha, val);
            } else {
                best = Math.min(best, val);
                beta = Math.min(beta, val);
            }
            if (beta <= alpha) break;
        }
    }
    return best;
}

function aiMove(board, depth) {
    const pieces = board.getAllPieces(false); // AI是黑方
    let bestMove = null;
    let bestScore = Infinity;

    for (const { row, col } of pieces) {
        const moves = getValidMoves(board, row, col);
        for (const [tr, tc] of moves) {
            const testBoard = board.clone();
            testBoard.movePiece(row, col, tr, tc);

            if (isCheckmate(testBoard, true)) {
                return { from: [row, col], to: [tr, tc] };
            }

            const score = minimax(testBoard, depth - 1, -Infinity, Infinity, true);
            if (score < bestScore) {
                bestScore = score;
                bestMove = { from: [row, col], to: [tr, tc] };
            }
        }
    }
    return bestMove;
}

/* ============================================================
   UI 控制器
   ============================================================ */

class ChessGame {
    constructor() {
        this.board = new Board();
        this.currentLevel = 0;
        this.selected = null;     // 当前选中的棋子 [row, col]
        this.validMoves = [];     // 当前合法走法
        this.gameOver = false;
        this.gameResult = null;
        this.isThinking = false;  // AI思考中

        this.boardEl = document.getElementById('chess-board');
        this.infoEl = document.getElementById('game-info');
        this.levelNameEl = document.getElementById('level-name');
        this.narrativeEl = document.getElementById('narrative-text');
        this.undoBtn = document.getElementById('undo-btn');
        this.costEl = document.getElementById('cost-display');

        this.init();
    }

    init() {
        this.undoBtn.addEventListener('click', () => this.undo());
        this.loadLevel(0);
    }

    /** 加载关卡 */
    loadLevel(index) {
        if (index >= LEVELS.length) {
            this.showFinalScreen();
            return;
        }

        this.currentLevel = index;
        const level = LEVELS[index];
        this.board = new Board();
        level.setup(this.board);
        this.selected = null;
        this.validMoves = [];
        this.gameOver = false;
        this.gameResult = null;
        this.isThinking = false;

        // 更新UI
        this.levelNameEl.textContent = level.name + ' — ' + level.subtitle;

        // 显示叙事文字
        this.showNarrative(level.narrative, () => {
            this.render();
            this.updateInfo();
            this.updateCost();
        });
    }

    /** 显示叙事文字 */
    showNarrative(text, callback) {
        this.narrativeEl.textContent = text;
        this.narrativeEl.classList.add('visible');
        setTimeout(() => {
            this.narrativeEl.classList.remove('visible');
            if (callback) callback();
        }, 2500);
    }

    /** 渲染棋盘 */
    render() {
        this.boardEl.innerHTML = '';

        // 绘制棋盘线（用CSS grid实现）
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'chess-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                // 棋子
                const piece = this.board.get(r, c);
                if (piece) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = 'chess-piece ' + (isRed(piece) ? 'red' : 'black');
                    pieceEl.textContent = PIECE_NAMES[piece];
                    cell.appendChild(pieceEl);
                }

                // 选中高亮
                if (this.selected && this.selected[0] === r && this.selected[1] === c) {
                    cell.classList.add('selected');
                }

                // 合法走法提示
                if (this.validMoves.some(([mr, mc]) => mr === r && mc === c)) {
                    cell.classList.add('valid-move');
                    if (piece) cell.classList.add('valid-capture');
                }

                // 代价红点
                if (this.board.capturePositions.some(p => p.row === r && p.col === c)) {
                    cell.classList.add('capture-dot');
                }

                cell.addEventListener('click', () => this.onCellClick(r, c));
                this.boardEl.appendChild(cell);
            }
        }
    }

    /** 点击格子 */
    onCellClick(row, col) {
        if (this.gameOver || this.isThinking) return;
        if (!this.board.redTurn) return; // 不是红方回合

        const piece = this.board.get(row, col);

        // 已选中棋子，尝试走棋
        if (this.selected) {
            const [sr, sc] = this.selected;

            // 点击自己的棋子：切换选中
            if (piece && sameColor(this.board.get(sr, sc), piece)) {
                this.selected = [row, col];
                this.validMoves = getValidMoves(this.board, row, col);
                this.render();
                return;
            }

            // 尝试走到目标位置
            if (this.validMoves.some(([r, c]) => r === row && c === col)) {
                this.makeMove(sr, sc, row, col);
                return;
            }

            // 点击空白/非法位置：取消选中
            this.selected = null;
            this.validMoves = [];
            this.render();
            return;
        }

        // 未选中，选择自己的棋子
        if (piece && isRed(piece)) {
            this.selected = [row, col];
            this.validMoves = getValidMoves(this.board, row, col);
            this.render();
        }
    }

    /** 执行走棋 */
    makeMove(fromRow, fromCol, toRow, toCol) {
        const captured = this.board.grid[toRow][toCol];
        this.board.movePiece(fromRow, fromCol, toRow, toCol);
        this.selected = null;
        this.validMoves = [];
        this.render();
        this.updateCost();

        // 吃子粒子爆裂效果
        if (captured) {
            this.burstCaptureEffect(toRow, toCol, captured);
        }

        // 检查是否将死对方
        if (isCheckmate(this.board, false)) {
            this.endGame('win');
            return;
        }

        // 检查对方是否无子可走（和棋）
        const blackPieces = this.board.getAllPieces(false);
        const hasMove = blackPieces.some(p => getValidMoves(this.board, p.row, p.col).length > 0);
        if (!hasMove) {
            this.endGame('win');
            return;
        }

        this.updateInfo('对方思考中...');
        this.isThinking = true;

        // AI走棋（延迟执行避免UI冻结）
        setTimeout(() => {
            this.doAiMove();
        }, 300);
    }

    /** AI走棋 */
    doAiMove() {
        const level = LEVELS[this.currentLevel];
        const move = aiMove(this.board, level.aiDepth);

        if (move) {
            this.board.movePiece(move.from[0], move.from[1], move.to[0], move.to[1]);
            this.render();
            this.updateCost();

            // 检查红方是否被将死
            if (isCheckmate(this.board, true)) {
                this.endGame('lose');
                return;
            }

            // 检查红方是否无子可走
            const redPieces = this.board.getAllPieces(true);
            const hasMove = redPieces.some(p => getValidMoves(this.board, p.row, p.col).length > 0);
            if (!hasMove) {
                this.endGame('lose');
                return;
            }
        }

        this.isThinking = false;
        this.updateInfo();
    }

    /** 吃子粒子爆发 */
    burstCaptureEffect(row, col, piece) {
        const boardEl = document.getElementById('chess-board');
        const cells = boardEl.querySelectorAll('.cell');
        const cell = cells[row * 9 + col];
        if (!cell) return;

        const rect = cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const isRed = piece.color === 'red';
        const particles = [];

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
            const speed = 3 + Math.random() * 5;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 3 + Math.random() * 4,
                life: 1,
                decay: 0.025 + Math.random() * 0.015,
                color: isRed
                    ? `hsl(${5 + Math.random() * 10}, 80%, ${50 + Math.random() * 20}%)`
                    : `hsl(${40 + Math.random() * 10}, 70%, ${55 + Math.random() * 20}%)`
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15;
                p.life -= p.decay;
                if (p.life > 0) {
                    alive = true;
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            if (alive) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        };
        requestAnimationFrame(animate);
    }

    /** 悔棋 */
    undo() {
        if (this.isThinking) return;
        if (this.board.history.length < 2) return; // 至少撤回两步（AI+玩家）
        this.board.undo(); // 撤回AI
        this.board.undo(); // 撤回玩家
        this.selected = null;
        this.validMoves = [];
        this.gameOver = false;
        this.gameResult = null;
        this.render();
        this.updateInfo();
        this.updateCost();
    }

    /** 更新信息 */
    updateInfo(text) {
        if (text) {
            this.infoEl.textContent = text;
            return;
        }
        if (this.gameOver) return;
        this.infoEl.textContent = this.board.redTurn ? '红方走棋（你的回合）' : '对方思考中...';

        // 将军提示
        if (isInCheck(this.board, true)) {
            this.infoEl.textContent = '⚠ 将军！请应将';
            this.infoEl.classList.add('check');
        } else {
            this.infoEl.classList.remove('check');
        }
    }

    /** 更新代价显示 */
    updateCost() {
        if (this.costEl) {
            const total = this.board.captureCount.red + this.board.captureCount.black;
            this.costEl.textContent = '代价：' + total + '个棋子被吃';
            if (total > 0) this.costEl.classList.add('has-cost');
        }
    }

    /** 游戏结束 */
    endGame(result) {
        this.gameOver = true;
        this.gameResult = result;
        this.isThinking = false;

        const overlay = document.getElementById('endgame-overlay');
        const titleEl = document.getElementById('endgame-title');
        const textEl = document.getElementById('endgame-text');
        const btnEl = document.getElementById('endgame-btn');

        overlay.classList.add('active');

        const level = LEVELS[this.currentLevel];
        const history = level.history;
        const captures = this.board.capturePositions.length;

        if (result === 'win') {
            titleEl.textContent = '胜利';
            let html = '你赢了这一局。<br>但棋盘上留下了 <span class="number-red">' + captures + '</span> 个红点。<br>每一场胜利，都有代价。';
            if (history) {
                html += '<br><br><span style="color:#c9a96e;font-size:0.9em">' +
                    history.event + '</span><br>' +
                    '<span style="color:#e74c3c">' + history.toll + '</span><br>' +
                    '<span style="color:#aaa;font-size:0.85em">' + history.detail + '</span>';
            }
            textEl.innerHTML = html;
            btnEl.textContent = this.currentLevel < LEVELS.length - 1 ? '下一关' : '查看总结';
        } else {
            titleEl.textContent = '失败';
            let html = '这一局你输了。<br>但历史告诉我们：<br>失败是成功之母。';
            if (history) {
                html += '<br><br><span style="color:#c9a96e;font-size:0.9em">' +
                    history.event + '</span><br>' +
                    '<span style="color:#e74c3c">' + history.toll + '</span><br>' +
                    '<span style="color:#aaa;font-size:0.85em">' + history.detail + '</span>';
            }
            textEl.innerHTML = html;
            btnEl.textContent = '再试一次';
        }

        btnEl.onclick = () => {
            overlay.classList.remove('active');
            if (result === 'win') {
                this.loadLevel(this.currentLevel + 1);
            } else {
                this.loadLevel(this.currentLevel);
            }
        };
    }

    /** 最终总结画面 */
    showFinalScreen() {
        const overlay = document.getElementById('endgame-overlay');
        const titleEl = document.getElementById('endgame-title');
        const textEl = document.getElementById('endgame-text');
        const btnEl = document.getElementById('endgame-btn');

        overlay.classList.add('active');
        titleEl.textContent = '长征结束了';
        textEl.innerHTML = '你走完了6关。<br>每一步棋，都是一次选择。<br>每一次吃子，都有代价。<br><br>长征路上，86000人出发，7000人到达。<br>这不是棋局。这是真实发生的事。';
        btnEl.textContent = '返回首页';
        btnEl.onclick = () => {
            if (typeof filmstripTransition === 'function') {
                filmstripTransition('../index.html', null);
            } else {
                window.location.href = '../index.html';
            }
        };
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new ChessGame();
    });
});
