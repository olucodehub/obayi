# Obayi Production Backend Setup

## Prerequisites

1. **Node.js** (v18 or later)
2. **Azure Storage Account** with Blob Storage enabled
3. **SQLite** (automatically installed with better-sqlite3)

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Configure Azure Blob Storage:**

### Create Azure Storage Account:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create new "Storage Account"
3. Choose settings:
   - Performance: Standard
   - Replication: LRS (Locally Redundant Storage)
   - Blob public access: Enabled

### Get Connection String:
1. Go to your Storage Account → Access Keys
2. Copy "Connection string" from key1 or key2

### Update `.env` file:
```env
# Database
DATABASE_PATH=./database.sqlite

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=your-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=obayi-files
AZURE_STORAGE_ACCOUNT_NAME=yourstorageaccount

# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_DOCUMENT_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png
```

4. **Initialize Database:**
```bash
npm run init-db
```

5. **Start Production Server:**
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `POST /api/students/profile-picture` - Upload profile picture
- `POST /api/students/documents` - Upload document
- `GET /api/students/documents` - Get all documents
- `DELETE /api/students/documents/:id` - Delete document

### Donors
- `GET /api/donors/profile` - Get donor profile
- `PUT /api/donors/profile` - Update donor profile
- `GET /api/donors/students` - Get assigned students

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/dashboard` - Get dashboard data
- `POST /api/admin/assignments` - Create donor-student assignment
- `DELETE /api/admin/assignments/:id` - Remove assignment

## File Storage

### Profile Pictures:
- Stored in: `profile-pictures/{userId}-{uuid}.jpg`
- Automatically optimized to 400x400px JPEG
- Old pictures automatically deleted on new upload

### Documents:
- Stored in: `documents/{studentId}/{documentType}-{uuid}.{ext}`
- Support: PDF, Word docs, Images
- Maximum size: 5MB (configurable)

## Database Schema

### Key Tables:
- `users` - Base user information
- `students` - Student-specific data
- `donors` - Donor-specific data  
- `student_documents` - File metadata
- `donor_student_assignments` - Matching relationships

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **File Type Validation** - Only allowed file types
3. **File Size Limits** - Prevent large uploads
4. **Input Validation** - All inputs validated
5. **Azure Blob Security** - Files stored securely in cloud

## Performance Optimizations

1. **better-sqlite3** - Fast, synchronous SQLite operations
2. **WAL Mode** - Better concurrent access
3. **Sharp Image Processing** - Optimized image handling
4. **Azure CDN Ready** - Blob URLs work with CDN
5. **Connection Pooling** - Efficient database connections

## Deployment Options

### Option 1: Azure App Service
1. Create Azure App Service (Node.js)
2. Deploy code via Git/GitHub Actions
3. Configure environment variables
4. Storage account in same region

### Option 2: VPS/Dedicated Server
1. Install Node.js, PM2
2. Clone repository
3. Configure environment
4. Use PM2 for process management

### Option 3: Docker Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring & Maintenance

1. **Logs**: Check application logs regularly
2. **Database**: Backup SQLite file periodically
3. **Azure Storage**: Monitor storage usage/costs
4. **Performance**: Monitor API response times
5. **Security**: Update dependencies regularly

## Cost Estimation (Azure)

- **Blob Storage**: ~$0.02/GB/month
- **Transactions**: ~$0.0004/10k operations
- **App Service**: $8-50+/month (depending on plan)

For 1000 students with avg 5 documents each:
- Storage: ~2GB = $0.04/month
- Transactions: ~50k/month = $0.002/month
- **Total**: <$0.10/month for storage

## Troubleshooting

### Common Issues:
1. **Azure connection failed**: Check connection string
2. **File upload failed**: Verify file types/sizes
3. **Database locked**: Check file permissions
4. **JWT errors**: Verify JWT_SECRET is set

### Debug Mode:
```bash
NODE_ENV=development npm run dev
```

This enables detailed error messages and logging.