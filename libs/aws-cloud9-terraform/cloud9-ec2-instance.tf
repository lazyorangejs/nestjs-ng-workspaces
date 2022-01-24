module "labels" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  version = "0.25.0"

  namespace   = "lazyorange"
  environment = "development"
  name        = "vscode-remote-workstation"
  delimiter   = "-"
  attributes  = []

  tags = {
    Terraform = true
  }
}

// https://github.com/terraform-aws-modules/terraform-aws-iam/tree/master/modules/iam-assumable-role
// https://github.com/terraform-aws-modules/terraform-aws-iam/tree/master/examples/iam-assumable-role
module "iam_assumable_role_workstation" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  version = "~> 4"

  trusted_role_services = [
    "ec2.amazonaws.com"
  ]

  # trusted_role_arns = [
  #   "arn:aws:iam::912888207281:user/gitpod"
  # ]

  # arn:aws:iam::912888207281:user/gitpod

  create_role             = true
  create_instance_profile = true

  role_name         = "custom"
  role_requires_mfa = false

  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonSSMFullAccess",
    "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
  ]
  number_of_custom_role_policy_arns = 2
}

// https://github.com/terraform-aws-modules/terraform-aws-ec2-instance
module "workstation-2" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 3.0"

  name = module.labels.id
  tags = module.labels.tags


  ami           = "ami-03aaf730676832ac6"
  instance_type = "t3.large"
  cpu_credits   = "unlimited"
  key_name      = "development"
  monitoring    = true

  vpc_security_group_ids = ["sg-2faab34d"]
  subnet_id              = "subnet-fd6b7780"

  associate_public_ip_address = true
  iam_instance_profile        = module.iam_assumable_role_workstation.iam_instance_profile_name

  # you don't need to install SSM agent until you use own ami
  #   # https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-status-and-restart.html
  #   user_data = <<EOF
  # #!/bin/bash
  # sudo snap install amazon-ssm-agent --classic
  # sudo snap install aws-cli --classic
  # EOF

}
