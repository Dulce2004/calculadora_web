import React from 'react';
import { useState } from 'react';
import './calculadora.css';

function Calculadora({ initialDisplay = '0' }) {
  const [displayValue, setDisplayValue] = useState(initialDisplay);
  const [previousValue, setPreviousValue] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num) => {
    if (displayValue === 'ERROR') {
      setDisplayValue(num);
      setWaitingForNewValue(false);
      return;
    }

    if (waitingForNewValue) {
      setDisplayValue(num);
      setWaitingForNewValue(false);
    } else {
      const newValue = displayValue === '0' ? num : displayValue + num;
      if (newValue.length > 9) {
        return;
      }
      setDisplayValue(newValue);
    }
  };

  const handleDecimal = () => {
    if (displayValue === 'ERROR') {
      setDisplayValue('0.');
      setWaitingForNewValue(false);
      return;
    }

    if (waitingForNewValue) {
      setDisplayValue('0.');
      setWaitingForNewValue(false);
    } else {
      const hasDecimal = displayValue.includes('.');
      if (!hasDecimal && displayValue.length < 9) {
        const newValue = displayValue + '.';
        setDisplayValue(newValue);
      }
    }
  };

  const handleOperation = (op) => {
    if (displayValue === 'ERROR') return;

    const currentNumber = parseFloat(displayValue);

    if (previousValue !== null && currentOperation) {
      const result = computeResult(previousValue, currentNumber, currentOperation);
      if (!checkResult(result)) {
        setDisplayValue('ERROR');
        resetState();
        return;
      }
      const formattedResult = formatResult(result);
      setDisplayValue(formattedResult);
      setPreviousValue(result);
    } else {
      setPreviousValue(currentNumber);
    }

    setCurrentOperation(op);
    setWaitingForNewValue(true);

    
  };

  const handleEquals = () => {
    if (displayValue === 'ERROR') return;

    if (currentOperation && previousValue !== null) {
      const currentNumber = parseFloat(displayValue);
      const result = computeResult(previousValue, currentNumber, currentOperation);
      if (!checkResult(result)) {
        setDisplayValue('ERROR');
      } else {
        const formattedResult = formatResult(result);
        setDisplayValue(formattedResult);
      }
      resetState();
    }
  };

  const handleSign = () => {
    if (displayValue === 'ERROR') return;

    let newValue;
    if (displayValue.startsWith('-')) {
      newValue = displayValue.slice(1); 
    } else {
      if (displayValue.length >= 9) return; 
      newValue = `-${displayValue}`;
    }

    if (newValue.length > 9) return; 
    setDisplayValue(newValue);
  };
  

  const computeResult = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? Infinity : a / b;
      case '%': return b === 0 ? Infinity : a % b;
      default: return b;
    }
  };

  const checkResult = (result) => result >= 0 && result <= 999999999;

  const formatResult = (result) => {
    let resultStr = result.toString();

    if (resultStr.includes('e')) {
      resultStr = result.toFixed(9).replace(/\.?0+$/, '');
    }

    if (resultStr.length > 9) {
      resultStr = resultStr.substring(0, 9);
      
      if (resultStr.endsWith('.')) {
        resultStr = resultStr.slice(0, -1);
      }
      
      if (resultStr.includes('.')) {
        const [integer, decimal] = resultStr.split('.');
        resultStr = `${integer}.${decimal.slice(0, 9 - integer.length - 1)}`;
      }
    }

    return resultStr;
  };

  const resetState = () => {
    setPreviousValue(null);
    setCurrentOperation(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    resetState();
  };

  return (
    <div className="calculator">
      <div className="display" data-testid="display">{displayValue}</div>
      <div className="buttons">
        <button className="clear" onClick={handleClear}>C</button>
        <button onClick={() => handleOperation('*')}>×</button>
        <button onClick={() => handleOperation('-')}>-</button>
        <button onClick={() => handleOperation('+')}>+</button>
        <button onClick={() => handleOperation('/')}>÷</button>
        <button onClick={() => handleOperation('%')}>%</button>

        <button onClick={() => handleNumber('7')}>7</button>
        <button onClick={() => handleNumber('8')}>8</button>
        <button onClick={() => handleNumber('9')}>9</button>

        <button onClick={() => handleNumber('4')}>4</button>
        <button onClick={() => handleNumber('5')}>5</button>
        <button onClick={() => handleNumber('6')}>6</button>

        <button onClick={() => handleNumber('1')}>1</button>
        <button onClick={() => handleNumber('2')}>2</button>
        <button onClick={() => handleNumber('3')}>3</button>

        <button onClick={() => handleDecimal()}>.</button>

        <button onClick={handleSign}>+/-</button>

        <button className="span-2" onClick={() => handleNumber('0')}>0</button>
        <button className="equals" onClick={handleEquals}>=</button>
        
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

Calculadora.propTypes = {
  initialDisplay: PropTypes.string
};

export default Calculadora;
