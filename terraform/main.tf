provider "aws" {
  region = var.aws_region
}

resource "aws_iam_role" "lambda_exec" {
  name               = "lambda_send_email_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_basic_execution" {
  name       = "lambda-basic-execution"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "ses_send_email" {
  name = "ses-send-email"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action   = "ses:SendEmail",
      Effect   = "Allow",
      Resource = "*"
    }]
  })
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "send_email" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "send_email_function"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "send_email.handler"
  runtime          = "python3.9"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      SENDER_EMAIL   = var.sender_email
      RECIPIENT_EMAIL = var.recipient_email
      CAPTCHA_SECRET = var.captcha_secret
      EMAIL_VALIDATION_APIKEY = var.email_validation_apikey
    }
  }
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "email-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [var.cors_domain]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    expose_headers = ["Content-Length"]
    max_age        = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.send_email.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "email_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /send"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send_email.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  route_settings { # this doesn't work, only applies to v1
    route_key = "POST /send"
    throttling_burst_limit = 1
    throttling_rate_limit = 1
  }
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

