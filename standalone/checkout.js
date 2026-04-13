document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const planRadios = document.querySelectorAll('input[name="plan"]');
    const planCards = document.querySelectorAll('.plan-card');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectedPlanPrice = document.getElementById('selectedPlanPrice');
    const selectedPlanInput = document.getElementById('selectedPlanInput');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const creditCardFields = document.getElementById('creditCardFields');
    const idealFields = document.getElementById('idealFields');
    const paypalFields = document.getElementById('paypalFields');
    const paymentForm = document.getElementById('paymentForm');

    const planPrices = {
        starter: '€4,99',
        pro: '€9,99',
        unlimited: '€14,99'
    };

    const planLabels = {
        starter: 'Starter',
        pro: 'Pro',
        unlimited: 'Unlimited'
    };

    function updatePlanSelection(planKey) {
        planCards.forEach(card => {
            card.classList.toggle('selected', card.dataset.plan === planKey);
            const radio = card.querySelector('input[name="planCard"]');
            if (radio) radio.checked = card.dataset.plan === planKey;
        });

        selectedPlanName.textContent = planLabels[planKey];
        selectedPlanPrice.textContent = planPrices[planKey];
        selectedPlanInput.value = planKey;
        checkoutBtn.textContent = `Betaal ${planPrices[planKey]}`;

        planRadios.forEach(radio => {
            if (radio.value === planKey) radio.checked = true;
        });
    }

    planCards.forEach(card => {
        card.addEventListener('click', () => {
            updatePlanSelection(card.dataset.plan);
        });
    });

    planRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                updatePlanSelection(radio.value);
            }
        });
    });

    function setPaymentFieldsEnabled(field, enabled) {
        field.querySelectorAll('input, select, textarea').forEach(element => {
            element.disabled = !enabled;
        });
    }

    function hideAllPaymentFields() {
        [creditCardFields, idealFields, paypalFields].forEach(field => {
            field.style.display = 'none';
            setPaymentFieldsEnabled(field, false);
        });
    }

    function showPaymentField(field) {
        hideAllPaymentFields();
        field.style.display = 'block';
        setPaymentFieldsEnabled(field, true);
    }

    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            switch (this.value) {
                case 'creditcard':
                    showPaymentField(creditCardFields);
                    break;
                case 'ideal':
                    showPaymentField(idealFields);
                    break;
                case 'paypal':
                    showPaymentField(paypalFields);
                    break;
            }
        });
    });

    hideAllPaymentFields();
    showPaymentField(creditCardFields);

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedPlan = selectedPlanInput.value || 'pro';
        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

        if (selectedPayment === 'ideal') {
            window.location.href = 'ideal.html';
            return;
        }

        if (selectedPayment === 'paypal') {
            window.location.href = 'paypal.html';
            return;
        }

        localStorage.setItem('paid', 'true');
        localStorage.setItem('plan', selectedPlan);
        window.location.href = 'success.html';
    });

    updatePlanSelection('pro');
});
