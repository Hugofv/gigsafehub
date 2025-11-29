# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** create a public GitHub issue
2. Email security details to: security@gigsafehub.com (or your security contact)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Best Practices

### Secrets Management

- **Never commit secrets** to the repository
- Use environment variables for all sensitive data
- Rotate JWT secrets regularly (recommended: every 90 days)
- Use strong, randomly generated secrets (minimum 32 characters)
- Store secrets in:
  - GitHub Secrets (for CI/CD)
  - AWS Secrets Manager
  - Azure Key Vault
  - HashiCorp Vault
  - Or similar secret management services

### JWT Secret Rotation

1. Generate a new secret using a cryptographically secure random generator
2. Update the secret in your secret management service
3. Deploy the new secret to your environment
4. Old tokens will remain valid until expiration (consider implementing token revocation if needed)

### Environment Variables

Always use `.env.example` files as templates. Never include:
- API keys
- Database passwords
- JWT secrets
- Private keys
- OAuth client secrets

### Dependencies

- Keep dependencies up to date
- Review security advisories regularly
- Use `pnpm audit` to check for vulnerabilities
- Enable Dependabot for automatic updates

### API Security

- Always use HTTPS in production
- Implement rate limiting
- Validate and sanitize all inputs
- Use CORS whitelisting
- Implement proper authentication and authorization
- Log security events for monitoring

## Security Checklist

- [ ] All secrets are stored in environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] JWT secrets are strong and rotated regularly
- [ ] Dependencies are up to date
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] CORS is properly configured
- [ ] Error messages don't leak sensitive information
- [ ] Logging doesn't include sensitive data

