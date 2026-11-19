"""Aplica db/migrations/*.sql no Aurora via Data API (sem VPN/bastion).

Uso: python db/migrate.py --stage dev [--profile enp-dev]
Lê o ARN do cluster e do segredo nos outputs da stack Enp-<stage>-Data.
"""
import argparse
import pathlib
import re

import boto3

MIGRATIONS = pathlib.Path(__file__).parent / "migrations"


def split_sql(sql: str) -> list[str]:
    sql = re.sub(r"--[^\n]*", "", sql)
    return [s.strip() for s in sql.split(";") if s.strip()]


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--stage", required=True, choices=["dev", "prod"])
    p.add_argument("--profile")
    p.add_argument("--region", default="sa-east-1")
    a = p.parse_args()

    s = boto3.Session(profile_name=a.profile, region_name=a.region)
    outs = {o["OutputKey"]: o["OutputValue"] for o in
            s.client("cloudformation").describe_stacks(StackName=f"Enp-{a.stage}-Data")["Stacks"][0]["Outputs"]}
    rds = s.client("rds-data")
    base = {"resourceArn": outs["DbClusterArn"], "secretArn": outs["DbSecretArn"], "database": "enp"}

    def run(sql: str, tx: str | None = None, params=None):
        kw = {**base, "sql": sql}
        if tx:
            kw["transactionId"] = tx
        if params:
            kw["parameters"] = params
        return rds.execute_statement(**kw)

    run("CREATE TABLE IF NOT EXISTS schema_migrations "
        "(versao TEXT PRIMARY KEY, aplicada_em TIMESTAMPTZ NOT NULL DEFAULT now())")
    feitas = {r[0]["stringValue"] for r in run("SELECT versao FROM schema_migrations")["records"]}

    for f in sorted(MIGRATIONS.glob("*.sql")):
        if f.stem in feitas:
            continue
        print(f"-> {f.name}")
        tx = rds.begin_transaction(**base)["transactionId"]
        try:
            for stmt in split_sql(f.read_text(encoding="utf-8")):
                run(stmt, tx)
            run("INSERT INTO schema_migrations (versao) VALUES (:v)", tx,
                [{"name": "v", "value": {"stringValue": f.stem}}])
            rds.commit_transaction(resourceArn=base["resourceArn"], secretArn=base["secretArn"], transactionId=tx)
        except Exception:
            rds.rollback_transaction(resourceArn=base["resourceArn"], secretArn=base["secretArn"], transactionId=tx)
            raise
    print("Migrações em dia.")


if __name__ == "__main__":
    main()
