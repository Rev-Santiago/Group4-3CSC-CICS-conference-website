import express from 'express';

const router = express.Router();

// Mock data for demonstration purposes
const data = [
    { title: "Welcome to UST CICS Conference Website", content: "The University of Santo Tomas College of Information and Computing Sciences (UST CICS) stands at the forefront of technology-driven innovation and academic excellence..." },
    { title: "Call For Papers/Tracks", content: "Track 1: Innovative Computing and Emerging Technologies..." },
    { title: "Call For Papers/Submission Guidelines", content: "All authors should use the IET Proceedings Template (Word) or IET Proceedings Template (Latex) for submission." },
    { title: "Schedule/Announcements", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum." },
    { title: "Conference Partners", content: "CICS 2025 is proud to collaborate with leading organizations from industry and academia. Our partners provide essential support, resources, and expertise that make this conference possible." },
    { title: "Event History/Announcements", content: "The Computing and Information Systems Conference (CICS) has a rich history of bringing together leading researchers, practitioners, and industry professionals. Below you can explore our previous events and their detailed programs." },
    { title: "Registration and Fees/Conference Fees", content: ""},
    { title: "Registration and Fees/Payment Guidelines", content: "Each author registration is valid for one accepted paper. The registration fee covers conference proceedings and publications..." },
    { title: "Registration and Fees/Presentation Video", content: "All authors of accepted papers of CICS-Conference Portal 2024 who have registered for presentation are required to upload a pre-recorded video of their paper presentation in the EDAS system..." },
    { title: "Publication/Conference Proceedings", content: "Accepted and peer-reviewed conference papers will be published as part of the IET Conference Proceedings." },
    { title: "Publication/Previous Conference Publications", content: ""},
    { title: "Schedule/Announcements", content: "Schedule updates will be posted here and sent to registered participants via email." },
    { title: "Schedule/Schedule Details", content: "Schedule updates will be posted here and sent to registered participants via email." },
    { title: "Venue/Announcements", content: "Note: COVID-19 safety protocols will be enforced in all venue spaces. Masks are recommended in crowded indoor sessions, and hand sanitizing stations will be available throughout the venue." },
    { title: "Venue/Venue Details", content: ""},
    { title: "Speakers/Keynote Speakers", content: ""},
    { title: "Speakers/Invited Speakers", content: ""},
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