import React from "react";
import { Container, Grid, Typography, Avatar } from "@mui/material";

const partners = [
  { name: "Partner 1" },
  { name: "Partner 2" },
  { name: "Partner 3" },
];

const PartnersPage = () => {
  return (
    <section className="partners">
        <Container className="">
            <Typography variant="h4" color="error" gutterBottom>
                Partners
            </Typography>

            {partners.map((partner, index) => (
                <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 4 }}>
                    {/* Logo Section */}
                    <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                        <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "grey.300",
                            fontSize: 20,
                        }}
                        >
                        LOGO
                        </Avatar>
                    </Grid>

                    {/* Text Section */}
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h6" fontWeight="bold">
                        {partner.name}
                        </Typography>
                        <Typography variant="body1">Lorem ipsum dolor sit amet</Typography>
                        <Typography variant="body2" color="text.secondary">
                        consectetur adipiscing elit
                        </Typography>
                        <Typography variant="body2" mt={1}>
                        Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, 
                        eget viverra odio feugiat. Donec est lectus, posuere eget elit at, sodales semper turpis. 
                        Sed volutpat erat ac venenatis pellentesque. Sed tincidunt sit amet felis eget euismod. 
                        Quisque faucibus vulputate lacus, eget auctor risus interdum a. Fusce finibus vitae est sed luctus.
                        </Typography>
                    </Grid>
                </Grid>
            ))}
        </Container>
    </section>
  );
};

export default PartnersPage;
