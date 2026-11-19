"""Provedor OIDC do GitHub + papel de deploy (sem access key fixa).

dev  -> só a branch main pode assumir o papel
prod -> só jobs no environment 'prod' (com aprovação no GitHub) podem assumir
"""
from aws_cdk import CfnOutput, Duration, Stack
from aws_cdk import aws_iam as iam
from constructs import Construct


class GithubOidcStack(Stack):
    def __init__(self, scope: Construct, cid: str, *, stage: str, github: dict, **kwargs) -> None:
        super().__init__(scope, cid, **kwargs)

        repo = f"{github['owner']}/{github['repo']}"
        sub = (
            f"repo:{repo}:environment:prod" if stage == "prod"
            else f"repo:{repo}:ref:refs/heads/main"
        )

        provider = iam.OpenIdConnectProvider(
            self, "GithubProvider",
            url="https://token.actions.githubusercontent.com",
            client_ids=["sts.amazonaws.com"],
        )

        role = iam.Role(
            self, "GithubDeployRole",
            role_name=f"enp-{stage}-github-deploy",
            max_session_duration=Duration.hours(1),
            assumed_by=iam.WebIdentityPrincipal(
                provider.open_id_connect_provider_arn,
                conditions={
                    "StringEquals": {
                        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                        "token.actions.githubusercontent.com:sub": sub,
                    }
                },
            ),
        )
        # Só pode assumir os papéis criados pelo `cdk bootstrap` (deploy, publish, lookup)
        role.add_to_policy(iam.PolicyStatement(
            actions=["sts:AssumeRole"],
            resources=[f"arn:aws:iam::{self.account}:role/cdk-*"],
        ))
        # Para o passo de migração do banco via Data API
        role.add_to_policy(iam.PolicyStatement(
            actions=["rds-data:ExecuteStatement", "rds-data:BatchExecuteStatement",
                     "rds-data:BeginTransaction", "rds-data:CommitTransaction",
                     "rds-data:RollbackTransaction", "cloudformation:DescribeStacks"],
            resources=["*"],
        ))
        role.add_to_policy(iam.PolicyStatement(
            actions=["secretsmanager:GetSecretValue"],
            resources=[f"arn:aws:secretsmanager:{self.region}:{self.account}:secret:enp-{stage}-db*"],
        ))

        CfnOutput(self, "DeployRoleArn", value=role.role_arn,
                  description=f"Cadastre no GitHub como AWS_ROLE_{stage.upper()}")
