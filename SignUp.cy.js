describe('Task 1', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/signup');
    });
  
    it('Display the sign-up form with all fields', () => {
      cy.get('[data-test=signup-title]').should('contain', 'Sign Up');
      cy.get('[data-test=signup-first-name]').should('be.visible');
      cy.get('[data-test=signup-last-name]').should('be.visible');
      cy.get('[data-test=signup-username]').should('be.visible');
      cy.get('[data-test=signup-password]').should('be.visible');
      cy.get('[data-test=signup-confirmPassword]').should('be.visible');
      cy.get('[data-test=signup-submit]').should('be.visible');
    });
  
    it('Validation errors when submitting an empty form', () => {
      cy.get('[data-test=signup-first-name]').click();
      cy.get('[data-test=signup-last-name]').click();
      cy.get('[data-test=signup-username]').click();
      cy.get('[data-test=signup-password]').click();
      cy.get('[data-test=signup-confirmPassword]').click();
      cy.get('[data-test=signup-submit]').should('be.disabled').click({force:true});
      cy.get('[data-test=signup-first-name]').click().parent().contains('First Name is required');
      cy.get('[data-test=signup-last-name]').click().parent().contains('Last Name is required');
      cy.get('[data-test=signup-username]').click().parent().contains('Username is required');
      cy.get('[data-test=signup-password]').click().parent().contains('Enter your password');
      cy.get('[data-test=signup-confirmPassword]').click().parent().contains('Confirm your password');
    });
  
    it('Validation error for password length', () => {
      cy.get('[data-test=signup-password]').type('123');
      cy.get('[data-test=signup-confirmPassword]').type('123');
      cy.get('[data-test=signup-submit]').should('be.disabled').click({force:true});
      cy.get('[data-test=signup-password]').parent().contains('Password must contain at least 4 characters');
    });
  
    it('Validation error for password mismatch', () => {
      cy.get('[data-test=signup-password]').type('password123');
      cy.get('[data-test=signup-confirmPassword]').type('differentpassword');
      cy.get('[data-test=signup-submit]').should('be.disabled').click({force:true});
      cy.get('[data-test=signup-confirmPassword]').parent().contains('Password does not match');
    });
  
    it('Submit button only enabled when form is valid', () => {
      cy.get('[data-test=signup-first-name]').type('John');
      cy.get('[data-test=signup-last-name]').type('Doe');
      cy.get('[data-test=signup-username]').type('johndoe');
      cy.get('[data-test=signup-password]').type('password123');
      cy.get('[data-test=signup-confirmPassword]').type('password123');
      cy.get('[data-test=signup-submit]').should('not.be.disabled');
    });
  
    it('Submit the form with valid data', () => {
      cy.get('[data-test=signup-first-name]').type('John');
      cy.get('[data-test=signup-last-name]').type('Doe');
      cy.get('[data-test=signup-username]').type('johndoe1');
      cy.get('[data-test=signup-password]').type('password123');
      cy.get('[data-test=signup-confirmPassword]').type('password123');
      cy.get('[data-test=signup-submit]').click();
      cy.url().should('include', '/signin');
    });
  
    it('Navigate to sign-in page on link click', () => {
      cy.contains('Have an account? Sign In').click();
      cy.url().should('include', '/signin');
    });
  });
  