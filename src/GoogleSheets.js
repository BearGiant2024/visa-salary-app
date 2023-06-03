import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// Set up the Google Sheets API client
const getClient = async () => {
  const client = await google.auth.getClient({
    credentials: {
      private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
      client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return client;
};

export const fetchSheetData = async (spreadsheetId, range) => {
  try {
    const client = await getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const fetchedData = response.data.values.map((row) => ({
      employer: row[0],
      jobTitle: row[1],
      baseSalary: parseInt(row[2]),
      location: row[3],
      submitDate: row[4],
      startDate: row[5],
    }));

    return fetchedData;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
};
