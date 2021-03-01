describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Successfully logged in.')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('www.url.fi')

      cy.contains('create').click()

      cy.contains('a new blog title by author added')
      cy.contains('title')
      cy.contains('author')
    })
  })

  describe('when logged in and blog created', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.addBlog({ title: 'title', author: 'author', url: 'www.url.fi' })
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()

      cy.contains('like').click()
    })

    it('A blog can be delete', function() {
      cy.contains('view').click()

      cy.contains('delete').click()
    })
  })

  describe('when logged in and multiple blogs created', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.addBlog({ title: 'title1', author: 'author1', url: 'www.url1.fi' })
      cy.addBlog({ title: 'title2', author: 'author2', url: 'www.url2.fi' })
    })

    it('blogs are ordered according to likes', function() {
      cy.contains('view').click()
      cy.contains('view').click()

      cy.get('.likeDiv').then(elements => {
        elements.map((i, elem) => {
          if(i === 1){
            cy.wrap(elem).contains('like').click()
          }
        })
      }).then(() => {
        cy.wait(2000)
        cy.get('.likeDiv').then(elements => {
          elements.map((i, elem) => {
            if(i === 0)
              expect(elem.innerHTML).contains('likes: 1')
            else if(i === 1)
              expect(elem.innerHTML).contains('likes: 0')
          })
        })
      })
    })
  })
})