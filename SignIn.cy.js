import { faker } from "@faker-js/faker";

const apiUsers = `${Cypress.env("apiUrl")}/users`;
const username = faker.internet.userName();
const password = 'password123';
describe('Task 2', () => {

  before(() => {
    cy.request("POST", `${apiUsers}`, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username,
      password
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
  });

  it('Display the sign-in form with all fields', () => {
    cy.get('[data-test=signin-username]').should('be.visible');
    cy.get('[data-test=signin-password]').should('be.visible');
    cy.get('[data-test=signin-remember-me]').should('be.visible');
    cy.get('[data-test=signin-submit]').should('be.visible');
    cy.get('[data-test=signup]').should('be.visible');
  });

  it('Show validation errors when submitting an empty form', () => {
    cy.get('[data-test=signin-username]').click();
    cy.get('[data-test=signin-submit]').click({force:true});
    cy.get('[data-test=signin-username]').parent().contains('Username is required');
    cy.get('[data-test=signin-submit]').should('be.disabled');
  });

  it('Show validation error for short password', () => {
    cy.get('[data-test=signin-username]').type(username);
    cy.get('[data-test=signin-password]').type('123');
    cy.get('[data-test=signin-submit]').click({force:true});
    cy.get('[data-test=signin-password]').parent().contains('Password must contain at least 4 characters');
  });

  it('Display an error message on failed login', () => {
    // Simulate an incorrect login
    cy.get('[data-test=signin-username]').type('wronguser');
    cy.get('[data-test=signin-password]').type('wrongpassword');
    cy.get('[data-test=signin-submit]').click();

    // Check for the error message
    cy.get('[data-test=signin-error]').should('be.visible')
      .and('contain', 'Username or password is invalid');
  });

  it('Navigate to sign-up page on link click', () => {
    cy.get('[data-test=signup]').click();
    cy.url().should('include', '/signup');
  });

  it('Toggle "Remember me" checkbox', () => {
    cy.get('[name="remember"]').check().should('be.checked');
    cy.get('[name="remember"]').uncheck().should('not.be.checked');
  });

  it('Login with correct data', () => {
    cy.get('[data-test=signin-username]').type(username);
    cy.get('[data-test=signin-password]').type(password);
    cy.get('[data-test=signin-submit]').should('not.be.disabled').click();
    cy.get('[data-test="user-onboarding-dialog-title"]').should('be.visible');
  });
});
