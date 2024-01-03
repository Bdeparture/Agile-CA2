# Assignment 2 - Agile Software Practice

Name: Sisi Chen

## API endpoints

### Users

+ GET /api/users - get all the users of the app.
+ POST /api/users - verify the account.
+ PUT /api/users/update/:id - update the information of the user.
+ POST /api/users/:userName/favourites - add the movie into favourite for different user.
+ GET /api/users/:userName/favourites - get the favourites movies of the account.
+ DELETE /api/users/:userName/favourites - remove the movie from favourite.

### Genres

+ GET /api/genres - get the genres.
+ GET /api/genres/tmdb - get the genres list.

### People

+ GET /api/people - get the people.
+ GET /api/people/tmdb/:id - get the id of a person.
+ GET /api/people/tmdb/peopleList/:page - get peopleList and change the page.
+ GET /api/people/tmdb/:id/peopleImages - get images of people.
+ GET /api/people/tmdb/:id/peopleMovieCredits - get credits of people.

### Movies

+ GET /api/movies - get the movies.
+ GET /api/movies/tmdb/:id - get the movies id.
+ GET /api/movies/tmdb/popular/:page - get popular movies.
+ GET /api/movies/tmdb/upcoming/:page - get upcoming movies.
+ GET /api/movies/tmdb/topRated/:page - get top rated movies.
+ GET /api/movies/tmdb/:id/images - get movies' images.
+ GET /api/movies/:id/reviews - get reviews of movies.
+ POST /api/movies/:id/reviews - add the review of movies.
+ GET /api/movies/tmdb/:id/movie_credits - get the credits of movies.

## Automated Testing

~~~
 Users endpoint
    PUT /api/users/update/:id
database connected to movies on ac-tzaru1y-shard-00-02.ddtbgzs.mongodb.net
      √ should update a user and return 200 status (225ms)
      √ should return 404 for non-existing user
    POST /api/users/:userName/favourites
      for valid user name
        when the movie is not in favourites
          √ should return a status 200 and message (46ms)
        when the movie is in favourites
          √ return error message and a status 404
    GET /api/users/:userName/favourites
      √ should return the favourites list and status 200
    DELETE /api/users/:userName/favourites
      for valid user name
        when the movie is in favourites
          √ should return user message and a status 201

  Genres endpoint
    GET /api/genres
      √ should return 4 genres and a status 200
    GET /api/genres/tmdb 
      √ should return a list of genres and a status 200

  People endpoint
    GET /api/people
      √ should return 20 people and a status 200 (69ms)
    GET /api/people/tmdb/:id
      for valid id
        √ should an object of people and a status 200 (120ms)
      for invalid id
        √ should return the NOT found message
    GET /api/people/tmdb/peopleList/:page
      when the page is valid number
        √ should return popular movies for a given page (90ms)
      when the page is invalid number
        √ should return a status 404 and the corresponding message
    GET /api/people/tmdb/:id/peopleImages
      for a valid id
        √ should return a person's images from tmdb and a status 200 (76ms)
      for an invalid id
        √ should return error message and a status 404
    GET /api/people/tmdb/:id/peopleMovieCredits
      for a valid id
        √ should return a person's movie credits from tmdb and a status 200 (100ms)
        for an invalid id
          √ should return error message and a status 404

  Movies endpoint
    GET /api/movies
      √ should return 20 movies and a status 200
    GET /api/movies/tmdb/:id
      when the id is valid
        √ should return the matching movie
      when the id is invalid
        √ should return the NOT found message
    GET /api/movies/tmdb/popular/:page
      when the page is valid number
        √ should return popular movies for a given page (82ms)
      when the page is invalid number
        √ should return a status 404 and the corresponding message
    GET /api/movies/tmdb/upcoming/:page
      when the page is valid number
        √ should return upcoming movies for a given page (87ms)
      when the page is invalid number
        √ should return a status 404 and the corresponding message
    GET /api/movies/tmdb/topRated/:page
      when the page is valid number
        √ should return topRated movies for a given page (81ms)
      when the page is invalid number
        √ should return a status 404 and the corresponding message
    GET /api/movies/tmdb/:id/images
      when the id is valid number
        √ should return an object containing the images and status 200 (79ms)
      when the id is not number
        √ should return a status 404 and the corresponding message
    GET /api/movies/tmdb/:id/movie_credits
      when the id is valid number
        √ should return an object containing the movie_credits and status 200 (95ms)
      when the id is not number
        √ should return a status 404 and the corresponding message
    GET /api/movies/:id/reviews
      when the id is valid number
        √ should return a list of the reviews in tmdb and status 200 (76ms)
      when the id is not number
        √ should return a status 404 and the corresponding message
    POST /api/movies/:id/reviews
      when the id is valid number
        √ should return a list of the reviews in tmdb and status 200 (78ms)
      when the id is not number
        √ should return a status 404 and the corresponding message (159ms)


  34 passing (10s)
~~~

## Deployments

https://movies-api-staging-css-1479054020eb.herokuapp.com
you can add the api in the behind to look more information like
[this](https://movies-api-staging-css-1479054020eb.herokuapp.com/api/people/tmdb/peopleList/1)

## Independent Learning (if relevant)

[![Coverage Status](https://coveralls.io/repos/gitlab/Bdeparture/agile-ca2-cicd/badge.svg)](https://coveralls.io/gitlab/Bdeparture/agile-ca2-cicd)

## Other related links

gitlab: [Sisi chen / Agile-CA2-cicd · GitLab](https://gitlab.com/Bdeparture/agile-ca2-cicd)
github: [Bdeparture/Agile-CA2 (github.com)](https://github.com/Bdeparture/Agile-CA2)
heroku: [movies-api-staging-css | Heroku](https://dashboard.heroku.com/apps/movies-api-staging-css)