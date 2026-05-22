describe('Home Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/sanity.io/**', (req) => {
      const url = req.url;
      if (url.includes('"product"')) {
        req.reply({
          statusCode: 200,
          body: {
            result: [
              {
                _id: 'prod1',
                name: 'Headphones Pro',
                slug: { current: 'headphones-pro' },
                price: 249,
                details: 'Premium wireless headphones',
                image: [{ _type: 'image', asset: { _ref: 'image-abc123-555x555-webp', _type: 'reference' } }],
              },
              {
                _id: 'prod2',
                name: 'Earbuds Elite',
                slug: { current: 'earbuds-elite' },
                price: 149,
                details: 'True wireless earbuds',
                image: [{ _type: 'image', asset: { _ref: 'image-def456-555x555-webp', _type: 'reference' } }],
              },
            ],
          },
        });
      } else if (url.includes('"banner"')) {
        req.reply({
          statusCode: 200,
          body: {
            result: [
              {
                _id: 'banner1',
                smallText: 'Beats Solo Air',
                midText: 'Summer Sale',
                largeText1: 'FINE',
                largeText2: 'SMILE',
                discount: '20% OFF',
                saleTime: '15 Nov to 7 Dec',
                desc: 'Best headphones on sale',
                product: 'headphones-pro',
                buttonText: 'Shop Now',
                image: { _type: 'image', asset: { _ref: 'image-banner-555x555-webp', _type: 'reference' } },
              },
            ],
          },
        });
      }
    }).as('sanityApi');

    cy.visit('/');
  });

  it('should render the hero banner', () => {
    cy.get('.hero-banner-container').should('exist');
  });

  it('should render product cards', () => {
    cy.get('.product-card').should('have.length.at.least', 1);
  });

  it('should render the footer banner', () => {
    cy.get('.footer-banner-container').should('exist');
  });

  it('should have navigation with logo', () => {
    cy.get('.navbar-container').should('exist');
    cy.contains('JSM Headphones').should('exist');
  });
});
