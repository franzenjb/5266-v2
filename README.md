# Red Cross Form 5266 v2 - Digital Transformation Project

## 🚀 Project Overview

The **Form 5266 v2 Digital Transformation** project modernizes the American Red Cross's Disaster Operations Control Form (5266), transitioning from a complex, fragile Excel-based system to a robust, real-time web application. This initiative addresses critical operational challenges and enhances disaster response capabilities through modern technology and intelligent design.

## 🎯 Mission Statement

Transform the Red Cross disaster operations reporting from end-of-day batch processing to real-time operational intelligence, enabling faster decision-making and more effective disaster response coordination.

## 📋 Current System Challenges

The existing Excel-based Form 5266 system faces significant limitations:

- **Fragility**: Spreadsheets break when users modify rows/columns
- **No Real-time Visibility**: Data only available after daily report generation
- **Archaic Macro System**: Unstable VBA macros prone to failures
- **Lack of Data Validation**: No error prevention leading to data integrity issues
- **Single Point of Failure**: Broken spreadsheet stops all reporting
- **Manual Data Entry**: Daily manual entry increases complexity and error potential
- **End-of-day Batch Processing**: Delays crucial decision-making

## ✨ New System Features

### Core Capabilities
- **Real-time Data Entry & Viewing**: Immediate operational insights
- **Role-based Access Control**: Users see only relevant data
- **Robust Data Validation**: Prevents errors, ensures data integrity
- **Live Dashboards**: Dynamic visual summaries replace static reports
- **Proper Database Architecture**: PostgreSQL backend for reliability
- **On-Demand IAP Generation**: Streamlined Incident Action Plan creation
- **Mobile-Responsive Design**: Enhanced field operations usability

### Technical Architecture
- **Frontend**: React 18 with Next.js for dynamic, responsive UI
- **Backend**: Node.js/Express API with real-time WebSocket support
- **Database**: PostgreSQL for data persistence and integrity
- **Deployment**: Docker containerization with CI/CD pipeline
- **Monitoring**: Real-time performance and error tracking

## 📁 Project Structure

```
5266-v2/
├── README.md                  # Project documentation
├── planning-docs/             # Planning and reference documents
│   ├── 5266 worksheet screenshots.pdf
│   ├── Disaster5266CollectionTool-Statistics.xlsx
│   ├── Disaster5266CollectionTool-Financials.xlsx
│   ├── Disaster5266LinebyLineDescriptions.pdf
│   ├── IncidentActionPlanTemplate.docx
│   └── Incident-Action-Plan-Form-Directions-JT.pdf
├── prototype/                 # Next.js prototype application
├── docs/                      # Technical documentation
├── src/                       # Source code
│   ├── frontend/             # React frontend application
│   ├── backend/              # Node.js backend API
│   └── database/             # Database schemas and migrations
└── tests/                    # Test suites
```

## 🚀 MVP Scope - Phase 1

### Initial Implementation Focus

#### 1. Start Here Statistics Tab
- DR Number input and display
- Region and Active Counties selection
- Contact Information management (DRO Director, Deputy Director)

#### 2. Feeding Tab
- **Line 9**: Meals Served tracking (manual count)
- **Line 10**: Snacks Served tracking (estimated count)
- Real-time aggregation and reporting

### Key Features
- Web-based data entry forms
- Real-time data persistence to PostgreSQL
- Live dashboard with current statistics
- Basic data validation for quality assurance
- Immediate visibility of operational metrics

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Real-time Updates**: Socket.io-client
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages (static) / Heroku (API)
- **Monitoring**: Sentry for error tracking
- **Testing**: Jest, React Testing Library

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 15+
- Git
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/franzenjb/5266-v2.git
cd 5266-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize database:
```bash
npm run db:migrate
npm run db:seed
```

5. Start development server:
```bash
npm run dev
```

Access the application at `http://localhost:3000`

## 🗓️ Development Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and repository initialization
- [ ] Database schema design
- [ ] Basic authentication system
- [ ] Start Here Statistics tab implementation
- [ ] Feeding tab implementation
- [ ] Real-time dashboard
- [ ] Basic data validation

### Phase 2: Core Expansion
- [ ] Mass Care/DES tab
- [ ] Government Operations tab
- [ ] Staff Wellness tracking
- [ ] Advanced reporting capabilities
- [ ] Mobile optimization

### Phase 3: Integration
- [ ] National Shelter System integration
- [ ] Volunteer Connection sync
- [ ] External API connections
- [ ] Advanced analytics dashboard
- [ ] Automated IAP generation

### Phase 4: Scale & Polish
- [ ] Multi-region deployment
- [ ] Offline capability
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Comprehensive testing suite

## 📊 Key Metrics & Line Item Reference

### Critical Data Points
- **Line 9**: Meals Served - Total count per operation
- **Line 10**: Snacks Served - Estimated distribution
- **Line 26**: EOCs (Emergency Operations Centers) active
- **Line 38**: Shelters opened and operational
- **Line 44**: Total clients served

## 🤝 Contributing

We welcome contributions to improve the Form 5266 v2 system. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [User Manual](./docs/user-guide.md)

## 🔒 Security Considerations

- All data transmission encrypted with TLS 1.3
- Role-based access control (RBAC) implementation
- Regular security audits and penetration testing
- GDPR and HIPAA compliance considerations
- Audit logging for all data modifications

## 📞 Support & Contact

- **Project Lead**: Jeff Franzen
- **GitHub Issues**: [Report bugs or request features](https://github.com/franzenjb/5266-v2/issues)
- **Documentation**: [Wiki](https://github.com/franzenjb/5266-v2/wiki)

## 📜 License

This project is proprietary to the American Red Cross. All rights reserved.

## 🙏 Acknowledgments

- American Red Cross Disaster Services team
- Florida Region disaster response volunteers
- Original Form 5266 development team
- Modern web development community

---

**Status**: 🚧 Active Development  
**Version**: 2.0.0-alpha  
**Last Updated**: September 2025  
**Deployment**: [Live Demo](https://franzenjb.github.io/5266-v2/)

### Quick Links
- [🔴 Production App](https://franzenjb.github.io/5266-v2/)
- [📊 Live Dashboard](https://franzenjb.github.io/5266-v2/dashboard)
- [📚 Documentation](https://github.com/franzenjb/5266-v2/wiki)
- [🐛 Report Issue](https://github.com/franzenjb/5266-v2/issues/new)