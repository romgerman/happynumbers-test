'use strict';

const N = 4
const TOTAL = 10

const expressionResults = []
let currentExpressionIndex = 0

function toggleDoneButton(active) {
    /** @type {HTMLButtonElement} */
    const btn = document.getElementById('done-btn')
    btn.disabled = !active
}

/**
 * @param {number} left
 * @param {number} right
 */
function createExpression(left, right) {
    /** @type {HTMLTemplateElement} */
    const template = document.getElementById('expression')

    /** @type {HTMLElement} */
    const node = template.content.firstElementChild.cloneNode(true)
    const left_op = node.querySelector('.expression__left')
    const right_op = node.querySelector('.expression__right')

    left_op.textContent = `${left}`
    right_op.textContent = `${right}`

    /** @type {HTMLInputElement} */
    const input = node.querySelector('input')
    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            toggleDoneButton(true)
        } else {
            toggleDoneButton(false)
        }
    });

    expressionResults.push(left * right);

    return node
}

function appendExpression(exprNode) {
    const column = document.getElementById('expression-column')
    column.appendChild(exprNode)
}

function showExpression(index) {
    const allExprs = document.querySelectorAll('.expression')
    allExprs.item(index).classList.add('visible')
}

function getExpressionResult(index) {
    const allExprs = document.querySelectorAll('.expression')
    return allExprs.item(index).querySelector('input').value
}

let timeoutHandle = 0

function markExpressionAsWrong(index) {
    /** @type {HTMLButtonElement} */
    const btn = document.getElementById('done-btn')
    btn.classList.add('wrong')
    highlightExpressionErroneously(index)
}

function markExpressionAsRight(index) {
    /** @type {HTMLButtonElement} */
    const btn = document.getElementById('done-btn')
    btn.classList.add('right')
}

function clearExpressionStyles(index) {
    /** @type {HTMLButtonElement} */
    const btn = document.getElementById('done-btn')
    btn.classList.remove('right')
    btn.classList.remove('wrong')
}

function highlightExpressionErroneously(index) {
    const allExprs = document.querySelectorAll('.expression')
    const expr = allExprs.item(index)
    const input = expr.querySelector('input')

    if (input.classList.contains('error')) {
        clearTimeout(timeoutHandle);
    } else {
        input.classList.add('error')
    }

    setTimeout(() => {
        input.classList.remove('error');
    }, 1000);
}

function disableExpression(index) {
    const allExprs = document.querySelectorAll('.expression')
    const input = allExprs.item(index).querySelector('input')
    const text = document.createElement('span')
    text.classList.add('result')
    text.textContent = input.value
    input.replaceWith(text)
}

function showNextExpression() {
    clearExpressionStyles(currentExpressionIndex)
    toggleDoneButton(false)
    disableExpression(currentExpressionIndex)
    appendVisualRow()

    if (++currentExpressionIndex != TOTAL) {
        showExpression(currentExpressionIndex)
    }
}

function createVisualRow() {
    /** @type {HTMLTemplateElement} */
    const template = document.getElementById('visual-row')

    /** @type {HTMLElement} */
    const node = template.content.firstElementChild.cloneNode(true)
    return node
}

function appendVisualRow() {
    const column = document.getElementById('visual-column')
    column.appendChild(createVisualRow())
}

function init() {
    const doneBtn = document.getElementById('done-btn')
    doneBtn.addEventListener('click', () => {
        const result = getExpressionResult(currentExpressionIndex)
        if (Number(result) == expressionResults[currentExpressionIndex]) {
            showNextExpression()
            markExpressionAsRight(currentExpressionIndex)
        } else {
            markExpressionAsWrong(currentExpressionIndex)
        }
    });


    for (let i = 1; i <= TOTAL; i++) {
        const expr = createExpression(N, i, i - 1)
        appendExpression(expr)
    }

    showExpression(currentExpressionIndex = 0)
}

init()
