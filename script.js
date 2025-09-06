let display = document.getElementById('result');
let currentInput = '0';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;
let displayExpression = '0';

function updateDisplay() {
    display.value = displayExpression;
}

function appendToDisplay(value) {
    if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
        return;
    }
    
    if (shouldResetDisplay) {
        // 新しい計算を開始する場合
        if (displayExpression === currentInput) {
            displayExpression = value;
            currentInput = value;
        } else {
            // 演算子の後の数値入力の場合
            displayExpression += value;
            currentInput = value;
        }
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
        if (displayExpression === '0') {
            displayExpression = value;
        } else {
            // 最後の文字が'0'の場合、それを置き換える
            if (displayExpression.endsWith('0') && displayExpression.length > 1) {
                displayExpression = displayExpression.slice(0, -1) + value;
            } else {
                displayExpression += value;
            }
        }
    } else {
        if (value === '.' && currentInput.includes('.')) {
            return;
        }
        currentInput += value;
        displayExpression += value;
    }
    
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    displayExpression = '0';
    updateDisplay();
}

function deleteLast() {
    if (displayExpression.length > 1) {
        displayExpression = displayExpression.slice(0, -1);
        // currentInputも更新（最後の数字部分のみ）
        let parts = displayExpression.split(/[\+\-\*\/]/);
        currentInput = parts[parts.length - 1].trim() || '0';
    } else {
        displayExpression = '0';
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    if (operator && previousInput !== '' && currentInput !== '') {
        let prev = parseFloat(previousInput);
        let curr = parseFloat(currentInput);
        let result;
        
        switch (operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr === 0) {
                    alert('0で割ることはできません');
                    return;
                }
                result = prev / curr;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        displayExpression = result.toString();
        if (currentInput.length > 12) {
            currentInput = parseFloat(result).toExponential(6);
            displayExpression = currentInput;
        }
        
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

function handleOperator(op) {
    if (operator && previousInput !== '' && !shouldResetDisplay) {
        // 連続演算の場合、内部で計算するが表示は更新しない
        let prev = parseFloat(previousInput);
        let curr = parseFloat(currentInput);
        let result;
        
        switch (operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr === 0) {
                    alert('0で割ることはできません');
                    return;
                }
                result = prev / curr;
                break;
            default:
                return;
        }
        
        // 結果を内部で保持するが、displayExpressionは更新しない
        currentInput = result.toString();
        previousInput = currentInput;
    } else {
        previousInput = currentInput;
    }
    
    operator = op;
    
    // 演算子を表示に追加
    let displayOp = op === '*' ? '×' : op === '/' ? '÷' : op;
    displayExpression += displayOp;
    updateDisplay();
    
    shouldResetDisplay = true;
}