packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable terraform_version {
  default = "1.1.4"
}

variable skaffold_version {
  default = "1.35.2"
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "aws-vscode-workstation-linux-aws"
  instance_type = "t2.micro"
  region        = "eu-central-1"

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

  provisioner "shell" {
    environment_vars = [
      "FOO=hello world"
    ]

    inline = [
      "sudo apt-get update && sudo apt-get install -qy wget unzip curl git procps",
      "sudo snap install amazon-ssm-agent --classic",
      "sudo snap install aws-cli --classic",
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash",
      //
      "wget https://releases.hashicorp.com/terraform/${var.terraform_version}/terraform_${var.terraform_version}_linux_amd64.zip",
      "unzip terraform_${var.terraform_version}_linux_amd64.zip",
      "sudo mv ./terraform /usr/local/bin/",

      "curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/v{var.skaffold_version}/skaffold-linux-amd64 && chmod +x skaffold && sudo mv skaffold /usr/local/bin",

      "sudo snap install docker"
    ]
  }

}
