describe('LoginView', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('должен отображать заголовок "Авторизация"', () => {
    cy.get('h1').should('contain.text', 'Авторизация');
  });

  it('должен отображать сообщение об ошибке при пустом имени пользователя', () => {
    cy.get('#username').type('a').clear(); // Ввод и очистка поля
    cy.get('#password').type('validpassword');
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.get('.invalid-feedback').should('contain.text', 'Имя пользователя обязательно.');
  });

  it('должен отображать сообщение об ошибке при коротком имени пользователя', () => {
    cy.get('#username').type('ab'); // Ввод короткого имени
    cy.get('#password').type('validpassword');
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.get('.invalid-feedback').should('contain.text', 'Имя пользователя должно содержать не менее 3 символов.');
  });

  it('должен отображать сообщение об ошибке при пустом пароле', () => {
    cy.get('#username').type('validuser');
    cy.get('#password').type('a').clear(); // Ввод и очистка поля
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.get('.invalid-feedback').should('contain.text', 'Пароль обязателен.');
  });

  it('должен отображать сообщение об ошибке при коротком пароле', () => {
    cy.get('#username').type('validuser');
    cy.get('#password').type('123'); // Ввод короткого пароля
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.get('.invalid-feedback').should('contain.text', 'Пароль должен содержать не менее 4 символов.');
  });

  it('должен отображать сообщение об ошибке при неправильных данных', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { error: 'Неверное имя пользователя или пароль' }
    }).as('loginRequest');

    cy.get('#username').type('invaliduser');
    cy.get('#password').type('invalidpass');
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.wait('@loginRequest');
    cy.get('.text-danger').should('contain.text', 'Неверное имя пользователя или пароль');
  });


  it('должен показывать индикатор загрузки при авторизации', () => {
    cy.intercept('POST', '/api/login', {
      delay: 1000,
      statusCode: 200,
      body: { token: 'fake-token' }
    }).as('loginRequest');

    cy.get('#username').type('validuser');
    cy.get('#password').type('validpass');
    cy.get('.btn-primary').click(); // Нажатие кнопки входа

    cy.get('.btn-primary').should('have.attr', 'disabled'); // Проверка состояния кнопки
    cy.get('.btn-primary').should('contain.text', 'Вход...');
    cy.wait('@loginRequest');
  });
});
