variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "us-east-1"
}

variable "sender_email" {
  description = "Verified SES sender email"
  type        = string
}

variable "recipient_email" {
  description = "Personal email address"
  type        = string
}

variable "captcha_secret" {
  description = "HCaptcha secret key"
  type        = string
}

variable "email_validation_apikey" {
  description = "API key for third party email validation"
  type        = string
}

variable "cors_domain" {
  description = "Domain used to enable CORS"
  type        = string
}