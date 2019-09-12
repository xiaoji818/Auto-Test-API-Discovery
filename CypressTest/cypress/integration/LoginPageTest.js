/* Cypress Automation Test for Login page elements of API Discovery
   Created by Zhuoli Xiao, August 2019
   Used for demo.
*/


describe('My First Test', function() {
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
	    // Test the menu-bar, should be visible and contain an logo which links user to our company mainpage
		cy
		.get('menu-bar')
		.should('be.visible') 

		cy
		.get('menu-bar')
		.should('contain','.noBorder liCell')
        
	})

	//check input elements status

    
})