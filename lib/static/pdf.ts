import { PaperFormat } from 'puppeteer';
import { configDotenv } from 'dotenv';
configDotenv();
export const pdfStyle = `
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1;
        font-family: Calibri;
      }

      .info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
      .info_black {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        background-color: black;
        color: white;
        padding-inline: 2rem;
      }
      .infoRight {
        text-align: right;
        font-size: 20px;
      }

      .infoLeft {
        text-align: right;
        font-size: 20px;
      }

      .username {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        margin-top: 30px;
        line-height: 1.3;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th,
      td {
        border: 1px solid black;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 5px;
        padding-right: 5px;
        white-space: pre-wrap;
      }

      th {
        color: white;

        background-color: black;
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
    </style>
`;

export const pdfBufferObject: {
  format: PaperFormat;
  displayHeaderFooter: boolean;
  printBackground: boolean;
  waitForFonts: boolean;
} = {
  format: 'A4',
  displayHeaderFooter: true,
  printBackground: true,
  waitForFonts: true,
};

export const puppeteerConfig =
  process.env.NODE_ENV == 'development'
    ? {}
    : {
        executablePath:
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Use system Chrome
        args: [
          '--disable-gpu',
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--no-zygote',
          '--disable-web-security',
        ],
      };
