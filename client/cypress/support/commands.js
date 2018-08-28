// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************


Cypress.Commands.add('login', (email, pass) => {
    cy.get('ion-input[name=email]').then((input) => {
        const inputEmail = input[0].shadowRoot.querySelector("input");
        inputEmail.value = email;
    });

    //cy.get('ion-input[name=password]').shadowDom('input').get('input').type(pass);

    cy.get('ion-input[name=password]').then((data) => {
        let currentElement = data[0].shadowRoot.querySelector('input');
        cy.wrap(currentElement).type(pass);
    });
        

    cy.wait(1000);

    cy.get('app-login form').submit();
})

Cypress.Commands.add("shadowDom", { prevSubject: true }, (subject, input) => {
    let currentElement = subject[0].shadowRoot.querySelector(input);
    return cy.wrap(currentElement);
});