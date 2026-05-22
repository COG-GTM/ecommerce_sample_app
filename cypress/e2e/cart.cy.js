describe('Cart', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/sanity.io/**').as('sanityApi');
    cy.visit('/');
  });

  it('should add a product and open cart', () => {
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-icon').click();
    cy.get('.cart-wrapper').should('exist');
  });

  it('should show item in cart with correct details', () => {
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-icon').click();
    cy.get('.cart-wrapper .product').should('have.length.at.least', 1);
    cy.get('.cart-wrapper .product h5').should('exist');
    cy.get('.cart-wrapper .product h4').should('exist');
  });

  it('should increment and decrement quantity in cart', () => {
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-icon').click();
    cy.get('.cart-wrapper .plus').first().click();
    cy.get('.cart-wrapper .num').first().should('exist');
    cy.get('.cart-wrapper .minus').first().click();
  });

  it('should remove item from cart', () => {
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-icon').click();
    cy.get('.remove-item').first().click();
    cy.contains('Your shopping bag is empty').should('exist');
  });

  it('should show empty cart message when cart is empty', () => {
    cy.get('.cart-icon').click();
    cy.contains('Your shopping bag is empty').should('exist');
  });
});
