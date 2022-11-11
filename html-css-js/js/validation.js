/*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    AKAI Frontend Task - Javascript

    W tym zadaniu postaraj się zaimplementować metody, które sprawdzą, czy dane wprowadzone
    do formularza są poprawne. Przykładowo: czy imię i nazwisko zostało wprowadzone.
    Możesz rozwinąć walidację danych tak bardzo, jak tylko zapragniesz.

    Powodzenia!
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// [!] Code needs a LOT of cleaning and refactoring (guard clauses, etc), but I ran out of time... :<
// But it serves its purpose. :>

const throttle = (cb, delay = 1000) => {
    let wait = false
    let waiting_args

    const timeout_func = () => {
        if (waiting_args == null) {
            wait = false
        } else {
            cb(...waiting_args)
            waiting_args = null
            setTimeout(timeout_func, delay)
        }
    }

    return (...args) => {
        if (wait) {
            waiting_args = args
            return
        }

        cb(...args)
        wait = true

        setTimeout(timeout_func, delay)
    }
}

// solution isn't too universal and probably overengineered, but it serves its purpouse
const form = document.querySelector('form#recruitment')
const submit = form.querySelector('input[type=submit]') || form.querySelector('button[type=submit]')
const fieldsets = form.querySelectorAll('fieldset')

// lock before interaction
submit.disabled = true

const show_error = (input_group, error_msg = 'Wprowadź poprawne dane') => {
    const error_box = input_group.querySelector('span.error')
    error_box.innerText = error_msg
    input_group.classList.add('invalid')
}

const check_form_validity = throttle(() => {
    const invalid = form.querySelectorAll('.invalid').length > 0 ? 1 : 0
    submit.disabled = invalid;
})

const check__basic_validity = (input_group) => {
    const value = input_group.querySelector('input').value
    if (value.length < 1) {
        show_error(input_group, 'Pole nie może być puste')
        return false
    }
    return true
}

const check_email_validity = (input_group) => {
    const value = input_group.querySelector('input').value
    // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    const email_validator = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!value.match(email_validator)) {
        show_error(input_group)
        return false
    }
    return true
}

const check_at_least_one = (input_groups) => {
    return input_groups.some(input_group => {
        let input = input_group.querySelector('input')
        return input.checked
    })
}

for (const fieldset of fieldsets) {
    const validity_rule = fieldset.getAttribute('data-validity-rule')

    if (validity_rule === 'at-least-one') {
        fieldset.classList.add('invalid') // fail first time

        const input_groups = fieldset.querySelectorAll('.input__group')

        for (const input_group of input_groups) {
            const input = input_group.querySelector('input')
            
            input.addEventListener('change', () => {
                let valid = check_at_least_one([...input_groups])

                fieldset.classList.toggle('invalid', !valid)

                check_form_validity()
            })
        }
    } else {
        const input_groups = fieldset.querySelectorAll('.input__group')
    
        for (const input_group of input_groups) {
            const input = input_group.querySelector('input')
    
            // `focus` and `input` could be used better for better UX
            input.addEventListener('input', () => { check_form_validity() })
            input.addEventListener('focus', () => { check_form_validity() })

            input.addEventListener('blur', e => {
                let valid = true
    
                valid = check__basic_validity(input_group) // if in input, should be throttled too
                if (input.type === 'email') valid = check_email_validity(input_group) // if in input, should be throttled too
    
                if (valid) input_group.classList.remove('invalid')
    
                check_form_validity()
            })
        }
    }
}

form.addEventListener('submit', e => {
    e.preventDefault()

    const fields = form.elements

    const data = {
        first_name: fields['first-name'],
        last_name: fields['last-name'],
        email: fields.email,
        section: [[...fields]
                 .filter(field => field.name === 'section' && field.checked)
                 .map(field => field.value)]
    }

    console.log(data)
})