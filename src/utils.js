let curNumDedup = null;
let solutionsFound = 0;

export function generateVeryHardSudoku() {
    while (true) {
        let original = generateFullSudoku();
        let hardSudoku = findHarderSudoku(original);
        printSudoku(hardSudoku);
        let solved = solveEasyMethods(hardSudoku);
        if (!solved) {
            return hardSudoku;
        }
    }
}

// Best effort returns a board filled in with all known values, otherwise nothing is returned for failed solves
function solveEasyMethods(board, bestEffort) {
    board = board.slice(0);
    let possibilities = new Array(81);
    for (let i = 0; i < 9*9; i++) {
        possibilities[i] = new Set();
        if (board[i] !== '-') {
            possibilities[i].add(board[i]);
        } else {
            for (let j = 1; j <= 9; j++) {
                possibilities[i].add(j);
            }
        }
    }

    // generate value subsets
    let valueSubsets = [];
    let values = [1,2,3,4,5,6,7,8,9];
    for (let i = 0; i < (1 << values.length); i++) {
        let thisSet = new Set();
        let curVal = i;
        for (let j = 0; j < values.length; j++) {
            if (curVal & 1) {
                thisSet.add(values[j]);
            }
            curVal = curVal >> 1;
        }
        if (thisSet.size > 0 && thisSet.size < 5) {
            valueSubsets.push(thisSet);
        }
    }

    // generate sets of coordinates
    let sets = [];
    for (let i = 0; i < 9; i++) {
        let rowset = [];
        let colset = [];
        for (let j = 0; j < 9; j++) {
            rowset.push(i + j*9);
            colset.push(j + i*9);
        }
        sets.push(rowset, colset);
    }
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let boxset = [];
            for (let xx = 0; xx < 3; xx++) {
                for (let yy = 0; yy < 3; yy++) {
                    boxset.push((x*3+xx) + (y*3+yy)*9);
                }
            }
            sets.push(boxset);
        }
    }

    let didSomething = true;
    while (didSomething) {
        didSomething = false;
        // check for n values appearing in n squares per set up to n=4, remove those from the rest of the set
        // for each set
        for (let group of sets) {
            // for each subset of values
            for (let valueSubset of valueSubsets) {
                // naked subsets
                // count which squares contain nothing but these values
                if (valueSubset.size < 5) {
                    let squaresContainingOnly = new Set();
                    for (let square of group) {
                        let hasExtraValue = false;
                        for (let value of possibilities[square]) {

                            if (!valueSubset.has(value)) {
                                hasExtraValue = true;
                                break;
                            }
                        }
                        if (!hasExtraValue) {
                            squaresContainingOnly.add(square);
                        }   
                    }
                    // if #squares === #values
                    if (squaresContainingOnly.size === valueSubset.size) {
                        // remove values from all other squares
                        for (let square of group) {
                            if (!squaresContainingOnly.has(square)) {
                                for (let value of valueSubset) {
                                    if (possibilities[square].has(value)) {
                                        didSomething = true;
                                    }
                                    possibilities[square].delete(value);
                                }
                            }
                        }
                    }
                }

                if (valueSubset.size < 5) {
                    // hidden subsets
                    // count which squares contain at least some of the values
                    let squaresContainingSome = new Set();
                    for (let square of group) {
                        let missingValue = false;
                        let hasOne = false;
                        for (let value of valueSubset) {
                            if (!possibilities[square].has(value)) {
                                missingValue = true;
                            } else {
                                hasOne = true;
                            }
                        }
                        if (hasOne) {
                            squaresContainingSome.add(square);
                        }
                    }
                    // if #squares === #values
                    if (squaresContainingSome.size === valueSubset.size) {
                        // remove other values from these squares
                        for (let square of squaresContainingSome) {
                            let newSet = new Set();
                            for (let value of valueSubset) {
                                if (possibilities[square].has(value)) {
                                    newSet.add(value);
                                }
                            }
                            if (possibilities[square].size !== newSet.size) {
                                didSomething = true;
                            }
                            possibilities[square] = newSet;
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < possibilities.length; i++) {
        if (!bestEffort) {
            if (possibilities[i].size !== 1) {
                console.log('Failed to solve');
                return;
            }
        }
        if (possibilities[i].size !== 1) {
            board[i] = '-';
        } else {
            board[i] = possibilities[i].values().next().value;
        }
    }
    return board;
}

// count number of digits in sudoku
function numNumbers(grid) {
    let cnt = 0;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] !== '-') {
            cnt++;
        }
    }
    return cnt;
}

// generate a random filled sudoku with no blanks
function generateFullSudoku() {
    let grid = new Array(9*9);
    grid.fill('-')
    return solveSudoku(grid, false);
}

// given a sudoku, find a minimal sudoku guaranteed to be at least as hard as the original
function findHarderSudoku(grid) {
    grid = grid.slice(0);
    const checkedMap = new Map();
    for (let j = 0; j < 10000; j++) {
        let i = Math.floor(Math.random() * 9*9);
        if (checkedMap.has(i)) {
            continue;
        }
        checkedMap.set(i, true);
        console.log(checkedMap.size);
        if (grid[i] === '-') {
            continue;
        }
        let val = grid[i];
        grid[i] = '-';
        if (!hasMultiSolutions(grid)) {
            continue;
        }
        grid[i] = val;
    }
    return grid;
}

// Only remove 40 values, so probably an easy to solve sudoku but this is not guaranteed, just for testing
function findEasySudoku(grid) {
    grid = grid.slice(0);
    const checkedMap = new Map();
    for (let j = 0; j < 40; j++) {
        let i = Math.floor(Math.random() * 9*9);
        if (checkedMap.has(i)) {
            continue;
        }
        checkedMap.set(i, true);
        console.log(checkedMap.size);
        if (grid[i] === '-') {
            continue;
        }
        let val = grid[i];
        grid[i] = '-';
        if (!hasMultiSolutions(grid)) {
            continue;
        }
        grid[i] = val;
    }
    return grid;
}

function printSudoku(grid) {
    for (let i = 0; i < 9; i++) {
        console.log(grid.slice(i*9, i*9+9).join(''));
    }
}

function findNumSolutions(grid) {
    solutionsFound = 0;
    solveSudoku(grid, true);
    return solutionsFound;
}

// check if sudoku has multiple solutions, stop after first 2 found
function hasMultiSolutions(grid) {
    grid = solveEasyMethods(grid, true);
    solutionsFound = 0;
    solveSudoku(grid, true, true);
    return solutionsFound !== 1;
}

// solves sudoku, check for how many solutions, and only check for at most 2 solutions
function solveSudoku(grid, multiSolution, max2Solutions) {
    if (grid.length !== 9*9) {
        return 'Incorrect size';
    }

    if (!isValidSudoku(grid)) {
        return 'Invalid';
    }

    for (let i = 0; i < 9*9; i++) {
        if (grid[i] === '-') {
            const cloneGrid = grid.slice(0);
            const offset = Math.floor(Math.random() * 9);
            for (let j = 1; j <= 9; j++) {
                cloneGrid[i] = ((j + offset) % 9) + 1;
                let solved = solveSudoku(cloneGrid, multiSolution, max2Solutions);
                if (solved !== 'Invalid' && (!multiSolution || (multiSolution && max2Solutions && solutionsFound >= 2))) {
                    return solved;
                }
            }
            return 'Invalid';
        }
    }
    if (multiSolution) {
        solutionsFound++;
    }
    return grid;
}

function resetMap() {
    curNumDedup = new Array(10);
}

function checkValue(val) {
    if (val === '-') {
        return true;
    }
    if (curNumDedup[val]) {
        return false;
    }
    curNumDedup[val] = true;
    return true;
}

// check that sudoku has valid filled in values (no conflicting numbers)
function isValidSudoku(grid) {
    for (let i = 0; i < 9; i++) {
        resetMap();
        for (let j = 0; j < 9; j++) {
            if (!checkValue(grid[i*9+j])) {
                return false;
            }
        }
        resetMap();
        for (let j = 0; j < 9; j++) {
            if (!checkValue(grid[j*9+i])) {
                return false;
            }
        }
    }
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            resetMap();
            for (let u = 0; u < 3; u++) {
                for (let v = 0; v < 3; v++) {
                    if (!checkValue(grid[x*3 + u + (y*3 + v)*9])) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}