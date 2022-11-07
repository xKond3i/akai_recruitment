/*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    AKAI Frontend Task - Javascript

    W tym zadaniu postaraj się zaimplementować metody, które sprawdzą, czy dane wprowadzone
    do formularza są poprawne. Przykładowo: czy imię i nazwisko zostało wprowadzone.
    Możesz rozwinąć walidację danych tak bardzo, jak tylko zapragniesz.

    Powodzenia!
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// solution isn't too universal and probably overengineered, but it serves its purpouse
const form = document.querySelector('form#recruitment')
const fieldsets = form.querySelectorAll('fieldset')
const input_groups = form.querySelectorAll('.input__group')

let form_valid = true

const validity_rules = [{field: 'text', rule: check_text_validity}, {field: 'email', rule: check_email_validity}, {type: 'at-least-one', rule: check_at_least_one_validity}]

function check_text_validity(value) {
    if (value.length == 0) return false
    return true
}

function check_email_validity(value) {
    if (value.length == 0) return false
    // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    const email_validator = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!value.match(email_validator)) return false
    return true
}

function check_at_least_one_validity(fieldset) {
    // todo
}

form.addEventListener('submit', e => {
    e.preventDefault()

    form_valid = true
    // check validity based on fieldset and field

    for (const input_group of input_groups) {
        const input = input_group.querySelector('input')

        for (const rule of validity_rules) {
            if (input.type !== rule.field) continue

            let field_valid = rule.rule(input.value)
            if (!field_valid) form_valid = false
            input_group.classList.toggle('invalid', !field_valid)
            // we could also change error text, but validity functions would have to provide that
            break
        }
    }
})

// TBC