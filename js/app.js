var App = Ember.Application.create();

App.Router.map(function() {
  // this.route('index', { path: '/' });
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
});


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


App.BookDetailsComponent = Ember.Component.extend({
  classNameBindings: ['ratingClass'],
  ratingClass: function() {
    return "rating-" + this.get('controller.book.rating');
  }.property('rating')
});

//App.ApplicationAdapter = DS.RESTAdapter.extend({});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  latency: 200 // simulates reall AJAX calls by waiting a number of milliseconds.
});

App.Book = DS.Model.extend({
  title: DS.attr(),
  author: DS.attr(),
  review: DS.attr(),
  rating: DS.attr('number'),
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
    title: 'Mindstorms',
    author: 'Seymour A. Papert',
    review: 'Although this book focuses on the cognitive advantages to having children use technology from an early age, it is also an in depth look at how people can learn for themseves. As someone who was often distracted and bored at times during school, Mindstorms highlights some of the reasoning behind that feeling and what we can do as teachers to help minimize it.',
    rating: 5,
    genre: 3,
    amazon_id: '0465046746'
  },
  {
    id: 2,
    title: 'Hyperion',
    author: 'Dan Simmons',
    review: "Probably my favorite science fiction book (and series) I've ever read. Hyperion is written in a style similar to The Canterbury Tales, in which a series of stories are told by the main characters. Each story is a gem in itself, but alude to the larger storyline. The scope of the story is ambitious - spanning time, planets religion and love.",
    rating: 5,
    genre: 1,
    amazon_id: '0553283685'
  },
  {
    id: 3,
    title: "Jony Ive: The Genius Behind Apple's Greatest Products",
    author: 'Leander Kahney',
    review: "Even though I respect Ive, I felt this biography only hit skin deep. It went over all the major events in his life, his passion for design, awards he achieved -- but that's really it. I dont't feel I know him anymore than before reading this.",
    rating: 2,
    genre: 3,
    amazon_id: '159184617X'
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
    books: [2]
  },
  {
    id: 2,
    name: 'Fiction'
  },
  {
    id: 3,
    name: 'Non-Fiction',
    books: [1,3]
  }
];