"""App CDK do ENP. Stacks por ambiente: Enp-<stage>-GithubOidc | Foundation | Data."""
import aws_cdk as cdk
from stacks.data import DataStack
from stacks.foundation import FoundationStack
from stacks.github_oidc import GithubOidcStack

app = cdk.App()
envs = app.node.try_get_context("envs")
github = app.node.try_get_context("github")

for stage, cfg in envs.items():
    env = cdk.Environment(account=cfg["account"], region=cfg["region"])
    prefix = f"Enp-{stage}"

    # Deploy manual, uma vez por conta (cria o OIDC usado pelo GitHub Actions)
    GithubOidcStack(app, f"{prefix}-GithubOidc", env=env, stage=stage, github=github)

    # Deploy pelo GitHub Actions
    FoundationStack(app, f"{prefix}-Foundation", env=env, stage=stage, cfg=cfg)
    DataStack(app, f"{prefix}-Data", env=env, stage=stage, cfg=cfg)

cdk.Tags.of(app).add("project", "enp")
app.synth()
