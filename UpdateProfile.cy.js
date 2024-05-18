import { faker } from "@faker-js/faker";
import { onboarding, signIn } from "./functions/allFunctions";

const apiUsers = `${Cypress.env("apiUrl")}/users`;
const username = faker.internet.userName();
const password = 'password123';

describe('Task 4', () => {

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

  it('Signin and finish onboardinng', () => {

   signIn(username,password);
   onboarding;
  });

  it('Signin and change user settings', () => {
 
    signIn(username,password);
    onboarding('Test bank', '123456789', '987654321');

    // Display the user settings form with all elements
    cy.get('[data-test=sidenav-user-settings]').click();
    cy.get('[data-test=user-settings-form]').should('be.visible');
    cy.get('[data-test=user-settings-firstName-input]').should('be.visible');
    cy.get('[data-test=user-settings-lastName-input]').should('be.visible');
    cy.get('[data-test=user-settings-email-input]').should('be.visible');
    cy.get('[data-test=user-settings-phoneNumber-input]').should('be.visible');
    cy.get('[data-test=user-settings-submit]').should('be.visible');

    // Display validation errors for empty required fields
    cy.get('[data-test=user-settings-firstName-input]').clear();
    cy.get('[data-test=user-settings-lastName-input]').clear();
    cy.get('[data-test=user-settings-email-input]').clear();
    cy.get('[data-test=user-settings-phoneNumber-input]').clear();
    cy.get('[data-test=user-settings-submit]').should('be.disabled').click({ force: true });
    cy.get('#user-settings-firstName-input-helper-text').contains('Enter a first name');
    cy.get('#user-settings-lastName-input-helper-text').contains('Enter a last name');
    cy.get('#user-settings-email-input-helper-text').contains('Enter an email address');
    cy.get('#user-settings-phoneNumber-input-helper-text').contains('Enter a phone number');

    // Display validation error for invalid email
    cy.get('[data-test=user-settings-email-input]').clear().type('invalid-email');
    cy.get('#user-settings-email-input-helper-text').contains('Must contain a valid email address');

    // Display validation error for invalid phone number
    cy.get('[data-test=user-settings-phoneNumber-input]').clear().type('invalid-phone');
    cy.get('#user-settings-phoneNumber-input-helper-text').contains('Phone number is not valid');

    // Save corrcet data
    cy.get('[data-test=user-settings-firstName-input]').clear().type('John');
    cy.get('[data-test=user-settings-lastName-input]').clear().type('Doe');
    cy.get('[data-test=user-settings-email-input]').clear().type('johndoe@example.com');
    cy.get('[data-test=user-settings-phoneNumber-input]').clear().type('123-456-7890');
    cy.get('[data-test=user-settings-submit]').should('not.be.disabled').click();

    // Check if everything is saved when changing tabs
    cy.get('[data-test="sidenav-home"]').click();
    cy.get('[data-test=sidenav-user-settings]').click();
    cy.get('[data-test=user-settings-firstName-input]').should('have.value', 'John');
    cy.get('[data-test=user-settings-lastName-input]').should('have.value', 'Doe');
    cy.get('[data-test=user-settings-email-input]').should('have.value', 'johndoe@example.com');
    cy.get('[data-test=user-settings-phoneNumber-input]').should('have.value', '123-456-7890');
    cy.get('[data-test="sidenav-signout"]').click();
  });

  it('Signin and check if user updated data is saved', () => {
 
    signIn(username,password);
    // Check if everything is saved    
    cy.get('[data-test=sidenav-user-settings]').click();
    cy.get('[data-test=user-settings-firstName-input]').should('have.value', 'John');
    cy.get('[data-test=user-settings-lastName-input]').should('have.value', 'Doe');
    cy.get('[data-test=user-settings-email-input]').should('have.value', 'johndoe@example.com');
    cy.get('[data-test=user-settings-phoneNumber-input]').should('have.value', '123-456-7890');
  });
});    
