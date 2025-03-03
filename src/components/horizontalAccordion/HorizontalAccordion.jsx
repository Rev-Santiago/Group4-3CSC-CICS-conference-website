import * as React from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function HorizontalAccordion() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mx-20">
        
      {/* Accordion 1 - Registration and Tracks */}
      <Accordion className="!bg-customRed border border-gray-400">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="text-white">
            Register now at CICS 2025 and Join us
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-white w-full">
          <Typography variant="h6" className="font-bold py-3">Tracks</Typography>

          {/* Track 1 */}
          <Typography className="text-customRed font-semibold mt-2 pb-3">
            Track 1: Innovative Computing and Emerging Technologies
          </Typography>
          <Typography className="text-gray-700 pb-3">
            High-Performance Computing; Cloud and Edge Computing; Artificial Intelligence; 
            Quantum Computing; Blockchain Technology; Cybersecurity and Digital Forensics; 
            Augmented Reality (AR) and Virtual Reality (VR); Internet of Things (IoT); Software 
            Development and Engineering; Distributed Systems; Data Analytics and Visualization; Green Computing.
          </Typography>

          {/* Track 2 */}
          <Typography className="text-customRed font-semibold mt-2 pb-3">
            Track 2: Data Science and Intelligent Systems
          </Typography>
          <Typography className="text-gray-700 pb-3">
            Big Data Analytics; Machine Learning; Deep Learning Applications; Natural Language Processing; 
            Data Mining; Smart Systems; Predictive Analytics; Decision Support Systems; Computer Vision; 
            Robotic Process Automation; Hybrid Intelligent Systems; Neural Network Applications; Advanced Algorithms.
          </Typography>

          {/* Track 3 */}
          <Typography className="text-customRed font-semibold mt-2 pb-3">
            Track 3: Sustainable Technology and Smart Innovations
          </Typography>
          <Typography className="text-gray-700 pb-3">
            Renewable Energy Technologies; Smart Cities and Smart Grids; Environmental Informatics; 
            Energy Management Systems; Green Energy Solutions; Automation and Control Systems; 
            Nanotechnology; Embedded Systems; Green Materials and Sensors; Low Power Electronics; 
            Environmental Monitoring and Data Integration; Technological Solutions for Sustainability.
          </Typography>

          {/* Submission Link */}
          <Typography variant="h6" className="font-bold mt-4 pb-3">Submission Link</Typography>
          <Typography className="text-gray-700">Please submit your papers at</Typography>
          <Button className="!bg-customRed hover:customRed mt-2 !text-white">
            Edas Submission Link for CICS
          </Button>
          <Typography 
            className="text-customRed mt-2 cursor-pointer pt-3" 
            onClick={() => navigate("/call-for-papers")}
          >
            Go to Call For Papers Page ➤
          </Typography>
        </AccordionDetails>
      </Accordion>

       {/* Accordion 2 - Publications */}
       <Accordion className="!bg-customRed border border-gray-400">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span" className="text-white">Publications</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-white">
          <Typography variant="h6" className="font-bold text-center pb-4">
            Previous Conference Publications
          </Typography>

          {/* Table Section with Borders */}
          <TableContainer component={Paper} className="border">
            <Table>
                <TableHead>
                <TableRow sx={{ backgroundColor: "#B7152F" }}>
                    <TableCell 
                    sx={{ 
                        color: "white", 
                        fontWeight: "bold", 
                        borderRight: "2px solid white", 
                        textAlign: "center"
                    }}>
                    Date
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                    Description
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                <TableRow>
                    <TableCell sx={{ borderRight: "1px solid gray", textAlign: "center" }}>
                    15 August 2024 (Initial); 15 September 2024 (Final); 30 September 2024 (Hard Extension)
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Paper Submission</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderRight: "1px solid gray", textAlign: "center" }}>
                    30 September 2024 (First Batch); 15 October 2024 (Final); 31 October 2024 (Hard Extension)
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Full-Paper Acceptance</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderRight: "1px solid gray", textAlign: "center" }}>15 November 2024</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Camera-Ready Submission</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderRight: "1px solid gray", textAlign: "center" }}>1 October 2024 – 31 October 2024</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Early Bird Registration</TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

          {/* Link to Publications Page */}
          <Typography 
            className="text-customRed mt-4 cursor-pointer pt-3"
            onClick={() => navigate("/publications")}
          >
            Go to Publication Page ➤
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
