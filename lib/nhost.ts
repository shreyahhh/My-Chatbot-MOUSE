import { NhostClient } from '@nhost/nextjs';

export const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
  region: process.env.NEXT_PUBLIC_NHOST_REGION!,
  authUrl: `https://${process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN}.auth.${process.env.NEXT_PUBLIC_NHOST_REGION}.nhost.run/v1`,
  graphqlUrl: `https://${process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN}.graphql.${process.env.NEXT_PUBLIC_NHOST_REGION}.nhost.run/v1`,
});

export default nhost;
