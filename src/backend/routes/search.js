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

// Search endpoint
router.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    );
    res.json(results);
});

export default router;
