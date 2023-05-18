//Creando las variables que vamos a utilizar
const calculate = (n1, operacion, n2) => {
  const num1 = parseFloat(n1);
  const num2 = parseFloat(n2);
  let resultado = num1;
  if (operacion === 'suma') return num1 + num2;
  if (operacion === 'resta') return num1 - num2;
  if (operacion === 'multiplicacion') return num1 * num2;
  if (operacion === 'division') return num1 / num2;
  if (operacion === 'porcentaje') return num1 * num2 / 100;
  if (operacion === 'cuadrado') return Math.pow(num1, num2)
  if (operacion === 'raizcuadrada') return Math.sqrt(num1);
};


// Tipos de acciones con las operaciones que hemos indicado anteriormente
const getKeyType = key => {
  const { action } = key.dataset;
  if (!action) return 'number';
  if (
    action === 'suma' ||
    action === 'resta' ||
    action === 'multiplicacion' ||
    action === 'division' ||
    action === 'porcentaje' ||
    action === 'cuadrado' ||
    action === 'raizcuadrada')
    return 'operacion';
  return action;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const {
    firstValue,
    operacion,
    modValue,
    previousKeyType } =
    state;


  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operacion' ||
      previousKeyType === 'calculate' ?
      keyContent :
      displayedNum + keyContent;
  }

  // Indicar que realiza si el usuario decide poner un numero decimal
  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.';
    if (previousKeyType === 'operacion' || previousKeyType === 'calculate') return '0.';
    return displayedNum;
  }

  //Ralizar la operacion
  if (keyType === 'operacion') {
    return firstValue &&
      operacion &&
      previousKeyType !== 'operacion' &&
      previousKeyType !== 'calculate' ?
      calculate(firstValue, operacion, displayedNum) :
      displayedNum;
  }

  //Si se pulsa clear se borre los datos de la calculadora
  if (keyType === 'clear') return 0;

  if (keyType === 'calculate') {
    return firstValue ?
      previousKeyType === 'calculate' ?
        calculate(displayedNum, operacion, modValue) :
        calculate(firstValue, operacion, displayedNum) :
      displayedNum;
  }
};

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key);
  const {
    firstValue,
    operacion,
    modValue,
    previousKeyType } =
    calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === 'operacion') {
    calculator.dataset.operacion = key.dataset.action;
    calculator.dataset.firstValue = firstValue &&
      operacion &&
      previousKeyType !== 'operacion' &&
      previousKeyType !== 'calculate' ?
      calculatedValue :
      displayedNum;
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' ?
      modValue :
      displayedNum;
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operacion = '';
    calculator.dataset.previousKeyType = '';
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

  if (keyType === 'operacion') key.classList.add('is-depressed');
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]');
    clearButton.textContent = 'CE';
  }
};

const calculator = document.querySelector('.calculator');
const display = calculator.querySelector('.calculator__display');
const keys = calculator.querySelector('.calculator__keys');

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(key, displayedNum, calculator.dataset);

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});