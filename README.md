# VeraLex - Legal Marketplace Platform

VeraLex is a modern web platform that connects clients seeking legal representation with qualified lawyers. This application streamlines the process of finding legal help and enables lawyers to expand their practice by finding new clients.

![VeraLex](https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)

## Features

### For Clients
- Post legal cases as plaintiff or defendant
- Browse and review lawyer profiles
- Receive applications from qualified attorneys
- Secure in-app messaging with lawyers
- Track case status and updates
- Close cases and leave reviews

### For Lawyers
- Create professional profiles with specializations
- Upload and verify bar association credentials
- Browse available cases by type and location
- Apply to cases with customized proposals
- Manage client relationships and case statuses
- Build reputation through client reviews

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Custom components with Tailwind styling
- **Routing**: React Router
- **Animation**: Framer Motion for smooth transitions and animations
- **Forms**: React Hook Form for form validation and handling

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/veralex.git
cd veralex
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser to `http://localhost:5173` to see the application

## Project Structure

```
veralex/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── auth/         # Authentication components
│   │   ├── client/       # Client-specific components
│   │   ├── lawyer/       # Lawyer-specific components
│   │   └── admin/        # Admin-specific components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layout components
│   ├── pages/            # Page components
│   │   ├── public/       # Public pages (home, about, etc.)
│   │   ├── auth/         # Authentication pages
│   │   ├── client/       # Client dashboard pages
│   │   ├── lawyer/       # Lawyer dashboard pages
│   │   └── admin/        # Admin dashboard pages
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Application entry point
├── .gitignore            # Git ignore file
├── index.html            # HTML entry
├── package.json          # Project dependencies
├── README.md             # Project documentation
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.js        # Vite configuration
```

## Deployment

This application can be built for production using:

```
npm run build
```

This will generate optimized assets in the `dist` directory, which can be deployed to any static hosting service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped build this platform
- Legal professionals who provided domain expertise
- The React and Tailwind CSS communities for excellent documentation
