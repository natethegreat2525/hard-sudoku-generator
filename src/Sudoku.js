import React from 'react';

class Sudoku extends React.Component {

    renderCell(value) {
        return (
            <div style={{
                width: 50,
                height: 50,
                font: '37px Arial, sans-serif',
                border: '1px solid black',
                display: 'inline-block',
            }}><div style={{
                position: 'relative',
                top: 6,
                color: value === '-' ? 'white' : 'black',
            }}>{value}</div></div>
        )
    }

    renderBlockCells(arr) {
        let cells = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                cells.push(this.renderCell(arr[j + i*3]));
            }
            cells.push(<br/>)
        }
        return cells;
    }

    renderSubBlock(arr) {
        return (
            <div style={{border: '1px solid black', display: 'inline-block'}}>{
                this.renderBlockCells(arr)
            }</div>
        );
    }

    renderAllBlocks(parsed) {
        let blocks = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let nums = [];
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        nums.push(parsed[(j*3+l) + (i*3+k)*9]);
                    }
                }
                blocks.push(this.renderSubBlock(nums));
            }
            blocks.push(<br/>);
        }
        return blocks;
    }
    render() {
        return (
            <div style={{border: '1px solid black', display: 'inline-block'}}>
                {this.renderAllBlocks(this.props.board)}
            </div>
        );
    }
}

export default Sudoku;
