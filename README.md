# Apify Actor Playground

A modern web application for running Apify actors with dynamic form generation and real-time results. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Dynamic Actor Loading**: Browse and select from your Apify actors
- **Schema-based Forms**: Automatically generate input forms based on actor schemas
- **Real-time Execution**: Run actors and view results with live status updates
- **Secure Authentication**: User accounts with encrypted API key storage
- **Guest Mode**: Quick access without registration
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication & Storage)
- **API Integration**: Apify API v2
- **Build Tool**: Vite
- **UI Components**: Custom component library with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Apify account with API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd apify-actor-playground
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. **Get Your API Key**: Visit [Apify Console](https://console.apify.com/account/integrations) to get your API token

2. **Choose Authentication Method**:
   - **Guest Mode**: Enter API key directly (temporary session)
   - **Create Account**: Sign up for persistent API key storage
   - **Sign In**: Access existing account

3. **Select an Actor**: Browse your actors and choose one to run

4. **Configure Input**: Fill out the auto-generated form based on the actor's schema

5. **Execute & View Results**: Run the actor and see real-time results with execution statistics

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── ActorList.tsx   # Actor selection interface
│   ├── ActorRunner.tsx # Actor execution and form handling
│   └── AuthPage.tsx    # Authentication interface
├── pages/              # Main application pages
├── services/           # API integration services
├── hooks/              # Custom React hooks
└── styles/             # CSS and animations
```

## API Integration

The application integrates with the Apify API v2 to:

- Fetch user actors
- Load actor input schemas
- Execute actor runs
- Retrieve run results and statistics

All API calls are made securely with proper error handling and user feedback.

## Security

- API keys are encrypted and stored securely using Supabase
- Guest mode API keys are stored locally and cleared on session end
- All API requests use HTTPS
- Input validation prevents malicious data injection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style

- TypeScript for type safety
- ESLint for code quality

## License

MIT License - see LICENSE file for details

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🎯 Enhanced Features

### Complex Schema Support
The application now supports:
- **Arrays**: Dynamic add/remove items with intuitive UI
- **Objects**: JSON editor with syntax validation
- **Nested Types**: Recursive schema parsing
- **All Primitive Types**: String, number, boolean, enum

### Timeout Management
- **Visual Indicators**: Shows maximum 5-minute runtime
- **Warning System**: Alerts users when approaching timeout
- **Real-time Feedback**: Live status updates during execution

### Production Security
- **HTTPS Enforcement**: Runtime warnings for insecure connections
- **Enhanced Error Handling**: Specific messages for different error types
- **Secure Headers**: Proper request identification and security headers
- **Input Validation**: API key format validation and sanitization
- **Decision**: Allow usage without account creation
- **Rationale**: Lower barrier to entry for testing
- **Implementation**: Session-based API key storage vs. persistent storage for authenticated users

#### 4. **Responsive Design**
- **Decision**: Mobile-first responsive design with hamburger navigation
- **Rationale**: Modern web expectations for multi-device support
- **Implementation**: Tailwind breakpoints with progressive enhancement

## 🔧 Technical Stack

### Core Technologies
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS
- **State Management**: React Hooks, Context API
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **API Integration**: Fetch API with custom service layer

### Development Tools
- **Linting**: ESLint with TypeScript rules
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Vite with optimizations
- **Package Manager**: npm

## 🔐 Security Considerations

### API Key Handling
- **Validation**: All API keys are validated against Apify before use
- **Storage**: Encrypted storage in Supabase for authenticated users
- **Transmission**: HTTPS-only communication
- **Scope**: Read-only operations where possible

### Error Handling
- **User-Friendly Messages**: Technical errors are translated to user-friendly feedback
- **No Sensitive Data Leakage**: Error messages are sanitized
- **Graceful Degradation**: Application remains functional during partial failures

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite's built-in optimizations
- **Image Optimization**: SVG icons for scalability
- **Responsive Images**: Adaptive sizing for different screens

### API Optimizations
- **Request Batching**: Efficient API call patterns
- **Error Recovery**: Automatic retry for transient failures
- **Loading States**: Clear feedback during async operations

## 🚦 Error Handling & User Feedback

### Comprehensive Error Coverage
- **API Key Validation**: Clear feedback for invalid keys
- **Network Errors**: Graceful handling of connectivity issues
- **Actor Execution Failures**: Detailed error information
- **Schema Loading Errors**: Fallback handling for missing schemas

### User Feedback System
- **Toast Notifications**: Real-time success/error messages
- **Loading States**: Visual feedback during operations
- **Progress Indicators**: Clear status for long-running operations

## 🎨 UI/UX Enhancements

### Design System
- **Glassmorphic Design**: Modern, professional appearance
- **Consistent Theming**: Unified color palette and spacing
- **Smooth Animations**: 60fps transitions and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Responsive Features
- **Mobile Navigation**: Hamburger menu with slide-out panel
- **Touch Optimization**: Large touch targets and gestures
- **Content Adaptation**: Responsive typography and layouts
- **Cross-Device Consistency**: Identical functionality across devices

## 🐛 Known Limitations

### Technical Limitations
1. **CORS Restrictions**: Some older browsers may have CORS limitations with Apify API
2. **Run Timeout**: Long-running actors (>5 minutes) may timeout in the browser
3. **Result Size**: Large datasets are limited to first 10 items for display performance

### Feature Limitations
1. **Actor Management**: Read-only operations (cannot create/edit actors)
2. **Advanced Configurations**: Some complex actor inputs may require manual JSON editing
3. **Batch Operations**: Single actor execution per request

## 🔮 Future Enhancements

### Potential Improvements
- **Batch Actor Execution**: Run multiple actors simultaneously
- **Result Export**: Download results in various formats (CSV, JSON, etc.)
- **Actor Analytics**: Historical execution statistics and performance metrics
- **Team Collaboration**: Shared workspaces and actor configurations
- **Advanced Scheduling**: Cron-like scheduling for regular executions

## 📞 Support & Troubleshooting

### Common Issues

#### "Invalid API Key" Error
- **Solution**: Verify your API key in [Apify Console](https://console.apify.com/account/integrations)
- **Check**: Ensure the key has proper permissions

#### "No Actors Found"
- **Solution**: Ensure you have actors in your Apify account
- **Alternative**: Create a simple "Hello World" actor for testing

#### "Schema Loading Failed"
- **Solution**: Check if the actor has a valid input schema
- **Workaround**: Try a different actor or contact support

### Getting Help
- **Apify Documentation**: [docs.apify.com](https://docs.apify.com)
- **Apify Community**: [community.apify.com](https://community.apify.com)
- **API Reference**: [docs.apify.com/api/v2](https://docs.apify.com/api/v2)

## 📄 License

This project is built as part of an integration developer assignment and demonstrates the capabilities of the Apify platform integration.

---

**Built with ❤️ for the Apify Integration Developer Assignment**

*Demonstrating modern web development practices with real-time API integration, responsive design, and production-ready architecture.*