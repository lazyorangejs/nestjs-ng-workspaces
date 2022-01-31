terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.region
}

# You cannot create a new backend by simply defining this and then
# immediately proceeding to "terraform apply". The S3 backend must
# be bootstrapped according to the simple yet essential procedure in
# https://github.com/cloudposse/terraform-aws-tfstate-backend#usage
module "terraform_state_backend" {
  source = "cloudposse/tfstate-backend/aws"
  # Cloud Posse recommends pinning every module to a specific version
  version    = "0.38.1"
  namespace  = "lo"
  stage      = "development"
  name       = "terraform"
  attributes = ["state"]

  terraform_backend_config_file_path = "."
  terraform_backend_config_file_name = "backend.tf"
  force_destroy                      = false
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
