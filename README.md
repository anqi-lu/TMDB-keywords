
# TMDB Movie Plot Keywords Visualization 

A project that visualizes most frequent plot keywords in movies from [TMDB 5000 Movie Dataset](https://www.kaggle.com/tmdb/tmdb-movie-metadata) on Kaggle. 

Deployed on github pages at [https://anqi-lu.github.io/TMDB-keywords/](https://anqi-lu.github.io/TMDB-keywords/).

The TMDB 5000 Movie Dataset contains information for about 5000 movies from The Movie Database(TMDB), a crowd-sourced movie information database. The movie information includes movie genres, country, actors, directors, plot keywords, gross profit, and much more. 

## Prototyping

The first visualization I made on this dataset was a [donut chart](https://bl.ocks.org/anqi-lu/01dfba5176131dffa961b923047c9fd2), illustrating the number of movies by country.  It shows the which countries are the movies from. Because TMDB is built entirely by the user so there could be a lot of bias in the data (Most movies are from western countries). Therefore, I decided that I was not going to do much with the “country” attribute of the data. Instead, I decided to focus on the “plot_keywords”, “genres”, and “year”.

The questions about this dataset became: 
- What plot keywords are the most common among all the movies?
- How do most common keywords vary according to genre?
- Are there trends in keywords over time?

According to the questions, I listed the following tasks:
1. Word cloud of top 20 key words for all genres
2. Genre filter — display top 20 keywords for each genre 3. Line chart of count by year
3. Line chart of count by year

## Sketch 

![sketch](https://user-images.githubusercontent.com/11758570/32586889-5b1354f2-c4d3-11e7-9c96-7906151c2e90.JPG)

Source of Inspiration:
[60 years of french first names](https://dataaddict.fr/prenoms/) and 
[stream-graph explorer](https://unhcr.github.io/dataviz-streamgraph-explorer)

This sketch brings the additional tasks:

4. Select multiple keywords and assign different color for each line in the line chart 
5. Hover to select a year and corresponding tooltip
6. Zoom by brushing on the year

## Interactions

<img width="400" alt="wordcloud" src="https://user-images.githubusercontent.com/11758570/32587217-2054e3d8-c4d5-11e7-9e01-d14d12745019.png">

* Word cloud on the left
  * Bigger the size, more frequent the word appeared
  * Click on a word, draws a line on the line chart on the right
  
<img width="400" alt="genre" src="https://user-images.githubusercontent.com/11758570/32587232-3f50ee62-c4d5-11e7-84bd-42a51dd412d7.png">

* Checkboxes — filter for genre below word cloud
    * Only one can be selected
    * Word cloud updated to the top 10 keywords from the selected genre

<img width="1000" alt="screen shot 2017-11-06 at 8 26 05 pm" src="https://user-images.githubusercontent.com/11758570/32587271-776e2bd4-c4d5-11e7-95c4-bf4b41954952.png">

* Line Chart on the right
  * x-axis: year, y-axis: frequency
  * Can draw multiple lines with multiple words selected

<img width="600" alt="tooltip" src="https://user-images.githubusercontent.com/11758570/32587464-807a30dc-c4d6-11e7-93d2-3ae00e24c0b1.png">

* On the line chart, hover over the year shows a tooltip with the frequency of the selected words at the year being hovered over. 

## Future Work

- Add animation to have smooth transitions
- Respond to resize 

## Attribution

This D3.js web project is forked from [curran](https://github.com/curran)'s [this template project](https://github.com/curran/dataviz-project-template).
