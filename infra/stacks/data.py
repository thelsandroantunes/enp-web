"""Dados: Aurora Serverless v2 (PostgreSQL) com Data API + buckets S3."""
from aws_cdk import CfnOutput, Duration, RemovalPolicy, Stack
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_rds as rds
from aws_cdk import aws_s3 as s3
from constructs import Construct


class DataStack(Stack):
    @property
    def availability_zones(self) -> list[str]:
        # AZs fixas: evita lookup na AWS durante o synth (CI sem credenciais)
        return [f"{self.region}a", f"{self.region}b"]

    def __init__(self, scope: Construct, cid: str, *, stage: str, cfg: dict, **kwargs) -> None:
        super().__init__(scope, cid, **kwargs)
        is_prod = stage == "prod"
        removal = RemovalPolicy.RETAIN if is_prod else RemovalPolicy.DESTROY

        # VPC sem NAT (custo zero): o acesso ao banco é só pela Data API
        vpc = ec2.Vpc(
            self, "Vpc", nat_gateways=0,
            subnet_configuration=[ec2.SubnetConfiguration(
                name="isolada", subnet_type=ec2.SubnetType.PRIVATE_ISOLATED, cidr_mask=24)],
        )

        cluster = rds.DatabaseCluster(
            self, "Db",
            engine=rds.DatabaseClusterEngine.aurora_postgres(
                version=rds.AuroraPostgresEngineVersion.VER_16_4),
            writer=rds.ClusterInstance.serverless_v2("writer"),
            serverless_v2_min_capacity=0.5 if is_prod else 0,  # 0 = pausa automática em dev
            serverless_v2_max_capacity=cfg.get("dbMaxAcu", 2),
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_ISOLATED),
            default_database_name="enp",
            credentials=rds.Credentials.from_generated_secret(
                "enp_admin", secret_name=f"enp-{stage}-db"),
            enable_data_api=True,
            storage_encrypted=True,
            backup=rds.BackupProps(retention=Duration.days(14 if is_prod else 1)),
            deletion_protection=is_prod,
            removal_policy=RemovalPolicy.SNAPSHOT if is_prod else RemovalPolicy.DESTROY,
        )

        def bucket(name: str) -> s3.Bucket:
            return s3.Bucket(
                self, name,
                block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
                encryption=s3.BucketEncryption.S3_MANAGED,
                enforce_ssl=True,
                versioned=is_prod,
                removal_policy=removal,
                auto_delete_objects=not is_prod,
            )

        provas = bucket("Provas")      # PDFs originais do INEP, gabaritos, microdados
        imagens = bucket("Imagens")    # figuras extraídas das questões (servidas via CloudFront na Etapa E)

        CfnOutput(self, "DbClusterArn", value=cluster.cluster_arn, export_name=f"enp-{stage}-db-arn")
        CfnOutput(self, "DbSecretArn", value=cluster.secret.secret_arn, export_name=f"enp-{stage}-db-secret")
        CfnOutput(self, "BucketProvas", value=provas.bucket_name)
        CfnOutput(self, "BucketImagens", value=imagens.bucket_name)
