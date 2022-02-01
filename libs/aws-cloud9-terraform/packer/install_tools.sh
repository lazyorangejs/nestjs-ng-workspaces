#!/bin/bash

sudo apt-get update
sudo apt-get install -qy wget unzip curl git procps libssl-dev zlib1g-dev

sudo apt-get install -qy linux-headers-$(uname -r) build-essential
sudo snap install amazon-ssm-agent --classic
sudo apt-get install ec2-instance-connect -qy

sudo snap install docker
sleep 30
sudo chmod 666 /var/run/docker.sock

# install zsh
sudo apt-get install -yq zsh

git clone https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
# "sudo chsh -s $(which zsh)",

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

echo "\nsource ~/.nvm/nvm.sh\n" >> ~/.zshrc
echo "export AWS_VAULT_BACKEND=file" >> ~/.zshrc

sudo apt-get install postgresql-client -yq
