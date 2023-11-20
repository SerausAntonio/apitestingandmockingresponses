/// <reference types="cypress" />
describe("Signup & Login", () => {

    it("Validate get - response", () => {
        cy.visit("/");

        cy.request({
            method: "GET",
            url: 'https://api.realworld.io/api/tags'

        }).then(response => {
            cy.wrap(response.body.tags).its('length').should('eq', 10);

        });
    })

    it.only('Validate Login', () => {
        cy.visit("/");
        let email = "pp123@gmail.com"
       
        cy.intercept({
            method: "POST",
            url: "https://api.realworld.io/api/users/login"
        
        }).as('login')

        cy.get('a[href*="login"]').click();
        cy.get('[placeholder="Email"]').type(email)
        cy.get('[placeholder="Password"]').type('cypress123');
        cy.get('button').contains('Sign in').click();


        cy.wait('@login').then(({request,response}) => {

            console.log("Request: " + JSON.stringify(request));
            console.log("Response: " + JSON.stringify(response));

            expect(response.statusCode).to.eq(200);
            expect(request.body.user.email).to.eq(email);
           
            console.log("Token " + response.body.user.token)
        
        })

        
    })

    it('validate register new user', () => {

        cy.visit("/");
    
        cy.intercept({

            method: "POST",
            url: "https://api.realworld.io/api/users"
    
        }).as('newUser')

        let randomString = Math.random().toString(36).substring(2);
        let username = "Auto" + randomString;
        let email = "Auto_email" + randomString + "@test.nl";
        cy.get('a[href*="/register"]').click();
        cy.get('[placeholder="Username"]').type(username);
        cy.get('[placeholder="Email"]').type(email);
        cy.get('[placeholder="Password"]').type("cypress123")
        cy.get('button.btn').contains('Sign up').click();


        cy.wait('@newUser').then(({request,response}) => {

            console.log("Request: " + JSON.stringify(request));
            console.log("Response: " + JSON.stringify(response));

            expect(response.statusCode).to.eq(201);
            expect(request.body.user.username).to.eq(username);
            expect(response.body.user.email).to.eq(email);
            console.log("Token " + response.body.user.token)
        
        })
    
        
    })

})