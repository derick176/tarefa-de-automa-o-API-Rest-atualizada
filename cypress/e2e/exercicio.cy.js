/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then((tkn) => {
        token = tkn
    })
});

    // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando
    // Validar que filtros por categoria e autores funcionam corretamente
    it('GET - Deve listar livros com filtros e paginação', () => {
            cy.api({
               method: 'GET',
               url: '/books',
               qs: {
                   page: 1,
                   limit: 10,
                   category: 'Ficção',
                   author: 'George Orwell'
               }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.books).to.be.an('array')
                expect(response.body.books.length).to.be.lessThanOrEqual(10)
            })
    });

    // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID
    // Verificar que todos os campos do livro são retornados corretamente
    it('GET - Deve obter detalhes de um livro específico', () => {
            cy.api({
                    method: 'GET',
                    url: '/books/10'
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.an('object')
            })
    });

    // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo
    // Verificar que apenas admin pode adicionar novos livros (validação de permissão)
    it('POST - Deve cadastrar um novo livro com sucesso', () => {
            const novoLivro = {
                title: 'novo livro de acao',
                author: 'livro de acao',
                category: 'acao',
                isbn: '978-0-123456-78-6'
            }
            cy.api({
                method: 'POST',
                url: '/books',
                headers: { 'Authorization': token },
                body: novoLivro
            }).should(response => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Livro criado com sucesso.')
            })
    });

    // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro
    // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
    it('POST -  Deve rejeitar livro com dados inválidos', () => {
        const livroInvalido = {
            title: 'livro de acao invalido',
            author: 'livro de acao',
            category: 'romance',
            isbn: '978-0-123456-78-6-0'
        }
        cy.api({
            method: 'POST',
            url: '/books',
            headers: { 'Authorization': token },
            body: livroInvalido
        }).should(response => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe um livro com este título e autor.')
        })
    });

    // Objetivo: Validar que um livro pode ser atualizado com sucesso
    // Verificar que apenas admin pode atualizar livros (validação de permissão)
    it('PUT - Deve atualizar um livro previamente cadastrado', () => {
        const livroAtualizado = {
            title: 'novo livro de acao atualizado',
            author: 'livro de acao atualizado',
            category: 'romance',
            isbn: '978-0-123456-78-6'
        }
        cy.api({
            method: 'PUT',
            url: '/books/39',
            headers: { 'Authorization': token },
            body: livroAtualizado
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Livro atualizado com sucesso.')
        })
    });

    // Objetivo: Validar que um livro pode ser removido do catálogo
    // Verificar que apenas admin pode deletar livros (validação de permissão)
    it('DELETE - Deve deletar um livro previamente cadastrado', () => {
        cy.api({
            method: 'DELETE',
            url: '/books/39',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Livro deletado com sucesso.')
        })
    });
});
