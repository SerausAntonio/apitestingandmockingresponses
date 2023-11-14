/// <reference types = "cypress" />

describe("First Api test", () => {

    beforeEach('Log me in', () => {
        cy.visit('/login');
        // cy.get('.nav-link').click();

    })

    it('Verify Sign Up with wrong credentialsto conduit - application', () => {
        cy.get('a[href$="/register"]').eq(0).click();

        cy.get('a.navbar-brand').contains('conduit');
        cy.get('.auth-page').find('h1.text-xs-center').contains('Sign up')
        cy.get('[placeholder="Username"]').type('xxxxx')
        cy.get('[placeholder="Email"]').type("yyyyyy")

        cy.get('[placeholder="Password"]').type("zzzzz")
        cy.get('.btn').contains('Sign up').click();
        cy.get('ul.error-messages').contains('username has already been taken');
    })

    it('Sign Up with valid credential conduit - application', () => {
        cy.get('a[href$="/register"]').eq(0).click();

        cy.get('a.navbar-brand').contains('conduit');
        cy.get('.auth-page').find('h1.text-xs-center').contains('Sign up')
        cy.get('[placeholder="Username"]').type('Spiderman')
        cy.get('[placeholder="Email"]').type('pp123@gmail.com')

        cy.get('[placeholder="Password"]').type("cypress123")
        cy.get('.btn').contains('Sign up').click();
        cy.get('ul.error-messages').contains('username has already been taken');
    })
    it('Login with invalid credentials', () => {

        cy.get('a[href$="login"]').click();
        cy.get('input[placeholder="Email"]').invoke('attr', 'formcontrolname').should('eq', 'email');
        cy.get('input[placeholder="Password"]').invoke('attr', 'formcontrolname').should('eq', 'password')
        cy.get('.btn').contains('Sign in')

        cy.get('[placeholder="Email"]').type("peter");
        cy.get('[placeholder="Password"]').type('Parker');
        cy.get('.btn').contains('Sign in').click();
        cy.get('ul.error-messages > li').contains('email or password is invalid')
    })
    it('Login with valid credentials', () => {

        cy.get('a[href$="login"]').click();
        cy.get('input[placeholder="Email"]').invoke('attr', 'formcontrolname').should('eq', 'email');
        cy.get('input[placeholder="Password"]').invoke('attr', 'formcontrolname').should('eq', 'password')
        cy.get('.btn').contains('Sign in')

        cy.logMeIn('pp123@gmail.com', 'cypress123');
        cy.get('a[href$="Spiderman"]').should('be.visible');

    })

    it.only('Verify correct request and response', () => {
        cy.logMeIn('pp123@gmail.com', 'cypress123');
        cy.get('a[href$="Spiderman"]').should('be.visible');

        cy.intercept('POST', 'https://api.realworld.io/api/articles').as('postArticles');

        cy.get('a[routerlink$="/editor"]').click();
        cy.get('[placeholder="Article Title"]').type("Hello-world123")
        cy.get('[placeholder="What\'s this article about?"]').type('What is the article about?')
        cy.get('textarea[formcontrolname="body"]').type("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book")
        cy.get('[placeholder="Enter tags"]').type("Spiderman")
        cy.get('.btn').contains('Publish Article').click();


        cy.wait('@postArticles')

        cy.get('@postArticles').then(xhr => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.equal(201);
            expect(xhr.request.body.article.body).to.equal("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book");
            expect(xhr.response.body.article.description).to.equal("What is the article about?")
            expect(xhr.response.url).to.equal("https://api.realworld.io/api/articles/")
            console.log(xhr.response.headers);
        })
    })

})