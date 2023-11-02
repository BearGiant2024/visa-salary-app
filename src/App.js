import React, { useState } from "react";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";

const API_KEY = `AIzaSyCPiVRDxxQFWZjanUQx2oPrnEg3cqMjz3k`;
const SPREADSHEET_ID = `12hKO-ucUdcb7ZPiGdkAW3WxX7proDzH8CCJIr4OlaY0`;

const SHEET_RANGE = "'Form Responses 1'!A2:H";

const fetchSheetData = async (spreadsheetId, range, apiKey) => {
  let fetchedData = [];

  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data.values.map((row) => {
        const record = {
          recruiterInitials: row[0],
          company: row[1],
          year: row[2],
          stage: row[3],
          followUp: row[4],
        };
        return record;
      });

      return fetchedData;
    })
    .catch((error) => {
      console.error(error);
    });
};

function App() {
  const [recruiterInitials, setRecruiterInitials] = useState("");
  const [company, setCompany] = useState("");
  const [year, setYear] = useState("All Years");
  const [ghostingRecords, setGhostingRecords] = useState([]);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both fields are empty
    if (!recruiterInitials.trim() && !company.trim()) {
      setError("Please provide either Recruiter's Initials or Company name");
      setShowResults(false);
      return;
    }

    setError(""); // Clear previous errors

    try {
      const fetchedData = await fetchSheetData(
        SPREADSHEET_ID,
        SHEET_RANGE,
        API_KEY
      );

      const filteredData = fetchedData.filter((record) => {
        const isRecruiterIntitals = record.recruiterInitials
          .toLowerCase()
          .includes(recruiterInitials.toLowerCase());

        const isCompany = record.company
          .toLowerCase()
          .includes(company.toLowerCase());

        const isYear =
          year === "All Years" || parseInt(record.year) === parseInt(year);

        return isRecruiterIntitals && isCompany && isYear;
      });

      setGhostingRecords(filteredData);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const years = [];

  for (let year = 2023; year >= 2012; year--) {
    years.push(year);
  }

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <div className="app-container">
      <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-center mb-5">
          <b>Ghosting's Database</b>
        </h1>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-3">
              <Form.Control
                type="text"
                value={recruiterInitials}
                onChange={(e) => setRecruiterInitials(e.target.value)}
                placeholder="Recruiter's Initials"
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <Form.Control
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option>All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="col-lg-2 col-md-6 mb-3">
              <Button variant="primary" type="submit" style={{ width: "100%" }}>
                Search
              </Button>
            </div>
          </div>
        </Form>
        {showResults && (
          <div
            className="table-responsive mt-4"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <Table striped bordered hover>
              {ghostingRecords.length > 0 ? (
                <>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Recruiter's Initials</th>
                      <th>Stage</th>
                      <th>Follow Up</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ghostingRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.company}</td>
                        <td>{record.recruiterInitials}</td>
                        <td>{record.stage}</td>
                        <td>{record.followUp}</td>
                        <td>{record.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="5">No records found.</td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
        )}
        <p className="text-center col-lg-8 mx-auto my-5">
          Ghostings.fyi is a database collection of unpleasant experiences by job
          candidates who stopped receiving responses from recruiters during their
          interview process. The database aims to bring more transparency to the 
          recruitment process and give candidates a forum to archive these interactions
          as experiences matter. You can browse previously reported experiences
          using the search function above. You may also anonymously submit your own 
          personal experiences to be reviewed by the team at the link below. Please note 
          that Google Sheets requires you to log in to verify that you are a real person, 
          but we DO NOT collect any information other than your responses. We ask that 
          this list be used solely to catalog real experiences or for research purposes 
          while evaluating potential employers and not in any other malicious manner. 
          Again, experiences matter and  we hope that our efforts improve the overall 
          recruitment process for both candidates and companies in the future.
        </p>
        <div className="row">
          <Button
            style={{ width: "100%" }}
            variant="secondary"
            onClick={() =>
              openInNewTab(
                "https://docs.google.com/forms/u/1/d/e/1FAIpQLSfnvMHVuxRXez5_ih43I9p-p8iXv9PZRXuXJZsYF6O76Td4sA/viewform?usp=sf_link"
              )
            }
          >
            Experience Submission Form
          </Button>
        </div>

        <div className="row"></div>
      </Container>
    </div>
  );
}

export default App;
