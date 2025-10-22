# SMA Dashboard - Docker Setup Guide

This guide provides step-by-step instructions to run the SMA Dashboard application using Docker containers.

## Prerequisites

### Required Software
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)

## Installation Steps

### 1. Install Docker

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Launch Docker Desktop

#### macOS
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Drag Docker.app to Applications folder
3. Launch Docker Desktop from Applications

#### Linux (Ubuntu)
```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Verify Docker Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker installation
docker run hello-world
```

## Running the Application

### Method 1: Using Docker Compose (Recommended)

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd Stock-SME-Project
   ```

2. **Build and start the application**
   ```bash
   # Build and start all services
   docker compose up --build
   
   # Or run in detached mode (background)
   docker compose up --build -d
   ```

3. **Access the application**
   - Open your web browser
   - Navigate to `http://localhost:3000`
   - The backend API will be available at `http://localhost:5001`

### Method 2: Manual Docker Commands

1. **Build the backend container**
   ```bash
   docker build -f Dockerfile.backend -t sma-backend .
   ```

2. **Build the frontend container**
   ```bash
   docker build -f Dockerfile.frontend -t sma-frontend .
   ```

3. **Create a network**
   ```bash
   docker network create sma-network
   ```

4. **Run the backend**
   ```bash
   docker run -d --name sma-backend --network sma-network -p 5001:5001 sma-backend
   ```

5. **Run the frontend**
   ```bash
   docker run -d --name sma-frontend --network sma-network -p 3000:80 sma-frontend
   ```

## Application Usage

### 1. Access the Dashboard
- Open your browser and go to `http://localhost:3000`
- You'll see the SMA Dashboard interface

### 2. Search for a Company
- Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL)
- Click "Search" to fetch data
- The application will display interactive SMA charts

### 3. Navigate the Interface
- Use the time range selector to filter data by year
- Toggle different SMA periods (10, 20, 30, 40, 50, 100)
- Hover over charts for detailed information
- Scroll horizontally to view different time periods

## Managing the Application

### Start the Application
```bash
docker compose up -d
```

### Stop the Application
```bash
docker compose down
```

### View Logs
```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Follow logs in real-time
docker compose logs -f
```

### Restart Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart frontend
```

### Update the Application
```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose down
docker compose up --build -d
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

#### 2. Container Won't Start
**Error**: `Container exited with code 1`

**Solution**:
```bash
# Check container logs
docker compose logs backend
docker compose logs frontend

# Check if all required files exist
ls -la Dockerfile.backend Dockerfile.frontend docker-compose.yml
```

#### 3. API Connection Issues
**Error**: `Failed to fetch data`

**Solution**:
```bash
# Check if backend is running
docker compose ps

# Test backend directly
curl http://localhost:5001/health

# Check network connectivity
docker compose exec frontend ping backend
```

#### 4. Build Failures
**Error**: `Build failed`

**Solution**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache
```

### Performance Issues

#### High Memory Usage
```bash
# Check container resource usage
docker stats

# Limit memory usage in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

#### Slow Startup
```bash
# Use pre-built images (if available)
docker compose pull

# Or build in parallel
docker compose build --parallel
```

## Deployment to Another Computer

### 1. Export Docker Images
```bash
# Save images to files
docker save sma-backend > sma-backend.tar
docker save sma-frontend > sma-frontend.tar
```

### 2. Transfer Files
- Copy the entire project directory to the target computer
- Or transfer the `.tar` files and project files

### 3. Load Images (if using .tar files)
```bash
# Load images on target computer
docker load < sma-backend.tar
docker load < sma-frontend.tar
```

### 4. Run on Target Computer
```bash
# Navigate to project directory
cd Stock-SME-Project

# Start the application
docker compose up -d
```

## Environment Configuration

### Custom Configuration
Create a `.env` file in the project root:

```bash
# Copy example file
cp env.example .env

# Edit configuration
nano .env
```

### Available Environment Variables

#### Backend
- `FLASK_HOST`: Backend host (default: 0.0.0.0)
- `FLASK_PORT`: Backend port (default: 5001)
- `FLASK_ENV`: Environment mode (production/development)

#### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5001)

## Security Considerations

### Production Deployment
1. **Use environment variables** for sensitive configuration
2. **Enable HTTPS** with reverse proxy (nginx/traefik)
3. **Use secrets management** for API keys
4. **Regular updates** of base images
5. **Network isolation** with custom Docker networks

### Example Production Setup
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    environment:
      - FLASK_ENV=production
    restart: always
    
  frontend:
    environment:
      - REACT_APP_API_URL=https://api.yourdomain.com
    restart: always
```

## Monitoring and Maintenance

### Health Checks
```bash
# Check service health
docker compose ps

# Test endpoints
curl http://localhost:5001/health
curl http://localhost:3000/health
```

### Log Management
```bash
# Rotate logs
docker compose logs --tail=100 > logs/app.log

# Clean old logs
docker system prune -f
```

### Backup
```bash
# Backup configuration
tar -czf sma-dashboard-backup.tar.gz .
```

## Support

### Getting Help
1. Check the logs: `docker compose logs`
2. Check container status: `docker compose ps`
3. Verify network connectivity: `docker network ls`
4. Review this documentation

### Useful Commands
```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View Docker networks
docker network ls

# View Docker images
docker images

# Clean up unused resources
docker system prune
```

## Next Steps

After successfully running the application:

1. **Explore the interface** - Try different stock tickers
2. **Customize the charts** - Adjust SMA periods and time ranges
3. **Deploy to production** - Follow security best practices
4. **Monitor performance** - Use Docker monitoring tools
5. **Scale if needed** - Consider load balancing for high traffic

---

**Note**: This application requires internet connectivity to fetch stock data from Yahoo Finance. Ensure your network allows outbound HTTPS connections.
