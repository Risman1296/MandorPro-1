#!/bin/bash

# Production Local Runner for MandorPro
# Runs Expo React Native app in production mode locally

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
APP_PID=""
EXPO_PID=""

# Cleanup function - trap to handle script exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Cleaning up processes...${NC}"
    
    if [ ! -z "$APP_PID" ] && kill -0 $APP_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping app server (PID: $APP_PID)...${NC}"
        kill -TERM $APP_PID 2>/dev/null || true
        wait $APP_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$EXPO_PID" ] && kill -0 $EXPO_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping Expo bundler (PID: $EXPO_PID)...${NC}"
        kill -TERM $EXPO_PID 2>/dev/null || true
        wait $EXPO_PID 2>/dev/null || true
    fi
    
    # Kill any remaining Expo processes
    pkill -f "expo start" 2>/dev/null || true
    pkill -f "metro" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Set up trap
trap cleanup EXIT INT TERM

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}
🏗️  MandorPro Production Local Runner
==========================================${NC}"
}

# Function to check required environment variables
check_env_vars() {
    print_info "Checking required environment variables..."
    
    local missing_vars=()
    
    # Check PORT
    if [ -z "$PORT" ]; then
        missing_vars+=("PORT")
    fi
    
    # Check DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        missing_vars+=("DATABASE_URL")
    fi
    
    # Check NODE_ENV
    if [ "$NODE_ENV" != "production" ]; then
        missing_vars+=("NODE_ENV (must be 'production')")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo -e "  ${RED}- $var${NC}"
        done
        echo
        print_info "Set them like this:"
        echo -e "  ${BLUE}export PORT=3000${NC}"
        echo -e "  ${BLUE}export DATABASE_URL=sqlite:///path/to/db.sqlite${NC}"
        echo -e "  ${BLUE}export NODE_ENV=production${NC}"
        exit 1
    fi
    
    print_success "Environment variables validated"
    echo -e "  PORT: ${GREEN}$PORT${NC}"
    echo -e "  DATABASE_URL: ${GREEN}$DATABASE_URL${NC}"
    echo -e "  NODE_ENV: ${GREEN}$NODE_ENV${NC}"
}

# Function to detect package manager
detect_package_manager() {
    if [ -f "package-lock.json" ] && command -v npm >/dev/null 2>&1; then
        echo "npm"
    elif [ -f "pnpm-lock.yaml" ] && command -v pnpm >/dev/null 2>&1; then
        echo "pnpm"
    elif [ -f "yarn.lock" ] && command -v yarn >/dev/null 2>&1; then
        echo "yarn"
    elif [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
        echo "npm"
    else
        print_error "No supported package manager found (npm/pnpm/yarn)"
        exit 1
    fi
}

# Function to build production bundle
build_production() {
    local pm=$1
    print_info "Building production bundle with $pm..."
    
    case $pm in
        "npm")
            npm run build 2>/dev/null || {
                print_warning "No build script found, creating production bundle..."
                npx expo export --platform web --output-dir dist
            }
            ;;
        "pnpm")
            pnpm run build 2>/dev/null || {
                print_warning "No build script found, creating production bundle..."
                pnpm exec expo export --platform web --output-dir dist
            }
            ;;
        "yarn")
            yarn build 2>/dev/null || {
                print_warning "No build script found, creating production bundle..."
                yarn expo export --platform web --output-dir dist
            }
            ;;
    esac
    
    print_success "Production build completed"
}

# Function to start server
start_server() {
    local pm=$1
    print_info "Starting production server on port $PORT..."
    
    # For Expo apps, we need to run in production mode
    case $pm in
        "npm")
            # Start Expo in production mode
            nohup npx expo start --port $PORT --no-dev --minify > expo.log 2>&1 &
            EXPO_PID=$!
            ;;
        "pnpm")
            nohup pnpm exec expo start --port $PORT --no-dev --minify > expo.log 2>&1 &
            EXPO_PID=$!
            ;;
        "yarn")
            nohup yarn expo start --port $PORT --no-dev --minify > expo.log 2>&1 &
            EXPO_PID=$!
            ;;
    esac
    
    APP_PID=$EXPO_PID
    print_success "Server started with PID: $APP_PID"
}

# Function to wait for port to be ready
wait_for_port() {
    local port=$1
    local timeout=60
    local counter=0
    
    print_info "Waiting for port $port to be ready (timeout: ${timeout}s)..."
    
    while [ $counter -lt $timeout ]; do
        if command -v nc >/dev/null 2>&1; then
            # Use netcat if available
            if nc -z localhost $port 2>/dev/null; then
                print_success "Port $port is ready!"
                return 0
            fi
        elif command -v curl >/dev/null 2>&1; then
            # Use curl if netcat is not available
            if curl -s --connect-timeout 1 http://localhost:$port >/dev/null 2>&1; then
                print_success "Port $port is ready!"
                return 0
            fi
        else
            # Fallback: check if process is still running
            if kill -0 $APP_PID 2>/dev/null; then
                sleep 2
                print_success "Server process is running on port $port"
                return 0
            fi
        fi
        
        sleep 1
        counter=$((counter + 1))
        
        # Show progress every 10 seconds
        if [ $((counter % 10)) -eq 0 ]; then
            print_info "Still waiting... (${counter}/${timeout}s)"
        fi
    done
    
    print_error "Timeout waiting for port $port to be ready"
    return 1
}

# Function to print service info
print_service_info() {
    echo
    print_success "🚀 MandorPro is running in production mode!"
    echo -e "${GREEN}
┌─────────────────────────────────────────┐
│              Service Info               │
├─────────────────────────────────────────┤
│ URL:     http://localhost:$PORT          
│ PID:     $APP_PID                        
│ Mode:    Production                     │
│ Logs:    expo.log                       │
└─────────────────────────────────────────┘${NC}"
    
    echo
    print_info "Available endpoints:"
    echo -e "  ${BLUE}• Web:     http://localhost:$PORT${NC}"
    echo -e "  ${BLUE}• QR Code: Check Expo DevTools${NC}"
    echo
    print_info "To stop the server:"
    echo -e "  ${BLUE}• Press Ctrl+C in this terminal${NC}"
    echo -e "  ${BLUE}• Or run: kill $APP_PID${NC}"
    echo
    print_warning "Server logs are being written to: expo.log"
    echo -e "${YELLOW}Use 'tail -f expo.log' to monitor real-time logs${NC}"
}

# Main execution
main() {
    print_header
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Step 1: Check environment variables
    check_env_vars
    echo
    
    # Step 2: Detect package manager
    local package_manager=$(detect_package_manager)
    print_success "Detected package manager: $package_manager"
    echo
    
    # Step 3: Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        case $package_manager in
            "npm") npm install ;;
            "pnpm") pnpm install ;;
            "yarn") yarn install ;;
        esac
        print_success "Dependencies installed"
        echo
    fi
    
    # Step 4: Build production bundle
    build_production $package_manager
    echo
    
    # Step 5: Start server
    start_server $package_manager
    echo
    
    # Step 6: Wait for port to be ready
    wait_for_port $PORT
    echo
    
    # Step 7: Print service information
    print_service_info
    
    # Keep script running
    print_info "Press Ctrl+C to stop the server..."
    wait $APP_PID
}

# Run main function
main "$@"