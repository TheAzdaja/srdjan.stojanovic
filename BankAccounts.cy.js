import { faker } from "@faker-js/faker";
import { onboarding, signIn } from "./functions/allFunctions";

type BankAccountData = {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  userId: string;
};

const apiUsers = `${Cypress.env("apiUrl")}/users`;
const username = faker.internet.userName();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const password = 'password123';
const graphqlUrl = "http://localhost:3001/graphql";

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

describe('Task 4', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signin');
  });

  it('Signin and finish onboarding', () => {
    signIn(username, password);
    // Onboarding
    onboarding('Test bank', '123456789', '987654321');
  });

  it('Validate vreate Bank Account form and create a bank account', () => {
    signIn(username, password);
    // Form validation errors
    cy.get('[data-test="sidenav-bankaccounts"]').click();
    cy.contains('Test bank').should('exist');
    cy.get('[data-test="bankaccount-new"]').click();
    cy.get('[data-test=bankaccount-bankName-input]').click();
    cy.get('[data-test=bankaccount-routingNumber-input]').click();
    cy.get('[data-test=bankaccount-accountNumber-input]').click();
    cy.get('[data-test=bankaccount-submit]').should('be.disabled').click({ force: true });
    cy.get('[data-test=bankaccount-bankName-input]').parent().contains('Enter a bank name');
    cy.get('[data-test=bankaccount-routingNumber-input]').parent().contains('Enter a valid bank routing number');
    cy.get('[data-test=bankaccount-accountNumber-input]').parent().contains('Enter a valid bank account number');

    // Invalid bank name
    cy.get('#bankaccount-bankName-input').clear().type('Test');
    cy.get('[data-test=bankaccount-bankName-input]').parent().contains('Must contain at least 5 characters');

    // Invalid routing number
    cy.get('#bankaccount-routingNumber-input').clear().type('123');
    cy.get('[data-test=bankaccount-routingNumber-input]').parent().contains('Must contain a valid routing number');

    // Invalid account number
    cy.get('#bankaccount-accountNumber-input').clear().type('12345');
    cy.get('[data-test=bankaccount-accountNumber-input]').parent().contains('Must contain at least 9 digits');

    // Form submission
    cy.get('[data-test=bankaccount-bankName-input]').clear().type('Test Bank 2');
    cy.get('[data-test=bankaccount-routingNumber-input]').clear().type('123456789');
    cy.get('[data-test=bankaccount-accountNumber-input]').clear().type('987654321');
    cy.get('[data-test=bankaccount-submit]').should('not.be.disabled');
    cy.get('[data-test=bankaccount-submit]').click();

    // Verify that the bank account was created by checking the bank accounts list page
    cy.contains('Test Bank 2').should('exist');
    cy.get('[data-test="bankaccount-delete"]').should('have.length', 2);
    cy.get('[data-test="bankaccount-delete"]').eq(0).click();

    cy.get('[data-test="bankaccount-delete"]').should('have.length', 1);
    cy.contains('Test bank (Deleted)').should('exist');
    cy.get('[data-test="sidenav-signout"]').click();
  });
});

describe("Task 8", function () {
  let bankAccounts: BankAccountData[] = [];

  const predefinedBankAccounts = [
    {
      bankName: "Test bank",
      accountNumber: "987654321",
      routingNumber: "123456789",
    },
    {
      bankName: "Test Bank 2",
      accountNumber: "987654321",
      routingNumber: "123456789",
    },
  ];

  it("Fetch bank accounts using GraphQL and compare data", function () {
    cy.visit('http://localhost:3000/signin');
    signIn(username, password);
    cy.get('[data-test="sidenav-bankaccounts"]').click();

    cy.request({
      method: "POST",
      url: graphqlUrl,
      body: {
        query: `
          query {
            listBankAccount {
              id
              bankName
              accountNumber
              routingNumber
              userId
            }
          }
        `
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      const { data } = response.body;
      expect(data).to.have.property("listBankAccount").that.is.an("array");

      bankAccounts = data.listBankAccount;
      expect(bankAccounts.length).to.be.greaterThan(0);

      // Compare fetched bank accounts with predefined data
      bankAccounts.forEach((account, index) => {
        const predefinedAccount = predefinedBankAccounts[index];
        if (predefinedAccount) {
          expect(account.bankName).to.eq(predefinedAccount.bankName);
          expect(account.accountNumber).to.eq(predefinedAccount.accountNumber);
          expect(account.routingNumber).to.eq(predefinedAccount.routingNumber);
        }
      });
    });
  });
});
