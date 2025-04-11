import express from 'express';

const router = express.Router();

// Mock data for demonstration purposes
const data = [
    { title: "Schedule/Announcements", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum." },
    { title: "Publication", content: "In facilisis ex nec ligula egestas." },
    { title: "Committee", content: "Eget viverra odio feugiat." },
    { title: "Payment Guidelines", content: "Each author registration is valid for one accepted paper. The registration fee covers conference proceedings and publications. " },
    { title: "Venue/Announcements", content: "Sed volutpat erat ac venenatis pellentesque." },
];

// Search endpoint with logging
router.get('/search', (req, res) => {
    console.log('Search endpoint hit with query:', req.query);
    
    const query = req.query.query?.toLowerCase() || '';
    
    if (!query) {
        console.log('Empty search query received');
        return res.json([]);
    }
    
    console.log('Searching for:', query);
    
    const results = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    );
    
    console.log(`Found ${results.length} results`);
    
    res.json(results);
});

export default router;