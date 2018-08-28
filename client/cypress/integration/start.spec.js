/// <reference types="cypress" /> 

describe('Start', () => {
    const email = 'test@test.com';
    const pass = 'test1234';

    beforeEach(() => {
        cy.visit('http://localhost:4200');
    });

    it('login an existing user', () => {      
        // Assert URL
        cy.url().should('include', 'login');
    
        // Fill out the form
        cy.login(email, pass);
    });

});