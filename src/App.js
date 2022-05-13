import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { Typography } from '@material-ui/core';
import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles.js';
import wordsToNumbers from 'words-to-numbers';

const alanKey = '';


const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles(0);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant='h5' component='h2'>
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant='h5' component='h2'>
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img
          src='https://scontent.fiev11-1.fna.fbcdn.net/v/t1.6435-9/p240x240/67659112_438501920211949_8507331483155824640_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=e3f864&_nc_ohc=pGZlssILlBsAX9Gs1Br&_nc_ht=scontent.fiev11-1.fna&oh=00_AT-9-5kCyZOHCyy-9pgFJH_trOQMfC_YnZ44K2ZjjonaMw&oe=62388F5C'
          className={classes.alanLogo}
          alt='logo'
        />
      </div>

      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
};

export default App;
