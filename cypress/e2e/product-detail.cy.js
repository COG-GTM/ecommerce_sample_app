describe('Product Detail Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/sanity.io/**').as('sanityApi');
    cy.visit('/');
  });

  it('should navigate to product detail when clicking a product card', () => {
    cy.get('.product-card').first().click();
    cy.get('.product-detail-container').should('exist');
  });

  it('should show product name, price, and details on product page', () => {
    cy.get('.product-card').first().click();
    cy.get('.product-detail-desc h1').should('exist');
    cy.get('.product-detail-desc .price').should('exist');
    cy.get('.product-detail-desc h4').should('contain', 'Details');
  });

  it('should render product images', () => {
    cy.get('.product-card').first().click();
    cy.get('.product-detail-image').should('exist');
  });

  it('should increment and decrement quantity', () => {
    cy.get('.product-card').first().click();
    cy.get('.quantity-desc .num').should('contain', '1');
    cy.get('.quantity-desc .plus').click();
    cy.get('.quantity-desc .num').should('contain', '2');
    cy.get('.quantity-desc .minus').click();
    cy.get('.quantity-desc .num').should('contain', '1');
  });

  it('should add product to cart', () => {
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.cart-item-qty').should('not.contain', '0');
  });
});
