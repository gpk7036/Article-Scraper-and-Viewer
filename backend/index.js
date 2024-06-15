const express = require('express');
const cors = require('cors');
const openmediem = require('./scrapper');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let articles = [];

const setArticles = (newArticles) => {
    articles = newArticles;
};

const getArticles = () => {
    return articles;
};

app.post('/scrape', async (req, res) => {
    const { topic } = req.body;
    try {
        const scrapedArticles = await openmediem(topic);
        setArticles(scrapedArticles);
        res.json(scrapedArticles); 
    } catch (error) {
        console.error('Error scraping Medium:', error);
        res.status(500).json({ error: 'Failed to scrape articles' });
    }
});

app.get('/articles', (req, res) => {
    const allArticles = getArticles();
    res.json(allArticles);
})

app.get('/', (req, res) => {
    res.send('home page')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})