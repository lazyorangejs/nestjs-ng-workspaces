#!/bin/bash

# install adsf version manager
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.9.0

echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.zshrc
echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.zshrc

source $HOME/.asdf/asdf.sh

asdf plugin-add boundary https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add consul https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add nomad https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add packer https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add sentinel https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add serf https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add terraform https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add vault https://github.com/asdf-community/asdf-hashicorp.git
asdf plugin-add waypoint https://github.com/asdf-community/asdf-hashicorp.git

#
asdf plugin-add kubectl https://github.com/asdf-community/asdf-kubectl.git
asdf plugin-add skaffold https://github.com/virtualstaticvoid/asdf-skaffold.git

#
asdf plugin add awscli
asdf plugin-add aws-vault https://github.com/virtualstaticvoid/asdf-aws-vault.git
#
asdf plugin add redis-cli https://github.com/NeoHsu/asdf-redis-cli.git

