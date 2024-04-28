import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

export async function GET(req: NextRequest) {
  const abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const url = req.nextUrl
  const token = url.searchParams.get("token")
  try {

    const decimals = await publicClient.readContract({ address: token as `0x${string}`, functionName: "decimals", abi })
    return NextResponse.json({ data: true })
  }
  catch (e) {
    return NextResponse.json({ data: false })
  }

}