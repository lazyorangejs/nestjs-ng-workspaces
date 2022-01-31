packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "aws-vscode-workstation-linux-aws-0.0.1-rc.5"
  instance_type = "t2.micro"
  region        = var.region

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-bionic-18.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }

  ssh_username = "ubuntu"
}

build {
  name = "aws-vscode-workstation"

  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "file" {
    content = <<EOF
terraform ${var.terraform_version}
vault 1.9.3

kubectl 1.23.3
skaffold ${var.skaffold_version}

awscli 2.4.15
aws-vault 6.4.0
EOF
    destination = "~/.tool-versions"
  }

  provisioner "file" {
    source = "./install_asdf_plugins.sh"
    destination = "/home/ubuntu/install_asdf_plugins.sh"
  }

  provisioner "shell" {
    environment_vars = [
      "FOO=hello world"
    ]

    inline = [
      "sudo apt-get update && sudo apt-get install -qy wget unzip curl git procps",
      "sudo apt-get install -qy linux-headers-$(uname -r) build-essential",
      "sudo snap install amazon-ssm-agent --classic",
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash",

      "sudo snap install docker",
      "sleep 30",
      "sudo chmod 666 /var/run/docker.sock",
     

      # install zsh
      "sudo apt-get install -yq zsh",

      "git clone https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh",
      "cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc",
      # "sudo chsh -s $(which zsh)",

      "git clone https://github.com/zsh-users/antigen.git ~/antigen",
      "echo \"source ~/antigen/antigen.zsh\" >> ~/.zshrc",
      
      "echo \"\nsource ~/.nvm/nvm.sh\n\" >> ~/.zshrc",
      "echo \"export AWS_VAULT_BACKEND="file"\" >> ~/.zshrc",

      "sudo apt-get install postgresql-client -yq",
      

      "zsh ./install_asdf_plugins.sh"
    ]
  }

}
