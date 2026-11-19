"""Fundação: alertas de orçamento e domínio (hosted zone)."""
from aws_cdk import CfnOutput, Fn, Stack
from aws_cdk import aws_budgets as budgets
from aws_cdk import aws_route53 as route53
from constructs import Construct


class FoundationStack(Stack):
    def __init__(self, scope: Construct, cid: str, *, stage: str, cfg: dict, **kwargs) -> None:
        super().__init__(scope, cid, **kwargs)

        email = cfg["alertEmail"]
        subscriber = [budgets.CfnBudget.SubscriberProperty(address=email, subscription_type="EMAIL")]

        def alert(pct: int, kind: str):
            return budgets.CfnBudget.NotificationWithSubscribersProperty(
                notification=budgets.CfnBudget.NotificationProperty(
                    comparison_operator="GREATER_THAN",
                    notification_type=kind,  # ACTUAL | FORECASTED
                    threshold=pct,
                    threshold_type="PERCENTAGE",
                ),
                subscribers=subscriber,
            )

        budgets.CfnBudget(
            self, "MonthlyBudget",
            budget=budgets.CfnBudget.BudgetDataProperty(
                budget_name=f"enp-{stage}-mensal",
                budget_type="COST",
                time_unit="MONTHLY",
                budget_limit=budgets.CfnBudget.SpendProperty(
                    amount=cfg["monthlyBudgetUsd"], unit="USD"),
            ),
            notifications_with_subscribers=[
                alert(50, "ACTUAL"), alert(80, "ACTUAL"),
                alert(100, "ACTUAL"), alert(100, "FORECASTED"),
            ],
        )

        if cfg.get("domain"):
            zone = route53.PublicHostedZone(self, "Zone", zone_name=cfg["domain"])
            CfnOutput(self, "NameServers", value=Fn.join(", ", zone.hosted_zone_name_servers or []),
                      description="Aponte o domínio no registro.br para estes NS")
