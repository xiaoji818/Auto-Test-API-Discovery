/// <reference types="cypress" />

// This recipe expands on the previous 'Logging in' examples
// and shows you how to use cy.request when your backend
// validates POSTs against a CSRF token
//
describe('Logging In - CSRF Tokens', function(){
  const username = 'zhuolixiao@teejlab.com'
  const password = 'qqgo2372'

  Cypress.Commands.add('loginByCSRF', (csrfToken) => {
    cy.request({
        method: 'POST',
        url: 'https://teejlab.com/accounts/login/?next=/edsn/',
        failOnStatusCode: false, // dont fail so we can make assertions
        form: true, // we are submitting a regular form body
        body: {
          username,
          password,
          _csrf: csrfToken // insert this as part of form body
        }
      })
  })

  /**
   * A utility function to check that we are seeing the dashboard page
   */
  const inDashboard = () => {
    cy.location('href').should('match', /dashboard$/)
    cy.contains('h2', 'dashboard.html')
  }

  // verify whether we can get respond from the protected dashboard
  const visitDashboard = () => {
    cy.visit('/dashboard')
    inDashboard()
  }

  beforeEach(function(){
    cy.viewport(500, 380)
  })

  it('redirects to /login', () => {
    cy.visit('/')
    cy.location('href').should('match', /login$/)
  })

  //Verify the API Discovery requires a CSRF token
  it('Verify requiring CSRF token', function(){
    cy.loginByCSRF('invalid-token')
      .its('status')
      .should('eq', 403)
  })

  //check all the possible methods of gettting token from API Discovery
  //1: Token in response body
  it('Try Method 1: parse token from the body', function(){
    cy.request('/login')
      .its('body')
      .then((body) => {
        
        const $html = Cypress.$(body)
        const csrf  = $html.find("input[name=_csrf]").val()

        cy.loginByCSRF(csrf)
          .then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.body).to.include("<h2>dashboard.html</h2>")
          })
      })
    visitDashboard()
  })


  //2: Token in response headers
  it('Try Method 2: parse token from the headers', function(){
    
    cy.request('/login')
      .its('headers')
      .then((headers) => {
        const csrf = headers['x-csrf-token']

        cy.loginByCSRF(csrf)
          .then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.body).to.include("<h2>dashboard.html</h2>")
          })
      })
    visitDashboard()
  })

  //3: Token in page body 
  it('Try Method 3: parse token directly in page body', function(){
    
    cy.request('/csrf')
      .its('body.csrfToken')
      .then((csrf) => {
        cy.loginByCSRF(csrf)
          .then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.body).to.include("<h2>dashboard.html</h2>")
          })
      })
    visitDashboard()
  })
  
  //4: directly login
  it('Try Method 4: directly login', () => {
   
    cy.visit('/login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('form').submit()
    inDashboard()
  })
})