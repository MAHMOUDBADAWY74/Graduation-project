# Front-end Graduation Project

[![React](https://img.shields.io/badge/React-19.0.0--rc.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.6-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, responsive web application built with React and Vite. This project demonstrates best practices in front-end development, including state management, routing, and UI/UX design.

## 🌟 Key Features

- ⚡️ Lightning-fast performance with Vite
- 🎨 Modern UI with Tailwind CSS, Bootstrap, and custom design system
- 🔄 Efficient state management using Redux Toolkit
- 💬 Real-time chat with SignalR, beautiful chat UI/UX, and PDF export for dashboards
- 📚 PDF and EPUB document viewing capabilities
- 🗺️ Interactive maps with Leaflet
- 📊 Data visualization with Recharts
- 🔍 Advanced search and filtering
- 📱 Fully responsive design
- 🧪 Testing setup with Jest
- 📦 Optimized build process

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository:

```bash
# Windows PowerShell
git clone https://github.com/MohammedAmr04/front-end-graduation.git
cd front-end-graduation
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production

Build for production:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
src/
├── admin/         # Admin panel components and features
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable UI components (Chat, Sidebar, Input, etc.)
├── hooks/         # Custom React hooks
├── layouts/       # Layout components and templates
├── pages/         # Page components and routes (Chat, Home, Profile, etc.)
├── routes/        # Route configurations
├── store/         # Redux store and slices
├── styles/        # Global styles and CSS modules
├── utils/         # Utility functions and helpers
└── test/          # Test files and configurations
```

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [React Router DOM](https://reactrouter.com/) - Routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Bootstrap](https://getbootstrap.com/) - UI Framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [Axios](https://axios-http.com/) - HTTP Client
- [Joi](https://joi.dev/) - Validation
- [React PDF Viewer](https://react-pdf-viewer.dev/) - PDF Document Viewer
- [EPUB.js](https://github.com/futurepress/epubjs) - EPUB Document Viewer
- [Leaflet](https://leafletjs.com/) - Interactive Maps
- [Recharts](https://recharts.org/) - Data Visualization
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Toast Notifications
- [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll
- [React Slick](https://react-slick.neostack.com/) - Carousel Component
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction) - Real-time Communication
- [Jest](https://jestjs.io/) - Testing

## 📝 Available Scripts

| Script            | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Starts the development server |
| `npm run build`   | Builds the app for production |
| `npm run preview` | Preview the production build  |
| `npm run lint`    | Run ESLint                    |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url_here
VITE_APP_TITLE=Your App Title
```

### Vite Configuration

The project uses Vite for development and building. Configuration can be found in `vite.config.js`.

### Tailwind Configuration

Tailwind CSS is configured in `tailwind.config.js`. Customize the theme and plugins as needed.

## 💬 Chat Feature

- Real-time chat using SignalR
- Modern, responsive chat UI with user avatars, names, and time-ago formatting
- My messages are right-aligned and colored, others are left-aligned and light
- Input bar is always visible when a user is selected
- Friendly prompt when no user is selected

## 📊 Admin Dashboard

- Download dashboard as PDF
- Modern card and chart layout
- Responsive and visually appealing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add appropriate comments and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mohammed Amr** - _Initial work_ - [MohammedAmr04](https://github.com/MohammedAmr04)

## 🙏 Acknowledgments

- React team for the amazing library
- Vite team for the fast build tool
- All contributors and maintainers of the used libraries
- Special thanks to all contributors who have helped shape this project

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

Made with ❤️ by Mohammed Amr
