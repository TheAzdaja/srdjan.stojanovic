import { faker } from "@faker-js/faker";
import { onboarding, signIn } from "./functions/allFunctions";

const apiUsers = `${Cypress.env("apiUrl")}/users`;
const username = faker.internet.userName();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const password = 'password123';

before(() => {
  cy.request("POST", `${apiUsers}`, {
    firstName,
    lastName,
    username,
    password
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

describe('Task 5', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
  });
  it('Create one transaction', () => {
    signIn(username, password);
    onboarding('Test bank', '123456789', '987654321');
    cy.get('[data-test="nav-top-new-transaction"]').click();
    cy.get('[data-test="users-list"] li').first().click({ force: true });

    // Load the form correctly
    cy.get('[data-test="transaction-create-form"]').should('exist');
    cy.get('#amount').should('exist');
    cy.get('#transaction-create-description-input').should('exist');

    // Show validation errors on empty form submission
    cy.get('[data-test="transaction-create-form"]').click();
    cy.get('#amount').click();
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled').click({ force: true })
    cy.get('#transaction-create-amount-input-helper-text').should('contain', 'Please enter a valid amount');
    cy.get('#transaction-create-description-input-helper-text').should('contain', 'Please enter a note');

    // Buttons should be disabled
    cy.get('[data-test="transaction-create-submit-request"]').should('be.disabled');
    cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');

    // Submission with invalid data for payment
    cy.get('#amount').type('-');
    cy.get('#transaction-create-amount-input-helper-text')
      .should('contain', 'amount must be a `number` type, but the final value was: `NaN` (cast from the value `"-"`).');
    cy.get('#amount').clear().type('.');
    cy.get('#transaction-create-amount-input-helper-text')
      .should('contain', 'amount must be a `number` type, but the final value was: `NaN` (cast from the value `"."`).');
    cy.get('#amount').clear().type('-1000');
    cy.get('#transaction-create-description-input').type('Invalid data for payment, negative');
    cy.get('[data-test="transaction-create-submit-request"]').should('not.be.disabled');
    cy.get('[data-test="transaction-create-submit-payment"]').should('not.be.disabled').click();
  });
});

describe('Task 6', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
  });
  it('Validate if one transaction is present', () => {
    signIn(username, password);

    cy.get('[data-test="app-name-logo"]').click();
    cy.get('[data-test="nav-personal-tab"]').click();

    // Validate if one transaction is present
    cy.get('[data-test^="transaction-item"]').should('have.length', 1);

    // Validate date on transaction 
    cy.get('[data-test^="transaction-item"]').first()
      .contains('Invalid data for payment, negative');
    cy.get('[data-test^="transaction-item"]').first()
      .contains('--$1,000.00');
    cy.get('[data-test^="transaction-item"]').first()
      .contains(firstName + ' ' + lastName);
    // Check transaction info
    cy.get('[data-test^="transaction-item"]').first().click();

    // Get the URL and extract the transaction ID 
    cy.url().then((url) => {
      const transactionId = url.split('/').pop();

      // Check sender avatars
      cy.get('[data-test=transaction-sender-avatar]').should('be.visible');
      cy.get('[data-test=transaction-receiver-avatar]').should('be.visible');

      // Check transaction description
      cy.get('[data-test=transaction-description]')
        .should('contain', 'Invalid data for payment, negative'); // Replace with the actual expected description

      // Check transaction amount
      cy.get(`[data-test="transaction-amount-${transactionId}"]`).should('exist').then(($span) => {
        const amountText = $span.text();
        expect(amountText).to.contain('--$1,000.00');
      });

      // Check like button exists
      cy.get(`[data-test="transaction-like-button-${transactionId}"]`).should('exist');

      // Check comments label exists
      cy.get(`[data-test="transaction-comment-input-${transactionId}"]`).should('exist');
    });
  });
});

describe('Task 7', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
  });
  it('Creare two more transactions', () => {
    signIn(username, password);
    // Submission with valid data for payment
    cy.get('[data-test="nav-top-new-transaction"]').click();
    cy.get('[data-test="users-list"] li').first().click({ force: true });
    cy.get('#amount').type('100');
    cy.get('#transaction-create-description-input').type('Test note');
    cy.get('[data-test="transaction-create-submit-request"]').should('not.be.disabled');
    cy.get('[data-test="transaction-create-submit-payment"]').should('not.be.disabled').click();

    // Submission with valid data for request
    cy.get('[data-test="new-transaction-create-another-transaction"]').click();
    cy.get('[data-test="users-list"] li').first().click({ force: true });
    cy.get('#amount').type('100');
    cy.get('#transaction-create-description-input').type('Test note');
    cy.get('[data-test="transaction-create-submit-payment"]').should('not.be.disabled');
    cy.get('[data-test="transaction-create-submit-request"]').should('not.be.disabled').click();
  });
  it('Confirm there are 3 transactions', () => {
    signIn(username, password);
    cy.get('[data-test="app-name-logo"]').click();
    cy.get('[data-test="nav-personal-tab"]').click();
    cy.get('[data-test^="transaction-item"]').should('have.length', 3);
  });
});

