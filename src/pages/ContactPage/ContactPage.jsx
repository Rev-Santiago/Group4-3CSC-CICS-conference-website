import React from "react";
import { Container } from "@mui/material";

const ContactPage = () => {
    return (
        <section className="contact">
            <Container>
                <div className="container mx-auto text-customRed pb-10">
                    <h1 className="text-3xl">Contact</h1>

                    {/* Main Contact */}
                    <section className="mt-8">
                        <p className="text-gray-700 mt-2">
                            Email: sampleemail@ust.edu.ph
                        </p>
                        <p className="text-gray-700 mt-2">
                            Telephone: +631 234 5678
                        </p>

                        {/* Person 1 */}
                        <div className="mt-4">
                            <h3 className="text-xl text-customRed">Person 1</h3>
                            <p className="text-gray-700 mt-2">
                                Email: sampleemail@ust.edu.ph
                            </p>
                            <p className="text-gray-700 mt-2">
                                Telephone: +631 234 5678
                            </p>
                        </div>

                        {/* Person 2 */}
                        <div className="mt-4">
                            <h3 className="text-xl text-customRed">Person 2</h3>
                            <p className="text-gray-700 mt-2">
                                Email: sampleemail@ust.edu.ph
                            </p>
                            <p className="text-gray-700 mt-2">
                                Telephone: +631 234 5678
                            </p>
                        </div>

                        {/* Person 3 */}
                        <div className="mt-4">
                            <h3 className="text-xl text-customRed">Person 3</h3>
                            <p className="text-gray-700 mt-2">
                                Email: sampleemail@ust.edu.ph
                            </p>
                            <p className="text-gray-700 mt-2">
                                Telephone: +631 234 5678
                            </p>
                        </div>
                    </section>
                </div>
            </Container>
        </section>
    );
};

export default ContactPage;
