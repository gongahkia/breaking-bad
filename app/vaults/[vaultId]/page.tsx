import { WithdrawalDepositStrategy } from "@/components/withdrawal-deposit-strategy"

interface Props {
  params: Promise<{ vaultId: string }>  
}

export default async function WithdrawalDepositPage({ params }: Props) {
  const { vaultId } = await params;  
  console.log("vaultId", vaultId)
  return <WithdrawalDepositStrategy vaultId={vaultId} />
}