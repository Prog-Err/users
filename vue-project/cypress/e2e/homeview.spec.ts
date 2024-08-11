
describe('HomeView', () => {
  beforeEach(() => {
    // Установка необходимых значений в localStorage для обхода авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('User', JSON.stringify({
        username: 'admin',
        roles: ['ROLE_ADMIN']
      }));
    });

    cy.visit('/'); 
  });

  it('должен отображать заголовок "Пользователи"', () => {
    cy.get('h1').should('contain.text', 'Пользователи');
  });

  it('должен отображать кнопку "Добавить пользователя", если пользователь является администратором', () => {
    cy.get('.btn.btn-primary').should('be.visible').and('contain.text', 'Добавить пользователя');
  });

  it('должен отображать индикатор загрузки, пока данные загружаются', () => {
    cy.intercept('GET', '/api/users', { delayMs: 1000 }).as('delayedGetUsers');
    cy.get('.spinner-border').should('be.visible');
  });

  it('должен отображать список пользователей, когда данные загружены', () => {
    cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsersWithFixture');

    cy.wait('@getUsersWithFixture')

    cy.get('tbody tr').should('have.length', 5); 
    cy.get('tbody tr').first().should('contain.text', 'ilya');
    cy.get('tbody tr').last().should('contain.text', 'test4');
  });

  it('должен отображать сообщение "Нет пользователей", если список пользователей пуст', () => {
    cy.intercept('GET', '/api/users', { body: [] }).as('getEmptyUsers');

    cy.wait('@getEmptyUsers')

    cy.get('tbody tr').should('have.length', 1); 
    cy.get('tbody tr td').should('contain.text', 'Нет пользователей');
  });

});


