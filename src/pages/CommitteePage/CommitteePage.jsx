import React from "react";
import { Container } from "@mui/material";

const CommitteePage = () => {
  return (
    <section className="committee">
        <Container>
            <div className="container mx-auto pb-10">
                <h1 className="text-3xl">Organizing Committee</h1>
                <section className="mt-8">

                    {/* Person 1 */}
                    <div className="mt-4">
                    <h3 className="text-xl text-customRed">Position</h3>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                    </div>
                    {/* Person 2 */}
                    <div className="mt-4">
                        <h3 className="text-xl text-customRed">Position</h3>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                    </div>

                    {/* Person 3 */}
                    <div className="mt-4">
                        <h3 className="text-xl text-customRed">Position</h3>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                        <p className="text-gray-700 mt-2">
                            Name
                        </p>
                    </div>
                </section>
            </div>
        </Container>
    </section>
  );
};

export default CommitteePage;
