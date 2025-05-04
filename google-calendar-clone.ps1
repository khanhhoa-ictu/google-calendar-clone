git checkout main
git pull origin main
git checkout bang
git merge main
yarn
npm run dev

scoop install extras/filezilla
# https://manage.bizflycloud.vn/iaas-cloud/servers/0a4f0a24-25ee-45d6-a605-5c5b541159fd/details
ssh root@103.109.43.202 # password fqDnSeUdYa8njU2yBWstj27
sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
systemctl status nginx
sudo systemctl enable nginx
# http://103.109.43.202/
sudo mkdir -p /var/www/calendar/html
sudo chown -R $USER:$USER /var/www/calendar/html
sudo chmod -R 755 /var/www/calendar
sudo nano /var/www/calendar/html/index.html
# <h1>Welcome to calendar!</h1>
sudo nano /etc/nginx/nginx.conf
sudo nano /etc/nginx/sites-enabled/calendar

server {
        listen 80;
        listen [::]:80;

        root /var/www/calendar/html;
        index index.html index.htm index.nginx-debian.html;

        server_name 103.109.43.202;

        location / {
                try_files $uri $uri/ =404;
        }
}

sudo nginx -t
sudo systemctl reload nginx
npm run build