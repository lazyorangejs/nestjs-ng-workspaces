data "aws_iam_instance_profile" "this" {
  name = "foobar"
}

module "cloud9_workstation" {
  source  = "cloudposse/ec2-instance/aws"
  version = "0.40.0"

  assign_eip_address          = true
  associate_public_ip_address = true

  ssh_key_pair  = "development"
  instance_type = "t2.micro"
  vpc_id        = "vpc-aa7a84c0"
  subnet        = "subnet-fd6b7780"
  # security_groups             = var.security_groups
  instance_profile = data.aws_iam_instance_profile.this.name

  name      = "vymarkov"
  namespace = "eg"
  stage     = "dev"

  # https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-status-and-restart.html
  user_data = <<EOF
#!/bin/bash
sudo snap install amazon-ssm-agent --classic"
EOF
}
