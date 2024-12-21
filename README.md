# CLWY Prisma API

A modern Express.js API with Prisma ORM integration, featuring graceful shutdown handling and comprehensive article management.

## 🚀 Features

- Express.js REST API with modern ES modules
- Prisma ORM for database operations
- Article management system
- Development hot-reloading
- Graceful shutdown handling
- Mock data generation for testing
- Error handling middleware
- TypeScript-like schema validation with Prisma

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clwy-prisma.git
cd clwy-prisma
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
# Create a .env file in the root directory
DATABASE_URL="mysql://user:password@localhost:3306/your_database"
PORT=3000
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run prod
```

### Generate Mock Data
```bash
node prisma/mock.js
```

## 📁 Project Structure

```
clwy-prisma/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── mock.js         # Mock data generator
├── routes/
│   └── index.js        # API routes
├── lib/
│   └── prisma.js       # Prisma client instance
├── server.js           # Express application setup
└── package.json        # Project dependencies
```

## 🔄 API Endpoints

### Articles
- `GET /admin/articles` - List all articles
- `POST /admin/articles` - Create a new article
- `GET /admin/articles/:id` - Get article by ID
- `PUT /admin/articles/:id` - Update article
- `DELETE /admin/articles/:id` - Delete article

## 🛑 Graceful Shutdown

The application handles graceful shutdowns through SIGTERM signal handling, ensuring:
- Ongoing requests are completed
- Server connections are properly closed
- Resources are cleaned up

## 📝 Development

### Running Tests
```bash
npm test
```

### Generating Mock Data
```bash
node prisma/mock.js
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team
- Prisma team
- Contributors and maintainers
