# QR Code Generator

## Overview

The QR Code Generator is a Next.js application that allows users to create and download multiple QR codes based on user-inputted text or URLs. Users can customize various settings, such as colors, margins, error correction levels, and mask patterns before generating and downloading their QR codes in a ZIP file.

## Features

- **User-Friendly Interface**: Intuitive form for inputting text or URLs.
- **Dynamic QR Code Generation**: Generate multiple QR codes with a single click.
- **Customization Options**: Adjust QR code settings including:
  - Error Correction Level (Low, Medium, Quartile, High)
  - Mask Pattern (0 to 7)
  - Dark and Light Color Selection
  - Margin and Width Settings
- **Downloadable ZIP File**: Download all generated QR codes in a convenient ZIP format.

## Technologies Used

- **Next.js**: A React framework for building server-rendered applications.
- **TypeScript**: For type safety and improved developer experience.
- **Zod**: For schema validation of user inputs.
- **React Hook Form**: For managing form state and validation.
- **QRCode.js**: To generate QR codes.
- **JSZip**: For creating ZIP files.
- **Lucide React**: For SVG icons.

## Installation

To get started with the QR Code Generator, follow these steps:

1. Clone the repository:
   ```bash
   git clone git@github.com:mynhinguyentruong/qrcode-generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd qrcode-generator
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

1. Enter the text or URL you want to convert into a QR code in the input field.
2. Click the "Add links" button to include additional inputs.
3. Customize the QR code settings as desired.
4. Click the "Generate" button to create the QR codes.
5. Once generated, download all QR codes as a ZIP file using the provided link.

## File Structure

```plaintext
.
├── components
│   ├── ui
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   ├── Body.tsx
├── pages
│   ├── api
│   │   ├── generate.ts
│   ├── index.tsx
├── styles
│   ├── globals.css
├── package.json
└── README.md
```