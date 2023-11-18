/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('logMeIn', (email, password) => {
    cy.get('[placeholder="Email"]').type(email);
    cy.get('[placeholder="Password"]').type(password);
    cy.get('.btn').contains('Sign in').click();


})

Cypress.Commands.add('logInToApplication', (email, password) => {
    const userCredentials = {

        "user": {
            "email": "pp123@gmail.com",
            "password": "cypress123"

        }


    }

    cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
    .its('body').then(body=>{
        const token = body.user.token;
        cy.wrap(token).as('token');
        cy.visit('/', {
            onBeforeLoad(win){
                win.localStorage.setItem('jwtToken',token);
            }
        })
    })
    // cy.get('[placeholder="Email"]').type(email);
    // cy.get('[placeholder="Password"]').type(password);
    // cy.get('.btn').contains('Sign in').click();


})