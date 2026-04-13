// Calculator Widget JavaScript
(function() {
    // Inject CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'calculator-widget.css';
    document.head.appendChild(cssLink);

    // Create widget HTML
    const widgetHTML = `
        <div class="calculator-widget" id="calculatorWidget">
            <div class="calculator-widget-header" id="calculatorWidgetHeader">
                <h3>Rekenmachine</h3>
                <button class="calculator-widget-close" id="calculatorWidgetClose">&times;</button>
            </div>
            <div class="calculator-display">
                <input type="text" id="calculatorDisplay" value="0" readonly>
            </div>
            <div class="calculator-buttons">
                <button class="calculator-btn" data-value="C">C</button>
                <button class="calculator-btn" data-value="±">±</button>
                <button class="calculator-btn" data-value="%">%</button>
                <button class="calculator-btn operator" data-value="/">÷</button>
                <button class="calculator-btn" data-value="7">7</button>
                <button class="calculator-btn" data-value="8">8</button>
                <button class="calculator-btn" data-value="9">9</button>
                <button class="calculator-btn operator" data-value="*">×</button>
                <button class="calculator-btn" data-value="4">4</button>
                <button class="calculator-btn" data-value="5">5</button>
                <button class="calculator-btn" data-value="6">6</button>
                <button class="calculator-btn operator" data-value="-">-</button>
                <button class="calculator-btn" data-value="1">1</button>
                <button class="calculator-btn" data-value="2">2</button>
                <button class="calculator-btn" data-value="3">3</button>
                <button class="calculator-btn operator" data-value="+">+</button>
                <button class="calculator-btn zero" data-value="0">0</button>
                <button class="calculator-btn" data-value=".">.</button>
                <button class="calculator-btn equals" data-value="=">=</button>
            </div>
        </div>
        <button class="calculator-widget-toggle" id="calculatorWidgetToggle">🧮</button>
    `;

    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get elements
    const widget = document.getElementById('calculatorWidget');
    const toggle = document.getElementById('calculatorWidgetToggle');
    const close = document.getElementById('calculatorWidgetClose');
    const display = document.getElementById('calculatorDisplay');
    const buttons = document.querySelectorAll('.calculator-btn');
    const header = document.getElementById('calculatorWidgetHeader');

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;

    // Update display
    function updateDisplay() {
        display.value = currentInput;
    }

    // Handle button clicks
    function handleButtonClick(value) {
        switch (value) {
            case 'C':
                currentInput = '0';
                previousInput = '';
                operation = null;
                shouldResetDisplay = false;
                break;
            case '±':
                currentInput = (parseFloat(currentInput) * -1).toString();
                break;
            case '%':
                currentInput = (parseFloat(currentInput) / 100).toString();
                break;
            case '=':
                if (operation && previousInput !== '') {
                    const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operation);
                    currentInput = result.toString();
                    previousInput = '';
                    operation = null;
                    shouldResetDisplay = true;
                }
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                if (operation && !shouldResetDisplay) {
                    const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operation);
                    currentInput = result.toString();
                }
                operation = value;
                previousInput = currentInput;
                shouldResetDisplay = true;
                break;
            default:
                if (shouldResetDisplay) {
                    currentInput = value;
                    shouldResetDisplay = false;
                } else {
                    currentInput = currentInput === '0' ? value : currentInput + value;
                }
                break;
        }
        updateDisplay();
    }

    // Calculate function
    function calculate(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return b;
        }
    }

    // Event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleButtonClick(button.dataset.value);
        });
    });

    // Toggle widget
    toggle.addEventListener('click', () => {
        widget.classList.toggle('open');
    });

    close.addEventListener('click', () => {
        widget.classList.remove('open');
    });

    // Make widget draggable
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let widgetStartX = 0;
    let widgetStartY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = widget.getBoundingClientRect();
        widgetStartX = rect.left;
        widgetStartY = rect.top;
        widget.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        const newLeft = widgetStartX + deltaX;
        const newTop = widgetStartY + deltaY;

        // Keep widget within viewport
        const maxLeft = window.innerWidth - widget.offsetWidth;
        const maxTop = window.innerHeight - widget.offsetHeight;

        widget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        widget.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            widget.style.cursor = 'default';
        }
    });

    // Prevent text selection during drag
    header.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });

    // Initialize
    updateDisplay();

})();