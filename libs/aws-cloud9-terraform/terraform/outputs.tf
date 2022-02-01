output "ec2_instance_id" {
  description = "The ID of the instance"
  value = module.vscode_workstation_ec2.id
}

output "public_ip" {
  description = "The public IP address assigned to the instance, if applicable. NOTE: If you are using an aws_eip with your instance, you should refer to the EIP's address directly and not use `public_ip` as this field will change after the EIP is attached"
  value = module.vscode_workstation_ec2.public_ip
}
