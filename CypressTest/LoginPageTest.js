/* Cypress Automation Test for Login page elements of API Discovery
   Created by Zhuoli Xiao, August 2019
   Used for demo.
*/


describe('My First Test', function() {
	//basic contents of login page
	it('Redirect to Login', function() {
		cy.visit('https://teejlab.com/edsn')

		// Should be on a new URL which includes '/commands/actions'
		cy.url().should('include', '/accounts/login')
		cy.contains('Sign In')
		//Login Page should have input element and visible to user
		cy
		.get('input')
		.should('be.visible') 
	})

    
})