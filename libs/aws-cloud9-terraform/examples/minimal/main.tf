# You cannot create a new backend by simply defining this and then
# immediately proceeding to "terraform apply". The S3 backend must
# be bootstrapped according to the simple yet essential procedure in
# https://github.com/cloudposse/terraform-aws-tfstate-backend#usage
module "terraform_state_backend" {
  source = "cloudposse/tfstate-backend/aws"
  # Cloud Posse recommends pinning every module to a specific version
  version    = "0.38.1"
  namespace  = "lo"
  stage      = "develop"
  name       = "terraform"
  attributes = ["state"]

  terraform_backend_config_file_path = "."
  terraform_backend_config_file_name = "backend.tf"
  force_destroy                      = true
}

module "vscode_workstation" {
  source = "../../terraform"

  region = var.region

  ami            = "ami-049164e77a2c5b5f9"
  vpc_id         = var.vpc_id
  subnet_id      = var.subnet_id
  workstation_ip = var.workstation_ip
  ssh_key_name   = var.ssh_key_name
}
