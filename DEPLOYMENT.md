# Deployment Guide for Ubuntu 22.04

This document provides a comprehensive guide to deploy the application on an Ubuntu 22.04 server.

## 1. Node.js Installation

1. Update the package index:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. Verify installation:
   ```bash
   node -v
   npm -v
   ```

## 2. MongoDB Setup

1. Import the MongoDB public GPG key:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   ```
2. Create a list file for MongoDB:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   ```
3. Update the package index:
   ```bash
   sudo apt update
   ```
4. Install MongoDB:
   ```bash
   sudo apt install -y mongodb-org
   ```
5. Start MongoDB service:
   ```bash
   sudo systemctl start mongod
   ```
6. Enable MongoDB to start on boot:
   ```bash
   sudo systemctl enable mongod
   ```

## 3. Git Clone

1. Navigate to the desired directory:
   ```bash
   cd /var/www/
   ```
2. Clone the repository:
   ```bash
   git clone https://github.com/bansalyash-debug/dice.git
   cd dice
   ```

## 4. NPM Install

1. Install application dependencies:
   ```bash
   npm install
   ```

## 5. Environment Configuration

1. Create a `.env` file in the root directory and configure as needed:
   ```bash
   touch .env
   echo "DATABASE_URL=mongodb://localhost:27017/myapp" >> .env
   ```

## 6. Systemd Service Creation

1. Create a service file:
   ```bash
   sudo nano /etc/systemd/system/dice.service
   ```
2. Add the following configuration:
   ```ini
   [Unit]
   Description=Dice Application
   After=network.target

   [Service]
   ExecStart=/usr/bin/node /var/www/dice/server.js
   Restart=always
   User=www-data
   Group=www-data
   Environment=NODE_ENV=production
   WorkingDirectory=/var/www/dice

   [Install]
   WantedBy=multi-user.target
   ```
3. Start and enable the service:
   ```bash
   sudo systemctl start dice
   sudo systemctl enable dice
   ```

## 7. Nginx Reverse Proxy Configuration

1. Install Nginx:
   ```bash
   sudo apt install -y nginx
   ```
2. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/dice
   ```
3. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. Enable the Nginx configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/dice /etc/nginx/sites-enabled/
   ```
5. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 8. SSL Setup with Let's Encrypt

1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```
2. Obtain and install the SSL certificate:
   ```bash
   sudo certbot --nginx -d your_domain.com
   ```
3. Follow prompts to configure auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## 9. Service Management Commands

- Start the service:
  ```bash
  sudo systemctl start dice
  ```
- Stop the service:
  ```bash
  sudo systemctl stop dice
  ```
- Restart the service:
  ```bash
  sudo systemctl restart dice
  ```
- Check the service status:
  ```bash
  sudo systemctl status dice
  ```

This guide offers a thorough instruction set for deploying your application on Ubuntu 22.04. Ensure to replace `your_domain.com` with your actual domain name where necessary.