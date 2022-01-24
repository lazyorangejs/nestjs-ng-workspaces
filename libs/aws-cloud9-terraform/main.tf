terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "http" {
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-central-1"
}

# data "aws_iam_user" "gitpod_user" {
#   user_name = "cloud9-user"
# }

# // https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloud9_environment_ec2
# resource "aws_cloud9_environment_ec2" "demo" {
#   instance_type = "t2.micro"
#   name          = "demo"

#   automatic_stop_time_minutes = 30

#   tags = {
#     user_name            = data.aws_iam_user.gitpod_user.user_name,
#     owner_emails_address = "vymarkov@gmail.com"
#   }
# }

# resource "aws_cloud9_environment_membership" "demo" {
#   environment_id = aws_cloud9_environment_ec2.demo.id
#   permissions    = "read-write"
#   user_arn       = data.aws_iam_user.gitpod_user.arn
# }

# data "aws_instance" "cloud9-instance" {
#   filter {
#     name   = "tag:aws:cloud9:environment"
#     values = [aws_cloud9_environment_ec2.demo.id]
#   }
# }

# data "aws_security_group" "cloud9_default_sg" {
#   name = element(data.aws_instance.cloud9-instance.security_groups[*], 0)
# }

# resource "aws_security_group_rule" "allow_ssh_from_developer_workstation" {
#   type              = "ingress"
#   from_port         = 22
#   to_port           = 22
#   protocol          = "tcp"
#   cidr_blocks       = ["195.69.222.254/32"]
#   security_group_id = data.aws_security_group.cloud9_default_sg.id
# }

# output "owner_id" {
#   value = data.aws_iam_user.gitpod_user.user_id
# }

# output "ssh_command" {
#   # value = "ssh ec2-user@${data.aws_instance["cloud9-instance"].public_ip}"
#   value = "ssh ec2-user@${data.aws_instance.cloud9-instance.public_ip}"
# }

# output "security_groups" {
#   value = element(data.aws_instance.cloud9-instance.security_groups[*], 0)
# }

# // security_groups
