/// <reference types="cypress" />
describe("Mock api responses",()=>{

    beforeEach('',()=>{
        cy.visit('/');
        cy.get('a[href$="login"]').click();
        cy.get('input[placeholder="Email"]').invoke('attr', 'formcontrolname').should('eq', 'email');
        cy.get('input[placeholder="Password"]').invoke('attr', 'formcontrolname').should('eq', 'password')
    
 
    })
    it.only('GET - Request',()=>{
        cy.get('.btn').contains('Sign in')
        cy.logMeIn('pp123@gmail.com', 'cypress123');

        cy.request('GET','https://api.realworld.io/api/tags')
        .as('getTags')
    
 
        cy.get("@getTags").then(xhr =>{
            const tags = xhr.body.tags;
            cy.wrap(tags).its('length').should('eq',10)
            //console.log(xhr.body.tags);
        })


    })

    it('Mock - Responses',()=>{

        cy.request('GET','https://api.realworld.io/api/tags')
        .as('getTags')
    

      //  cy.wait("@getTags")
        cy.get("@getTags").then(xhr =>{
            const tags = xhr.body.tags;
            cy.wrap(tags).its('length').should('eq',10)
            //console.log(xhr.body.tags);
        })

    })
    it('Verify popular tags are displayed',()=>{
        cy.intercept('GET','https://api.realworld.io/api/tags',{fixture: 'tags.json'})
          
        cy.get('.btn').contains('Sign in')
        cy.logMeIn('pp123@gmail.com', 'cypress123');
        cy.get('.tag-list').should('contain','cypress')
        .and('contain','automation')
        .and('contain','testing');
              
    })

    //https://api.realworld.io/api/articles
    it('Verify global feed likes count',()=>{
        cy.intercept('GET','https://api.realworld.io/api/articles/feed*',{"articles":[],"articlesCount":0})
        cy.intercept('GET','https://api.realworld.io/api/articles?limit=10&offset=0',{fixture: 'articles.json'})

        cy.get('.btn').contains('Sign in')
        cy.logMeIn('pp123@gmail.com', 'cypress123');
        cy.get('.nav-link').contains('Your Feed').click();   
        cy.contains('Global Feed').click();
     
        cy.get('app-article-list button').then(heartList =>{
            expect(heartList[0]).to.contain("1");
            expect(heartList[1]).to.contain("5");
            
        })
    })   
    

    it('verify global feed',()=>{
      //  cy.get('.btn').contains('Sign in')
       
      //  cy.logMeIn('pp123@gmail.com', 'cypress123');
       
     //   cy.get('.nav-link').contains('Your Feed').click();   
     //   cy.contains('Global Feed').click();

        cy.fixture('articles').then(file =>{
            const articleLink = file.articles[1].slug
            file.articles[1].favoritesCount = 6
            cy.intercept('POST','https://api.realworld.io/api/articles/'+articleLink+'/favorite',file)
          
        cy.get('.btn').contains('Sign in')
       
        cy.logMeIn('pp123@gmail.com', 'cypress123');
            cy.get('app-article-List button').eq(1).click().should('contain','6');
                         
   
        }) 

    })

  
})

