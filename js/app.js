var App = Ember.Application.create();

App.Router.map(function() {
  this.resource('index', { path: '/' });
  this.resource('book', { path: '/books/:book_id' });
  this.resource('genre', { path: '/genre/:genre_id' });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      books: this.store.findAll('book'),
      genres: this.store.findAll('genre')
    });
  },
  setupController: function(controller, model) {
    controller.set('genres', model.genres);
    controller.set('books', model.books);
  }
});
App.IndexController = Ember.Controller.extend({});

App.BooksController = Ember.ArrayController.extend({
  sortProperties: ['title']
})


App.GenreRoute = Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      genres: this.store.findAll('genre'),
      genre: this.store.find('genre', params.genre_id)
    });
  },
  setupController: function(controller, model) {
    controller.set('genres', model.genres);
    controller.set('genre', model.genre);
  }
});

App.GenreController = Ember.Controller.extend({
});
// Show this, then delete it and change the dynamic segment
// App.BookRoute = Ember.Route.extend({
//   model: function(params) {
//     return this.store.find('book', params.id);
//   }
// });


App.GenresController = Ember.ArrayController.extend({
  sortProperties: ['name']
})

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  // latency: 2000
});

App.Book = DS.Model.extend({
  title: DS.attr(),
  author: DS.attr(),
  review: DS.attr(),
  rating: DS.attr('number'),
  genre: DS.attr(),
  amazon_id: DS.attr(),
  genre: DS.belongsTo('genre', {async: true}),

  image: function() {
    return 'http://images.amazon.com/images/P/'+this.get('amazon_id')+'.01.ZTZZZZZZ.jpg';
  }.property('amazon_id'),
  url: function() {
    return 'http://www.amazon.com/gp/product/'+this.get('amazon_id') + "/adamfortuna-20";
  }.property('amazon_id')
});

App.Book.FIXTURES = [
  {
    id: 1,
    title: 'I, Robot',
    author: 'Isaac Asimov',
    review: 'My review',
    rating: 5,
    genre: 1,
    amazon_id: '0553294385'
  },
  {
    id: 2,
    title: 'Mindstorms',
    author: 'Seymour A. Papert',
    review: 'Amazing',
    rating: 5,
    genre: 3,
    amazon_id: '0465046746'
  },
  {
    id: 3,
    title: 'Hyperion',
    author: 'Dan Simmons',
    review: 'Probably my favorite science fiction book (and series) I\'ve ever read.',
    rating: 5,
    genre: 3,
    amazon_id: '0553283685'
  }
];

App.Genre = DS.Model.extend({
  name: DS.attr(),
  books: DS.hasMany('book', {async: true})
});

App.Genre.FIXTURES = [
  {
    id: 1,
    name: 'Science Fiction',
    books: [1,3]
  },
  {
    id: 2,
    name: 'Fiction'
  },
  {
    id: 3,
    name: 'Non-Fiction',
    books: [2]
  }
];