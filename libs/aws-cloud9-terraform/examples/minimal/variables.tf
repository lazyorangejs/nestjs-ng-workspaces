variable "ami" {
  type    = string
  default = "ami-0eaa6183e540e9b04"
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "subnet_id" {
  type    = string
  default = "subnet-fd6b7780"
}

variable "vpc_id" {
  type = string
}

variable "workstation_ip" {
  type = string
}

variable "ssh_key_name" {
  type = string
}

variable "region" {
  type    = string
  default = "eu-central-1"
}
