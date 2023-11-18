/// <reference types = "cypress"/>

describe("Api - calls", () => {
    beforeEach('', () => {

        cy.visit("/")
        cy.get('a[href$="login"]').click();
        cy.get('input[placeholder="Email"]').invoke('attr', 'formcontrolname').should('eq', 'email');
        cy.get('input[placeholder="Password"]').invoke('attr', 'formcontrolname').should('eq', 'password')
        //cy.logMeIn('pp123@gmail.com','cypress123');
        cy.logInToApplication();
    })

    it('Log in and add a new article in a global feed', () => {
       
        // const userCredentials = {

        //     "user": {
        //         "email": "pp123@gmail.com",
        //         "password": "cypress123"

        //     }


        // }


        const bodyRequest = {
            "article":
            {
                "title": "Request from API",
                "description": "This is the description",
                "body": "This is the body",
                "tagList": []
            }
        }
        

        // cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        //     .its('body').then(body => 
               cy.get('@token').then(token=> {
              // const token = body.user.token;
                console.log("Token", token);
          
               cy.request({
                   url: 'https://api.realworld.io/api/articles/',
                   headers: { 'Authorization': 'Token ' + token },
                    method: 'POST',

                    body: bodyRequest

                }).then(response => {
                    expect(response.status).to.equal; (201);
                })

           
            cy.contains('Global Feed').click();
            cy.get('.article-preview > a.preview-link').first().click();
            
        //    cy.get('.article-actions').cy.contains('Delete Article').eq(0).click();
        cy.get('.article-actions > app-article-meta > .article-meta > :nth-child(3) > .btn-outline-danger').click();                
       
        cy.request({
            url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
            headers: { 'Authorization': 'Token ' + token },
             method: 'GET',

           }).its('body').then(body => {
            console.log(body.articles[0].title);
            console.log(bodyRequest.article.title);
            expect(body.articles[0].title).not.to.equal(bodyRequest.article.title);
           
           })

        })
    })
    

})