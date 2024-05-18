export function signIn(username:string , password:string) {
    cy.get('[data-test=signin-username]').type(username);
    cy.get('[data-test=signin-password]').type(password);
    cy.get('[data-test=signin-submit]').should('not.be.disabled').click();
}

export function onboarding(bankName:string, routingNumber:string, accountNumber:string){
    cy.get('[data-test=user-onboarding-next]').click();
    cy.get('[data-test=bankaccount-bankName-input]').type(bankName);
    cy.get('[data-test=bankaccount-routingNumber-input]').type(routingNumber);
    cy.get('[data-test=bankaccount-accountNumber-input]').type(accountNumber);
    cy.get('[data-test=bankaccount-submit]').click();
    cy.get('[data-test=user-onboarding-next]').click();
}

