packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "aws-vscode-workstation-linux-aws-0.0.1-rc.7"
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
    content     = <<EOF
ruby 3.1.0

terraform ${var.terraform_version}
vault 1.9.3

kubectl 1.23.3
skaffold ${var.skaffold_version}

awscli 2.4.15
aws-vault 6.4.0

sonarscanner 4.4.0.2170

jq 1.6
nodejs 12.22.9
EOF
    destination = "~/.tool-versions"
  }

  provisioner "file" {
    source      = "./install_asdf_plugins.sh"
    destination = "/home/ubuntu/install_asdf_plugins.sh"
  }

  provisioner "file" {
    source      = "./install_tools.sh"
    destination = "/home/ubuntu/install_tools.sh"
  }

  provisioner "shell" {
    environment_vars = [
      "FOO=hello world"
    ]

    inline = [
      "echo 'Sleeping for 30 seconds to give Ubuntu enough time to initialize (otherwise, packages may fail to install).'",
      "sleep 30",
      "./install_tools.sh",
      "./install_asdf_plugins.sh"
    ]
  }

}
