describe('Checkout', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/sanity.io/**').as('sanityApi');
  });

  it('should click Pay with Stripe and trigger checkout', () => {
    cy.intercept('POST', '/api/stripe', {
      statusCode: 200,
      body: { id: 'cs_test_mock_session_id' },
    }).as('stripeCheckout');

    cy.visit('/');
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-icon').click();
    cy.get('.btn').contains('Pay with Stripe').click();

    cy.wait('@stripeCheckout').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('id');
    });
  });
});
