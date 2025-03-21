import React from "react";
import { useLocation } from 'react-router-dom';
import { Container } from "@mui/material";

const searchResults = [
    {
        title: "2023/Publication",
        content:
            "Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.",
    },
    {
        title: "Publication",
        content:
            "Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.",
    },
    {
        title: "Committee",
        content: 
            "Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.",
    },
    {
        title: "2023/Committee",
        content:
            "Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.",
    },
    {
        title: "2023/Welcome",
        content:
           "Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.",
    },
];

function SearchResultPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query');

    return (
        <Container>
            <div className="mx-auto ">

                <h1 className="text-2xl mb-4">Search results</h1>
                <div>
                    {searchResults.map((result, index) => (
                        <div key={index} className="pb-4">
                            <a href="#" className="text-customRed text-lg font-semibold">
                                {index + 1}. {result.title}
                            </a>
                            <p className="text-gray-700 mt-1">{result.content}</p>
                            {index !== searchResults.length - 1 && (
                                <hr className="my-4 border-gray-300" />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </Container>
    );
};

export default SearchResultPage;
