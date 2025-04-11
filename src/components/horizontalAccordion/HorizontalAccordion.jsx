import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from '@mui/material';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

// Constants
const API_URL = "http://localhost:5000/api/publications";
const TRACKS = [
    {
        id: 1,
        title: "Track 1: Innovative Computing and Emerging Technologies",
        description: "High-Performance Computing; Cloud and Edge Computing; Artificial Intelligence; " +
            "Quantum Computing; Blockchain Technology; Cybersecurity and Digital Forensics; " +
            "Augmented Reality (AR) and Virtual Reality (VR); Internet of Things (IoT); Software " +
            "Development and Engineering; Distributed Systems; Data Analytics and Visualization; Green Computing."
    },
    {
        id: 2,
        title: "Track 2: Data Science and Intelligent Systems",
        description: "Big Data Analytics; Machine Learning; Deep Learning Applications; Natural Language Processing; " +
            "Data Mining; Smart Systems; Predictive Analytics; Decision Support Systems; Computer Vision; " +
            "Robotic Process Automation; Hybrid Intelligent Systems; Neural Network Applications; Advanced Algorithms."
    },
    {
        id: 3,
        title: "Track 3: Sustainable Technology and Smart Innovations",
        description: "Renewable Energy Technologies; Smart Cities and Smart Grids; Environmental Informatics; " +
            "Energy Management Systems; Green Energy Solutions; Automation and Control Systems; " +
            "Nanotechnology; Embedded Systems; Green Materials and Sensors; Low Power Electronics; " +
            "Environmental Monitoring and Data Integration; Technological Solutions for Sustainability."
    }
];

/**
 * TrackItem component to display individual conference tracks
 */
const TrackItem = ({ title, description }) => (
    <Box
        sx={{
            padding: 2,
            mb: 2,
            borderLeft: '4px solid #B7152F',
            backgroundColor: 'rgba(183, 21, 47, 0.03)',
            borderRadius: '0 4px 4px 0',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: 'rgba(183, 21, 47, 0.08)',
                transform: 'translateX(5px)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }
        }}
    >
        <Typography
            className="text-customRed font-semibold"
            sx={{
                fontSize: '1.1rem',
                mb: 1,
                fontWeight: 600
            }}
        >
            {title}
        </Typography>
        <Typography
            className="text-gray-700"
            sx={{
                lineHeight: 1.6
            }}
        >
            {description}
        </Typography>
    </Box>
);

/**
 * PublicationsTable component to display publications in a table format
 */
const PublicationsTable = ({ publications }) => {
    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    const tableHeaderStyle = {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        borderColor: "black",
        fontSize: '1.1rem',
        padding: '16px 8px'
    };

    return (
        <TableContainer
            className="border"
            sx={{
                borderColor: "black",
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#B7152F", borderColor: "black" }}>
                        <TableCell
                            sx={{
                                ...tableHeaderStyle,
                                borderRight: "1px solid black",
                                width: '30%'
                            }}>
                            Date
                        </TableCell>
                        <TableCell sx={tableHeaderStyle}>
                            Description
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {publications.length > 0 ? (
                        publications.map((pub, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'rgba(183, 21, 47, 0.05)',
                                    }
                                }}
                            >
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                        borderRight: "1px solid black",
                                        borderColor: "black",
                                        fontWeight: 500,
                                        padding: '12px 8px'
                                    }}
                                >
                                    {formatDate(pub.publication_date)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: 'center',
                                        borderColor: 'black',
                                        color: 'rgb(30, 58, 138)',
                                        padding: '12px 8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: '#B7152F',
                                            backgroundColor: 'rgba(183, 21, 47, 0.05)',
                                        },
                                    }}
                                >
                                    {pub.publication_description}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} sx={{ textAlign: "center", borderColor: "black", padding: '20px' }}>
                                No publications available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

/**
 * Custom Accordion Panel component with enhanced visual effects
 */
const AccordionPanel = ({ panelId, title, expanded, handleChange, children }) => {
    const isExpanded = expanded === panelId;

    return (
        <Box
            sx={{
                mb: 2,
                transition: 'transform 0.3s ease',
                transform: isExpanded ? 'scale(1.01)' : 'scale(1)',
            }}
        >
            <Accordion
                className="border border-gray-400"
                expanded={isExpanded}
                onChange={handleChange(panelId)}
                sx={{
                    backgroundColor: '#B7152F',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: isExpanded
                        ? '0 8px 15px rgba(183, 21, 47, 0.2)'
                        : '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                        boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
                    },
                    '&:before': {
                        display: 'none', // Remove default MUI accordion line
                    }
                }}
            >
                <AccordionSummary
                    expandIcon={
                        <Box
                            sx={{
                                backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                padding: '2px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isExpanded ?
                                <CloseIcon sx={{ color: "white", transition: 'transform 0.3s ease', transform: 'rotate(180deg)' }} /> :
                                <AddIcon sx={{ color: "white", transition: 'transform 0.3s ease', transform: 'rotate(0deg)' }} />
                            }
                        </Box>
                    }
                    aria-controls={`${panelId}-content`}
                    id={`${panelId}-header`}
                    sx={{
                        padding: '8px 16px',
                        justifyContent: "center",
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.05)',
                        },
                        '& .MuiAccordionSummary-content': {
                            margin: '10px 0',
                        }
                    }}
                >
                    <Typography
                        component="span"
                        className="text-white"
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            transition: 'transform 0.3s ease',
                            transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        {title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    className="bg-white w-full"
                    sx={{
                        padding: '24px 20px',
                        backgroundColor: 'white',
                        borderTop: '2px solid rgba(183, 21, 47, 0.5)',
                    }}
                >
                    {children}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

/**
 * Enhanced Navigation Button Component
 */
const NavigationButton = ({ to, children }) => {
    const navigate = useNavigate();

    return (
        <Typography
            onClick={() => navigate(to)}
            sx={{
                color: '#B7152F',
                mt: 3,
                pt: 1,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateX(8px)',
                    textDecoration: 'underline',
                },
                '&:after': {
                    content: '"➤"',
                    marginLeft: '8px',
                    transition: 'transform 0.3s ease',
                },
                '&:hover:after': {
                    transform: 'translateX(3px)',
                }
            }}
        >
            {children}
        </Typography>
    );
};

/**
 * HorizontalAccordion Component
 */
export default function HorizontalAccordion() {
    const navigate = useNavigate();
    const [publications, setPublications] = React.useState([]);
    const [expanded, setExpanded] = React.useState(null);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    // Fetch publications on component mount
    React.useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch(`${API_URL}?page=1&limit=4`);
                const data = await response.json();

                if (data.data) {
                    setPublications(data.data);
                }
            } catch (error) {
                console.error("Error fetching publications:", error);
            }
        };

        fetchPublications();
    }, []);

    return (
        <Container sx={{ py: 4 }}>
            <div className="space-y-6">
                {/* Registration and Tracks Accordion */}
                <AccordionPanel
                    panelId="panel1"
                    title="Register now at CICS 2025 and Join us"
                    expanded={expanded}
                    handleChange={handleAccordionChange}
                >
                    <Typography
                        variant="h6"
                        className="font-bold py-3"
                        sx={{
                            borderBottom: '2px solid rgba(183, 21, 47, 0.2)',
                            paddingBottom: '10px',
                            marginBottom: '15px',
                            fontWeight: 700,
                            color: '#333'
                        }}
                    >
                        Tracks
                    </Typography>

                    {/* Map through tracks */}
                    {TRACKS.map(track => (
                        <TrackItem
                            key={track.id}
                            title={track.title}
                            description={track.description}
                        />
                    ))}

                    {/* Submission Section */}
                    <Typography
                        variant="h6"
                        className="font-bold mt-4 pb-3"
                        sx={{
                            borderBottom: '2px solid rgba(183, 21, 47, 0.2)',
                            paddingBottom: '10px',
                            marginBottom: '15px',
                            fontWeight: 700,
                            color: '#333'
                        }}
                    >
                        Submission Link
                    </Typography>
                    <Typography className="text-gray-700" sx={{ mb: 2 }}>
                        Please submit your papers at
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Button
                            onClick={() => window.open("https://edas.info/login.php?rurl=aHR0cHM6Ly9lZGFzLmluZm8vTjMyMjgxP2M9MzIyODE=", "_blank")}
                            className="!bg-customRed !text-white"
                            sx={{
                                backgroundColor: '#B7152F',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 5px rgba(183, 21, 47, 0.3)',
                                display: 'inline-block',
                                marginBottom: -2,
                                width: 'auto',
                                maxWidth: '300px',
                                '&:hover': {
                                    backgroundColor: '#8E1023',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(183, 21, 47, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(1px)',
                                    boxShadow: '0 1px 3px rgba(183, 21, 47, 0.4)',
                                },
                            }}
                        >
                            EDAS SUBMISSION LINK FOR CICS
                        </Button>
                        <NavigationButton to="/call-for-papers">
                            Go to Call For Papers Page
                        </NavigationButton>
                    </div>
                </AccordionPanel>

                {/* Publications Accordion */}
                <AccordionPanel
                    panelId="panel2"
                    title="Publications"
                    expanded={expanded}
                    handleChange={handleAccordionChange}
                >
                    <h3 className="text-xl text-customRed mb-2">Conference Proceedings</h3>
                    <p className="text-gray-700 mb-6">
                        Accepted and peer-reviewed conference papers will be published as part of the IET Conference Proceedings.
                        The proceedings will be submitted for indexing in major academic databases including IEEE Xplore, Scopus,
                        and Web of Science. Authors of selected high-quality papers may be invited to extend their work for
                        publication in special issues of renowned international journals.
                    </p>

                    <Typography
                        variant="h6"
                        className="font-bold text-center pb-2"
                        sx={{
                            borderBottom: '2px solid rgba(183, 21, 47, 0.2)',
                            paddingBottom: '10px',
                            marginBottom: '20px',
                            fontWeight: 700,
                            color: '#333'
                        }}
                    >
                        Previous Conference Publications
                    </Typography>

                    <PublicationsTable publications={publications} />

                    <NavigationButton to="/publication">
                        Go to Publication Page
                    </NavigationButton>
                </AccordionPanel>
            </div>
        </Container>
    );
}