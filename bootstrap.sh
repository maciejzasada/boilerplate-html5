#!/bin/sh

# Update apt-get
sudo apt-get update

# Install curl.
sudo apt-get install curl -y

# Install make.
sudo apt-get install make

# Install Node.js.
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs -y

# Install Bower.
npm install -g bower

# Install Gulp.
npm install -g gulp

# Install Ruby.
# TODO:

# Install scss-lint.
sudo gem install scss-lint

# Enter working directory.
cd /vagrant

# Install node modules.
npm install

# Install bower components.
bower install --config.interactive=false --allow-root