import { source } from "./ai-stack-concept-sources/shared";

export const infrastructureAsCodeSources = [
  source("HashiCorp", "Terraform intro", "https://developer.hashicorp.com/terraform/intro", ["iac-definition", "iac-declaration"]),
  source("HashiCorp", "Terraform resources", "https://developer.hashicorp.com/terraform/language/resources", ["iac-resource", "iac-dependency"]),
  source("HashiCorp", "terraform plan command", "https://developer.hashicorp.com/terraform/cli/commands/plan", ["iac-plan", "iac-preview"]),
  source("HashiCorp", "Terraform state", "https://developer.hashicorp.com/terraform/language/state", ["iac-state", "iac-drift"]),
  source("HashiCorp", "Terraform modules", "https://developer.hashicorp.com/terraform/language/modules", ["iac-module"]),
];
