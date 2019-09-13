/* Cypress Automation Test for Login page elements of API Discovery
   Created by Zhuoli Xiao, August 2019
   Used for demo.
*/


describe('My First Test', function() {
	// constant variable
	const username = 'zhuolixiao@teejlab.com'
  	const password = 'qqgo2372'

	//basic contents of login page
	it('Forward to Login', function() {
		cy.visit('https://teejlab.com/edsn')

		// Should be on a new URL which includes '/commands/actions'
		cy.url().should('include', '/accounts/login')
		cy.contains('Sign In')
		//Login Page should have input element and visible to user
		cy
		.get('input')
		.should('be.visible') 
	})

	//check frame elements
	it('Frame Elements', function() {

		//check the Center product name API Discovery
		cy.contains("API Discovery") 

	    // Test the menu-bar, should be visible and contain an logo in style 'a', click should direct to our home page of company
		cy
		.get('#navMain')
		.should('be.visible') 
		.find('ul')
		.find('a')
		.invoke('removeAttr', 'target').click()
		// Check whether we are re-directed to the homepage of teejlab
		cy.url().should('include', 'teejlab.com')



		//go back to API Discovery home Page, and check footer: company mark
		cy
		.visit('https://teejlab.com/edsn')
		.contains('2019 TeejLab')
        .invoke('removeAttr', 'target').click()
        .url().should('include', 'teejlab.com')

        //go back to API Discovery home Page, and check footer: Terms 
		cy
		.visit('https://teejlab.com/edsn')
		.contains('Terms')
        .invoke('removeAttr', 'target').click()
     	.url().should('include', 'teejlab.com/legal/terms')

     	 //go back to API Discovery home Page, and check 
		cy
		.visit('https://teejlab.com/edsn')
		.contains('Privacy')
        .invoke('removeAttr', 'target').click()
     	.url().should('include', 'teejlab.com/legal/privacy/')
	})

	//check input elements status
	it('Two Input Status', function() {

		cy.visit('https://teejlab.com/edsn')
		//check whether username input is valid
		cy
		.get('#id_username')
		.type('zhuolixiao@teejlab.com')
		.should('have.value','zhuolixiao@teejlab.com')
		//check whether password input is valid
		cy
		.get('#id_password')
		.type('qqgo2372')
		.should('have.value','qqgo2372')

	})
    //prepare a CSRF token
    Cypress.Commands.add('loginByCSRF', (csrfToken) => {
    cy.request({
        method: 'POST',
        url: 'https://teejlab.com/accounts/login/',
        failOnStatusCode: false, // dont fail so we can make assertions
        form: true, // we are submitting a regular form body
        body: {
          username,
          password,
          _csrf: csrfToken // insert this as part of form body
        }
      })
  	})
	//Verify the API Discovery requires a CSRF token
	it('Verify Login CSRF token', function(){
	cy.loginByCSRF('invalid-token')
	  .its('status')
	  .should('eq', 403)
	})

	// check Forget password and Signup Link in this page 
	it('Two Links', function() {

		//check whether link Forget password is working
		cy
		.contains('Forgot password?')
		.click()
		.url().should('include','password_reset/')
		//check whether link back to LoginPage is working
		cy
		.contains('Back to Login Page')
		.click()
		.url().should('eq','https://teejlab.com/accounts/login/')
		// check whether link sign up is working
        cy
		.contains('Sign up')
		.click()
		.url().should('include','signup/')

		//check whether link back to LoginPage is working
		cy
		.contains('Back to Login Page')
		.click()
		.url().should('eq','https://teejlab.com/accounts/login/')

	})

    
})